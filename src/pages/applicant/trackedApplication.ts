import type { TrackedApplication } from "../../api/applications/applications-api";

/**
 * Where a tracked application lives between the tracking form and the status page.
 *
 * **`sessionStorage`, deliberately.** An applicant has no account, so there is no session
 * to hang this on, and the alternative — putting the code and email in the URL — would
 * leave someone's application readable in a shared browser's history, in a bookmark, or in
 * a screenshot. sessionStorage is scoped to the tab and gone when it closes, which matches
 * how long this should be readable.
 *
 * It is a cache of an already-authorised lookup, never the authorisation itself: the status
 * page re-fetches from the server, so tampering with the stored copy buys nothing.
 */
const KEY = "rel8ApplicantTracking";

interface Stored {
  code: string;
  email: string;
  application: TrackedApplication;
}

export const saveTrackedApplication = (code: string, email: string, application: TrackedApplication) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ code, email, application } satisfies Stored));
  } catch {
    /* private mode, or storage disabled — the status page just asks them to look it up again */
  }
};

export const getTrackedApplication = (): Stored | null => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    return parsed?.code && parsed?.email ? parsed : null;
  } catch {
    return null;
  }
};

export const clearTrackedApplication = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
};
