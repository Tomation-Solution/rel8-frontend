import { isPast } from "../../../utils/dates";
import { isFree } from "../../../api/paystack-api";

/**
 * Field accessors for an event record, in one place because the model's names do not match
 * what the UI calls them.
 *
 * Checked against `rel8-backend-nordjs-2025/src/models/Event.js`:
 *
 *   bannerUrl, details, address, meetingLink, audience, environmentId,
 *   date, time, organizer, pricing{amount, memberAmount, publicAmount},
 *   paymentConfig, documentId, requiresRegistration, allowPublicRegistration,
 *   registrationCapacity, registrationDeadline
 *
 * Two things that trip people up:
 *
 * 1. **There is no `name` field.** The title is `details` — the backend's own
 *    `getEventStats` aggregation reads `eventTitle: "$event.details"`. Call sites in this
 *    repo have historically written `event.name || event.details`, which works only because
 *    `name` is always undefined. The fallback is kept below for records written before the
 *    schema settled, but `details` is the field.
 * 2. **`isPaid` and `price` are gone** (X-4). Pricing is `pricing.memberAmount ?? pricing.amount`,
 *    and an empty `paymentConfig.methods` means free regardless of the numbers.
 */

export const eventTitle = (event: any): string => event?.details || event?.name || "Untitled event";

/** The scheduled date. `time` is a separate free-text field, not part of this. */
export const eventWhen = (event: any): string | undefined => event?.date;

/** Drives the New / Past corner badge. */
export const isPastEvent = (event: any): boolean => isPast(event?.date);

/**
 * What a *member* pays. `memberAmount` is an optional discount; `null` means "use `amount`".
 * `publicAmount` is for non-members and never applies in this portal.
 */
export const eventPrice = (event: any): number => (event?.pricing?.memberAmount != null ? event.pricing.memberAmount : (event?.pricing?.amount ?? 0));

/** Free when no payment method is configured, or when the member's price is zero. */
export const eventIsPaid = (event: any): boolean => !isFree(event?.paymentConfig) && eventPrice(event) > 0;

/** The mockup's "Location: Physical / Virtual" chip — derived, not stored. */
export const eventLocationKind = (event: any): "Virtual" | "Physical" => (event?.meetingLink ? "Virtual" : "Physical");
