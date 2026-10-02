/**
 * seo/Meta.jsx — Reusable per-page SEO head component.
 * Uses centralized SEO configuration from seoConfig.js and routeSeo.js.
 * Language-aware hreflang implementation.
 */

import { Helmet } from "react-helmet-async";
import { useLanguage } from "../i18n/useLanguage";
import {
  SITE_NAME,
  BASE_URL,
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

  // Determine the route path if not provided
  const resolvedRoutePath = routePath || "/";

  // Get route-specific SEO config (falls back to defaults)
  const routeSeo = getRouteSeo(resolvedRoutePath);

  // Build title: page title takes precedence, otherwise route config, then site name
  const fullTitle = buildTitle(title, routeSeo.title.replace(`| ${SITE_NAME}`, "").trim() || SITE_NAME);

  // Build description: page prop > route config > site default
  const fullDescription = buildDescription(description, routeSeo.description);

  // Canonical URL with trailing slash consistency
  const canonicalUrl = canonical
    ? getCanonicalUrl(canonical)
    : getCanonicalUrl(resolvedRoutePath);

  // Current language URL path
  let basePath = resolvedRoutePath;

  // Remove trailing slash unless the path is "/"
  if (basePath.endsWith("/") && basePath.length > 1) {
    basePath = basePath.slice(0, -1);
  }

  // Current language URL
  const currentPath =
    language === "en"
      ? basePath
      : `/${language}${basePath === "/" ? "" : basePath}`;

  const canonicalUrlFull = `${BASE_URL}${currentPath}`;

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