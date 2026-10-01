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
    accent: "#3BA3A1",
    rgb: "59, 163, 161",
    text: "#0F5252",
    media: "map",
  },
  {
    accent: "#1A7F7F",
    rgb: "26, 127, 127",
    text: "#0F5252",
    media: "architecture",
  },
  {
    accent: "#4FBDBB",
    rgb: "79, 189, 187",
    text: "#0F5252",
    media: "pipeline",
    link: "/workflow-automation",
    linkLabel: "View build",
  },
  {
    accent: "#2A9D9C",
    rgb: "42, 157, 156",
    text: "#0F5252",
    media: "loop",
  },
];

/* ── WHAT WE BUILD — selected build areas ── */

export const selectedWork = [
  {
    id: "odoo",
    icon: "blocks",
    category: "Platform / ERP",
    title: "Odoo Customization",
    description:
      "ERP, CRM and business applications implemented and customized around how companies actually operate — from workflows to business logic.",
    tags: ["ERP", "CRM", "Business workflows"],
    href: "/odoo-customization",
    linkLabel: "Explore Odoo",
    accent: "#1A7F7F",
    accentRgb: "26, 127, 127",
    accentText: "#0F5252",
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
    accent: "#2A9D9C",
    accentRgb: "42, 157, 156",
    accentText: "#0F5252",
    visual: "workflow",
    featured: true,
  },
  {
    id: "integrations",
    icon: "git-branch",
    category: "Integration",
    title: "System Integration & APIs",
    description:
      "APIs and webhooks that connect ERP, CRM, databases and operational platforms into reliable workflows.",
    tags: ["APIs", "Webhooks", "ERP / CRM"],
    href: "/system-integrations",
    linkLabel: "Explore integrations",
    accent: "#14807E",
    accentRgb: "20, 128, 126",
    accentText: "#0F5252",
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
    accent: "#4FBDBB",
    accentRgb: "79, 189, 187",
    accentText: "#0F5252",
    visual: "ai",
    featured: false,
  },
  {
    id: "observability",
    icon: "eye",
    category: "DevOps / Monitoring",
    title: "Observability",
    description:
      "Monitoring, logs, metrics and alerts that show what your systems are doing — so issues are found with context, not guesswork.",
    tags: ["Monitoring", "Logs", "Alerts"],
    href: "/devops-observability",
    linkLabel: "Explore observability",
    accent: "#0E6F70",
    accentRgb: "14, 111, 112",
    accentText: "#0F5252",
    visual: "observability",
    featured: false,
  },
  {
    id: "consulting",
    icon: "handshake",
    category: "Strategy",
    title: "AI Consulting",
    description:
      "Identify practical AI opportunities, prioritize the right workflows, and connect them to the systems your business already uses.",
    tags: ["Assessment", "Roadmaps", "AI Strategy"],
    href: "/ai-consulting",
    linkLabel: "Explore AI consulting",
    accent: "#159A9C",
    accentRgb: "21, 154, 156",
    accentText: "#0F5252",
    visual: "consulting",
    featured: false,
  },
];
