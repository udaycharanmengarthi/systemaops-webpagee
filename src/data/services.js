/* ================================================================
   SERVICES NAVIGATION DATA
   Source of truth for the Services Mega Menu (desktop + mobile).

   Every entry maps to an EXISTING route. Categories without a
   dedicated page point to the Services overview section on the
   home page (/#services).

   Service identity colors (one accent per capability):
     Odoo = violet · Workflow = amber · AI = cyan
     Integration = blue · Data = orange · DevOps = pink
=============================================================== */

export const servicesMenu = [
  {
    id: "odoo",
    title: "Odoo Solutions",
    tagline:
      "ERP, CRM and business applications tailored to how you operate.",
    href: "/odoo-customization",
    accent: "#8B7CFF",
    accentRgb: "139, 124, 255",
    accentSecondary: "#A78BFA",
    accentText: "#6659D9",
    visual: "odoo",
  },
  {
    id: "workflow",
    title: "Business Workflow Automation",
    tagline:
      "Automate repetitive operations across the tools you already use.",
    href: "/workflow-automation",
    accent: "#F59E0B",
    accentRgb: "245, 158, 11",
    accentSecondary: "#FBBF24",
    accentText: "#B45309",
    visual: "workflow",
  },
  {
    id: "ai",
    title: "AI Automation & Agents",
    tagline:
      "AI agents and intelligent workflows that remove manual work.",
    href: "/ai-automation",
    accent: "#22D3EE",
    accentRgb: "34, 211, 238",
    accentSecondary: "#06B6D4",
    accentText: "#0891B2",
    visual: "ai",
  },
  {
    id: "integration",
    title: "System Integration & APIs",
    tagline:
      "Connect Odoo, n8n, CRMs and business systems into one flow.",
    href: "/system-integrations",
    accent: "#3B82F6",
    accentRgb: "59, 130, 246",
    accentSecondary: "#60A5FA",
    accentText: "#2563EB",
    visual: "integration",
  },
  {
    id: "data",
    title: "Data & Document Automation",
    tagline:
      "Process, route and sync documents and data automatically.",
    href: "/data-document-automation",
    accent: "#F97316",
    accentRgb: "249, 115, 22",
    accentSecondary: "#FB923C",
    accentText: "#C2410C",
    visual: "data",
  },
  {
    id: "devops",
    title: "DevOps & Observability",
    tagline:
      "Monitor, alert and remediate with AI-assisted operations.",
    href: "/devops-observability",
    accent: "#EC4899",
    accentRgb: "236, 72, 153",
    accentSecondary: "#F472B6",
    accentText: "#BE185D",
    visual: "devops",
  },
];

export const servicesOverviewHref = "/#services";
