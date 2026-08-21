import apiTenant from "../baseApi";
import type { PaymentCheckout, PaymentConfig, PaymentMethod } from "../paystack-api";

/**
 * The membership application fee.
 *
 * Only ever owed by members who **joined by applying** — `Member.applicationId` is set. An
 * organization switching fees on must not retroactively bill the members it already had,
 * which is why the whole rule lives in one backend endpoint rather than being reassembled
 * here from the fee list and the payment list.
 *
 * Backend: `applicationfee.routes.js`, `applicationPayment.controller.js`.
 */

export interface ApplicationFeeStatus {
  /** True when this member still has to pay. */
  owes: boolean;
  /** The organization charges a fee at all. */
  required: boolean;
  /** This member came through an application rather than being added by an admin. */
  joinedByApplying: boolean;
  fee: {
    _id: string;
    paymentName: string;
    amount: number;
    currency?: string | null;
    paymentConfig?: PaymentConfig;
  } | null;
  /** Their most recent attempt, if any — including a rejected one. */
  payment: { _id: string; status: string; method?: string; manualReference?: string | null; rejectionReason?: string | null } | null;
}

export const fetchApplicationFeeStatus = async (): Promise<ApplicationFeeStatus> => {
  const response = await apiTenant.get("/api/application-fees/my-status");
  return response.data.data;
};

/**
 * Start paying the fee. Returns the same unified `checkout` as every other payment in the
 * platform (X-1/X-7): a Paystack URL to redirect to, or bank details plus the reference
 * that lets an admin match the transfer.
 */
export const startApplicationFeePayment = async (applicationFeeId: string, method?: PaymentMethod): Promise<{ payment: { _id: string }; checkout?: PaymentCheckout }> => {
  const response = await apiTenant.post("/api/application-fees/payment", { applicationFeeId, method });
  return response.data.data ?? response.data;
};

/** Member states they have made the transfer. Proof is optional unless configured. */
export const declareApplicationFeePayment = async (paymentId: string, { proof, note }: { proof?: File | null; note?: string }) => {
  const formData = new FormData();
  if (proof) formData.append("proof", proof);
  if (note) formData.append("note", note);

  const response = await apiTenant.put(`/api/application-fees/payment/${paymentId}/declare`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
