/* src/consent/consent.js
 *
 * Single source of truth for cookie-consent state.
 *
 * Storage key: systemaops-cookie-consent (unchanged, for backward compat).
 * Categories: necessary (always on), analytics, functional, marketing.
 */
export const CONSENT_STORAGE_KEY = "systemaops-cookie-consent";
export const CONSENT_VERSION = "2026-01-01";
export const CONSENT_VALIDITY_DAYS = 395;

export const CONSENT_CATEGORIES = [
  "necessary",
  "analytics",
  "functional",
  "marketing",
];

export function defaultConsent() {
  return {
    necessary: true,
    analytics: false,
    functional: false,
    marketing: false,
    stats: false,
    status: "pending",
    version: CONSENT_VERSION,
    source: null,
    updatedAt: null,
    expiresAt: null,
  };
}

function safeParse(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function readConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    const parsed = safeParse(raw);
    if (!parsed) return null;
    // Material policy change -> treat as no consent (re-request).
    if (parsed.version !== CONSENT_VERSION) return null;
    // Expiry -> re-request.
    if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
      return null;
    }
    const analytics =
      parsed.analytics === true || parsed.stats === true;
    return {
      necessary: true,
      analytics,
      functional: parsed.functional === true,
      marketing: parsed.marketing === true,
      stats: analytics,
      status: parsed.status || "customized",
      version: parsed.version,
      source: parsed.source || null,
      updatedAt: parsed.updatedAt || null,
      expiresAt: parsed.expiresAt || null,
    };
  } catch {
    return null;
  }
}

export function isConsentValid(consent) {
  if (!consent) return false;
  if (consent.version !== CONSENT_VERSION) return false;
  if (consent.expiresAt && new Date(consent.expiresAt) < new Date()) {
    return false;
  }
  return true;
}

export function writeConsent(categories = {}, source = "banner") {
  const analytics = !!categories.analytics;
  const functional = !!categories.functional;
  const marketing = !!categories.marketing;
  const allOptional = analytics && functional && marketing;
  const noneOptional = !analytics && !functional && !marketing;
  const status = allOptional
    ? "accepted"
    : noneOptional
      ? "rejected"
      : "customized";
  const now = new Date();
  const expires = new Date(
    now.getTime() + CONSENT_VALIDITY_DAYS * 24 * 60 * 60 * 1000,
  );
  const record = {
    necessary: true,
    analytics,
    functional,
    marketing,
    stats: analytics,
    status,
    version: CONSENT_VERSION,
    source,
    updatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify(record),
      );
    } catch {
      /* storage unavailable */
    }
    try {
      window.dispatchEvent(
        new CustomEvent("systemaops:consent", { detail: record }),
      );
      window.dispatchEvent(
        new CustomEvent("open-cookie-settings", { detail: record }),
      );
    } catch {
      /* ignore */
    }
  }
  return record;
}

export function acceptAll(source = "banner") {
  return writeConsent(
    { analytics: true, functional: true, marketing: true },
    source,
  );
}

export function rejectOptional(source = "banner") {
  return writeConsent(
    { analytics: false, functional: false, marketing: false },
    source,
  );
}

export function withdrawConsent() {
  return rejectOptional("settings");
}

export function hasConsent(category) {
  if (category === "necessary") return true;
  const c = readConsent();
  if (!c) return false;
  if (category === "analytics" || category === "stats") {
    return c.analytics === true;
  }
  if (category === "functional") return c.functional === true;
  if (category === "marketing") return c.marketing === true;
  return false;
}
