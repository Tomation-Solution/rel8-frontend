import type { SearchResult, SearchResultType } from "../api/search/search-api";

/**
 * Where a global-search result opens in this portal.
 *
 * The backend returns `type` + `id` and no URL on purpose — the admin dashboard, this
 * portal and the mobile app each route the same record somewhere different. This file is
 * the portal's half of that contract; the equivalents live in
 * `src/types/search.ts` (admin) and `src/constants/search.ts` (mobile).
 */

type Destination = { detail: (id: string) => string } | { list: string };

const DESTINATIONS: Record<SearchResultType, Destination | null> = {
  member: { detail: id => `/members/${id}` },
  event: { detail: id => `/event/${id}` },
  meeting: { detail: id => `/meeting/${id}` },
  news: { detail: id => `/news/${id}` },
  publication: { detail: id => `/publication/${id}` },
  gallery: { detail: id => `/gallery/${id}` },
  election: { detail: id => `/election/${id}` },
  environment: { detail: id => `/environment/${id}` },
  // `/service-requests/:id` is the *service* detail, not a request — the route name is
  // older than the page.
  service: { detail: id => `/service-requests/${id}` },
  due: { list: "/dues" },
  project: { list: "/fund-a-project" },
  faq: { list: "/support" },
  ticket: { list: "/support" },
  // No minutes screen in this portal, so nothing to open. Excluded from the request
  // rather than routed somewhere that does not show it.
  minute: null,
};

/** The types this client can open — sent as `?types=` so nothing dead comes back. */
export const SEARCHABLE_TYPES = (Object.keys(DESTINATIONS) as SearchResultType[]).filter(type => DESTINATIONS[type] !== null);

export function searchResultPath(result: SearchResult): string | null {
  const destination = DESTINATIONS[result.type];
  if (!destination) return null;
  return "detail" in destination ? destination.detail(result.id) : destination.list;
}
