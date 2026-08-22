import jwt_decode from "jwt-decode";

/**
 * The one place that knows how a member session is stored.
 *
 * Everything used to read `localStorage.getItem("rel8User")` inline — the two axios
 * interceptors, the sidebar's logout, the chat panels, `extra_functions`, the auth
 * context — each with its own idea of what a missing or malformed value meant. That is
 * why a hard refresh could land you on the login screen while still holding a perfectly
 * good token: the context read the key in an effect, so its first render said "no user",
 * and the layout acted on that before the read had happened.
 */

const STORAGE_KEY = "rel8User";

/** Where the member was headed before the session check bounced them. sessionStorage,
 *  not router state, because the 401 path is a full page load. */
const REDIRECT_KEY = "redirectAfterLogin";

/** Treat a token as dead slightly before `exp` so an in-flight request does not land
 *  after it lapses. Member tokens are signed for 7d (`member.controller.js`). */
const EXPIRY_SKEW_MS = 30_000;

export interface StoredSession {
  token: string;
  orgId?: string;
  [key: string]: any;
}

/** The raw stored session, or null. Never throws. */
export function readStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.token === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStoredSession(session: StoredSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* storage disabled — the session simply will not survive a reload */
  }
}

export function clearStoredSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
}

/** A token with no readable `exp` is treated as live: the server is the authority, and
 *  guessing "expired" would lock out a session the API would have accepted. */
export function isTokenExpired(token: string | undefined | null): boolean {
  if (!token) return true;

  try {
    const { exp } = jwt_decode<{ exp?: number }>(token);
    if (typeof exp !== "number") return false;
    return Date.now() >= exp * 1000 - EXPIRY_SKEW_MS;
  } catch {
    return false;
  }
}

/** The single definition of "logged in", used by the guards and by the layout. */
export function hasValidSession(): boolean {
  const session = readStoredSession();
  return !!session && !isTokenExpired(session.token);
}

export function getSessionToken(): string | null {
  return readStoredSession()?.token ?? null;
}

export function rememberIntendedPath(path: string) {
  // Never send someone back to an auth screen once they authenticate.
  if (!path || path === "/" || /^\/(login|forgot-password|setup-new-password|authentication|logout)/.test(path)) return;
  try {
    sessionStorage.setItem(REDIRECT_KEY, path);
  } catch {
    /* the redirect is a nicety, not a requirement */
  }
}

/** Reads and clears in one step, so a stale destination cannot be replayed later. */
export function takeIntendedPath(): string | null {
  try {
    const path = sessionStorage.getItem(REDIRECT_KEY);
    sessionStorage.removeItem(REDIRECT_KEY);
    return path;
  } catch {
    return null;
  }
}
