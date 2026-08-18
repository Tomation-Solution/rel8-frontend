import apiTenant from "../baseApi";

export const fetchAllUserDues = async () => {
  const response = await apiTenant.get(`/api/dues/memberdues/`);
  return response.data;
};

/**
 * X-7: dues payment now starts at `POST /api/dues/pay/:dueId` and is declared at
 * `POST /api/dues/pay/:dueId/declare` — see `api/paystack-api.ts`
 * (`startDuePayment` / `declareDuePayment`).
 *
 * The old `payDue()` helper that lived here pointed at `/dues/process_payment/due/:id/`,
 * a route that does not exist on this backend — no `/api` prefix and no such handler.
 * It could only ever have 404'd. Removed rather than repointed, because the new flow is
 * two steps and its caller needs the returned checkout.
 */
export const startDuePaymentLegacyNote = undefined;
