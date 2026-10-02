/**
 * seoConfig.js — Site-wide SEO configuration.
 * Single source of truth for metadata defaults, URL patterns, and settings.
 * Import anywhere in the application; never hardcode these values in components.
 */

export const SITE_NAME = "SystemaOps";
export const BASE_URL = "https://www.systemaops.com";
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
export const DEFAULT_DESCRIPTION =
  "SystemaOps provides AI Automation, Odoo ERP, Workflow Automation, n8n Development and Enterprise Software Solutions.";

// Language configuration
export const LANGUAGES = {
  en: {
    name: "English",
    default: true,
    hreflang: "en-US",
  },
  de: {
    name: "German",
    hreflang: "de-DE",
  },
  nl: {
    name: "Dutch",
    hreflang: "nl-NL",
  },
};

// Route SEO configuration — maps path patterns to metadata defaults
export const ROUTE_SEO = {
  "/": {
    title: "SystemaOps | AI Automation & Odoo ERP Solutions",
    description: "SystemaOps provides AI Automation, Odoo ERP, Workflow Automation, n8n Development and Enterprise Software Solutions.",
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
  },
  "/ai-automation": {
    title: "AI Automation Services for Business Workflows | SystemaOps",
    description:
      "Build AI agents and intelligent workflows that work with the systems your team already uses, handling repeatable tasks with people in the loop where judgment matters.",
    ogImage: `${BASE_URL}/ai-automation`,
    ogType: "website",
  },
  "/odoo-customization": {
    title: "Odoo Customization & Implementation | SystemaOps",
    description:
      "ERP, CRM and business applications tailored to how you operate. Odoo implementation, customization and integration services.",
    ogImage: `${BASE_URL}/odoo-customization`,
    ogType: "website",
  },
  "/workflow-automation": {
    title: "Business Workflow Automation | SystemaOps",
    description:
      "Automate repetitive operations across the tools you already use. Workflow automation with n8n, API integrations and process orchestration.",
    ogImage: `${BASE_URL}/workflow-automation`,
    ogType: "website",
  },
  "/system-integrations": {
    title: "System Integrations & APIs | SystemaOps",
    description:
      "Connect ERP, CRM, databases and business applications through reliable APIs, webhooks and workflows built by SystemaOps.",
    ogImage: `${BASE_URL}/system-integrations`,
    ogType: "website",
  },
  "/data-document-automation": {
    title: "Data & Document Automation | SystemaOps",
    description:
      "Process, route and sync documents and data automatically. Intelligent document processing, OCR, AI extraction and ERP integration.",
    ogImage: `${BASE_URL}/data-document-automation`,
    ogType: "website",
  },
  "/devops-observability": {
    title: "DevOps & Observability | SystemaOps",
    description:
      "Bring deployment, runtime visibility, monitoring and alerts together so teams understand system behavior and respond with context.",
    ogImage: `${BASE_URL}/devops-observability`,
    ogType: "website",
  },
  "/ai-consulting": {
    title: "AI Consulting Services | SystemaOps",
    description:
      "Identify high-impact AI opportunities and build a roadmap around measurable business value. Strategy, roadmap and delivery for AI automation.",
    ogImage: `${BASE_URL}/ai-consulting`,
    ogType: "website",
  },
  "/about": {
    title: "About SystemaOps | Company",
    description:
      "Learn about SystemaOps: what we do, who we serve, and the technologies we work with.",
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
  },
  "/contact": {
    title: "Contact SystemaOps | Get in Touch",
    description:
      "Get in touch with SystemaOps. Contact us for AI automation, Odoo, workflow automation or integration services.",
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
  },
  "/privacy-policy": {
    title: "Privacy Policy | SystemaOps",
    description:
      "SystemaOps privacy policy. How we process personal data, cookies, and your rights regarding your data.",
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
  },
  "/careers": {
    title: "Careers | SystemaOps",
    description:
      "Join the SystemaOps team. Open positions in AI, Odoo, workflow automation and integration.",
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
  },
  "/faqs": {
    title: "FAQs | SystemaOps",
    description:
      "Frequently asked questions about AI automation, Odoo, workflow automation, n8n, integrations and document automation.",
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
  },
  "/blogs": {
    title: "AI Automation, Odoo & Workflow Blog | SystemaOps",
    description:
      "Guides on AI automation, Odoo ERP, n8n development and workflow automation — practical insights from the SystemaOps operations team.",
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
  },
};

// Trailing slash configuration
export const TRAILING_SLASH = "always"; // "always", "never", or "remove"

// x-default language for hreflang
export const X_DEFAULT_LANG = "en";

// Supported hreflang languages
export const HREFLANG_LANGS = ["en", "de", "nl"];