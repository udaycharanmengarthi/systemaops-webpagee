/**
 * breadcrumbs.js — Visible breadcrumbs and BreadcrumbList JSON-LD.
 * Implements breadcrumbs where useful for deeper pages.
 * Schema always corresponds exactly to the visible page hierarchy.
 */

import { breadcrumbsSchema } from "./structuredData";

/**
 * Generate breadcrumb items for a page based on its path.
 * The hierarchy is built from the route structure.
 * 
 * @param {string} path - The current page path (e.g., "/ai-automation")
 * @param {object} options - Additional options
 * @returns {object|undefined} Breadcrumb schema object or undefined
 */
export function getBreadcrumbsForPath(path = "/", options = {}) {
  const { t } = options.t || ((key) => key);

  // Build hierarchy based on path
  const hierarchy = [];

  if (path === "/") {
    // Home page - just home
    return breadcrumbsSchema([
      { name: "Home", href: "/" },
    ]);
  }

  // Determine parent hierarchy based on known routes
  
  // Home link always first
  hierarchy.push({ name: "Home", href: "/" });

  // Add service-level links based on known service routes
  const serviceRoutes = {
    "/ai-automation": { title: "AI Automation" },
    "/odoo-customization": { title: "Odoo ERP" },
    "/workflow-automation": { title: "Workflow Automation" },
    "/system-integrations": { title: "System Integrations" },
    "/data-document-automation": { title: "Data & Document Automation" },
    "/devops-observability": { title: "DevOps & Observability" },
    "/ai-consulting": { title: "AI Consulting" },
  };

  // Add intermediate "Services" link if we're on a service page
  if (serviceRoutes[path]) {
    hierarchy.push({ name: "Services", href: "/#services" });
    hierarchy.push({ name: serviceRoutes[path].title, href: path });
  } else if (path === "/about") {
    hierarchy.push({ name: "About", href: "/about" });
  } else if (path === "/contact") {
    hierarchy.push({ name: "Contact", href: "/contact" });
  } else if (path === "/careers") {
    hierarchy.push({ name: "Careers", href: "/careers" });
  } else if (path === "/faqs") {
    hierarchy.push({ name: "FAQs", href: "/faqs" });
  } else if (path === "/blogs") {
    hierarchy.push({ name: "Blog", href: "/blogs" });
  } else {
    // For unknown paths, just home + current
    hierarchy.push({ name: t("nav.current") || path, href: path });
    return breadcrumbsSchema(hierarchy);
  }

  return breadcrumbsSchema(hierarchy);
}

/**
 * Generate breadcrumbs from a custom hierarchy array.
 * Each item must have { name, href }.
 * This is useful when the page already has its own breadcrumb structure.
 * 
 * @param {Array} hierarchy - Array of { name, href } objects
 * @returns {object|undefined} Breadcrumb schema object or undefined
 */
export function getBreadcrumbsFromHierarchy(hierarchy) {
  if (!Array.isArray(hierarchy) || hierarchy.length === 0) return null;

  // Filter items that have both name and href
  const validItems = hierarchy.filter(
    item => item && typeof item === "object" && item.name && item.href
  );

  if (validItems.length === 0) return null;

  return breadcrumbsSchema(validItems);
}

/**
 * Get breadcrumbs for a service page with the standard hierarchy:
 * Home → Services → [Service Name]
 * 
 * @param {string} serviceTitle - The title of the service (from hero or metadata)
 * @returns {object|undefined} Breadcrumb schema object
 */
export function getServiceBreadcrumbs(serviceTitle) {
  return breadcrumbsSchema([
    { name: "Home", href: "/" },
    { name: "Services", href: "/#services" },
    { name: serviceTitle, href: undefined }, // will be set by the caller with the actual route
  ]);
}