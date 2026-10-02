/**
 * routeSeo.js — Route-specific SEO configuration.
 * Maps URL paths to their SEO metadata overrides.
 * Used by the SeoHead component to determine page-specific titles and descriptions.
 */

import {
  ROUTE_SEO,
  SITE_NAME,
  BASE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  TRAILING_SLASH,
  HREFLANG_LANGS,
} from "./seoConfig";

/**
 * Get the SEO config for a given path.
 * Walks up the path hierarchy to find a matching config.
 * e.g., "/ai-automation/details" would match "/ai-automation" config.
 */
export function getRouteSeo(pathname) {
  // Normalize path: remove trailing slash, ensure starts with /
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");

  // Try exact match first
  if (ROUTE_SEO[normalized]) {
    return { ...ROUTE_SEO[normalized], path: normalized };
  }

  // Try path prefix match (e.g., "/ai-automation/subpage" matches "/ai-automation")
  const parts = normalized.split("/").filter(Boolean);
  for (let i = parts.length - 1; i > 0; i -= 1) {
    const prefix = "/" + parts.slice(0, i).join("/");
    if (ROUTE_SEO[prefix]) {
      return { ...ROUTE_SEO[prefix], path: prefix };
    }
  }

  // Fallback to default
  return {
    title: `${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    ogImage: `${BASE_URL}/og-image.png`,
    ogType: "website",
    path: "/",
  };
}

/**
 * Get hreflang configuration for the current language.
 * Returns object with enUrl, deUrl, nlUrl, xdefaultUrl constructed
 * using the base path and current language.
 */
export function getHreflangUrls(basePath) {
  // Normalize basePath
  let path = basePath === "/" ? "/" : basePath.replace(/\/+$/, "");

  // Ensure path starts with /
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  // Remove trailing slash for URL construction unless it's /
  const pathForUrl = path === "/" ? "/" : path.replace(/\/+$/, "");

  const urls = {
    en: `${BASE_URL}${pathForUrl}`,
    de: `${BASE_URL}/de${pathForUrl === "/" ? "" : pathForUrl}`,
    nl: `${BASE_URL}/nl${pathForUrl === "/" ? "" : pathForUrl}`,
  };

  const xdefault = `${BASE_URL}/${
    pathForUrl === "/" ? "" : pathForUrl.replace(/^\//, "/")
  }`;

  return { urls, xdefault };
}

/**
 * Get the canonical URL for a page.
 * Ensures trailing slash consistency per TRAILING_SLASH config.
 */
export function getCanonicalUrl(pathname) {
  // Normalize: remove duplicate slashes
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
  // "always" default: keep as-is if already normalized

  return `${BASE_URL}${clean}`;
}

/**
 * Get the page's primary language direction.
 * Currently all supported languages are LTR.
 */
export function getLangDirection() {
  // All supported languages (en, de, nl) are LTR
  return "ltr";
}

/**
 * Generate alternate language URLs for hreflang.
 * Each alternate version must actually exist.
 * Returns object with URL objects for link tags.
 */
export function generateHreflangLinks(basePath, language) {
  const { urls, xdefault } = getHreflangUrls(basePath);

  const currentLang = language || "en";

  const links = HREFLANG_LANGS.map((lang) => {
    if (lang === currentLang) {
      // Self-referential: use the canonical URL
      return {
        rel: "alternate",
        href: urls[lang],
        hreflang: lang,
      };
    }
    // Alternate language
    return {
      rel: "alternate",
      href: urls[lang],
      hreflang: lang,
    };
  });

  // Add x-default
  links.push({
    rel: "alternate",
    href: xdefault,
    hreflang: "x-default",
  });

  return links;
}

/**
 * Get the og:image URL for a page.
 * Uses page-specific image if configured, otherwise falls back to default.
 */
function getOgImage(pageOgImage) {
  if (pageOgImage) {
    // Ensure absolute URL
    try {
      new URL(pageOgImage); // valid URL
      return pageOgImage;
    } catch {
      // Not a valid URL, prepend base
      return `${BASE_URL}${pageOgImage.startsWith("/") ? pageOgImage : "/" + pageOgImage}`;
    }
  }
  return DEFAULT_OG_IMAGE;
}

/**
 * Get the og:type for a page.
 */
function getOgType(pageOgType) {
  if (pageOgType) {
    return pageOgType;
  }
  return "website";
}

/**
 * Build the full <title> element content.
 * Format: "Page Title | Site Name"
 * Never: "Keyword | Keyword | Keyword | Site Name"
 */
function buildTitle(pageTitle, siteName = SITE_NAME) {
  if (pageTitle) {
    return `${pageTitle} | ${siteName}`;
  }
  return siteName;
}

/**
 * Build the meta description, using page description if available,
 * otherwise falling back to route config, then site default.
 */
function buildDescription(pageDescription, routeDescription = DEFAULT_DESCRIPTION) {
  if (pageDescription) {
    return pageDescription;
  }
  return routeDescription;
}

export { getOgImage, getOgType, buildTitle, buildDescription };