/**
 * canonical.js — Canonical URL utility.
 * Handles trailing slash consistency, www/non-www normalization,
 * and duplicate URL prevention.
 */

import { TRAILING_SLASH } from "./seoConfig";

/**
 * Normalize a pathname for use as a canonical URL.
 * - Removes duplicate slashes
 * - Ensures leading slash
 * - Applies trailing slash policy from config
 */
export function normalizePath(pathname) {
  if (!pathname) return "/";

  // Remove duplicate slashes
  let clean = pathname.replace(/\/+/g, "/");

  // Ensure starts with /
  if (!clean.startsWith("/")) {
    clean = "/" + clean;
  }

  // Apply trailing slash policy
  if (TRAILING_SLASH === "always") {
    if (clean !== "/") {
      clean = clean.replace(/\/+$/, "/");
    }
  } else if (TRAILING_SLASH === "remove") {
    if (clean !== "/") {
      clean = clean.replace(/\/+$/, "");
    }
  }
  // "default" (unspecified): keep as normalized, no forced change

  return clean;
}

/**
 * Build a full canonical URL with base domain.
 * Ensures the URL is in the format https://www.systemaops.com/path
 */
export function buildCanonicalUrl(pathname) {
  const path = normalizePath(pathname);
  return `https://www.systemaops.com${path}`;
}

/**
 * Alias for buildCanonicalUrl — provides getCanonicalUrl export.
 */
export const getCanonicalUrl = buildCanonicalUrl;

/**
 * Validate that a canonical URL points to an indexable page.
 * Returns true if the URL looks valid and indexable.
 */
export function isValidCanonicalUrl(url) {
  try {
    new URL(url);
    return url.includes("systemaops.com") && !url.includes("/admin");
  } catch {
    return false;
  }
}

/**
 * Get the preferred domain (www vs non-www).
 * Currently the site uses www.systemaops.com consistently.
 * This function can be extended to handle redirects if needed.
 */
export function getPreferredDomain(url) {
  try {
    const parsed = new URL(url);
    // Force www prefix for consistency
    if (parsed.hostname.startsWith("www.")) {
      return url;
    }
    // Replace with www version
    const wwwUrl = url.replace(
      parsed.hostname,
      `www.${parsed.hostname}`
    );
    return wwwUrl;
  } catch {
    return url;
  }
}