import apiTenant from "../baseApi";

/**
 * Environments — the backend resource behind the portal's "Environment" page.
 *
 * Mounted as `app.use("/api/environments", groupRoutes)` in the backend's `src/app.js`;
 * the model is `src/models/Environment.js` and the controller
 * `src/controllers/environment.controller.js`. The admin app talks to exactly these
 * endpoints through `rel8-admin-version-2/src/services/api/environments.ts` — check there
 * first if a shape here looks wrong.
 *
 * ⚠️ There is **no `/api/excos` route on this backend.** The portal's old
 * `fetchAllExcos()` called it, and `App.tsx` had `/excos` commented out, so the screen was
 * doubly dead. Excos are environments with `environmentType: "exco"`.
 */

/** `environmentSchema.environmentType` — the enum is closed, see the model. */
export type EnvironmentType = "exco" | "committee" | "general";

/** One row of `positions[]` — a titled seat, optionally linked to a real member. */
export interface EnvironmentPosition {
  _id: string;
  memberId?: string | null;
  name: string;
  email?: string;
  title: string;
  bio?: string;
  imageUrl?: string;
  order?: number;
}

export interface EnvironmentRecord {
  _id: string;
  name: string;
  description?: string;
  environmentType: EnvironmentType;
  isPublic?: boolean;
  /** Whether this environment has a group chat — M13 reads this. */
  hasChat?: boolean;
  positions?: EnvironmentPosition[];
  chairperson?: string | null;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

/** A member as `getEnvironmentMembers` populates them: `name email imageUrl` only. */
export interface EnvironmentMember {
  _id: string;
  name: string;
  email?: string;
  imageUrl?: string;
}

/**
 * All environments for the tenant.
 *
 * Note the controller `.select("-members")` on every list endpoint — the member arrays are
 * never included, by design. Use `fetchEnvironmentMembers` for one environment's roster.
 */
export const fetchEnvironments = async (): Promise<EnvironmentRecord[]> => {
  const response = await apiTenant.get("/api/environments");
  return Array.isArray(response.data) ? response.data : [];
};

export const fetchEnvironmentsByType = async (type: EnvironmentType): Promise<EnvironmentRecord[]> => {
  const response = await apiTenant.get(`/api/environments/type/${type}`);
  return Array.isArray(response.data) ? response.data : [];
};

export const fetchEnvironment = async (id: string): Promise<EnvironmentRecord | null> => {
  if (!id) return null;
  const response = await apiTenant.get(`/api/environments/${id}`);
  return response.data ?? null;
};

export const fetchEnvironmentMembers = async (id: string): Promise<EnvironmentMember[]> => {
  if (!id) return [];
  const response = await apiTenant.get(`/api/environments/${id}/members`);
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Every exco seat across every exco environment, flattened and ordered.
 *
 * An org can run more than one exco environment (a past and a current council, say), so the
 * environment name is carried onto each seat for grouping.
 */
export const fetchExcoPositions = async (): Promise<(EnvironmentPosition & { environmentName: string; environmentId: string })[]> => {
  const environments = await fetchEnvironmentsByType("exco");
  return environments.flatMap(environment =>
    (environment.positions ?? [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(position => ({ ...position, environmentName: environment.name, environmentId: environment._id }))
  );
};
