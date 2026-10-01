/* Server/src/utils/retention.js
 *
 * Single source of truth for the 1-year data-retention policy.
 *
 * Policy: contact enquiries and job applications are kept for one
 * CALENDAR year from submission, then removed automatically by the
 * MongoDB TTL index on `expiresAt` (expireAfterSeconds: 0).
 *
 * Calendar-year semantics (Date#setFullYear), NOT a fixed 365 days:
 * - normal dates:      2026-09-23 -> 2027-09-23
 * - month boundaries:  2026-01-31 -> 2027-01-31
 * - year boundaries:   2026-12-31 -> 2027-12-31
 * - leap day (Feb 29): JS rolls over to Mar 1 (or Feb 28 when the
 *   server timezone shifts the instant across midnight). Either way
 *   the result is >= 365 days after creation, so a record can never
 *   expire EARLY because of this edge.
 *
 * Time-of-day is preserved; DST transitions in zones that observe
 * them may shift the stored instant by up to ~1 hour, which is
 * immaterial against a 1-year retention window.
 */

export const RETENTION_YEARS = 1;

/* Maximum plausible span of one calendar year plus a small grace
   window. Used only to flag suspicious values (e.g. a far-future
   expiresAt that would violate the 1-year policy), never to shorten
   a legitimate retention period. Feb 29 -> Mar 1 yields 366 days,
   hence the 367-day ceiling. */
export const RETENTION_MAX_DAYS = 367;

export function addOneCalendarYear(value) {
  const d = new Date(value);
  d.setFullYear(d.getFullYear() + RETENTION_YEARS);
  return d;
}

/* Canonical computation: expiresAt = createdAt + 1 calendar year.
 * Throws on an unusable createdAt so callers handle it explicitly
 * instead of silently storing a wrong expiry. */
export function expiresAtFor(createdAt) {
  const base = new Date(createdAt);
  if (Number.isNaN(base.getTime())) {
    throw new Error("expiresAtFor: invalid createdAt");
  }
  return addOneCalendarYear(base);
}

/* Backstop for creation paths that have no createdAt yet
 * (Mongoose applies timestamps at save time, not at document
 * construction). Prefer expiresAtFor(createdAt) when createdAt
 * is available. */
export function oneYearFromNow() {
  return addOneCalendarYear(new Date());
}

export function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
