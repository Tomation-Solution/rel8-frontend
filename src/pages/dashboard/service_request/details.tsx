import { useNavigate, useParams } from "react-router-dom";
import { getServiceDetail, getMyServiceRequests, uploadServiceRequestPaymentProof } from "../../../api/serviceRequestApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BackLink, Button, Card, EmptyState, PageHeader, StatusPill } from "../../../components/ui";
import { FiBriefcase } from "react-icons/fi";
import { formatMoney, useCurrencySymbol } from "../../../utils/currency";
import { formatDate } from "../../../utils/dates";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { useRef, useState } from "react";
import Toast from "../../../components/toast/Toast";

const ServiceRequestDetail = () => {
  const { id: serviceId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notifyUser } = Toast();
  const currencySymbol = useCurrencySymbol();
  const [uploadingForRequestId, setUploadingForRequestId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { isLoading: loadingService, data: service } = useQuery(["getServiceDetail", serviceId], () => getServiceDetail({ serviceId: typeof serviceId === "string" ? serviceId : "-1" }), {
    enabled: typeof serviceId === "string" ? true : false,
  });

  const { isLoading: loadingRequests, data: requests } = useQuery(["getMyServiceRequests"], getMyServiceRequests, {
    enabled: typeof serviceId === "string" ? true : false,
  });

  // Filter requests for this specific service
  const serviceRequests = requests?.filter(req => req.serviceId._id === serviceId) || [];
  const hasPendingRequest = serviceRequests.some(req => req.requestStatus === "pending");

  const { mutate: uploadProof, isLoading: isUploadingProof } = useMutation(
    async ({ requestId, file }: { requestId: string; file: File }) => {
      return await uploadServiceRequestPaymentProof({ requestId, paymentProof: file });
    },
    {
      onSuccess: () => {
        notifyUser("Payment proof uploaded. An admin will verify it shortly.", "success");
        queryClient.invalidateQueries(["getMyServiceRequests"]);
        setUploadingForRequestId(null);
      },
      onError: (error: any) => {
        notifyUser(error?.response?.data?.message || "Failed to upload payment proof", "error");
        setUploadingForRequestId(null);
      },
    },
  );

  // Was hardcoded `en-NG` / NGN; the org's own currency setting drives it now.
  const formatPrice = (price: number) => formatMoney(price, currencySymbol);

  /**
   * ⚠️ Two chips per request, and they are **different enums** (CLAUDE.md):
   *   `requestStatus`  — fulfilment: pending -> confirmed -> dispatched -> completed
   *   `paymentStatus`  — money, the unified X-7 vocabulary
   * `statusTone()` renders them with one colour set as a convenience only. Do not merge
   * the enums anywhere upstream of the pill.
   */
  const getStatusBadge = (status: string) => <StatusPill status={status} />;
  const getPaymentStatusBadge = (status: string) => <StatusPill status={status} />;

  return (
    <>
      <BackLink to="/service-requests" label="Go back" />
      <PageHeader title="Service Request" subtitle="See the details of the service request here..." />

      {loadingService || loadingRequests ? (
        <div className="py-20 grid place-items-center">
          <CircleLoader />
        </div>
      ) : (
      <Card className="max-w-4xl p-6">
        <div>
          <h2 className="text-[20px] font-semibold text-org-primary">{service?.name}</h2>
          <p className="text-sm text-muted mt-1">{service?.description}</p>
          <p className="mt-3 text-[15px] text-ink">
            Service Price: <span className="text-org-primary font-semibold">{service ? formatPrice(service.price) : ""}</span>
          </p>

          {/* Payment Information */}
          {service && (
            <div className="mt-5 p-4 bg-org-tint rounded-lg">
              <p className="text-sm font-medium text-org-primary mb-2">Payment Information:</p>
              {/* X-7: account details arrive with a payment reference once a request
                  exists, so the transfer can be matched — they are not shown up front. */}
              {service.paymentConfig?.methods?.includes("bank_transfer") && !service.paymentConfig?.methods?.includes("paystack") ? (
                <div>
                  <p className="text-sm text-muted">Pay by bank transfer. You'll get the account details and a reference to quote when you submit a request.</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted">Payment will be completed after submitting your service request.</p>
                </div>
              )}
            </div>
          )}
          <br />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <h2 className="text-[18px] font-semibold text-ink">Your Previous Requests</h2>
            <Button onClick={() => navigate(`/service-requests-submission/${serviceId}`)}>Request Service</Button>
          </div>
          <br />
          <br />

          {serviceRequests.length === 0 ? (
            <EmptyState icon={FiBriefcase} title="No previous requests" description="You have not requested this service yet." />
          ) : (
            <div className="space-y-4">
              {serviceRequests.map(request => (
                <div key={request._id} className="border border-hairline rounded-xl p-4 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-muted">Request ID: {request._id.slice(-8)}</p>
                      <p className="text-sm text-muted">Date: {formatDate(request.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(request.requestStatus)}
                      {getPaymentStatusBadge(request.paymentStatus)}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium text-ink">Delivery Address:</p>
                    <p className="text-sm text-muted">
                      {request.deliveryAddress.street}, {request.deliveryAddress.city}, {request.deliveryAddress.country}
                    </p>
                  </div>

                  {request.adminNotes && (
                    <div className="mb-3 p-3 bg-status-warning-bg rounded">
                      <p className="text-sm font-medium text-ink">Admin Notes:</p>
                      <p className="text-sm text-muted">{request.adminNotes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {request.paymentId?.proofUrl && (
                      <a href={request.paymentId?.proofUrl} target="_blank" rel="noreferrer" className="text-sm text-org-primary hover:underline">
                        View Payment Proof
                      </a>
                    )}
                    {(!request.paymentId?.proofUrl || request.paymentStatus === "rejected") && (
                      <>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          ref={el => {
                            fileInputRefs.current[request._id] = el;
                          }}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingForRequestId(request._id);
                            uploadProof({ requestId: request._id, file });
                            // reset input so same file can be selected again if needed
                            e.currentTarget.value = "";
                          }}
                        />
                        <button type="button" className="text-sm text-org-primary hover:underline disabled:opacity-60" disabled={isUploadingProof && uploadingForRequestId === request._id} onClick={() => fileInputRefs.current[request._id]?.click()}>
                          {isUploadingProof && uploadingForRequestId === request._id ? "Uploading..." : request.paymentStatus === "rejected" ? "Re-upload Payment Proof" : "Upload Payment Proof"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
      )}
    </>
  );
};

export default ServiceRequestDetail;
