# Rel8 Members Portal — Conventions

Coding practices mirror the E-MetricSuite / Rhoblo standard set, adapted to this older members app. Product, payments, and redesign notes live in `CLAUDE.md` and `REDESIGN.md`.

## Before making changes

- Before updating or writing any code to a file, first confirm with the user: (1) what will be done, (2) the exact files to be changed, (3) how critical the change is, and (4) how it affects existing code
- Do not begin editing files until the user confirms the plan
- Before building any screen, check the backend (`rel8-backend-nordjs-2025`) and admin (`Rel8-Admin-Version-2`) — this app still calls some renamed/deleted routes

## Package manager

- Prefer **yarn** (this repo has `yarn.lock`). Do not introduce a second lockfile

## Code style

- TypeScript — no `any` unless absolutely necessary
- ES modules only (`import`/`export`, never `require`)
- No inline comments in code
- Correctness gate: `yarn build` (`tsc && vite build`); fast check: `npx tsc --noEmit`

## Architecture

- React **18** + Vite under `src/`
- **`react-query` v3** (legacy package) — positional `useQuery(key, fn, opts)` / `useMutation(fn, opts)` / `isLoading`. Do **not** copy `@tanstack/react-query` v5 hook code from the admin
- Tailwind (no Chakra); redesign primitives in `src/components/ui/`
- API: `src/api/` (one folder per resource); axios via `src/api/baseApi.ts` (`apiTenant`, `apiTenantAxiosForm`)
- Pages under `src/pages/` (`auth/`, `dashboard/<feature>/`)
- Payments: **`src/api/paystack-api.ts`** is the single entry — read `CLAUDE.md` Payments before touching money code

## File size & modularity

- **MAX 350 lines per file.** Split when exceeding
- Pages compose; move orchestration into hooks/API modules
- Always mirror the closest existing page / `components/ui` primitive — see `REDESIGN.md`

## Code duplication / reuse

- **Zero tolerance for duplication.** Search `src/components/ui/`, `src/components/`, `src/api/`, `src/utils/`, `src/hooks/`, and sibling Rel8 apps before creating anything new
- Never invent a second Button, Field, Table, StatusPill, or payment panel when one exists in `src/components/ui/` or `src/components/payments/`

## Separation of concerns

- Pages compose UI and wire props
- API calls live in `src/api/` — never inline axios URLs in pages for new work
- Shared toast via the local `Toast()` wrapper — do not invent a second toaster
- Keep route/page files thin

## Forms and interactions

- Form fields → **react-hook-form** + **yup** (this app’s stack — not zod) + shared `Field` / form components + `src/api/` in `onSubmit` — never plain `useState` for new form field state
- Button-only mutations → **react-query** `useMutation` + API module — do not introduce react-hook-form
- **Do not mix** `useMutation` and react-hook-form in the same flow
- Mutating button actions open a **confirmation dialog/modal** first
- Prefer the backend `message` for toasts; do not replace it with a generic line
- Async actions use shared **`Button`** `isLoading` — never hand-rolled spinner/label swaps (`{isLoading ? 'Saving...' : 'Save'}`). If a loading label is needed, extend `Button` with `loadingText` rather than ternary children

## Perceived performance

- Feedback on press via `Button` `isLoading`
- Progress for long work (uploads, payments, multi-step)
- Confirm important success (payments, registrations, votes); failures explain how to fix
- Never blank screens — use existing loaders / empty states / redesign skeletons

## Data fetching

- react-query v3 only for new server state — never ad-hoc `useEffect` + `fetch` in pages
- Stable query keys; disable dependent queries when ids are missing
- Invalidate/refetch on mutation success using v3 APIs (`queryClient.invalidateQueries`)

## API endpoints

- Define every backend path in `src/api/` before use
- Never hardcode URL strings in components/pages
- Never duplicate an endpoint definition — payments go through `paystack-api.ts`

## Mobile responsiveness

- Every new or revamped screen must work on phone and tablet (redesign tokens already mobile-first)
- No horizontal page scroll; touch targets ≥ 44px for icon controls

## Testing

- No suite wired yet; when adding tests use **Vitest**, mock the API, never hit the real backend
- Cover happy path, loading/error states, and mutation flow

## Git

- Conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, etc.
- Use a dedicated `feat/`, `fix/`, or `bug/` branch — never commit feature work straight to `main` or `staging`
- Delete merged branches only after explicit user approval

## Related repositories

- Backend: `/Users/apple/Documents/backend/Rel8-Backend-Nordjs-2025`
- Admin: `/Users/apple/Documents/frontend/Rel8-Admin-Version-2`
- Public website: `/Users/apple/Documents/frontend/rel8-website-2025`
- Mobile: `/Users/apple/Documents/frontend/Rel8-membership-mobile`
- Product / payments / redesign: `CLAUDE.md`, `REDESIGN.md`
