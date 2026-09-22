/**
 * components/service/serviceData.js
 *
 * Preset section data for the i18n-driven service routes
 * (Odoo + Workflow). Kept separate from ServiceSections.jsx
 * so the component file only exports components.
 */

export const ODOO_ACCENT = {
  svc: "#8B7CFF",
  rgb: "139, 124, 255",
  text: "#6659D9",
};

export const WORKFLOW_ACCENT = {
  svc: "#F59E0B",
  rgb: "245, 158, 11",
  text: "#B45309",
};

export const AI_ACCENT = {
  svc: "#22D3EE",
  rgb: "34, 211, 238",
  text: "#0891B2",
};

export const ODOO_TECH = [
  {
    role: "Platform",
    items: ["Odoo ERP", "Odoo CRM", "Python", "Custom modules"],
  },
  {
    role: "Business areas",
    items: ["Sales", "Inventory", "Invoicing", "Accounting", "HR & Payroll"],
  },
  {
    role: "Integration",
    items: ["REST APIs", "Webhooks", "Payment platforms", "Third-party systems"],
  },
  {
    role: "Experience",
    items: ["React portals", "Customer portals", "SEO-ready websites"],
  },
];

export const ODOO_FAQ = [
  {
    q: "Do you work with new implementations, existing Odoo systems, or both?",
    a: "Both. We implement Odoo around your workflows from scratch, and we customize, extend or untangle Odoo systems that are already running.",
  },
  {
    q: "Can you build functionality Odoo doesn't include by default?",
    a: "Yes. Custom Python modules are built around your specific business requirements and integrated with the standard Odoo apps you already use.",
  },
  {
    q: "Which business areas does an Odoo implementation cover?",
    a: "Typically CRM and sales pipelines, inventory and fulfillment, invoicing and accounting, plus HR and payroll — scoped to what your operation actually needs.",
  },
  {
    q: "Does Odoo connect to our other tools?",
    a: "Yes. Odoo connects to payment systems, CRMs and third-party platforms through APIs and webhooks, so it works as part of the wider operation.",
  },
  {
    q: "What do we get at handover?",
    a: "A working system configured around your workflows, plus handover notes your team can maintain — covering customizations, integrations and routines.",
  },
];

export const ODOO_RELATED = [
  {
    title: "AI Automation",
    desc: "AI agents and intelligent workflows that remove manual work.",
    href: "/ai-automation",
    accent: "#22D3EE",
  },
  {
    title: "Workflow Automation",
    desc: "Automate repetitive operations across the tools you already use.",
    href: "/workflow-automation",
    accent: "#F59E0B",
  },
  {
    title: "System Integration & APIs",
    desc: "Connect Odoo, CRMs and business systems into one flow.",
    href: "/system-integrations",
    accent: "#3B82F6",
  },
];

export const WORKFLOW_TECH = [
  {
    role: "Orchestration",
    items: ["n8n", "Zapier", "Event triggers", "Conditional logic"],
  },
  {
    role: "Business systems",
    items: ["CRMs", "ERP systems", "Google Sheets", "Slack", "Email", "Databases"],
  },
  {
    role: "Execution paths",
    items: ["Approvals", "Notifications", "Record sync", "Follow-ups"],
  },
  {
    role: "Reliability",
    items: ["Failure handling", "Monitoring", "Exception paths"],
  },
];

export const WORKFLOW_FAQ = [
  {
    q: "Which processes are worth automating first?",
    a: "Repetitive, rule-based work with clear triggers — data entry, notifications, follow-ups, record synchronization. We identify the highest-impact candidates during discovery.",
  },
  {
    q: "Do we use n8n, Zapier, or something else?",
    a: "Production workflows are typically built in n8n with APIs, webhooks and process orchestration. Where a simpler tool fits the job, we say so.",
  },
  {
    q: "What happens when an automated workflow fails?",
    a: "Failure handling is part of the design: retries where safe, exception paths for the rest, and monitoring so failures are visible instead of silent.",
  },
  {
    q: "Do we have to replace the tools we already use?",
    a: "No. Workflows connect your existing CRMs, sheets, chat tools, ERP systems and databases — the automation wraps around them.",
  },
  {
    q: "How is the automation maintained over time?",
    a: "Performance is monitored and optimized continuously, and workflows scale as the business grows — with handover notes your team can follow.",
  },
];

export const WORKFLOW_RELATED = [
  {
    title: "AI Automation",
    desc: "AI agents and intelligent workflows that remove manual work.",
    href: "/ai-automation",
    accent: "#22D3EE",
  },
  {
    title: "Odoo Solutions",
    desc: "ERP, CRM and business applications tailored to how you operate.",
    href: "/odoo-customization",
    accent: "#8B7CFF",
  },
  {
    title: "System Integration & APIs",
    desc: "Connect Odoo, CRMs and business systems into one flow.",
    href: "/system-integrations",
    accent: "#3B82F6",
  },
];
