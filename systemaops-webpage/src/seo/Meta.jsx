/**
 * seo/Meta.jsx — Reusable per-page SEO head component.
 */

import { Helmet } from "react-helmet-async";
import { useLanguage } from "../i18n/useLanguage";

const SITE_NAME = "SystemaOps";
const BASE_URL = "https://www.systemaops.com";

const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

const DEFAULT_DESCRIPTION =
  "SystemaOps provides AI Automation, Odoo ERP, Workflow Automation, n8n Development and Enterprise Software Solutions.";

export default function Meta({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
}) {
  const { language } = useLanguage();

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  // Remove trailing slash unless the path is "/"
  let basePath = canonical || "/";

  if (basePath.endsWith("/") && basePath.length > 1) {
    basePath = basePath.slice(0, -1);
  }

  // Current language URL
  const currentPath =
    language === "en"
      ? basePath
      : `/${language}${basePath === "/" ? "" : basePath}`;

  const canonicalUrl = canonical
    ? `${BASE_URL}${currentPath}`
    : undefined;

  // Alternate language URLs
  const enUrl = `${BASE_URL}${basePath}`;

  const deUrl = `${BASE_URL}/de${
    basePath === "/" ? "" : basePath
  }`;

  const nlUrl = `${BASE_URL}/nl${
    basePath === "/" ? "" : basePath
  }`;

  return (
    <Helmet>
      {/* Language */}
      <html lang={language} />

      {/* Primary SEO */}
      <title>{fullTitle}</title>

      <meta
        name="description"
        content={description}
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
          <link
            rel="alternate"
            href={enUrl}
            hrefLang="en"
          />

          <link
            rel="alternate"
            href={deUrl}
            hrefLang="de"
          />

          <link
            rel="alternate"
            href={nlUrl}
            hrefLang="nl"
          />

          <link
            rel="alternate"
            href={enUrl}
            hrefLang="x-default"
          />
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
        content={description}
      />

      <meta
        property="og:type"
        content={ogType}
      />

      {canonicalUrl && (
        <meta
          property="og:url"
          content={canonicalUrl}
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
        content={ogImage}
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
        content="summary_large_image"
      />

      <meta
        name="twitter:site"
        content="@SystemaOpsTech"
      />

      <meta
        name="twitter:title"
        content={fullTitle}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      <meta
        name="twitter:image"
        content={ogImage}
      />
    </Helmet>
  );
}