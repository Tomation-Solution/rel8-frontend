import axios, { InternalAxiosRequestConfig } from 'axios';
import { ENDPOINT_URL } from "../utils/constants";
import { clearStoredSession, readStoredSession, rememberIntendedPath } from "../utils/session";

// Public auth routes that don't require authentication
const PUBLIC_AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/setup-new-password",
  "/enter-code",
  "/authentication",
  "/logout",
  // The applicant portal: no account exists yet, so a 401 there must never bounce someone
  // to a login they cannot complete.
  "/track",
  "/application",
];

// Helper function to check if current route is public
const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_AUTH_ROUTES.some(route => pathname.startsWith(route));
};

// Public API instance (no auth required)
export const apiPublic = axios.create({
  baseURL: `${ENDPOINT_URL}/api/`,
  headers: {
    'Content-Type': "application/json",
  },
});

// Tenant API instance (requires auth for protected routes)
const apiTenant = axios.create({
  baseURL: `${ENDPOINT_URL}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Attach the session to an outgoing request.
 *
 * Both instances used to inline their own copy of this, each parsing `rel8User` by hand.
 * The `isPublicRoute` skip is kept — an auth screen must be able to call the login and
 * password-reset routes without a stale bearer token attached — but the storage read now
 * goes through `utils/session`, which is the one place that knows the shape.
 */
const attachSession = (config: InternalAxiosRequestConfig) => {
  if (isPublicRoute(window.location.pathname)) return config;

  const session = readStoredSession();
  if (!session) return config;

  config.headers['Authorization'] = `Bearer ${session.token}`;

  if (session.orgId) {
    // Merge, never replace: callers pass their own params (filters, pagination) and this
    // must not discard them.
    config.params = { ...(config.params ?? {}), orgId: session.orgId };
  }

  return config;
};

/**
 * A 401 means the session is gone — the token expired, was revoked, or belongs to a member
 * the org removed. The redirect here was commented out, so the app stayed on a dashboard
 * where every panel silently failed to load and nothing said why. It now clears the dead
 * session and sends the member to login, remembering where they were so they land back
 * there afterwards.
 */
apiTenant.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error.response?.status === 401;

    if (isUnauthorized && !isPublicRoute(window.location.pathname)) {
      clearStoredSession();
      rememberIntendedPath(window.location.pathname + window.location.search);

      // A hard navigation rather than a router push: the interceptor lives outside the
      // router, and the reload drops every cached query belonging to the dead session.
      // `replace` so the back button does not return to a page that cannot load.
      window.location.replace('/login');
    }

    return Promise.reject(error);
  }
);

apiTenant.interceptors.request.use(attachSession, (error) => Promise.reject(error));

// Form data API instance — used by the `declare*` payment calls, which upload a proof file.
//
// This instance was still configured for the old Django API and every request through it
// 404'd: the base was `/tenant/<slug>/tenant`, which the Node backend does not mount, so
// `POST /api/dues/pay/:id/declare` went out as
// `/tenant/aani/tenant/api/dues/pay/:id/declare`. Two further mismatches were hidden
// behind that 404 and would have surfaced as a 401 the moment the path was corrected:
// the header was `Token <t>` where the backend does `authHeader.replace("Bearer ", "")`,
// and `orgId` was never appended, which every tenant-scoped route requires.
//
// It now matches `apiTenant` exactly, differing only in that it carries FormData.
// Content-Type is deliberately NOT set: axios strips it for a FormData body so the
// browser can supply the multipart boundary. Setting it by hand cannot work here.
export const apiTenantAxiosForm = axios.create({
  baseURL: `${ENDPOINT_URL}/`,
});

apiTenantAxiosForm.interceptors.request.use(attachSession, (error) => Promise.reject(error));

// Same 401 treatment as the JSON instance — a proof upload whose session has expired must
// end up at the login screen, not fail silently behind a spinner.
apiTenantAxiosForm.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isPublicRoute(window.location.pathname)) {
      clearStoredSession();
      rememberIntendedPath(window.location.pathname + window.location.search);
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

// Utility function to download files
export const fetchFileForDownload = async (fileUrl: string) => {
  const response = await axios.get(fileUrl, {
    method: 'GET',
    responseType: 'blob'
  });

  return response.data;
};

// Export public routes constant for use in other parts of the app
export { PUBLIC_AUTH_ROUTES, isPublicRoute };

export default apiTenant;