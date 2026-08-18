# Rel8 Members Portal — CLAUDE.md

The member-facing app: dues, events, elections, projects, services, chat, profile.
Served at `app.rel8.ng` (or whatever `FRONTEND_URL` is on the backend).

Sibling repos, each with its own CLAUDE.md:

- `C:\Users\offic\documents\rel8-backend-nordjs-2025` — the API. **Read its CLAUDE.md**;
  it carries the master TODO list and the payment architecture.
- `C:\Users\offic\documents\rel8-admin-version-2` — admin dashboard
- `C:\Users\offic\documents\rel8-website-2025` — per-tenant public website

---

## Commands

```bash
npm run dev      # vite --port 4000
npm run build    # tsc && vite build   <- the correctness gate
npm run lint     # eslint, --max-warnings 0
npm run preview
```

No tests. `npx tsc --noEmit` is the fast check; `npm run build` is the real one.

## Stack

This app is **older than its siblings** — do not assume their conventions apply:

- React **18** (not 19)
- **`react-query` v3** — the legacy package, not `@tanstack/react-query` v5.
  `useQuery(key, fn, opts)` positional form, `useMutation(fn, opts)`, `isLoading`
  (not `isPending`). Do not copy hook code from the admin repo.
- Tailwind (no Chakra), `react-hook-form` + **yup** (not zod)
- `react-router-dom` v6, `react-toastify` via a local `Toast()` wrapper
- axios via `src/api/baseApi.ts`

## Layout

```
src/
  api/          one folder per resource; baseApi.ts holds the axios instances
  components/   shared UI (button/, form/, loaders/, toast/, payments/)
  pages/        auth/ and dashboard/<feature>/
```

`src/api/baseApi.ts` exports `apiTenant` (JSON) and `apiTenantAxiosForm` (multipart).
Use the form instance for anything with a file.

## Payments — read before touching money code

All five payment domains are unified (backend `X-1`/`X-7`). **`src/api/paystack-api.ts`
is the single entry point** — despite the filename it now covers both tiers, not just
Paystack.

The old generic `POST /api/paystack/initialize/:type/:id` is **410 Gone**. Each domain
starts payment at its own endpoint, because each needs domain knowledge that initializer
never had:

| domain | start | declare a transfer |
|---|---|---|
| Due | `startDuePayment(dueId, method?)` | `declareDuePayment(dueId, {proof?, note?})` |
| Event | `startEventRegistration(eventId)` | `declareEventPayment(registrationId, …)` |
| Project | `startProjectContribution({...})` | `declareProjectContribution(id, …)` |
| Service | `startServiceRequest({...})` | `declareServicePayment(requestId, …)` |

Every start returns the same `checkout`:

```ts
{ method: "paystack",      authorizationUrl, reference }      // redirect the payer
{ method: "bank_transfer", reference, amount, bankTransfer }  // show the details
```

Render the second case with **`components/payments/BankTransferPanel`** — it handles the
account details, copy-to-clipboard, the optional proof upload and the declare call. Do not
hand-roll another one.

### Two rules that are easy to get wrong

1. **Proof is optional.** Only require it when the item's
   `paymentConfig.bankTransfer.requireProof` is set. Most associations reconcile from
   their own bank statement; demanding a receipt just loses payers.
2. **Bank details are never shown before a payment exists.** They arrive with a generated
   reference, which is the only thing that lets an admin match the transfer to this
   member. Showing a bare account number up front (as this app used to) produces
   unattributable payments.

### Status vocabulary

One enum everywhere — `PAYMENT_STATUS_LABEL` in `paystack-api.ts` has the display strings:

`pending` → `awaiting_verification` → `paid` | `failed` | `rejected` | `cancelled`

Plus `unpaid` (a due nobody has started paying) and `free`. Legacy values (`approved`,
`awaiting-confirmation`, `confirmed`) are still tolerated in status maps because rows
predating the migration can still carry them.

**Two statuses are NOT payment statuses** and must not be folded in:
`ServiceRequest.requestStatus` (fulfilment: confirmed → dispatched → completed) and
`ProjectContribution.status` (in-kind verification only — cash uses `paymentStatus`).

### Events pricing

`event.isPaid` / `event.price` are gone. Use `event.pricing`:
`memberAmount` when the admin set a member discount, else `amount`. `paymentConfig.methods`
empty ⇒ free. A registration can now be `pending_payment` — a place held while checkout is
in flight, which does **not** count toward capacity.

## Voting

One vote per **member per position** (backend `BE-2`/`BE-3`, enforced by a unique index).
`ElectionDetailsPage` computes `hasVotedInCurrentPosition` and disables every candidate in
a position once one is chosen. A 409 from `castVote` means the server already has a vote
for that position — sync the UI rather than surfacing a bare error.

---

## TODOs

Legend: `[ ]` open · `[x]` done. IDs shared with the sibling repos (`MP-*` = portal only).

- [x] **X-1 / X-7 (portal side) · Migrate onto the unified payment layer.**
  **RESOLVED (2026-08-18):** `paystack-api.ts` rewritten; new
  `components/payments/BankTransferPanel`; `DuesPage`, `PaymentsTab`, `FundAProjectPage`,
  `serviceSubbmission`, `details.tsx`, `EventDetailPage`, `MyRegistrationsPage` and
  `PayUpForASingleDue` all updated. `serviceSubbmission` was rewritten — it had three
  overlapping submit paths, one per legacy payment type.

- [x] **MP-1 · `payDue()` pointed at a route that never existed.**
  `/dues/process_payment/due/:id/` — no `/api` prefix, no such handler. It could only
  404. **RESOLVED (2026-08-18):** Removed; `PayUpForASingleDue` now uses
  `startDuePayment`.

- [ ] **MP-2 · `events-api.ts` is full of dead endpoints.**
  `registerForFreeEvent`, `registerForPaidEvent`, `postEventPaymentSuccess`,
  `getEventRegisteredMembers`, `getEventAttendees`, `requestReschedule`, `getReschedule`
  all call `/api/events/eventview/...`, `/api/events/payment/` or `/api/events/save/payment/`
  — **none of which exist on this backend**. Pre-existing, not caused by the payment work.
  Verify against `src/routes/event.routes.js` and delete what is dead.

- [ ] **MP-3 · `PayUpForASingleDue` only handles the Paystack path.**
  If a due offers bank transfer only, it now tells the member to use the Dues page rather
  than silently failing. Better: render `BankTransferPanel` there too.

- [ ] **MP-4 · `useDynamicPaymentApi` (`src/api/payment.ts`) may now be dead.**
  It drove the old external payment-link flow, which no longer exists as a configured
  method. Check remaining callers and remove.

- [ ] **MP-5 · Election results view does not use the results endpoint.**
  The admin app got a rebuilt results view (`FE-4`); this app still renders from
  `fetchElectionDetails`. `fetchElectionResults` exists in `api-elections.ts` and is
  unused. The backend now returns per-position `isTie`/`winners[]` and a
  timezone-correct `status` — worth surfacing "voting open/closed" to members.
