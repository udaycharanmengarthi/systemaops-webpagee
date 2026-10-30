/* ================================================================
   CONSULTATION FORM VALIDATION
   Pure functions, no React — directly unit-testable.

   Messages are returned as TRANSLATION KEYS so every language can
   provide its own wording; the component resolves them with t().
   ================================================================ */

export const MESSAGE_MAX = 1200;

/* Mirrors the backend constraints in src/controllers/consultation.controller.js
   so the visitor is not told "valid" and then rejected server-side. */
export const LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  message: MESSAGE_MAX,
};

export const EMPTY_VALUES = {
  name: "",
  email: "",
  company: "",
  areaOfInterest: "",
  message: "",
  privacyAccepted: false,
};

/* Deliberately permissive but rejects the obvious mistakes. Mirrors the
   server-side validator.js check used by the contact form. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const trim = (value) => (typeof value === "string" ? value.trim() : "");

/**
 * @returns {Record<string, string>} field -> translation key.
 *          Empty object means the values are valid.
 */
export const validateValues = (values, { areas = [] } = {}) => {
  const errors = {};

  const name = trim(values.name);
  const email = trim(values.email);
  const message = trim(values.message);
  const area = trim(values.areaOfInterest);

  if (!name) {
    errors.name = "consultation.validation.nameRequired";
  } else if (name.length > LIMITS.name) {
    errors.name = "consultation.validation.nameTooLong";
  }

  if (!email) {
    errors.email = "consultation.validation.emailRequired";
  } else if (email.length > LIMITS.email) {
    errors.email = "consultation.validation.emailTooLong";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "consultation.validation.emailInvalid";
  }

  if (area && areas.length && !areas.includes(area)) {
    errors.areaOfInterest = "consultation.validation.areaInvalid";
  }

  if (!message) {
    errors.message = "consultation.validation.messageRequired";
  } else if (message.length > LIMITS.message) {
    errors.message = "consultation.validation.messageTooLong";
  }

  if (values.privacyAccepted !== true) {
    errors.privacyAccepted = "consultation.validation.privacyRequired";
  }

  return errors;
};

/** Validate a single field on blur (same rules, narrow scope). */
export const validateField = (field, values, options) => {
  const errors = validateValues(values, options);
  return errors[field] || null;
};

/**
 * The UI selects areas with the short service ids from
 * src/data/services.js ("integration"), but the API stores, validates and
 * emails a stable, descriptive slug (Server/src/config/workflow.js
 * AREAS_OF_INTEREST -> "system-integrations").
 *
 * The two must be translated at this boundary: the form keeps working in
 * short ids, and the API contract stays exactly as the backend defines it.
 * Sending the short id unchanged was rejected with HTTP 400.
 */
const AREA_SLUGS = {
  ai: "ai-automation",
  odoo: "odoo-erp",
  workflow: "workflow-automation",
  aiops: "aiops-monitoring",
  consulting: "ai-consulting",
  integration: "system-integrations",
  other: "other",
};

/** Map a UI service id to the slug the consultation API accepts. */
export const toAreaSlug = (value) => AREA_SLUGS[value] ?? value;

/** Normalized payload for the API — trimmed, lowercased email. */
export const toPayload = (values) => ({
  name: trim(values.name),
  email: trim(values.email).toLowerCase(),
  company: trim(values.company),
  areaOfInterest: toAreaSlug(trim(values.areaOfInterest) || "other"),
  message: trim(values.message),
  privacyAccepted: true,
});

/** Field order used by the error summary (stable, predictable). */
export const FIELD_ORDER = [
  "name",
  "email",
  "areaOfInterest",
  "message",
  "privacyAccepted",
];
