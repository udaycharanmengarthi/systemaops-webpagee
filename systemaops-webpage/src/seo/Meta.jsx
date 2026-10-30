/**
 * seo/Meta.jsx — Reusable per-page SEO head component.
 * Uses centralized SEO configuration from seoConfig.js and routeSeo.js.
 * Language-aware hreflang implementation.
 */

import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../i18n/useLanguage";
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
} from "./seoConfig";
import { getRouteSeo } from "./routeSeo";
import { buildTitle, buildDescription } from "./routeSeo";
import { getCanonicalUrl } from "./canonical";
import { generateHreflangLinks } from "./routeSeo";
import { getOgImage, getOgType } from "./routeSeo";

export default function Meta({
  title,
  description,
  canonical,
  keywords,
  ogImage,
  ogType = "website",
  noIndex = false,
  routePath,
}) {
  const { language } = useLanguage();
  const location = useLocation();

  /* The current route, unless the caller pins one. Deriving it here (rather
     than defaulting to "/") is what keeps per-page route SEO, og:url and
     description fallbacks correct for every page that uses <Meta>. */
  const resolvedRoutePath = routePath || location.pathname;

  // Get route-specific SEO config (falls back to defaults)
  const routeSeo = getRouteSeo(resolvedRoutePath);

  /* Title format: "{Page title} | SystemaOps". The site name suffix must
     be the site name only - appending the route config's full title used
     to double it ("About SystemaOps | SystemaOps | AI Automation & Odoo
     ERP Solutions"). */
  const fullTitle = buildTitle(title, SITE_NAME);

  // Build description: page prop > route config > site default
  const fullDescription = buildDescription(description, routeSeo.description);

  // Canonical URL with trailing slash consistency
  const canonicalUrl = canonical
    ? getCanonicalUrl(canonical)
    : getCanonicalUrl(resolvedRoutePath);

  /* og:url is the language-agnostic canonical URL. The site has no
     URL-based locale variants (no /de/* or /nl/* routes - language is
     switched in-page via localStorage), so prefixing the visitor's
     language here would emit phantom URLs. */
  const canonicalUrlFull = canonicalUrl;

  // Base path for the hreflang generator (currently returns [] because
  // HREFLANG_LANGS is empty).
  let basePath = resolvedRoutePath;

  // Remove trailing slash unless the path is "/"
  if (basePath.endsWith("/") && basePath.length > 1) {
    basePath = basePath.slice(0, -1);
  }

  // Generate hreflang links - language-aware
  // Only generate links for supported languages
  const hreflangLinks = generateHreflangLinks(basePath, language);

  // Open Graph image: page override or default
  const finalOgImage = ogImage ? getOgImage(ogImage) : DEFAULT_OG_IMAGE;

  // Open Graph type
  const finalOgType = getOgType(ogType);

  // Twitter card
  const twitterCard = "summary_large_image";
  const twitterSite = "@SystemaOpsTech";

  return (
    <Helmet>
      {/* Language html attribute */}
      <html lang={language} />

      {/* Primary SEO */}
      <title>{fullTitle}</title>

      <meta
        name="description"
        content={fullDescription}
      />

      {keywords && (
        <meta
          name="keywords"
          content={keywords}
        />
      )}

      {noIndex && (
        <meta
          name="robots"
          content="noindex, nofollow"
        />
      )}

      {canonicalUrl && (
        <link
          rel="canonical"
          href={canonicalUrl}
        />
      )}

      {/* Hreflang */}
      {canonical && (
        <>
          {hreflangLinks.map((link, i) => (
            <link
              key={i}
              rel={link.rel}
              href={link.href}
              hreflang={link.hreflang}
            />
          ))}
        </>
      )}

      {/* Open Graph */}
      <meta
        property="og:site_name"
        content={SITE_NAME}
      />

      <meta
        property="og:title"
        content={fullTitle}
      />

      <meta
        property="og:description"
        content={fullDescription}
      />

      <meta
        property="og:type"
        content={finalOgType}
      />

      {canonicalUrl && (
        <meta
          property="og:url"
          content={canonicalUrlFull}
        />
      )}

      <meta
        property="og:locale"
        content={
          language === "en"
            ? "en_US"
            : language === "de"
              ? "de_DE"
              : "nl_NL"
        }
      />

      <meta
        property="og:image"
        content={finalOgImage}
      />

      <meta
        property="og:image:width"
        content="1200"
      />

      <meta
        property="og:image:height"
        content="630"
      />

      {/* Twitter */}
      <meta
        name="twitter:card"
        content={twitterCard}
      />

      <meta
        name="twitter:site"
        content={twitterSite}
      />

      <meta
        name="twitter:title"
        content={fullTitle}
      />

      <meta
        name="twitter:description"
        content={fullDescription}
      />

      <meta
        name="twitter:image"
        content={finalOgImage}
      />
    </Helmet>
  );
}