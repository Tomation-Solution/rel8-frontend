import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "react-query";
import { useState } from "react";
import Toast from "../../../components/toast/Toast";
import { useNavigate, useParams } from "react-router-dom";
import { getServiceDetail, DeliveryAddress } from "../../../api/serviceRequestApi";
import { declareServicePayment, isFree, startServiceRequest, supportsMethod, type PaymentCheckout, type PaymentMethod } from "../../../api/paystack-api";
import PaymentMethodChoice from "../../../components/payments/PaymentMethodChoice";
import { defaultMethod } from "../../../components/payments/defaultMethod";
import BankTransferPanel from "../../../components/payments/BankTransferPanel";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { BackLink, Button, Card, IconInput, PageHeader } from "../../../components/ui";

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
  const [payMethod, setPayMethod] = useState<PaymentMethod | null>(null);
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
  // `payMethod` is null until the payer touches the control — the service loads async, so
  // there is nothing to seed from on first render. Fall back to the default until then.
  const effectiveMethod: PaymentMethod = payMethod && supportsMethod(config, payMethod) ? payMethod : defaultMethod(config);

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
        method: effectiveMethod,
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
    <>
      <BackLink to={`/service-requests/${serviceId}`} label="Go back" />
      <PageHeader title={`Request ${service?.name ?? "Service"}`} subtitle="Tell us where it should go, then complete payment." />

      {loadingService ? (
        <div className="py-20 grid place-items-center">
          <CircleLoader />
        </div>
      ) : (
      <Card className="max-w-2xl p-6">
        <div>

          {service && (
            <div className="mb-6 p-4 bg-org-tint rounded-lg">
              <p className="text-sm text-muted">Service Description:</p>
              <p className="text-ink mb-2">{service.description}</p>
              <p className="text-sm text-muted">Service Price:</p>
              <p className="text-2xl font-bold text-org-primary">{formatPrice(service.price)}</p>
            </div>
          )}

          {/* How this can be paid. Account details are no longer shown up front — they
              arrive with a reference once the request exists, so the transfer can be
              matched back to this member. */}
          {service && !checkout && (
            <div className="mb-6 p-4 bg-org-tint/40 border border-hairline rounded-lg">
              <p className="text-sm font-medium text-ink mb-2">Payment</p>
              {isFree(config) ? (
                <p className="text-sm text-status-warning">No payment method is configured for this service. Please contact the organisation.</p>
              ) : (
                <>
                  <PaymentMethodChoice config={config} value={effectiveMethod} onChange={setPayMethod} disabled={submitting} />

                  <p className="mt-2 text-sm text-muted">
                    {effectiveMethod === "paystack"
                      ? "You'll be taken to Paystack to pay by card or bank transfer. Your request confirms automatically once payment succeeds."
                      : "You'll be shown the account details and a reference to quote on your transfer, then an admin confirms it."}
                  </p>
                </>
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
                <Button fullWidth onClick={() => navigate(`/service-requests/${serviceId}`)}>Back to my requests</Button>
              </div>
            </div>
          )}

          {!checkout && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3 className="text-lg font-semibold text-ink mb-4">Delivery Address</h3>

              <div className="space-y-4">
                <IconInput label="Street Address" {...register("street")} />
                {errors.street && <p className="text-status-danger text-xs">{errors.street.message}</p>}

                <IconInput label="City" {...register("city")} />
                {errors.city && <p className="text-status-danger text-xs">{errors.city.message}</p>}

                <IconInput label="State (Optional)" {...register("state")} />

                <IconInput label="Country" {...register("country")} />
                {errors.country && <p className="text-status-danger text-xs">{errors.country.message}</p>}

                <IconInput label="Postal Code (Optional)" {...register("postalCode")} />
              </div>

              <div className="mt-6 flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={e => {
                    e.preventDefault();
                    navigate(`/service-requests/${serviceId}`);
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" isLoading={submitting} onClick={handleSubmit(onSubmit)}>
                  {hasPaystack ? "Continue to payment" : "Submit request"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
      )}
    </>
  );
};

export default ServiceSubmission;
