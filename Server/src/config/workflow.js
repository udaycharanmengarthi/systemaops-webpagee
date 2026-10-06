/* Server/src/config/workflow.js
 *
 * SINGLE SOURCE OF TRUTH for operational workflows, roles, and
 * priorities. Both the status-transition validator and the admin UI
 * consume these definitions — never hard-code status behavior in
 * controllers or components.
 */

export const CONTACT_STATUSES = [
  "NEW",
  "IN_REVIEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "CLOSED",
];

export const CAREER_STATUSES = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
];

export const CONTACT_TRANSITIONS = {
  NEW: ["IN_REVIEW", "CLOSED"],
  IN_REVIEW: ["CONTACTED", "QUALIFIED", "CLOSED"],
  CONTACTED: ["QUALIFIED", "IN_REVIEW", "CLOSED"],
  QUALIFIED: ["CONVERTED", "CONTACTED", "CLOSED"],
  CONVERTED: ["CLOSED"],
  // CLOSED is terminal via the normal flow; reopening is an explicit
  // privileged action handled by the controller (CLOSED -> IN_REVIEW).
  CLOSED: [],
};

export const CAREER_TRANSITIONS = {
  NEW: ["REVIEWING", "REJECTED"],
  REVIEWING: ["SHORTLISTED", "INTERVIEW", "REJECTED"],
  SHORTLISTED: ["INTERVIEW", "OFFER", "REJECTED"],
  INTERVIEW: ["OFFER", "SHORTLISTED", "REJECTED"],
  OFFER: ["HIRED", "REJECTED"],
  HIRED: [],
  REJECTED: [],
};

export const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

/* Roles ordered by privilege. Higher rank includes all lower rights. */
export const ROLES = ["VIEWER", "MANAGER", "ADMIN", "SUPER_ADMIN"];

export const ROLE_RANK = {
  VIEWER: 1,
  MANAGER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

export function isValidRole(role) {
  return Object.prototype.hasOwnProperty.call(ROLE_RANK, role);
}

export function hasMinRole(role, minimum) {
  return (ROLE_RANK[role] || 0) >= (ROLE_RANK[minimum] || 0);
}

export function canTransition(entity, from, to, { allowReopen = false } = {}) {
  const map =
    entity === "career" ? CAREER_TRANSITIONS : CONTACT_TRANSITIONS;
  if (!map[from]) return false;
  if (map[from].includes(to)) return true;
  // Privileged reopen: CLOSED contact -> IN_REVIEW only.
  if (
    allowReopen &&
    entity === "contact" &&
    from === "CLOSED" &&
    to === "IN_REVIEW"
  ) {
    return true;
  }
  return false;
}

/* Legacy career statuses (pre-workflow model) mapped forward.
   Used by the ops backfill; unknown values fall back to NEW. */
export const LEGACY_CAREER_STATUS_MAP = {
  Pending: "NEW",
  Reviewed: "REVIEWING",
  Shortlisted: "SHORTLISTED",
  Rejected: "REJECTED",
};
