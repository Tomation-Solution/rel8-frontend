import apiTenant, { apiTenantAxiosForm } from "./baseApi";

/**
 * Payments (X-1 / X-7).
 *
 * The platform used to have five separate payment implementations. They are now one:
 * a shared `paymentConfig` on whatever is being paid for, and a single `Payment` record
 * behind every transaction.
 *
 * The generic `POST /api/paystack/initialize/:type/:id` this file used to call is now
 * **410 Gone**. Each domain owns its entry point, because each needs knowledge the
 * generic initializer never had — member-vs-public pricing for events, member-chosen
 * amounts for project contributions, delivery addresses for services.
 *
 * Every "start" call returns the same `checkout` shape:
 *   { method: "paystack",      authorizationUrl, reference }     -> redirect the payer
 *   { method: "bank_transfer", reference, amount, bankTransfer } -> show the details
 *
 * For bank transfer the payer later calls the matching `declare*` function. **Proof is
 * optional** — admins commonly reconcile against their own bank statement — unless the
 * item's config sets `bankTransfer.requireProof`.
 */

export type PaymentMethod = "paystack" | "bank_transfer";

/** One status vocabulary, shared by dues, events, projects, services and app fees. */
export type PaymentStatus = "pending" | "awaiting_verification" | "paid" | "failed" | "rejected" | "cancelled";

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  unpaid: "Not paid",
  free: "Free",
  pending: "Awaiting payment",
  awaiting_verification: "Awaiting confirmation",
  paid: "Paid",
  failed: "Payment failed",
  rejected: "Not accepted",
  cancelled: "Cancelled",
  not_applicable: "—",
};

export interface BankTransferDetails {
  accountName?: string | null;
  accountNumber?: string | null;
  bankName?: string | null;
  instructions?: string | null;
  requireProof?: boolean;
}

export interface PaymentConfig {
  methods: PaymentMethod[];
  bankTransfer?: BankTransferDetails;
  paystackChannels?: string[];
}

export interface PaymentCheckout {
  method: PaymentMethod;
  /** paystack only */
  authorizationUrl?: string;
  reference?: string;
  /** bank_transfer only */
  amount?: number;
  bankTransfer?: BankTransferDetails | null;
}

export interface UnifiedPayment {
  _id: string;
  purpose: "due" | "event" | "application" | "project" | "service";
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  manualReference?: string | null;
  providerReference?: string | null;
  proofUrl?: string | null;
  rejectionReason?: string | null;
}

export interface StartPaymentResult {
  checkout?: PaymentCheckout;
  payment?: UnifiedPayment;
  /** the domain record — shape depends on the purpose */
  memberDue?: any;
  contribution?: any;
  serviceRequest?: any;
  registration?: any;
  message?: string;
}

/** True when the item is free (no payment method configured). */
export const isFree = (config?: PaymentConfig | null): boolean => !config || !Array.isArray(config.methods) || config.methods.length === 0;

export const supportsMethod = (config: PaymentConfig | undefined | null, method: PaymentMethod): boolean => !isFree(config) && !!config?.methods.includes(method);

/** Build a multipart body for the optional proof upload. */
const proofForm = (opts?: { proof?: File | null; note?: string }) => {
  const form = new FormData();
  if (opts?.proof) form.append("proof", opts.proof);
  if (opts?.note) form.append("note", opts.note);
  return form;
};

// ---------------------------------------------------------------------------
// Dues
// ---------------------------------------------------------------------------

/** POST /api/dues/pay/:dueId — `dueId` is the Due id, NOT the MemberDue id. */
export const startDuePayment = async (dueId: string, method?: PaymentMethod): Promise<StartPaymentResult> => {
  const response = await apiTenant.post(`/api/dues/pay/${dueId}`, method ? { method } : {});
  return response.data;
};

/** Member states they have made the bank transfer. Proof optional. */
export const declareDuePayment = async (dueId: string, opts?: { proof?: File | null; note?: string }) => {
  const response = await apiTenantAxiosForm.post(`/api/dues/pay/${dueId}/declare`, proofForm(opts));
  return response.data;
};

// ---------------------------------------------------------------------------
// Project contributions
// ---------------------------------------------------------------------------

export interface StartContributionInput {
  projectId: string;
  contributionType: "cash" | "in_kind";
  /** cash only — member-chosen amount */
  amount?: number;
  /** in_kind only */
  inKindDescription?: string;
  method?: PaymentMethod;
}

/** POST /api/projects/contributions — in-kind returns no checkout. */
export const startProjectContribution = async (input: StartContributionInput): Promise<StartPaymentResult> => {
  const response = await apiTenant.post(`/api/projects/contributions`, input);
  return response.data;
};

export const declareProjectContribution = async (contributionId: string, opts?: { proof?: File | null; note?: string }) => {
  const response = await apiTenantAxiosForm.post(`/api/projects/contributions/${contributionId}/declare`, proofForm(opts));
  return response.data;
};

// ---------------------------------------------------------------------------
// Service requests
// ---------------------------------------------------------------------------

export interface StartServiceRequestInput {
  serviceId: string;
  deliveryAddress: Record<string, string | undefined>;
  method?: PaymentMethod;
}

/**
 * POST /api/services/requests — creates the request AND starts payment in one call.
 * The delivery address is required, which is why this cannot use a generic initializer.
 */
export const startServiceRequest = async (input: StartServiceRequestInput): Promise<StartPaymentResult> => {
  const response = await apiTenant.post(`/api/services/requests`, {
    serviceId: input.serviceId,
    deliveryAddress: input.deliveryAddress,
    ...(input.method ? { method: input.method } : {}),
  });
  return response.data;
};

export const declareServicePayment = async (requestId: string, opts?: { proof?: File | null; note?: string }) => {
  const response = await apiTenantAxiosForm.put(`/api/services/requests/${requestId}/payment-proof`, proofForm(opts));
  return response.data;
};

// ---------------------------------------------------------------------------
// Event registration
// ---------------------------------------------------------------------------

/** POST /api/events/:eventId/register — free events return no checkout. */
export const startEventRegistration = async (eventId: string): Promise<StartPaymentResult> => {
  const response = await apiTenant.post(`/api/events/${eventId}/register`, {});
  return response.data;
};

export const declareEventPayment = async (registrationId: string, opts?: { proof?: File | null; note?: string }) => {
  const response = await apiTenantAxiosForm.post(`/api/events/registrations/${registrationId}/declare-payment`, proofForm(opts));
  return response.data;
};

// ---------------------------------------------------------------------------
// Verification
// ---------------------------------------------------------------------------

export interface PaystackVerifyResponse {
  message: string;
  status?: string;
  [key: string]: any;
}

/** Verify after returning from Paystack. Idempotent — the webhook is authoritative. */
export const verifyPaystackPayment = async (reference: string): Promise<PaystackVerifyResponse> => {
  const response = await apiTenant.get(`/api/paystack/verify/${reference}`);
  return response.data;
};
