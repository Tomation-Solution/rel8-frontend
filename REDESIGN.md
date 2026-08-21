# Rel8 Members Portal — Redesign Tracker

Working document for the full visual rebuild of the member portal against the mockups in
`C:\Users\offic\Downloads\Relate\`. Read this alongside `CLAUDE.md` (stack rules, payment
architecture, status vocabulary — none of which change here).

**Scope: presentation only.** No API contracts change. Where a mockup shows something the
backend does not model (see [Mockup features we are NOT building](#mockup-features-we-are-not-building)),
we drop it rather than inventing an endpoint.

---

## 0. Resume here

**State as of 2026-08-21 — M0 through M13 done. `npx tsc --noEmit` and `npm run build` are
clean; `npm run dev` boots and serves.** Nothing has been eyeballed against a live tenant —
that needs a logged-in member, so someone with credentials should sanity-check the new
screens. M1's applicant shell is deferred, not built.

Nothing is committed.

### Next three things, in order

1. **M14 (Auth)** — the login / register / verify / forgot-password screens. **No mockups
   exist for any of them**, so it is extrapolated from the established language.
2. **M15 (dead-code sweep)** — the last module, and by now the list is long.
3. Then: get someone with a member login to eyeball the whole thing against a live tenant.
   (§0d is done — fixed in the backend repo, uncommitted there.)

Before starting any of them, read **§0b**. Checking the backend mount list first is what
turned up §0c, and in M5 it turned up the opposite mistake — a feature we had written off
as unbuildable ("Remind Me To Join") that has had a working endpoint all along.

### Resolved: the Environment toggle is gone — option (a)

The old navbar's "Environments" checkbox dropdown wrote to `localStorage.selectedEnvironments`
and `filterContentByEnvironment()` filtered Home and `EventGrid` off it. **Retired
2026-08-21.** Deleted: `src/context/environmentContext.tsx`, `src/utils/contentFilter.ts`,
the `EnvironmentProvider` mount in `main.tsx`, and both call sites. Audience scoping is the
API's job now — the client-side filter was a fuzzy `audience.includes(env)` string match.

Members' stale `selectedEnvironments` keys are left in localStorage; nothing reads them.

Note this is a *different* thing from the `Environment` **page** (M4) and the backend
`Environment` **model** (§0c), which are alive and well. Three uses of one word.

### Deferred: the applicant shell is blocked on the backend

`New Applicant dashboard.png` is not a restyle — this repo has no applicant route, page or
API module, and **`rel8-backend-nordjs-2025/src/routes/applications.routes.js` mounts
`requireOrgAdmin` on the whole router**, so there is no endpoint an applicant can call to
read their own application. Building the shell would ship a screen that can only 403.

Backend work needed first: a member/applicant-scoped `GET` for "my application"
(name, applicant id, application date, application status, review status). Once that
exists, the shell is a small piece of work — logo-only sidebar with one "Application"
item, topbar with org + Logout and no search, and a `KeyValueList` card.

### Assets

§5b lists the two illustrations that are currently standing in with the wrong art, plus
what is worth exporting from Figma for exactness. Everything else in the mockups is either
a line icon `react-icons` already matches, backend-rendered, or tenant-uploaded content.

### Smaller notes for whoever picks this up

- **`npm run lint` fails, and did before this work started.** `main` carries **12**
  `react-refresh` / `react-hooks/exhaustive-deps` warnings against a `--max-warnings 0`
  gate. The redesign is currently at **7** — check the delta, not the pass/fail. Keep it
  there: `react-refresh/only-export-components` fires whenever a `.tsx` file exports a
  helper beside its component, so put helpers in a sibling `.ts` (`statusTone.ts`,
  `notificationMeta.ts`, `utils/dates.ts` are the precedents).
- `ChatPage` still takes no recipient, so the Environment page's "Chat Up" can only land on
  `/chat`. M13 owes it a deep link.
- Every legacy screen still renders. The old `.btn*` / `.form-control` helpers in
  `index.css` were kept alive on purpose so untouched pages don't break mid-migration;
  they go in M15.

---

## 0b. Working rule — check the backend and the admin before you build

**Every module in this plan touches data someone else already modelled.** The mockups say
what a screen should look like; they do not say what the API returns, and this portal is
older than its siblings, so it carries call sites the backend renamed or deleted years ago.
Three whole API clients turned out to be dead in a single afternoon (see §0c).

So, before writing a screen — not after it fails in the browser:

| question | where the answer lives |
|---|---|
| Does this endpoint still exist? | `rel8-backend-nordjs-2025/src/app.js` — the `app.use("/api/...")` block is the definitive list of what is mounted. A route file existing on disk proves nothing |
| What does it return? | the controller in `src/controllers/*.controller.js`, and the schema in `src/models/*.js` — the `enum:` lines are the real vocabulary |
| Who can call it? | the `requireOrgAdmin` / `requireOrgAdminOrMember` middleware on the route. `requireOrgAdmin` means **a member cannot call it**, however good the screen would look |
| How is it meant to behave? | `rel8-admin-version-2` — the admin is newer and already consumes the current shapes. `src/services/api/*.ts` there is a working reference client |
| What should it look like? | the mockups in `Relate/` |

Two habits that pay for themselves:

- **The admin is the tiebreaker.** When this portal and the backend disagree about a shape,
  the admin app is almost always right — it was written against the current API. Read
  `rel8-admin-version-2/src/services/api/` before inventing a client here.
- **Write the reference into the code.** New API modules in this repo carry a header
  comment naming the backend route file, controller and model they talk to, plus the admin
  client that mirrors them. `src/api/environments/environments-api.ts` is the pattern.
  Whoever reads it next should not have to repeat the archaeology.

---

## 0c. The Group → Environment consolidation

**Confirmed with the user, 2026-08-21.** The backend collapsed groups, committees and excos
into **one `Environment` model** discriminated by `environmentType`. The admin app has
already dropped its standalone Exco and Committee screens. **This portal never followed the
rename**, so it still ships three API clients and five pages pointed at routes that are not
mounted.

```
Environment  (backend src/models/Environment.js)
  environmentType: "exco" | "committee" | "general"   <- the only distinction
  name, description, isPublic, hasChat
  members:   [ObjectId -> Member]     // never returned by list endpoints (.select("-members"))
  positions: [{ memberId?, name, email, title, bio, imageUrl, order }]
  chairperson?, startDate?, endDate?
```

Live routes — `app.use("/api/environments", groupRoutes)`, all `requireOrgAdminOrMember`
for reads:

| route | returns |
|---|---|
| `GET /api/environments` | every environment, metadata only |
| `GET /api/environments/type/:type` | one of `exco` / `committee` / `general` — 400 on anything else |
| `GET /api/environments/:id` | one, with `positions[]` |
| `GET /api/environments/:id/members` | the roster, populated as `name email imageUrl` only |

### Done — the rename is complete in this repo (2026-08-21)

**The user confirmed "group" was the mistake: the concept is Environment, everywhere.** So
this is not a compatibility layer, it is a rename. Nothing in `src/` says "group" any more
except where the *server's own wire format* still does.

Deleted outright (dead endpoints, nothing mounted at those paths):

| gone | called | replaced by |
|---|---|---|
| `api/groups/groups-api.ts` | `/api/groups`, `/api/groups/:id`, `/api/groups/:id/members` | `api/environments/environments-api.ts` |
| `api/committee/committee.ts` | `/api/committees*` | `fetchEnvironmentsByType("committee")` |
| `fetchAllExcos` / `fetchExcoById` | `/api/excos*` | `fetchEnvironmentsByType("exco")` |
| `pages/dashboard/members/ExcosPage.tsx`, `ExcoDetailPage.tsx` | — | the Environment page's Excos tab |
| `pages/dashboard/committees/*` | — | the Environment page's Committees tab |

Renamed and repointed:

| was | now |
|---|---|
| `pages/dashboard/groups/GroupDetailPage.tsx` | `pages/dashboard/environment/EnvironmentDetailPage.tsx` |
| `groups/GroupChatTab.tsx` | `environment/EnvironmentChatTab.tsx` |
| `groups/GroupConversationPanel.tsx` | `environment/EnvironmentConversationPanel.tsx` (`GroupPanel` → `EnvironmentPanel`) |
| route `/groups/:id` | route `/environment/:id` |
| `getGroupMessagesById`, `getGroupChats`, `sendGroupMessage`, `toggleGroupChat`, `clearGroupChat` | `getEnvironmentMessagesById`, `getEnvironmentChats`, `sendEnvironmentMessage`, `toggleEnvironmentChat`, `clearEnvironmentChat` |

### Where "group" legitimately survives — do not rename these

The backend renamed the model, the message model and the entire socket protocol, but **left
the REST chat paths alone**. These are wire format, not concept:

- URLs: `/api/chat/group`, `/api/chat/group/:groupId`, `/api/chat/groups`,
  `/api/chat/groups/:groupId/toggle`. The id in the path is an Environment id
- the JSON body key `groupId` on `POST /api/chat/group`

`api/chats/chats.ts` carries a header comment saying so. Function names follow the concept;
paths follow the server.

### Two things this turned up that were broken, not just misnamed

1. **The socket client was talking to nobody.** `chat.socket.js` listens for
   `joinEnvironment` / `leaveEnvironment` / `environmentMessage` and reads `{ environmentId }`
   for typing events. The portal was emitting `joinGroup` / `leaveGroup` / `groupMessage`
   with `{ groupId }`. Every one of those was silently ignored — live environment chat could
   not have worked. **Fixed** in `EnvironmentConversationPanel.tsx` / `EnvironmentChatTab.tsx`.
2. **`GroupDetailPage` filtered content on a field that does not exist.** It used
   `item.groupId === id`; News, Publication, Gallery, Event and Meeting all carry
   `environmentId` (each schema has a literal `// Changed from groupId` comment). Every
   content tab rendered empty regardless of what was in the environment. **Fixed** in
   `EnvironmentDetailPage.tsx`.

### Still owed by M13

`pages/chat/ChatPage.tsx` and `components/chat/ChatBoxContainer.tsx` still carry
`'group-chat'` / `type: 'group'` discriminators and a legacy `/chat/{tenant}/group/{id}/`
URL builder. Those are internal to the chat module M13 rewrites wholesale, so they were left
rather than half-renamed. M13 finishes them.

---

## 0d. Backend bugs found from this repo — **fixed 2026-08-21**

Found while checking shapes for the portal, then fixed in `rel8-backend-nordjs-2025`
(logged there as **BE-38**). Left here because the portal's behaviour depended on them and
someone will otherwise re-diagnose the same symptoms.

**What was wrong.** When groups/committees/excos were consolidated into `Environment` and
`GroupMessage` became `EnvironmentMessage`, `chat.controller.js` aliased the new models back
to the old variable names but **never renamed the fields in its queries** — still filtering
on `groupId` (which `EnvironmentMessage` does not have) and sorting on `timestamp` (which
`{ timestamps: true }` never creates; it produces `createdAt`/`updatedAt`).

Mongoose 8 defaults `strictQuery` to false, so the bogus filter went straight to Mongo
rather than being stripped — silent empty results instead of an error:

| endpoint | symptom |
|---|---|
| `GET /api/chat/group/:groupId` | `[]` for every environment — messages arrived live over the socket and vanished on reload |
| `GET /api/chat/groups`, `/overview` | `messageCount: 0`, `lastActivity: null`, `lastMessage: null` on every chat |
| `DELETE /api/chat/groups/:groupId` | deleted nothing, reported success |
| `POST /api/chat/group` | **never worked.** Built the document with `groupId`, which mongoose dropped, leaving no `environmentId` — a `required` field — so every send failed validation and 500'd |

It was only ever the controller: `sockets/chat.socket.js` had been migrated properly, which
is exactly why live messages worked and nothing else did.

**What changed.** Models referenced by their real names; every query on `environmentId` and
`createdAt`; `sendGroupMessage` accepts `environmentId` (still accepting `groupId` from the
body — that is the wire contract the clients speak), requires it, checks environment
membership and writes it.

`PrivateMessage` genuinely has a `timestamp` field, so those queries were correct and were
left alone. The REST paths stay `/api/chat/group*` — renaming them would break this portal
and the admin for nothing.

Verified without a database: the `EnvironmentMessage` schema confirms `environmentId`
(required) and `createdAt` exist while `groupId`/`timestamp` do not, and `validateSync()`
shows the old document shape failing with `environmentId: required` where the new one
passes.

> Consequence for this repo: environment chat now keeps its history across a reload, and the
> conversation list shows real message counts and last-activity times. Nothing in the portal
> had to change — `getEnvironmentMessagesById` already read `createdAt ?? timestamp`.

---

## 1. The design language

Sampled from the PNGs, not guessed.

| token | value | where it shows up |
|---|---|---|
| primary | `#7F02A2` | filled buttons, active nav text, badges, stat values, links |
| primary tint | `#F8E6FB` | active nav pill, table header row, card footers, chat bubbles, info chips |
| surface | `#FFFFFF` | every card |
| app / topbar bg | `#FAFAFB` | topbar strip, sidebar |
| hairline | `#ECEDEF` | card borders, row dividers, muted buttons |
| muted fg | `#6A7181` | body copy, "Past" state buttons |
| past / disabled badge | `#BEC1C7` | "Past" chips on event & meeting cards |
| success | fg `#4EAE4E` / bg `#E7F4E7` | Verified, Confirmed, Completed, VALID |
| danger | fg `#FF2424` / bg `#FFEAEA` | Pending, Logout, "Upload Payment Proof" |

Shape language: `rounded-xl` (12px) cards with a 1px hairline border and **no shadow**;
`rounded-full` pills for search inputs, filter selects, status chips and pagination;
`rounded-lg` on buttons. Generous whitespace, no dividers where a gap will do.

Type: **DM Sans** throughout (already loaded in `src/index.css`). Page title 24–28px
semibold near-black, subtitle 14px muted directly beneath — every screen opens with this
pair.

### Theming rule — do not hardcode purple

The portal is multi-tenant and already recolours itself per organization through CSS
variables (`--color-org-primary`, set by `src/utils/themeUtils.ts` from the org's brand
colours). The mockups are purple because the sample tenant (IACS) is purple.

So: **`#7F02A2` becomes the new default value of `--color-org-primary`, and every purple in
the redesign is expressed as `org-primary` / `org-primary/10` / `org-tint`.** A tenant with
a green brand must come out green. Any literal `#7F02A2` in a component is a bug.

Files: `src/index.css` (`:root` block), `tailwind.config.js` (`colors`),
`src/utils/themeUtils.ts` (`resetToDefaultTheme`).

---

## 2. Shared primitives

The single biggest win here. Roughly 80% of every mockup screen is these ~20 pieces.
All new files live in **`src/components/ui/`** and are re-exported from
`src/components/ui/index.ts`.

| primitive | replaces / absorbs | used by |
|---|---|---|
| `PageHeader` | `PageHeading`, `BreadCrumb`, ad-hoc `<h3>`s | every page |
| `BackLink` | hand-rolled "Go back" arrows | every detail page |
| `Card` | ad-hoc `bg-white rounded-lg` divs | everywhere |
| `StatCard` + `StatCardRow` | `src/components/cards/StatCard.tsx` | Home, Events, Meetings, Dues, News, Gallery, Publications, Elections, Vote, Results |
| `SearchFilterBar` | per-page search inputs + selects | Dues, Events, Meetings, News, Gallery, Publications, Elections, Environment, Chat |
| `Pagination` | `react-paginate` usages | 10+ list pages |
| `StatusPill` | every bespoke status `<span>` | Dues, Projects, Service Requests, Elections, Environment, Events |
| `Tabs` | ad-hoc tab strips | Chat, Environment, Elections, Account |
| `SubNav` | — (new) | My Account, Support |
| `MediaCard` | `EventsCard`, `MeetingCard`, `NewsCard`, `PublicationCard`, `FundAProjectCard`, `GalleryCard` | Events, Meetings, News, Publications, Projects, Gallery |
| `PersonCard` | `ExcosMemberCard`, member tiles | Environment |
| `InfoChip` / `InfoChipGrid` | — (new) | Event detail, Meeting detail |
| `KeyValueList` | — (new) | Applicant dashboard, Certificate info panel |
| `Button` | `src/components/button/Button.tsx` (rewritten) | everywhere |
| `IconInput` / `IconTextarea` | `InputWithLabel`, `TextInputWithImage`, `TextInputPassword` | Account, Support, Auth |
| `Toggle` | — (new) | Notification preferences |
| `EmptyState` | scattered "no data" markup | every list page |
| `Accordion` | (a deleted `Accordion` used to exist — MP-7) | FAQ |
| `ProgressBar` | `src/components/progress-bar/ProgressBar.tsx` | Election results/vote |
| `Table` | `src/components/Table/Table.jsx` **and** `DataTable.tsx` — two disagreeing wrappers, both replaced by `ui/Table.tsx` (M7) | Dues, Service Requests, Elections, Positions |
| `ContactForm` | duplicated form in 2 support pages | Admin Support, Technical Support |

---

## 3. Modules

Tackled in order. Each is a self-contained, buildable step.

Legend: `[ ]` open · `[~]` in progress · `[x]` done

### [x] M0 · Design tokens & primitives — **done 2026-08-20**
Nothing visible changed; everything after this depends on it.
- [x] `tailwind.config.js` — `org-tint`/`org-tint.strong`, `ink`, `muted`, `hairline`,
  `app`, `past`, and a `status.*` scale (`success`/`danger`/`warning`/`neutral` + `-bg`)
- [x] `src/index.css` — `:root` defaults incl. the two new tint variables, tighter base
  type scale, a `.surface` component class. Legacy `.btn*`/`.form-control` helpers
  retained (see the resume notes)
- [x] `src/utils/themeUtils.ts` — rewritten. Exports `DEFAULT_PRIMARY` (`#7F02A2`) /
  `DEFAULT_SECONDARY`, and derives the tint through **HSL** (keep hue, cap saturation at
  80%, set lightness 94% / 87%) rather than blending toward white, which greys the hue out.
  `setOrganizationTheme()` now sets six variables, not four.
- [x] `src/components/ui/` — 17 primitives + an `index.ts` barrel. Import from the barrel.

Built: `Accordion`, `Button`, `Card`, `EmptyState`, `Field` (`IconInput`, `IconTextarea` —
both `forwardRef` so `react-hook-form`'s `register()` spreads straight on), `InfoChip` +
`InfoChipGrid`, `KeyValueList`, `MediaCard` + `MediaCardGrid`, `PageHeader` + `BackLink`,
`Pagination`, `PersonCard` + `PersonCardGrid`, `ProgressBar`, `SearchFilterBar` +
`SearchInput` + `FilterSelect`, `StatCard` + `StatCardRow`, `StatusPill` + `statusTone()`,
`Tabs` + `SubNav`, `Toggle`.

> `statusTone()` now lives in its own module, `src/components/ui/statusTone.ts`, alongside
> `PillTone` and the `TONES` map — a component file that also exports helpers trips
> `react-refresh/only-export-components`, and this repo lints at `--max-warnings 0`. It
> deliberately maps **three different enums** (payment
> status, `ServiceRequest.requestStatus`, `ProjectContribution.status`) onto one colour set,
> because the chip looks identical either way. That is a rendering convenience only — do not
> let it tempt anyone into merging those enums upstream. `ContactForm` is listed in §2 but
> is **not built yet**; it lands with M12.

### [x] M1 · App shell — **done 2026-08-21**
The frame every screen sits in. Highest-leverage module.
- [x] `src/types/sidebarDataType.tsx` — `SideBarLinkType` gains `key` (badge lookup),
  `startsGroup` (visual grouping) and `danger` (Logout)
- [x] `src/data/sideBarData.tsx` — mockup order and labels (§4), one distinct icon per
  entry. `Environment` is a flat link **temporarily pointing at `/members`**
- [x] `src/components/navigation/NavItem.tsx` — lavender active pill with a brand left bar,
  count badge, unread dot, danger tone. Submenu rendering kept (nothing feeds it right now).
  `NestedSubGroup`'s `children` prop renamed to `items`
- [x] `src/components/navigation/Sidebar.tsx` — greeting block (`greeting()` is exported and
  time-of-day aware) + role pill + rail + red Logout. Badges come from the **existing**
  `"events"` / `"notifications"` query keys so react-query serves them from cache instead of
  refetching. **Dropped the dynamic group submenu** — see the resume notes
- [x] `src/components/navigation/Navbar.tsx` — rewritten: disabled `Ctrl + K` search,
  `formatTopbarDate()` chip, Notifications pill with an unread dot, org name/role + logo.
  **Removed the Environments checkbox dropdown** — see the open decision
- [x] `src/layouts/DashboardLayout.tsx` — rewritten. The navbar sits in the flow now, so the
  `pt-[70px]` padding that compensated for the old `fixed` one is gone (it was pushing
  every page down by a navbar it no longer sat under). Content is a centred `max-w-[1440px]`
  column with mockup spacing, and the scroll container resets to the top on every route
  change — react-router's own restoration never sees it, because the scroller is ours and
  not the window. Dues-blocker modal untouched; its currency map moved to `utils/currency.ts`
- [ ] **Applicant shell** (`New Applicant dashboard.png`) — **deferred, blocked on the
  backend.** See "Deferred" in §0. Not counted against M1
- [x] `npm run build` — clean

### [x] M2 · Home dashboard — **done 2026-08-21** — `Home.png`
- [x] `src/pages/dashboard/home/HomePage.tsx` rewritten on the primitives. `PageHeader`
  ("Dashboard" / "Here is what's happening with your community today."), a `StatCardRow` of
  Active Dues / Total Events / Meeting, then a 2:1 split — "Latest Update" and "Recent
  Notifications" on the left, "Quick Actions" and "Publications" on the right
- [x] Active Dues reuses `isOutstanding()` from `paystack-api.ts`, so the stat and the
  dues-blocker modal can never disagree about what is owed
- [x] The three carousels are gone. `react-multi-carousel` is still imported by other
  screens, so it stays in `package.json` until M15
- [x] Empty states are real: "No Update Yet" + a working "Check for Update" that refetches
  the news query, and per-panel empties for notifications and publications
- [x] Two new shared utils, both extracted rather than invented:
  - `src/utils/dates.ts` — `formatDate`, `formatDateTime`, `relativeTime` ("2 Days ago"),
    `isPast`. M3/M5/M6 all need these
  - `src/utils/currency.ts` — `CURRENCY_SYMBOLS`, `currencySymbolFor`, `useCurrencySymbol`,
    `formatMoney`. The symbol map was copy-pasted into four files with three different
    defaults; `DashboardLayout` and Home are on the shared one, and M7 should move
    `DuesPage` / `PaymentsTab` / `PayUpForASingleDue` across too
- [x] `EventGrid.tsx` lost its environment filter (see §0). Its styling is still M5's job
- Retires `HomePageNotification.tsx`, `QuickNav.tsx`, `HomePageNewsCard.tsx` — all now
  unreferenced, deleted in M15

### [x] M3 · Notifications — **done 2026-08-21** — `Notifications.png`
- [x] `src/pages/dashboard/notifications/NotificationsPage.tsx` rewritten
- [x] `src/components/notifications/NotificationRow.tsx` — shared by Home and this page.
  `stamp="relative"` gives Home's "2 Days ago", `stamp="posted"` the list page's
  "Date Posted: 17/06/2025 @03:28 PM"
- [x] `notificationMeta.ts` — `notificationLink()` / `notificationIcon()`. **The old page
  guessed the destination by substring-matching the notification _title_**
  (`title.includes("event")`), which sent every row to a list page and broke the moment an
  admin worded a title differently. It now reads `latest_update_table_name` /
  `latest_update_table_id`, the fields that actually carry it
- [x] Paged client-side at 10/page — `/notifications/latestupdate/member_lastest_updates/`
  takes no page parameter and returns the whole list

### [x] M4 · Environment — **done 2026-08-21** — `environment.png`, `environment-1.png`
**This is the consolidation module — read §0c first.** Everything that used to be a
standalone Excos, Committees or Groups screen lands here as a tab, because the backend has
one `Environment` model behind all three.

- `src/api/environments/environments-api.ts` — new client for `/api/environments`,
  mirroring `rel8-admin-version-2/src/services/api/environments.ts`
- `src/pages/dashboard/environment/EnvironmentPage.tsx` — new, replacing
  `members/MembersPage.tsx`, `members/ExcosPage.tsx` and `committees/CommitteesPage.tsx`
- Tabs: **Member Environment** (`GET /api/members`) · **Excos Environment**
  (`/type/exco` → `positions[]`) · **Committees** (`/type/committee`) · **Groups**
  (`/type/general`) · **Member Types** (`/api/member-types`)
- Mockup furniture: count line ("95 Members"), centred search pill, `PersonCard` grid with
  an Active/Inactive corner chip and a "Chat Up" CTA, pagination
- Flip the `environment` entry in `sideBarData.tsx` from `/members` to `/environment`

Field notes, from the backend model rather than guesswork:

- The Active/Inactive chip is **`Member.status`** (`active` / `inactive` / `suspended` /
  `pending`). Do **not** use `Member.isActive` — that is a separate account-deactivation
  boolean with `deactivationReason` / `deactivatedAt` beside it. Same trap as the two
  service-request enums in M10
- `GET /api/members` enriches each member with `environments: [{_id, name}]`, so a member
  already knows which environments they are in — no second request needed
- Exco cards come from `positions[]`, not from members. A position carries its own `name`,
  `title`, `email` and `imageUrl` and only *optionally* links to a real `memberId`, so an
  org can list a seat for someone who has no portal account
- An org can run more than one exco environment (an outgoing and an incoming council), so
  carry the environment name onto each seat and group by it
- "Chat Up" can only `navigate("/chat")` today — `ChatPage` takes no route param and no
  recipient state. Deep-linking a private conversation is **M13's** job; the CTA is wired
  to the right place, it just cannot preselect yet

### [x] M5 · Events & Meetings — **done 2026-08-21** — `Events.png`, `Events-1.png`, `Meetings.png`, `Meetings-1.png`

- [x] `events/EventsPage.tsx` — Total / New / Past stat cards, search + All/New/Past filter,
  `MediaCard` grid in the tinted-footer layout, pagination. "My Registrations" kept in the
  header's action slot (it is not in the mockup, but the route exists and nothing else
  links to it)
- [x] `events/EventDetailPage.tsx` — hero with the New/Past badge, `InfoChip` grid,
  organiser strip with the attachment download, and the "Others" rail
- [x] `events/MyRegistrationsPage.tsx` — restyled onto `Card` + `StatusPill`
- [x] `meetings/MeetingPage.tsx` — two stat cards (the mockup has no Past tile for
  meetings), same card grid plus a per-card reminder button
- [x] `meetings/MeetingDetailsPage.tsx` — rebuilt; `styled-components` gone from it
- [x] `events/eventFields.ts` — new. Field accessors with the model's traps written down
- [x] `meetings/RemindMeButton.tsx` — new, see below

**"Remind Me To Join" is real, and is built.** §5 used to list it as a mockup affordance
with no API. That was wrong: `POST /api/meetings/:id/remind` is mounted and member-callable.
The controller upserts a `MeetingReminder` on (meetingId, memberId), so pressing twice is
safe, and it enforces two rules the button now respects rather than discovering by error —
`minutesBefore` must be one of 5/10/15/30, and a reminder whose fire time has already passed
is a 400, so the button hides itself for meetings that are too close or already over.

**Field notes, from `models/Event.js` and `models/Meeting.js`:**

- **An event has no `name` field.** The title is `details` — the backend's own
  `getEventStats` reads `eventTitle: "$event.details"`. Existing call sites wrote
  `event.name || event.details`, which only ever worked because `name` was undefined
- Events keep date and time apart (`date` + free-text `time`); meetings put both in
  `event_date`. `formatCardDateTime(date, time?)` handles both
- "Location: Physical / Virtual" is **derived, not stored** — an event is Virtual when it
  has a `meetingLink`, a meeting when it has a `url`
- Meeting fields are spelt `organiserName` / `organiserDetails` / `organiserImage` /
  `addresse` / `meeting_docs`; events use `organizer` (z) and `address`. Not a typo to fix
  here — that is what the API returns
- `GET /api/events/stats` exists but is **org-wide admin data** (revenue, registration
  counts). The mockup's Total/New/Past are member-visible counts of the member's own event
  list, so they are derived client-side instead

**Deliberate deviation from the mockup:** `Events-1.png` puts a single "Pay Now" beside the
Type chip. That cannot express what the backend models — capacity, registration deadline,
choice of payment method, and cancelling an unpaid registration — so the chip states the
price and a `Registration` card below carries the actions. Payment logic itself is
unchanged (X-1/X-7): `startEventRegistration` → `BankTransferPanel` → `declareEventPayment`.

**Not touched, on purpose:** `EventsCard`, `MeetingCard`, `EventGrid`, `QuickNav`, `SeeAll`
and `GalleryGrid` still back News, Publications, Gallery and Projects, which are M6/M9.
They go in M15, not now.

### [x] M6 · Publications, News, Gallery — **done 2026-08-21** — `Publications*.png`, `News*.png`, `Gallery.png`

- [x] `news/index.tsx`, `news/NewsDetailPage.tsx`
- [x] `publications/PublicationsPage.tsx`, `PublicationsDetailPage.tsx`
- [x] `gallery/GalleryPage.tsx`, `GalleryDetailPage.tsx`
- [x] `content/contentFields.ts` — new, shared accessors (below)
- [x] `content/CommentsPanel.tsx` — new, shared by News and Publications

**None of these models call their fields what the portal called them.** From
`models/News.js`, `models/Publication.js`, `models/Gallery.js`:

| | title | body |
|---|---|---|
| News | `topic` | `content` |
| Publication | `title` | `content` |

So a news item has **no `name` and no `body`**. `contentFields.ts` holds the accessors.

- `likes` / `dislikes` are **arrays of member ids**, not counts — the count is the length,
  and "have I liked this" is membership. The old detail page read
  `localStorage.getItem("userId")`, a key nothing in this app ever writes, so its like state
  was permanently false
- `getPublicationById` populates `likes` as `{name, email}` objects while news leaves them
  as raw ids; `hasLiked()` tolerates both
- **`GET /api/content/news/:id/comments` does not exist.** `content.routes.js` has POST /
  PUT / DELETE for news comments but no GET (publications *do* have one). Comments arrive
  embedded — `getNewsById` populates `comments.userId` with name/email/imageUrl. So
  `fetchNewsComments` was removed and the detail page makes one request instead of two, and
  no longer pulls the whole news list to find one article
- Gallery items hold `images: [{url, caption}]`, with `imageUrl: [String]` as the legacy
  shape the controller still normalises alongside it. `galleryImages()` reads both
- Gallery is the one content endpoint that **pages server-side** (`gallery_version2`), so
  its `Pagination` is driven by `total`/`limit` from the response rather than a client slice

**Two mockup affordances not built**, both moved into §5 with reasons: threaded replies and
per-comment likes. The comment subdocument has no `parentId` and no like field, so both
would have been client-only state that vanishes on reload.

**Confirmation worth recording:** `content.controller.js` runs `getUserEnvironmentIds()` +
`getAudienceFilter()` on every list endpoint — the server already scopes content by
audience and environment. That is the retroactive justification for retiring the
client-side environment filter in §0.

### [x] M7 · Dues & payments — **done 2026-08-21** — `Dues.png`

- [x] `components/ui/Table.tsx` — **new primitive.** Lavender header with rounded ends,
  hairline dividers, no zebra. Deliberately not on `react-table`: every table in these
  mockups is a plain list with custom cells, and the repo had *two* disagreeing wrappers
  (`Table/Table.jsx` for dues, `Table/DataTable.tsx` for elections). Both die in M15 as
  screens move across — `Table.jsx` is already unreferenced
- [x] `dues/DuesPanel.tsx` — **new.** The outstanding-total tile, search + filter, table and
  both payment paths
- [x] `dues/DuesPage.tsx` — now just a `PageHeader` over the panel
- [x] `account/PaymentsTab.tsx` — now just the panel (see below)
- [x] `dues/receipt.ts` — the ~200-line canvas PDF lifted out of the page body
- [x] `pay-up/PayUpForASingleDue.tsx`, `modals/OutstandingDuesModal.tsx`,
  `payments/BankTransferPanel.tsx`, `payments/PaymentMethodChoice.tsx` restyled
- [x] `payments/defaultMethod.ts` — split out so the choice component exports only a component

**The duplicate that had drifted.** `DuesPage` and `PaymentsTab` were near-identical copies
of the same screen, and they no longer agreed: `PaymentsTab` hand-rolled a multipart POST to
`/api/dues/pay/:id/declare` instead of calling `declareDuePayment`, so the two screens
declared transfers differently and **only one of them honoured `requireProof`**. One panel
now, so there is one dues table and one payment path.

**Four hardcoded-value bugs fixed along the way**, all of the same family — a value written
in before the thing it belongs to existed:

| where | was | why it was wrong |
|---|---|---|
| `BankTransferPanel` | `₦${amount}` | hardcoded naira on the one screen where the number must be exactly right. Now `useCurrencySymbol()` |
| `dues/receipt.ts` | accent `#1e3a5f` | a navy from the pre-redesign palette, so every tenant's receipt came out blue. Now reads `--color-org-primary` |
| `PaymentMethodChoice` | selected card `bg-org-secondary` | a saturated brand colour behind dark label text. Now `bg-org-tint`, like every other selected surface |
| `OutstandingDuesModal` | `handleRemindLater` | wrote `localStorage.duesReminderTime` with no button wired to it and nothing reading the key back. Removed |

The currency-symbol map that was copy-pasted into four files with three different defaults
is now only `utils/currency.ts`, as M2 intended.

⚠️ Payment *logic* is untouched — X-1/X-7 stands. Proof stays optional unless
`paymentConfig.bankTransfer.requireProof` is set, and bank details still never appear before
a payment exists to attach the reference to.

**Mockup notes:** `Dues.png` is titled "Elections" (a copy error, not a spec — the page is
Dues) and draws a bulk-select checkbox column, omitted per §5 as there are no bulk endpoints.

### [x] M8 · Elections — **done 2026-08-21** — `Elections.pdf`, `Position.png`, `Vote.pdf`, `View Election Result.pdf`

- [x] `ElectionsPage.tsx` rebuilt on `ui/Table` + `Tabs` + `StatCardRow`
- [x] `ElectionDetailsPage.tsx` restyled onto the tokens **without touching the voting
  logic** — one vote per member per position, the 409 sync and the dues gate are as they were
- [x] Four pages deleted (below), plus the dead `fetchElectionContestants`

> ⚠️ The three election mockups are **PDFs**, and this environment cannot render them
> (`pdftoppm` missing). M8 was built from `Position.png` plus the written descriptions
> captured in this file when they *were* readable. Worth an eyeball by someone who can open
> them.

**Four of the six election pages were static mocks.** `ElectionAllVotes`,
`ElectionContestantDetailPage`, `ElectionStepsPage` and `ElectionCreateAspirantPage`
contained **zero** `useQuery` / `useMutation` / `apiTenant` calls — hardcoded names and
percentages in markup. None appears in the mockups either. Deleted along with their routes,
`components/cards/ElectionContestantCard.tsx`, and `fetchElectionContestants` (which called
`/election/adminmanageballotbox/list_of_contestant/`, a Django-era path, and had no callers).

**The list page was recomputing the election window in the browser** — building
`new Date(\`${startDate}T${startTime}:00\`)` and comparing, which resolves the election's
wall-clock time against the *viewer's* timezone and ignores an admin closing early. That is
the same bug BE-6 fixed server-side and MP-5 removed from the detail page. `getElections`
already returns a server-computed `status` (`Upcoming` / `Ongoing` / `Ended`) and a
`stats.turnout`; both are used directly now.

**§5 correction:** "Average Turn-out ... not returned" was half wrong. It is not on
`fetchElectionResults`, but `GET /api/elections/member-stats` returns `averageTurnout`
alongside `totalElectionsHeld` and `upcomingElections` — so all three stat cards are real.
**Still not built:** `Position.png`'s "Date Started", "Time Spent" and "Past Holder"
columns. The Position model is `{ name, orgId, currentHolder }` plus timestamps; there is no
position-history collection to derive any of them from.

### [x] M9 · Fund a Project — **done 2026-08-21** — `Project.png`, `Project Details.png`, `Project Status.png`

- [x] `pages/dashboard/projects/FundAProjectPage.tsx` restyled onto `MediaCard` + `StatusPill`
- [x] `pages/dashboard/fund-a-project/` **deleted** — all four pages, plus
  `api/fundAProject/`, `components/cards/FundAProjectCard.tsx`,
  `components/PaymentSuccess/`, and the `/fund-a-project/:projectId`,
  `/support-in-kind/:projectId`, `/support-in-cash/:projectId` and
  `/fund-a-project/thank-you/:project_id` routes

**There were two Fund-a-Project implementations and only one worked.** The routed detail and
support pages called `fundAProject()` → `/extras/admin_manage_project/`: no `/api` prefix,
Django-era, not mounted. The live one is `pages/dashboard/projects/FundAProjectPage`, which
uses `api/projects/projects-api.ts` and already carries the X-7 contribution flow.

Note `GET /api/projects/:id` is **`requireOrgAdmin`** — a member cannot fetch a single
project. Members get `/api/projects/active`, so a per-project detail route would have to
derive its project from that list. The single page with a contribution modal avoids the
problem entirely, which is why the deleted detail page was not rebuilt.

Also removed dead code the X-7 migration left behind in the live page:
`createContributionMutation`, `ServicesFileUploadInput`, `proofOfPaymentRef` and
`handleProofOfPaymentClick` — none reachable since contributions started going through
`startProjectContribution`.

### [x] M10 · Service Requests — **done 2026-08-21** — `Service Request.png`, `Service Request-1.png`

- [x] `service_request/index.tsx` rebuilt as a `ui/Table` catalogue with search + pagination
- [x] `service_request/details.tsx` and `serviceSubbmission.tsx` restyled
- [x] Both pages hardcoded `Intl.NumberFormat("en-NG", { currency: "NGN" })`; they use the
  org's own currency now (same bug family as M7)

⚠️ **Two chips per request, two different enums** — `requestStatus`
(pending → confirmed → dispatched → completed) and `paymentStatus` (the X-7 vocabulary).
`statusTone()` gives them one colour set as a rendering convenience; that is not permission
to merge them.

⚠️ **Deliberate deviation from `Service Request-1.png`.** The mockup prints the account
number, account name and bank **before any request exists**. That is exactly the
anti-pattern X-7 removed: an account number with no reference produces transfers nobody can
match to a member, which is why CLAUDE.md states bank details never appear before a payment
does. The page says how payment will work, and the details arrive with a reference once the
request is submitted. Do not "restore" the mockup here.

### [x] M11 · My Account — **done 2026-08-21** — `My Account*.png`, `Credentials.png`, `Certificate.png`

- [x] `AccountPage.tsx` — `SubNav` (Profile Settings / Credentials) + inner `Tabs`
- [x] `ProfileTab.tsx` restyled; card carries the purple left edge
- [x] `PasswordTab.tsx`, `NotificationPreferenceTab.tsx`, `CredentialsTab.tsx` — new
- [x] `members/MemberProfilePage.tsx` restyled
- [x] `account/PaymentsTab.tsx` deleted — the mockup's SubNav has two entries, not three,
  and Dues is its own item in the rail rendering the same `DuesPanel`

**Three of this module's screens have no endpoint behind them.** Each is handled by doing
the nearest true thing rather than a form that submits nowhere:

| mockup | reality | what shipped |
|---|---|---|
| Password Settings: current / new / confirm | **no authenticated change-password route.** `member.routes.js` has only `set-password` (invite token), `forgot-password` (email) and `reset-password/:token` | a "Send me a reset link" action on the endpoint that does exist |
| Notification Preference toggles | Member has no preferences field; `PUT /members/profile` accepts name, phone, jobTitle, bio, socials, image — nothing else | toggles render in their true state (all on) and are disabled, with the reason stated |
| Certificate viewer + Verify | **`credential.template.routes.js` is `requireOrgAdmin` on every route**, and it serves *templates* — there is no issued-credential model and no member-scoped "my certificate" endpoint | the card states the position; no viewer that could only 403 |

The **Membership ID card is real** and needed nothing new — `MembershipCardTab` renders it
in the browser from the member's own profile.

The mockup also shows an "Environment" field on the profile form. A member's memberType and
environments are set by an admin and `PUT /api/members/profile` does not accept them, so it
renders read-only rather than as an input that silently discards edits.

### [x] M12 · Support — **done 2026-08-21** — `Support.png`, `Support-1.png`, `Support-2.png`

- [x] `support/SupportPage.tsx` — one page, `SubNav` (FAQs / Admin Support / Technical
  Support), `Accordion` for the FAQs
- [x] `components/ui/ContactForm.tsx` — **the last §2 primitive**, now built
- [x] `FAQPage.tsx`, `AdminSupportPage.tsx`, `TechnicalSupportPage.tsx` deleted with their
  `/faq`, `/admin-support` and `/technical-support` routes

Four pages became one. The old `SupportPage` was just three links to the other three, and
Admin/Technical Support were the same form twice — same fields, same validation, same
success handling — differing only in which mutation they called. `ContactForm` takes that
difference as a prop.

Nothing was blocked here: `GET /api/faqs` is `requireOrgAdminOrMember`, and both forms
already went through `POST /api/tickets` (fixed in an earlier pass — they used to post to
Django `/contactus/*` routes and show a success state anyway).

### [x] M13 · Chat — **done 2026-08-21, as a removal**

**Decided with the user: there is no standalone Chat feature any more.** Chat is a property
of an Environment on this backend — `Environment.hasChat`, an `EnvironmentMessage` model,
and a socket protocol keyed on `environmentId` — so it lives inside the Environment detail
page rather than as a second, parallel place to have the same conversations. `Chat.png` and
`Chat-1.png` draw a standalone page; that is the one place the mockups and the data model
disagree about what the feature *is*, and the model won.

Deleted: `pages/chat/ChatPage.tsx`, all of `components/chat/`, the `/chat` route, and the
`Chat` entry in the rail.

Kept, under `pages/dashboard/environment/`: `EnvironmentChatTab`,
`EnvironmentConversationPanel` (group + private panels) and `MessageBubble` — the old
`components/chat/ChatItem`, restyled to the mockup's bubbles and moved to live beside the
feature it belongs to.

**Both debts this module owed are paid:**

1. §0c's repoint — the roster call now goes to `/api/environments/:id/members`, and the
   socket protocol was corrected during the rename.
2. M4's "Chat Up". With `/chat` gone it would have been a dead link, so it now opens a real
   conversation: `/environment/:id?tab=chat&member=<memberId>`, which selects that person's
   private panel. On the Environment list this needs to know *which* environment — members
   come back with `environments: [{_id, name}]` but no `hasChat`, so the two lists are
   crossed to find the first chat-enabled environment the two of you share. **If you share
   none, the button is hidden** rather than left pointing nowhere — the server refuses
   `joinEnvironment` on an environment without `hasChat`, so there would be nothing to open.

✅ **Fixed since.** The backend bug that made REST message history return `[]` (§0d, logged
there as BE-38) was repaired in `rel8-backend-nordjs-2025`, so environment chat keeps its
history across a reload and the conversation list shows real counts. No portal change was
needed.

### [ ] M14 · Auth screens — **no mockups supplied**
`Relate/` contains no login, register, verify, forgot-password or activate screen.
Extrapolated from the established language (purple CTA, hairline cards, icon inputs) —
revisit if mockups turn up.
- `src/pages/auth/LoginPage.tsx`, `RegistrationPage.tsx`, `VerifyMemberPage.tsx`,
  `AuthenticationPage.tsx`, `PayupPage.tsx`
- `src/pages/auth/forgot-password/*`
- `src/pages/ActivateAccount.tsx`, `PaystackCallbackPage.tsx`, `ErrorPage.tsx`,
  `NotFoundPage.tsx`
- `src/components/auth/*`

### [ ] M15 · Dead-code sweep — **deliberately last**
After every screen is on the primitives, delete what nothing imports.

**The Group -> Environment casualties (§0c) — dead endpoints, not just unused files:**
`src/api/committee/committee.ts`, `src/api/groups/groups-api.ts`, `fetchAllExcos` +
`fetchExcoById` in `src/api/members/api-members.ts`, `pages/dashboard/members/ExcosPage.tsx`,
`ExcoDetailPage.tsx`, `pages/dashboard/committees/*`, `pages/dashboard/groups/GroupDetailPage.tsx`,
and the `/committees`, `/committees/:id`, `/groups/:id` routes in `App.tsx`.
Keep `GroupChatTab` / `GroupConversationPanel` — M13 repoints them.

**Now also unreferenced after M8–M11:** `components/Table/Table.jsx` and
`components/Table/DataTable.tsx` (both replaced by `ui/Table`), `components/cards/NewsCard.tsx`,
`PublicationCard.tsx`, `PublicationComment.tsx`, `components/button/Button.tsx` and
`components/form/*` wherever the migrated screens dropped them. Confirm with a build.

Known candidates already: `src/components/cards/HomePageNewsCard.tsx`,
`src/components/navigation/QuickNav.tsx`, `src/components/homepage/HomePageNotification.tsx`,
`src/components/SeeAll.tsx`, `src/components/PageHeading.tsx`,
`src/components/breadcrumb/BreadCrumb.tsx`, `src/components/form/*` (superseded),
`src/pages/dashboard/services/*` (nine static service form pages the mockups replace with
the generic Service Request flow), `src/components/PaymentSuccess/ThankYou.tsx`.

> ⚠️ **`src/components/TenantProvider.tsx` is load-bearing** — `main.tsx` imports it as
> `TenantGate` *with an explicit extension*, so a naive grep says it is unused. Confirm
> deletions with `npm run build`, never with grep. (Same warning as `CLAUDE.md` MP-7.)

---

## 4. Navigation, as the mockups define it

Every screen shows the same rail, so this is the source of truth for `sideBarData.tsx`:

```
Home · Chat · Notifications(•) · Environment
Events(10) · Meetings · Publications · News · Gallery · Elections · Dues
My Account · Fund a Project · Service Request · Support
Logout (red, detached at the bottom)
```

Changes from what shipped:
- `Environments` (dropdown of member-types/groups) → **`Environment`**, a flat link to a
  single tabbed page. The group/committee sub-links move inside that page.
- `Publication` → `Publications`; `Election` → `Elections`;
  `Service Requests` → `Service Request`
- `Meetings` moves up to sit directly under Events
- Every item gets a distinct icon (the shipped rail reuses `FiUser` four times)
- Events carries a count badge; Notifications carries an unread dot

---

## 5. Mockup features we are NOT building

Recorded so they don't get re-litigated. Each is a UI affordance with no backend behind it.

| in the mockups | why not |
|---|---|
| Standalone Chat page (`Chat.png`, `Chat-1.png`) | chat is a property of an Environment (`hasChat`, `EnvironmentMessage`, a socket keyed on `environmentId`). It lives in the Environment detail page instead of as a parallel second home for the same conversations. Decided with the user, M13 |
| Global `Ctrl + K` "Search Anything" | no search endpoint; rendered as a decorative, disabled input for now |
| Bulk row checkboxes (dues, services, gallery, elections) | no bulk-action endpoints; column omitted |
| ~~"Remind Me To Join" on meetings~~ | **This entry was wrong — the feature is built (M5).** `POST /api/meetings/:id/remind` is mounted and `requireOrgAdminOrMember`. It was listed here because nobody checked `src/app.js`, which is exactly the mistake §0b exists to prevent |
| ~~Election "Average Turn-out"~~ | **Half wrong — built in M8.** Not on `fetchElectionResults`, but `GET /api/elections/member-stats` returns `averageTurnout`. The stat card is real |
| Position "Date Started" / "Time Spent" / "Past Holder" | the Position model is `{ name, orgId, currentHolder }` + timestamps. No position-history collection exists to derive any of them |
| Password change form (`My Account-1.png`) | no authenticated change-password route — only invite-token, forgot-password and reset-token. The tab sends a reset link instead |
| Service bank details shown before a request exists (`Service Request-1.png`) | the anti-pattern X-7 removed: an account number with no reference produces unattributable transfers. Details arrive with the reference after submission |
| Certificate viewer + "Verify Certificate" | `credential.template.routes.js` is `requireOrgAdmin` on every route and serves *templates* — there is no issued-credential model and no member-scoped endpoint. Deferred, not dropped; the Membership ID card is unaffected (rendered client-side) |
| Applicant dashboard (`New Applicant dashboard.png`) | `applications.routes.js` is `requireOrgAdmin` end to end — no applicant-scoped endpoint exists. Deferred until the backend adds one, not dropped |
| Environment / audience toggle | retired 2026-08-21; the client-side `audience.includes(env)` filter was a guess the API should own. See §0 |
| Per-type notification preference toggles | the Member model has no preferences field and `PUT /members/profile` accepts nothing of the sort; the tab shows the true state (all on), disabled, with the reason |
| ~~News/publication like + comment counts on cards~~ | **Wrong — built in M6.** `getNews` populates `comments.userId` and returns `likes[]`; `getPublications` the same. Both counts are on the list response, so the cards show them |
| Threaded comment replies, and a like per comment (`News-1.png`) | `News.comments` / `Publication.comments` are flat subdocuments — `{ _id, userId, content, createdAt }`. No `parentId`, no like field. Replies have nowhere to point, so the composer posts top-level comments only |

---

## 5b. Assets to export from Figma

The mockups are **icon-driven, not illustration-driven** — nearly every glyph is a
standard 1.5px line icon that `react-icons` already matches. So this list is short, and
it is the complete set of places where a real exported asset would beat what is in the
code today.

Convention when they arrive: raster → `src/assets/images/`, vector → `src/assets/icons/`,
imported by ES import (never a bare `/` path — the app is served under a tenant subdomain).

### Blocking — a placeholder is standing in and it looks wrong

| # | asset | mockup | what the code does today |
|---|---|---|---|
| 1 | **Mailbox + paper-plane illustration**, "No Update Yet" empty state | `Home.png`, Latest Update panel | reuses the legacy `src/assets/images/no-notification-available.png`, which is **not** the mockup's art. Passed as `<EmptyState image={...} layout="row">` — swapping the import is a one-line change |
| 2 | **Book + magnifier illustration**, faded, Publications empty state | `Home.png`, right column | falls back to `<EmptyState icon={FiBookOpen}>` — a tinted line icon, not the drawn glyph |

### Non-blocking — flagged for exactness, not correctness

| # | asset | mockup | note |
|---|---|---|---|
| 3 | **The rail / stat / quick-action icon set** | every screen | matched by eye to `react-icons` (Feather, Hi2, Pi, Md). If the Figma file uses one specific icon family, exporting the set would make the whole app exact in one pass — this is the single highest-leverage export on the list, since it touches every screen |
| 4 | **Member avatar placeholder** — tinted circle + user glyph | `environment.png`, cards with no photo | M4 will draw it with a react-icon in `org-tint`; visually near-identical |
| 5 | **REL8 wordmark lockup** ("REL8 / Connecting People For Impact") | `New Applicant dashboard.png`, top-left | `public/logo.png` exists and may already be it. Only needed once the applicant shell is unblocked (§0) |
| 6 | **Chat send / emoji glyphs, group avatar** | `Chat.png` | react-icons covers these |

### Not a Figma export — do not chase these

- **Certificate and membership-ID artwork** (`Certificate.png`, `certificate.jpg`,
  `Credentials.png`) is **rendered by the backend** from
  `rel8-backend-nordjs-2025/src/routes/credential.template.routes.js`. The portal only
  frames it. Nothing to export.
- **Every photograph** — member portraits, project buildings, event and gallery banners —
  is tenant-uploaded content. The mockups' stock images are filler.

---

## 6. Checks

```bash
npx tsc --noEmit   # fast
npm run build      # the real gate
npm run lint       # --max-warnings 0
npm run dev        # :4000
```

---

## 7. Session log

### 2026-08-21 (latest) — M12, and M13 as a removal

**M12** collapsed four support pages into one. The old `SupportPage` was three links to the
other three, and Admin/Technical Support were the same form twice — same fields, same
validation, same success handling, differing only in which mutation they called.
`ContactForm`, the last §2 primitive still unbuilt, now takes that difference as a prop.
Nothing was blocked; both forms already went through `POST /api/tickets`.

**M13 became a deletion.** The user's call: chat now sits inside Environment, so the
standalone Chat feature is not needed. That matches the data model exactly — chat is a
property of an `Environment` (`hasChat`, `EnvironmentMessage`, a socket keyed on
`environmentId`), not a separate thing. `Chat.png` draws a standalone page; it is the one
place the mockups and the model disagree about what the feature *is*, and the model won.

The interesting part was making sure nothing was left pointing at the hole. `/chat` had two
callers — the "Chat Up" button on both Environment screens — which would have become dead
links. They now open a real conversation:
`/environment/:id?tab=chat&member=<memberId>`, selecting that person's private panel. On the
list screen that needs to know *which* environment, and `GET /api/members` returns each
member's `environments` but not `hasChat`, so the two lists are crossed to find the first
chat-enabled environment the two of you share. Share none and the button is hidden — the
server refuses `joinEnvironment` without `hasChat`, so there would be nothing to open.

`components/chat/ChatItem` survived the deletion as
`pages/dashboard/environment/MessageBubble`, restyled to the mockup's bubbles and moved to
sit beside the feature it belongs to.

Worth repeating: **backend BE-A (§0d) still makes environment chat lose its history on
reload.** Messages arrive live over the socket and the REST fetch returns `[]`. One line in
`chat.controller.js`.

**Verified:** `npx tsc --noEmit` clean · `npm run build` clean · `npm run dev` serves 200 ·
`npm run lint` **7** warnings (`main` is 12).

---

### 2026-08-21 (late) — M8, M9, M10 and M11 together

Four modules in one pass, front-loading the backend/admin research for all of them before
writing anything. That was the right order: the research decided the shape of three of the
four.

**The recurring find: screens with nothing behind them.** Six this time.

- **Four of the six election pages were static mocks** — `ElectionAllVotes`,
  `ElectionContestantDetailPage`, `ElectionStepsPage`, `ElectionCreateAspirantPage`
  contained zero `useQuery`/`useMutation`/`apiTenant` calls. Hardcoded names and vote
  percentages in markup. None of them is in the mockups either. Deleted.
- **Fund a Project existed twice**, and the routed detail/support pages were the dead half —
  `/extras/admin_manage_project/`, Django-era, unmounted. Deleted; the live single-page
  version stays.
- **Three of My Account's screens have no endpoint**: no authenticated change-password
  route, no notification-preferences field, and `credential.template.routes.js` is
  `requireOrgAdmin` on every route with no issued-credential model at all. Each got the
  nearest true thing instead of a form submitting nowhere — a reset-link action, disabled
  toggles showing the real state, and a card that states the position. The membership ID
  card needed nothing: it renders client-side from the member's own profile.

**And one correction in our favour.** §5 claimed election "Average Turn-out" was
unavailable. It is not on `fetchElectionResults`, but `GET /api/elections/member-stats`
returns `averageTurnout` — so all three Elections stat cards are real. Second time §5 has
been wrong in the pessimistic direction (after the meeting reminder in M5); both entries are
struck through with the correction rather than deleted.

**Two bugs of the by-now-familiar kind.** The elections *list* was still recomputing the
election window in the browser — the timezone bug BE-6 fixed server-side and MP-5 removed
from the detail page — while `getElections` had been returning a correct `status` all along.
And both service-request pages hardcoded `en-NG`/NGN, same family as M7's four.

**One place the mockup is actively wrong, and was not followed.** `Service Request-1.png`
prints the bank account before any request exists. That is the exact anti-pattern X-7
removed: an account number with no reference produces transfers nobody can match to a
member. Recorded under M10 so it does not get "fixed" back.

Also worth flagging: the three Elections mockups are PDFs and this environment cannot render
them. M8 was built from `Position.png` plus the descriptions captured in this file when they
were readable — it deserves an eyeball from someone who can open them.

**Verified:** `npx tsc --noEmit` clean · `npm run build` clean · `npm run dev` serves 200 ·
`npm run lint` **8** warnings (`main` is 12). Not verified: appearance against a live tenant.

---

### 2026-08-21 (night) — M7

Dues. The mockup work was small; the cleanup underneath was not.

**`DuesPage` and `PaymentsTab` were the same screen twice, and had drifted apart.**
`PaymentsTab` hand-rolled its own multipart POST to `/api/dues/pay/:id/declare` rather than
calling `declareDuePayment`, which meant the two screens declared bank transfers by
different routes and only one of them honoured `requireProof` — the exact rule CLAUDE.md
flags as easy to get wrong. Both now render one `DuesPanel`.

**Four hardcoded values, all the same mistake in different places** — a literal written
before the thing it should reference existed. The bank-transfer panel printed `₦` no matter
the tenant's currency, on the one screen where the number has to be right. The PDF receipt
used a navy left over from the pre-redesign palette, so a green-branded association got a
blue receipt. The payment-method picker put dark label text on `bg-org-secondary`, a
saturated brand colour. And the dues blocker carried a `handleRemindLater` that wrote a
localStorage key no button triggered and nothing ever read. All four fixed; the table in M7
records them so the pattern is visible rather than four separate curiosities.

Also built `ui/Table` and retired the react-table wrapper for these screens. The repo had
two table components that disagreed with each other; M8 and M10 move the rest across.

Lint is down to **9** (`main` is 12) — `defaultMethod` moved out of the component file.

**Verified:** `npx tsc --noEmit` clean · `npm run build` clean · `npm run lint` 9 warnings.
Not verified: appearance against a live tenant.

---

### 2026-08-21 (evening) — the Environment rename finished, then M6

**The rename, properly this time.** The user confirmed "group" was the mistake — the concept
is Environment everywhere — so §0c stopped being a compatibility note and became a rename.
`api/groups/`, `api/committee/` and the exco fetchers are gone; `groups/GroupDetailPage`,
`GroupChatTab` and `GroupConversationPanel` moved to `environment/` under Environment names;
`/groups/:id` became `/environment/:id`. What survives as "group" is only the server's own
wire format — the REST paths under `/api/chat/group*` and one JSON body key — and that is
now written down in `api/chats/chats.ts` so nobody "fixes" a URL.

Doing it turned up **two things that were broken rather than merely misnamed**:

1. The socket client was talking to nobody. The server listens for `joinEnvironment` /
   `environmentMessage` and reads `{ environmentId }`; the portal was emitting `joinGroup` /
   `groupMessage` with `{ groupId }`. Live environment chat could not have worked.
2. `GroupDetailPage` filtered its content tabs on `item.groupId`, a field no content model
   has — News, Publication, Gallery, Event and Meeting all carry `environmentId`. Every tab
   rendered empty regardless of what was in the environment.

Both fixed. Two *backend* bugs also fell out — `chat.controller.js` querying `groupId` on a
model that only has `environmentId`, and sorting by a `timestamp` field that
`{ timestamps: true }` never creates. They were fixed in the backend repo later the same
day; **§0d** has the full account.

**M6.** Same pattern as M5: the models do not call their fields what the portal did. News is
`topic`/`content`, not `name`/`body`. Likes are arrays of member ids, not counts — and the
old page checked `localStorage.getItem("userId")`, a key nothing writes, so its like state
was permanently false. `GET /news/:id/comments` does not exist either; comments come embedded
on the article, so the detail page now makes one request where it used to make two and
also stopped downloading the entire news list to find one item.

Threaded replies and per-comment likes from `News-1.png` were **not** built — the comment
subdocument has no `parentId` and no like field. Both are in §5 with the reason.

**Verified:** `npx tsc --noEmit` clean · `npm run build` clean · `npm run lint` 10 warnings
(`main` is 12). Not verified: appearance against a live tenant.

---

### 2026-08-21 (later still) — M5

Events and Meetings, both list and detail. The §0b habit paid off in the opposite direction
this time: **"Remind Me To Join" was listed in §5 as a mockup affordance with no API behind
it, and that was simply wrong.** `POST /api/meetings/:id/remind` is mounted and
member-callable, with a `MeetingReminder` model behind it. Someone had written the feature
off without opening `src/app.js`. It is built now, and it respects the controller's two
rules up front — the 5/10/15/30 whitelist, and refusing a reminder for a meeting that is
already too close — rather than letting the member discover them as 400s.

The other find was smaller but had been quietly wrong for a long time: **the Event model has
no `name` field.** The title is `details`. Every call site in this repo wrote
`event.name || event.details`, which worked only because the left side was always
undefined. `eventFields.ts` now holds that and the rest of the model's quirks in one place.

Kept the X-1/X-7 payment path exactly as it was. The mockup's single "Pay Now" chip button
could not express capacity, deadlines, method choice or cancellation, so those stayed in a
`Registration` card and the chip just states the price — recorded under M5 as a deliberate
deviation rather than left for someone to "fix" back.

**Verified:** `npx tsc --noEmit` clean · `npm run build` clean · `npm run lint` 10 warnings
(`main` is 12). Not verified: appearance against a live tenant.

---

### 2026-08-21 (later) — M3, M4, and the Group -> Environment discovery

Started M3/M4 and, on the user's instruction, began cross-referencing the backend and the
admin app before writing each screen rather than after. That immediately changed the shape
of M4 — see §0b for the rule and §0c for what it turned up.

**The find.** The portal ships three API clients aimed at routes the backend does not
mount: `/api/excos`, `/api/committees` and `/api/groups`. All three were consolidated into
one `Environment` model discriminated by `environmentType`, and the admin app has already
dropped its standalone Exco and Committee screens. The portal never followed. The tell was
`GroupType` in `groups-api.ts` being field-for-field the `Environment` schema — a
pre-rename copy, not a separate feature. `/excos` was already commented out in `App.tsx`,
so that screen had been dead in two independent ways.

Removed as part of M4, since M4 *is* the consolidation: `members/ExcosPage.tsx`,
`ExcoDetailPage.tsx`, `pages/dashboard/committees/*`, `api/committee/committee.ts`,
`fetchAllExcos`/`fetchExcoById`, and the `/committees` + `/committees/:id` routes.
`groups/` was left alone deliberately — its *chat* half is live (`/api/chat/group/:groupId`
takes an Environment id), so M13 repoints it rather than M15 deleting it.

**M3.** One shared `NotificationRow` for Home and the list page. The old page picked a
row's destination by substring-matching the notification *title*, so every row landed on a
list page and a reworded title broke it; it now uses `latest_update_table_name`/`_id`.

**M4.** One page, five tabs — Members, Excos, Committees, Groups, Member Types — restoring
the links the M1 sidebar rewrite had made unreachable. Two field traps worth remembering:
the Active/Inactive chip is `Member.status`, **not** `Member.isActive` (that one is account
deactivation); and exco cards come from `positions[]`, which carry their own name/title/
image and only optionally link to a real member, so an org can list a seat for someone with
no portal account.

**Lint went down, not up.** `react-refresh/only-export-components` fires on any `.tsx` that
exports a helper beside its component. Moved `greeting`/`formatTopbarDate` into
`utils/dates.ts` (where they belonged), and the notification helpers into
`notificationMeta.ts`. `main` is at 12 warnings; the tree is now at **10**.

**Verified:** `npx tsc --noEmit` clean · `npm run build` clean · `npm run lint` 10 warnings.
Not verified: appearance against a live tenant.

---

### 2026-08-21 — M1 finished, environment filter retired, M2 complete

Picked up from the M1 half-done state. Three things happened.

**1. `DashboardLayout` rewritten, closing M1.** The old container carried `pt-[70px]` to
clear a `fixed` navbar that the M1 rewrite had already put back in the flow — so every page
was being pushed down by a bar it no longer sat under. Replaced with a centred
`max-w-[1440px]` column on mockup spacing, plus a scroll reset on route change.

**2. The Environment toggle question, resolved as (a) — retire it.** Deleted the provider,
`contentFilter.ts` and both call sites. Worth recording the counter-evidence, since it was
close: `Home.png`'s Publications empty state literally reads *"No publications available for
the selected environment(s)"*, so the mockups do still assume the concept. It went anyway
because the filter was a fuzzy client-side string match over `audience`, driven by a
control the mockups delete — leaving it in place meant members silently filtered by a
frozen localStorage value they could no longer change.

**3. M2.** Home rebuilt on the primitives; the three `react-multi-carousel` carousels are
gone. Two utils fell out of it — `utils/dates.ts` and `utils/currency.ts` (the currency
symbol map existed in four places with three different defaults).

Also split `statusTone`/`PillTone`/`TONES` out of `StatusPill.tsx` into `statusTone.ts`.
M0 had left them co-exported with the component, which trips `react-refresh/only-export-components`
under this repo's `--max-warnings 0` lint. That was the redesign's only added warning; the
count is now back to `main`'s baseline of 12.

**Verified:** `npx tsc --noEmit` clean · `npm run build` clean · `npm run dev` serves 200 ·
`npm run lint` 12 warnings, identical to `main`. Not verified: how any of it looks against
a live tenant — that needs a member login.

**Deferred, with a reason:** the applicant shell. See §0 — the backend has no
applicant-facing endpoint, so there is nothing to render.

---

### 2026-08-20 — M0 complete, M1 started

Read every mockup in `Relate/` (30 PNGs + 3 PDFs), sampled the palette out of the pixels
rather than eyeballing it, and wrote this document. Then:

**Files changed** (nothing committed — all still in the working tree):

```
M  tailwind.config.js
M  src/index.css
M  src/utils/themeUtils.ts
M  src/types/sidebarDataType.tsx
M  src/data/sideBarData.tsx
M  src/components/navigation/NavItem.tsx
M  src/components/navigation/Sidebar.tsx
M  src/components/navigation/Navbar.tsx
?? REDESIGN.md
?? src/components/ui/          (17 primitives + index.ts)
```

**Verified:** `npx tsc --noEmit` → clean. `npm run build` not yet run.

**Decisions taken, so they don't get re-argued:**

- *Purple is a default, not a constant.* The portal already themes per tenant through
  `--color-org-primary`; the mockups are purple because the sample tenant is. So `#7F02A2`
  became the default value of that variable and every purple in the redesign resolves
  through `org-primary` / `org-tint`. A literal `#7F02A2` inside a component is a bug.
- *The tint is computed in HSL, not blended with white.* Blending #7F02A2 toward white
  gives `#F5EBF8`, which reads grey; the mockup's `#F8E6FB` holds its hue. `tintColor()`
  keeps the hue, caps saturation at 80% and sets lightness — so a green-branded tenant
  gets a green wash rather than a grey one.
- *Left the legacy CSS helpers in place.* Deleting `.btn` / `.form-control` now would break
  every not-yet-migrated screen mid-flight. They come out in M15.
- *Started with tokens + shell, not auth.* The original suggestion was auth first, but
  `Relate/` ships **no auth mockups at all** (M14 is extrapolated), and every screen that
  does have a mockup sits inside the shell — so the shell is where the leverage is.

**Out of scope, confirmed:** `landing Page.png` is the marketing site — it belongs to
`rel8-website-2025`, not this repo.

---

Sibling repos, unchanged by this work but worth reading for shared vocabulary:
`Rel8-Backend-Nordjs-2025` (API + master TODO), `Rel8-Admin-Version-2` (admin dashboard),
`rel8-website-2025` (public site — **`landing Page.png` belongs to that repo, not this one**).
