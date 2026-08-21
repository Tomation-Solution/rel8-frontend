# Rel8 Members Portal — CLAUDE.md

The member-facing app: dues, events, elections, projects, services, chat, profile.
Served at `app.rel8.ng` (or whatever `FRONTEND_URL` is on the backend).

> 🎨 **A full visual redesign is in flight — read [`REDESIGN.md`](./REDESIGN.md) before
> touching any UI.** It carries the design tokens, the shared primitives in
> `src/components/ui/`, the module-by-module plan and a "Resume here" section with the
> current state. Currently: M0–M13 done — everything except Auth (M14) and the dead-code
> sweep (M15). Nothing committed.
> This file still governs stack rules, payment architecture and status vocabulary —
> none of which the redesign changes.

**Before building any screen, check the backend and the admin** — this app is older than
both and still calls routes they renamed or deleted. `REDESIGN.md` §0b has the checklist;
the short version is that `rel8-backend-nordjs-2025/src/app.js` decides what exists, and
`rel8-admin-version-2/src/services/api/` shows how it is meant to be consumed.

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

The member-facing dues screen is **one component**, `pages/dashboard/dues/DuesPanel.tsx`,
used by both `DuesPage` and the Account page's Payments tab. Those were separate copies that
declared transfers differently; do not fork them again.

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

**An event has no `name` field — the title is `details`.** The backend's own
`getEventStats` reads `eventTitle: "$event.details"`. `event.name || event.details` appears
in old call sites and only ever worked because `name` is undefined. Accessors live in
`src/pages/dashboard/events/eventFields.ts`.

`event.isPaid` / `event.price` are gone. Use `event.pricing`:
`memberAmount` when the admin set a member discount, else `amount`. `paymentConfig.methods`
empty ⇒ free. A registration can now be `pending_payment` — a place held while checkout is
in flight, which does **not** count toward capacity.

## Environments — one model, not three

Groups, committees and excos are **one backend resource**, `Environment`, discriminated by
`environmentType: "exco" | "committee" | "general"`. The admin app already dropped its
standalone Exco and Committee screens; this portal has not caught up, so
`/api/excos`, `/api/committees` and `/api/groups` are all **unmounted** and every client
calling them can only 404. Use `/api/environments` (`src/api/environments/environments-api.ts`).
Full breakdown, including which files die and which only need repointing, is in
`REDESIGN.md` §0c.

**Content field names**: News is `topic` / `content` (no `name`, no `body`); Publication is
`title` / `content`; Gallery is `images: [{url, caption}]`. `likes` / `dislikes` are arrays
of member ids, so the count is the length. Accessors:
`src/pages/dashboard/content/contentFields.ts`.

**Chat lives inside an Environment.** There is no standalone Chat page — `Environment.hasChat`
gates it, `EnvironmentMessage` stores it, and the socket protocol is keyed on
`environmentId` (`joinEnvironment` / `environmentMessage`, *not* the old `joinGroup` /
`groupMessage`). The UI is `pages/dashboard/environment/EnvironmentChatTab.tsx`.

Two member fields that are not the same thing: **`Member.status`**
(`active`/`inactive`/`suspended`/`pending`) is membership standing and is what the
Active/Inactive chip shows; **`Member.isActive`** is account deactivation, paired with
`deactivationReason` / `deactivatedAt`.

## Voting

Four of the six election pages were static mocks with no data layer and were deleted in M8
(`ElectionAllVotes`, `ElectionContestantDetailPage`, `ElectionStepsPage`,
`ElectionCreateAspirantPage`). What remains is the list and the detail/vote/results page.
`getElections` returns a server-computed `status` and `stats.turnout` — never recompute the
election window in the browser.

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

- [x] **MP-2 · `events-api.ts` is full of dead endpoints.**
  `registerForFreeEvent`, `registerForPaidEvent`, `postEventPaymentSuccess`,
  `getEventRegisteredMembers`, `getEventAttendees`, `requestReschedule`, `getReschedule`
  all call `/api/events/eventview/...`, `/api/events/payment/` or `/api/events/save/payment/`
  — **none of which exist on this backend**. Pre-existing, not caused by the payment work.
  Verify against `src/routes/event.routes.js` and delete what is dead.
  **RESOLVED (2026-08-18):** All eight removed after checking each against
  `src/routes/event.routes.js` — only `/eventview/get_events/` exists.

- [x] **MP-3 · `PayUpForASingleDue` only handles the Paystack path.**
  If a due offers bank transfer only, it now tells the member to use the Dues page rather
  than silently failing. Better: render `BankTransferPanel` there too.
  **RESOLVED (2026-08-18):** It now renders `BankTransferPanel` in place, so a
  transfer-only due is completed on the same screen instead of redirecting the member to
  the Dues page.

- [x] **MP-4 · `useDynamicPaymentApi` (`src/api/payment.ts`) was dead.**
  It drove the old external payment-link flow, which no longer exists as a configured
  method. Check remaining callers and remove.
  **RESOLVED (2026-08-18):** Removed. It posted to `/dues/process_payment/...` (no `/api`
  prefix, no such handler) and `pay()` had no callers left — only `loadingPay`, which was
  permanently false, was still destructured in `DuesPage` and `PaymentsTab`.

- [x] **MP-6 · Three unreachable payment-success pages removed.**
  `/event/success/:eventId`, the FundAProject success page and the service success page
  were all routed but unreachable — every payment now returns to `/paystack/callback`, and
  the only thing that linked to `/event/success` was `registerForPaidEvent`, itself dead.
  Two of the three also posted to endpoints that do not exist. Their API callers
  (`postEventPaymentSuccess`, `postPaymentSuccess`, `postServicePaymentSuccess`) went too,
  and the backend's now-orphaned `POST /api/services/payment-success` with them.

- [x] **MP-7 · Nine unreferenced modules removed.**
  `accordion/Accordion`, `cards/ElectionPositionCard`, `grid/PublicationGrid`,
  `tables/CompletedPaymentTable`, `tables/PendingPaymentTable`, `data/notificationData`,
  `elections/ElectionContestantsPage`, `support/ContactUsPage`.

  **Note for future sweeps:** `components/TenantProvider.tsx` looks unreferenced to a
  naive grep because `main.tsx` imports it under a different name *and* with an explicit
  extension — `import TenantGate from "./components/TenantProvider.tsx"`. It is load-bearing.
  Always confirm with a build, not a grep.

- [x] **MP-5 · Election results view does not use the results endpoint.**
  The admin app got a rebuilt results view (`FE-4`); this app still renders from
  `fetchElectionDetails`. `fetchElectionResults` exists in `api-elections.ts` and is
  unused. The backend now returns per-position `isTie`/`winners[]` and a
  timezone-correct `status` — worth surfacing "voting open/closed" to members.

  **RESOLVED (2026-08-18):** The page now reads the server's `status` instead of
  recomputing the voting window in the browser. The old `isElectionOngoing()` used
  `setHours`, resolving the election's wall-clock end time against the **viewer's**
  timezone — the same bug `BE-6` fixed on the backend — and it ignored an admin closing the
  election early (`FE-14`). Members also now see an explicit "Voting open / closed / not
  yet open" badge.