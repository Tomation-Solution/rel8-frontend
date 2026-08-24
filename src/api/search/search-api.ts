import apiTenant from "../baseApi";

/**
 * Global search — the topbar field.
 *
 * `GET /api/search` returns `type` + `id` and deliberately no URL, because the same result
 * routes to a different screen in the admin dashboard, this portal and the mobile app.
 * `searchResultPath` in `utils/searchDestinations.ts` is this client's half of that.
 */

export type SearchResultType =
  | "member"
  | "event"
  | "meeting"
  | "news"
  | "publication"
  | "gallery"
  | "minute"
  | "election"
  | "environment"
  | "due"
  | "project"
  | "service"
  | "faq"
  | "ticket";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  description: string;
  date: string | null;
  meta: Record<string, any>;
}

export interface SearchGroup {
  type: SearchResultType;
  label: string;
  /** More matches exist than were returned for this group. */
  hasMore: boolean;
  items: SearchResult[];
}

export interface SearchResponse {
  query: string;
  total: number;
  groups: SearchGroup[];
  types: { type: SearchResultType; label: string }[];
}

interface GlobalSearchParams {
  q: string;
  /** Restrict to these resources. The topbar sends the ones it can open. */
  types?: SearchResultType[];
  /** Results per group; the backend caps this at 25. */
  limit?: number;
}

export const globalSearch = async ({ q, types, limit }: GlobalSearchParams, signal?: AbortSignal): Promise<SearchResponse> => {
  const response = await apiTenant.get("/api/search", {
    params: {
      q,
      ...(types?.length ? { types: types.join(",") } : {}),
      ...(limit ? { limit } : {}),
    },
    signal,
  });
  return response.data;
};
