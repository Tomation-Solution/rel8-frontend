/**
 * Date helpers shared across the redesigned screens.
 *
 * Everything here is deliberately timezone-naive-safe: we hand the raw ISO string to
 * `Date` and let the browser localise it. Do not reintroduce `setHours()`-style
 * arithmetic — that is what made the old election window calculation wrong (BE-6).
 */

const toDate = (value?: string | number | Date | null): Date | null => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

/** "12 June 2026" */
export const formatDate = (value?: string | number | Date | null, fallback = "—"): string => {
  const d = toDate(value);
  return d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : fallback;
};

/** "12 June 2026, 10:30" */
export const formatDateTime = (value?: string | number | Date | null, fallback = "—"): string => {
  const d = toDate(value);
  return d ? `${formatDate(d)}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : fallback;
};

/**
 * "2 Days ago" — the stamp on the right of every notification row in the mockups.
 * Falls back to an absolute date once something is older than a month, because
 * "43 Days ago" tells a member nothing useful.
 */
export const relativeTime = (value?: string | number | Date | null, now: Date = new Date()): string => {
  const d = toDate(value);
  if (!d) return "";

  const seconds = Math.round((now.getTime() - d.getTime()) / 1000);
  if (seconds < 0) return formatDate(d);
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} Minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} Hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 31) return `${days} Day${days === 1 ? "" : "s"} ago`;

  return formatDate(d);
};

/** "Date Posted: 17/06/2025 @03:28 PM" — the right-hand stamp on the Notifications list. */
export const formatPostedAt = (value?: string | number | Date | null): string => {
  const d = toDate(value);
  if (!d) return "";
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `Date Posted: ${date} @${time}`;
};

/** "17/06/2026 | 10:00 AM" — the line under a card title on Events, Meetings and Projects. */
export const formatCardDateTime = (value?: string | number | Date | null, time?: string | null): string => {
  const d = toDate(value);
  if (!d) return time || "";
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  // Events carry a separate free-text `time` field; meetings put it all in `event_date`.
  const clock = time || d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return clock ? `${date} | ${clock}` : date;
};

/** True when the date has already passed — drives the "Past" badge on event/meeting cards. */
export const isPast = (value?: string | number | Date | null, now: Date = new Date()): boolean => {
  const d = toDate(value);
  return d ? d.getTime() < now.getTime() : false;
};

/** "Good Morning" / "Good Afternoon" / "Good Evening", by the viewer's clock. */
export const greeting = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

/** "Tuesday, 2 June 2026." — the date chip in the middle of the topbar. */
export const formatTopbarDate = (date: Date = new Date()): string => `${date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}.`;
