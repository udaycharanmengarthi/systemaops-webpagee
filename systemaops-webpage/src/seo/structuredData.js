/**
 * structuredData.js — JSON-LD structured data generators.
 * Page-specific and site-wide schema markup using only real visible content.
 * No fake schema, no content-invisible markup, no guaranteed rich results.
 */

import { SITE_NAME, BASE_URL } from "./seoConfig";

// ============================================================
// Site-wide schema
// ============================================================

/**
 * Organization schema — site-wide, using real company data.
 * Only includes verified social profiles.
 */
export function organizationSchema(siteName = SITE_NAME, description, url = BASE_URL, logo, socialProfiles = []) {
  const base = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url,
    description,
  };

  if (logo) {
    base.logo = logo;
  }

  // Only add sameIf if profiles are actually verified
  if (socialProfiles && socialProfiles.length > 0) {
    const verified = socialProfiles.filter(p => p.url && p.name);
    if (verified.length > 0) {
      base.sameAs = verified.map(p => p.url);
    }
  }

  return base;
}

/**
 * WebSite schema — site-wide, Organization+WebSite combination.
 */
export function websiteSchema(
  siteName = SITE_NAME,
  description,
  url = BASE_URL,
  publisher,
  disallows = []
) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url,
    description,
    publisher,
  };

  if (disallows && disallows.length > 0) {
    // Note: robots meta is typically handled separately;
    // this is for structured data completeness
    schema.disallows = disallows;
  }

  return schema;
}

// ============================================================
// Page-specific schema
// ============================================================

/**
 * Service schema — matches the actual service page.
 * Uses name, description, url from the page's metadata.
 */
export function serviceSchema(name, description, url) {
  if (!name) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
  };
}

/**
 * BreadcrumbList schema — corresponds exactly to the visible hierarchy.
 * Never create schema that disagrees with the visible page.
 */
export function breadcrumbsSchema(items) {
  if (!items || items.length === 0) return null;

  // Validate that items have both name and href
  const validItems = items.filter(
    item => item && item.name && item.href
  );

  if (validItems.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: validItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  };
}

/**
 * Article / BlogPosting schema — uses values that actually exist.
 * Only include fields present in the article data.
 */
export function articleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  publisher: pub,
  mainEntityOfPage,
}) {
  const fields = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
  };

  if (image) {
    fields.image = image;
  }
  if (datePublished) {
    fields.datePublished = datePublished;
  }
  if (dateModified) {
    fields.dateModified = dateModified;
  }
  if (author) {
    fields.author = author;
  }
  if (pub) {
    fields.publisher = pub;
  }
  if (mainEntityOfPage) {
    fields.mainEntityOfPage = mainEntityOfPage;
  }

  // Only return if we have minimum required fields
  if (!fields.headline) return null;

  return fields;
}

/**
 * FAQ schema — ONLY where the page genuinely contains visible FAQ content.
 * Do not create FAQ schema for pages without visible FAQ items.
 */
export function faqSchema(faqItems) {
  if (!faqItems || !Array.isArray(faqItems) || faqItems.length === 0) {
    return null;
  }

  // Verify items have both question and answer
  const hasValidItems = faqItems.every(
    item => item && item.question && item.answer
  );

  if (!hasValidItems) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item, index) => ({
      "@type": "Question",
      name: item.question,
      text: item.answer,
      position: index + 1,
    })),
  };
}

// ============================================================
// Helper: extract organization data from website config
// ============================================================

/**
 * Build organization schema from the footer company data.
 * Uses real data from the Footer component's company description.
 */
export function buildOrganizationSchemaFromFooter(companyName, companyDescription) {
  const description = companyDescription || `${SITE_NAME} provides AI Automation, Odoo ERP, workflow automation and intelligent systems.`;

  // Social profiles from Footer data
  const socialProfiles = [
    { name: "LinkedIn", url: "https://www.linkedin.com/company/107682944/" },
    { name: "Instagram", url: "https://www.instagram.com/systemaops?igsh=MXB1b2ExMmJicWZ6eA==" },
    { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61580745634197" },
    { name: "Twitter", url: "https://x.com/SystemaOpsTech" },
    { name: "YouTube", url: "https://www.youtube.com/@SystemaOps-ai" },
  ];

  return organizationSchema(
    companyName || SITE_NAME,
    description,
    BASE_URL,
    undefined, // logo would be passed from the site
    socialProfiles
  );
}