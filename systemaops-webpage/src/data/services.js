/* ================================================================
   SERVICES — SINGLE SOURCE OF TRUTH
   One canonical entry per primary service. Used by:
   - Services Mega Navigation
   - Home service cards
   - Footer service links
   - Breadcrumbs / related links (via href constants)

   Display name → canonical page → one route. Change a route
   here and every consumer updates together.
=============================================================== */

export const servicesMenu = [
  {
    id: "ai",
    name: "AI Automation",
    pageTitle: "AI Automation & Agents",
    title: "AI Automation",
    tagline:
      "AI agents and intelligent workflows that remove manual work.",
    href: "/ai-automation",
    accent: "#159A9C",
    accentRgb: "21, 154, 156",
    accentSecondary: "#20A7A0",
    accentText: "#0E6F70",
    visual: "ai",
  },
  {
    id: "odoo",
    name: "Odoo ERP",
    pageTitle: "Odoo Solutions",
    title: "Odoo ERP",
    tagline:
      "ERP, CRM and business applications tailored to how you operate.",
    href: "/odoo-customization",
    accent: "#0E6F70",
    accentRgb: "14, 111, 112",
    accentSecondary: "#159A9C",
    accentText: "#0C5E5F",
    visual: "odoo",
  },
  {
    id: "workflow",
    name: "Workflow Automation",
    pageTitle: "Business Workflow Automation",
    title: "Workflow Automation",
    tagline:
      "Automate repetitive operations across the tools you already use.",
    href: "/workflow-automation",
    accent: "#20A7A0",
    accentRgb: "32, 167, 160",
    accentSecondary: "#2FBCB5",
    accentText: "#0E6F70",
    visual: "workflow",
  },
  {
    id: "aiops",
    name: "AIOps Monitoring",
    pageTitle: "DevOps & Observability",
    title: "AIOps Monitoring",
    tagline:
      "Monitor, detect anomalies and respond before failures become operational problems.",
    href: "/devops-observability",
    accent: "#128A8C",
    accentRgb: "18, 138, 140",
    accentSecondary: "#159A9C",
    accentText: "#0C5E5F",
    visual: "devops",
  },
  {
    id: "consulting",
    name: "AI Consulting",
    pageTitle: "AI Consulting",
    title: "AI Consulting",
    tagline:
      "Identify high-impact AI opportunities and build a roadmap around measurable business value.",
    href: "/ai-consulting",
    accent: "#159A9C",
    accentRgb: "21, 154, 156",
    accentSecondary: "#20A7A0",
    accentText: "#0E6F70",
    visual: "ai",
  },
  {
    id: "integration",
    name: "System Integrations",
    pageTitle: "System Integrations",
    title: "System Integrations",
    tagline:
      "Connect CRM, ERP, databases and internal systems into one reliable ecosystem.",
    href: "/system-integrations",
    accent: "#118587",
    accentRgb: "17, 133, 135",
    accentSecondary: "#159A9C",
    accentText: "#0C5E5F",
    visual: "integration",
  },
];

export const servicesOverviewHref = "/#services";

/* Workflow Automation capabilities (Data & Document Automation is
   a capability here, not a competing primary service). Its page
   stays live for backward compatibility. */
export const workflowCapabilities = {
  data: {
    name: "Data & Document Automation",
    href: "/data-document-automation",
  },
};

export const getServiceByHref = (href) =>
  servicesMenu.find((s) => s.href === href);
