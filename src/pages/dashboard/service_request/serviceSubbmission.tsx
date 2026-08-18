import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "react-query";
import { useState } from "react";
import Toast from "../../../components/toast/Toast";
import { useNavigate, useParams } from "react-router-dom";
import { getServiceDetail, DeliveryAddress } from "../../../api/serviceRequestApi";
import { declareServicePayment, isFree, startServiceRequest, supportsMethod, type PaymentCheckout } from "../../../api/paystack-api";
import BankTransferPanel from "../../../components/payments/BankTransferPanel";
import CircleLoader from "../../../components/loaders/CircleLoader";
import InputWithLabel from "../../../components/form/InputWithLabel";
import Button from "../../../components/button/Button";

const schema = yup.object({
  street: yup.string().required("Street address is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().optional(),
  postalCode: yup.string().optional(),
});

type FormI = yup.InferType<typeof schema>;

/**
 * Request a service (X-7).
 *
 * Simplified onto the unified payment flow. This page previously had three overlapping
 * submit paths — one per legacy payment type — plus a separate "create the request, then
 * upload proof" dance. `POST /api/services/requests` now creates the request AND starts
 * the payment in one call, returning either a Paystack URL or the bank details with a
 * reference to quote.
 */
const ServiceSubmission = () => {
  const { id: serviceId } = useParams();
  const navigate = useNavigate();
  const { notifyUser } = Toast();

  const [submitting, setSubmitting] = useState(false);
  const [checkout, setCheckout] = useState<PaymentCheckout | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [declaring, setDeclaring] = useState(false);
  const [declared, setDeclared] = useState(false);
  const [declareError, setDeclareError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormI>({ resolver: yupResolver(schema) });

  const { isLoading: loadingService, data: service } = useQuery(["getServiceDetail", serviceId], () => getServiceDetail({ serviceId: typeof serviceId === "string" ? serviceId : "-1" }), {
    enabled: typeof serviceId === "string",
    refetchOnWindowFocus: false,
  });

  const config = service?.paymentConfig;
  const hasPaystack = supportsMethod(config, "paystack");

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const onSubmit = async (data: FormI) => {
    if (!service || !serviceId) return;

    if (isFree(config)) {
      notifyUser("This service has no payment method configured. Please contact the organisation.", "error");
      return;
    }

    const deliveryAddress: DeliveryAddress = {
      street: data.street || "",
      city: data.city || "",
      country: data.country || "",
      state: data.state,
      postalCode: data.postalCode,
    };

    setSubmitting(true);
    setDeclareError("");
    setDeclared(false);

    try {
      const result = await startServiceRequest({
        serviceId,
        deliveryAddress,
        method: hasPaystack ? "paystack" : "bank_transfer",
      });

      const co = result.checkout;

      if (co?.method === "paystack" && co.authorizationUrl) {
        window.location.href = co.authorizationUrl;
        return;
      }

      if (co?.method === "bank_transfer") {
        setCheckout(co);
        setRequestId(result.serviceRequest?._id ?? null);
        notifyUser("Request created. Complete your transfer to confirm it.", "success");
      } else {
        notifyUser("Service request submitted successfully!", "success");
        navigate(`/service-requests/${serviceId}`);
      }
    } catch (err: any) {
      notifyUser(err?.response?.data?.message || "Failed to submit service request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  /** Member states they have made the transfer. Proof optional unless configured. */
  const handleDeclare = async ({ proof, note }: { proof?: File | null; note?: string }) => {
    if (!requestId) return;
    setDeclaring(true);
    setDeclareError("");
    try {
      await declareServicePayment(requestId, { proof, note });
      setDeclared(true);
    } catch (err: any) {
      setDeclareError(err?.response?.data?.message || "Could not submit. Please try again.");
    } finally {
      setDeclaring(false);
    }
  };

  return (
    <div>
      {(loadingService || submitting) && <CircleLoader />}

      <div className="max-w-2xl">
        <div className="bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Request {service?.name}</h2>

          {service && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Service Description:</p>
              <p className="text-gray-800 mb-2">{service.description}</p>
              <p className="text-sm text-gray-600">Service Price:</p>
              <p className="text-2xl font-bold text-org-primary">{formatPrice(service.price)}</p>
            </div>
          )}

          {/* How this can be paid. Account details are no longer shown up front — they
              arrive with a reference once the request exists, so the transfer can be
              matched back to this member. */}
          {service && !checkout && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Payment</p>
              {isFree(config) ? (
                <p className="text-sm text-yellow-700">No payment method is configured for this service. Please contact the organisation.</p>
              ) : hasPaystack ? (
                <p className="text-sm text-gray-600">You'll be taken to Paystack to pay by card or bank transfer. Your request confirms automatically once payment succeeds.</p>
              ) : (
                <p className="text-sm text-gray-600">You'll be shown the account details and a reference to quote on your transfer, then an admin confirms it.</p>
              )}
            </div>
          )}

          {checkout && (
            <div className="mb-6">
              <BankTransferPanel
                checkout={checkout}
                onDeclare={handleDeclare}
                declaring={declaring}
                declared={declared}
                error={declareError}
                requireProof={Boolean(config?.bankTransfer?.requireProof)}
                title="Transfer to the account below"
              />
              <div className="mt-4">
                <Button text="Back to my requests" className="w-full" onClick={() => navigate(`/service-requests/${serviceId}`)} />
              </div>
            </div>
          )}

          {!checkout && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h3>

              <div className="space-y-4">
                <InputWithLabel label="Street Address" register={register("street")} />
                {errors.street && <p className="text-red-500 text-xs">{errors.street.message}</p>}

                <InputWithLabel label="City" register={register("city")} />
                {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}

                <InputWithLabel label="State (Optional)" register={register("state")} />

                <InputWithLabel label="Country" register={register("country")} />
                {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}

                <InputWithLabel label="Postal Code (Optional)" register={register("postalCode")} />
              </div>

              <div className="mt-6 flex gap-4">
                <Button
                  text="Cancel"
                  className="flex-1 border border-gray-500 bg-transparent text-[#000] hover:bg-gray-500 hover:text-white"
                  onClick={e => {
                    e.preventDefault();
                    navigate(`/service-requests/${serviceId}`);
                  }}
                />
                <Button text={submitting ? "Submitting..." : hasPaystack ? "Continue to payment" : "Submit request"} className="flex-1" isLoading={submitting} onClick={handleSubmit(onSubmit)} />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceSubmission;
