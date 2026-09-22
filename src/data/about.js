/* ================================================================
   ABOUT PAGE DATA
   Real-world presence, LinkedIn field posts, process steps and
   selected build areas. Curated locally — no scraping, no embeds.
=============================================================== */

/* ── Real-world presence showcase (left cards / right media stage) ── */

export const presenceItems = [
  {
    id: "events",
    label: "Events",
    eyebrow: "GITEX AI EUROPE · BERLIN",
    title: "Technology is better when the conversation is real.",
    description:
      "At GITEX AI Europe 2026, the SystemaOps team connected with technology leaders, AI innovators, partners and businesses from across the world.",
    media: {
      type: "image",
      src: "/about/event-photo.jpg",
      alt: "SystemaOps at GITEX AI Europe 2026, Berlin",
    },
    caption: "SystemaOps at GITEX AI Europe 2026, Berlin",
    link: "https://www.linkedin.com/posts/systemaops_gitexaieurope-gitex2026-berlin-activity-7479389229152665600-FZFw",
    linkLabel: "View on LinkedIn",
  },
  {
    id: "hackathons",
    label: "Hackathons",
    eyebrow: "HACKATHONS",
    title: "Build fast. Test ideas. Ship what works.",
    description:
      "Hackathons give us a place to turn ambitious ideas into working systems under real constraints.",
    media: {
      type: "image",
      src: "/about/hackathon-photo.jpg",
      alt: "SystemaOps building at a hackathon",
    },
    caption: "SystemaOps building at a hackathon",
    link: "https://www.linkedin.com/posts/systemaops_systemaops-agentos-amd-activity-7458939953671168001-XEOU?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADpXUb4Bi4tZOV2XbG2RI8CuBBsbJBFGkbk",
    linkLabel: null,
  },
  {
  id: "community",
  label: "Technology Community",
  eyebrow: "TECHNOLOGY COMMUNITY",
  title: "Stay close to the people shaping technology.",
  description:
    "We stay connected to technical communities, meetups and industry conversations to keep learning from the people building and using the systems around us.",
  media: {
    type: "image",
    src: "/about/community-photo.jpg",
    alt: "SystemaOps at a technology community meetup",
  },
  caption: "SystemaOps at a technology community meetup",
  link: null,
  linkLabel: null,
},
  {
    id: "product",
    label: "Product / Build",
    eyebrow: "PRODUCT / BUILD",
    title: "The systems we ship.",
    description:
      "Production workflows built and maintained for real operations — the same visual language as the diagrams we use every day.",
    media: {
      type: "svg",
      visual: "product",
      alt: "A production workflow diagram: trigger, process, action",
    },
    caption: "Production workflow — trigger, process, action",
    link: "/workflow-automation",
    linkLabel: "Explore workflow automation",
  },
];

/* ── "From the SystemaOps Field" — curated LinkedIn posts ── */

export const fieldPosts = [
  {
    id: "gitex-berlin-recap",
    category: "Events · GITEX AI Europe",
    title: "Where conversations become possibilities",
    excerpt:
      "Meeting technology leaders, AI innovators, partners and businesses from across the world — and the conversations that came out of it.",
    image: "/about/event-photo.jpg",
    url: "https://www.linkedin.com/posts/systemaops_gitexaieurope-gitex2026-berlin-activity-7479389229152665600-FZFw",
  },
  {
    id: "gitex-day1",
    category: "Events · GITEX AI Europe · Day 1",
    title: "GITEX AI Europe · Day 1",
    excerpt:
      "Day 1 focused on meeting people from different industries, exchanging ideas and opening new conversations around AI, technology and innovation.",
    image: "/about/day1-photo.jpg",
    url: "https://www.linkedin.com/posts/systemaops_gitexaieurope-gitex2026-berlin-activity-7478288335426224128-K2jD",
  },
  {
    id: "gitex-day1-ai",
    category: "Events · GITEX AI Europe · Day 1",
    title: "Day 1 — AI, technology and innovation",
    excerpt:
      "First day at GITEX AI Europe: conversations around AI, technology and innovation with people from different industries.",
    image: "/about/day1-ai-photo.jpg",
    url: "https://www.linkedin.com/posts/systemaops_gitexaieurope-gitex2026-artificialintelligence-activity-7477763133529493504-tcZk",
  },
];

/* ── HOW WE WORK — process journey meta (copy lives in i18n) ── */

export const processStepAccents = [
  {
    accent: "#38BDF8",
    rgb: "56, 189, 248",
    text: "#0369A1",
    media: "map",
  },
  {
    accent: "#8B7CFF",
    rgb: "139, 124, 255",
    text: "#6659D9",
    media: "architecture",
  },
  {
    accent: "#22D3EE",
    rgb: "34, 211, 238",
    text: "#0891B2",
    media: "pipeline",
    link: "/workflow-automation",
    linkLabel: "View build",
  },
  {
    accent: "#F59E0B",
    rgb: "245, 158, 11",
    text: "#B45309",
    media: "loop",
  },
];

/* ── WHAT WE BUILD — selected build areas ── */

export const selectedWork = [
  {
    id: "odoo",
    icon: "blocks",
    category: "Platform / ERP",
    title: "Odoo ERP",
    description:
      "ERP, CRM and business applications implemented and customized around how companies actually operate — from workflows to business logic.",
    tags: ["ERP", "CRM", "Business workflows"],
    href: "/odoo-customization",
    linkLabel: "Explore Odoo",
    accent: "#8B7CFF",
    accentRgb: "139, 124, 255",
    accentText: "#6659D9",
    visual: "odoo",
    featured: true,
  },
  {
    id: "workflow",
    icon: "workflow",
    category: "Automation",
    title: "Workflow Automation",
    description:
      "Production automation systems built with n8n and APIs that connect business applications and remove manual steps.",
    tags: ["n8n", "APIs", "Automation"],
    href: "/workflow-automation",
    linkLabel: "Explore workflow automation",
    accent: "#F59E0B",
    accentRgb: "245, 158, 11",
    accentText: "#B45309",
    visual: "workflow",
    featured: true,
  },
  {
    id: "fudo",
    icon: "utensils",
    category: "Operations",
    title: "Fudo POS & Operations",
    description:
      "Restaurant and hospitality operations work — connecting point-of-sale systems to the business processes around them.",
    tags: ["POS", "Operations", "Integrations"],
    href: "/#services",
    linkLabel: "Explore services",
    accent: "#FB7185",
    accentRgb: "251, 113, 133",
    accentText: "#BE123C",
    visual: "fudo",
    featured: false,
  },
  {
    id: "aml",
    icon: "shield",
    category: "AI / Compliance",
    title: "AML & AI Systems",
    description:
      "AI-assisted systems for compliance-heavy processes — combining automation, document handling and observability where appropriate.",
    tags: ["AI", "Compliance", "Automation"],
    href: "/ai-automation",
    linkLabel: "Explore AI automation",
    accent: "#38BDF8",
    accentRgb: "56, 189, 248",
    accentText: "#0369A1",
    visual: "aml",
    featured: false,
  },
  {
    id: "integrations",
    icon: "git-branch",
    category: "Integration",
    title: "System Integrations",
    description:
      "APIs and webhooks that connect ERP, CRM, databases and operational platforms into reliable workflows.",
    tags: ["APIs", "Webhooks", "ERP / CRM"],
    href: "/system-integrations",
    linkLabel: "Explore integrations",
    accent: "#3B82F6",
    accentRgb: "59, 130, 246",
    accentText: "#2563EB",
    visual: "integrations",
    featured: false,
  },
  {
    id: "ai",
    icon: "bot",
    category: "Intelligent Automation",
    title: "AI Automation",
    description:
      "AI agents and intelligent workflows that handle repetitive decisions, documents and responses — with human oversight where needed.",
    tags: ["AI Agents", "Workflows", "Human-in-the-loop"],
    href: "/ai-automation",
    linkLabel: "Explore AI automation",
    accent: "#2DD4BF",
    accentRgb: "45, 212, 191",
    accentText: "#0F766E",
    visual: "ai",
    featured: false,
  },
];
