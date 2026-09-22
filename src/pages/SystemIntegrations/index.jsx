/**
 * pages/SystemIntegrations/index.jsx
 *
 * System Integration & APIs service page.
 * Story: different systems, one reliable flow.
 */

import {
  ArrowRight,
  CalendarDays,
  PlugZap,
  Webhook,
  ArrowLeftRight,
  KeyRound,
  ShieldAlert,
  Activity,
} from "lucide-react";

import { Link } from "react-router-dom";

import Meta from "../../seo/Meta";
import ServiceSchema from "../../seo/schema/ServiceSchema";
import BreadcrumbSchema from "../../seo/schema/BreadcrumbSchema";
import Reveal from "../../components/ui/Reveal";
import {
  ServiceTech,
  RealWork,
  ServiceFaq,
  RelatedServices,
} from "../../components/service/ServiceSections";
import "../../components/service/ServiceShared.css";
import { selectedWork } from "../../data/about";

import "./SystemIntegrations.css";

const ACCENT = "#3B82F6";
const ACCENT_RGB = "59, 130, 246";
const ACCENT_TEXT = "#2563EB";

const CAPABILITIES = [
  {
    icon: PlugZap,
    title: "API integrations",
    desc: "Connect ERP, CRM, databases and business applications through well-defined REST APIs — reading and writing data where the operation needs it.",
  },
  {
    icon: Webhook,
    title: "Webhooks & events",
    desc: "React to what happens in one system — a new order, a status change, a payment — and trigger the next step somewhere else automatically.",
  },
  {
    icon: ArrowLeftRight,
    title: "Data synchronization",
    desc: "Keep shared records consistent across systems so teams stop reconciling the same information in two places.",
  },
  {
    icon: KeyRound,
    title: "Authentication & access",
    desc: "API keys, tokens and scoped permissions set up deliberately, so each integration can only touch what it should.",
  },
  {
    icon: ShieldAlert,
    title: "Error handling",
    desc: "Failed calls are caught, retried where safe, and surfaced clearly — instead of silently dropping business-critical updates.",
  },
  {
    icon: Activity,
    title: "Integration monitoring",
    desc: "Know when a flow stops working: payload logs, failure visibility and alerts wired into the workflows your team already watches.",
  },
];

const PROCESS = [
  {
    n: "01",
    color: "#3B82F6",
    title: "Map",
    desc: "We identify what needs to move between which systems, in which direction, and what triggers each exchange.",
  },
  {
    n: "02",
    color: "#8B7CFF",
    title: "Connect",
    desc: "APIs, webhooks and system boundaries are defined — including authentication and data formats for each side.",
  },
  {
    n: "03",
    color: "#22D3EE",
    title: "Validate",
    desc: "Payloads, permissions and failure cases are checked before anything goes live, so edge cases don't become incidents.",
  },
  {
    n: "04",
    color: "var(--accent-primary)",
    title: "Operate",
    desc: "The integration runs under observation, with exception handling and a clear path for changes as systems evolve.",
  },
];

const USE_CASES = [
  {
    title: "ERP ↔ CRM synchronization",
    desc: "Customers, orders and statuses stay aligned between the system that sells and the system that fulfills — without manual re-entry.",
  },
  {
    title: "Webhook-driven business workflows",
    desc: "Events in one platform kick off multi-step workflows in n8n: notifications, record updates, follow-ups and handoffs.",
  },
  {
    title: "Database ↔ application integration",
    desc: "Operational data flows between databases and the applications teams use daily, kept consistent in both directions where needed.",
  },
  {
    title: "External platform ↔ internal system",
    desc: "Third-party platforms — payments, messaging, logistics — connected to internal ERP and workflow systems through a controlled layer.",
  },
];

const INCLUDES = [
  "Endpoint and event inventory — what connects to what, and why",
  "Authentication and access scoping for every integration",
  "Payload validation and data-format mapping",
  "Retry, fallback and exception paths for failed calls",
  "Logging and monitoring hooks so failures are visible",
  "Handover notes your team can actually maintain",
];

const SI_TECH = [
  {
    role: "Systems",
    items: ["Odoo ERP", "CRMs", "Databases", "Payment platforms", "Messaging tools", "Logistics platforms"],
  },
  {
    role: "Connectivity",
    items: ["REST APIs", "Webhooks", "Event triggers", "Data-format mapping"],
  },
  {
    role: "Control",
    items: ["Payload validation", "Retry & fallback", "Exception queues", "Access scoping"],
  },
  {
    role: "Operations",
    items: ["Logging", "Monitoring", "Alerts", "n8n workflows"],
  },
];

const SI_WORK_IDS = ["integrations", "workflow", "odoo"];

const SI_FAQ = [
  {
    q: "Which systems can you connect?",
    a: "Odoo, CRMs, databases, n8n workflows and third-party platforms that expose APIs or webhooks — payments, messaging and logistics included. If a system has no usable interface, we say so during mapping rather than promising a workaround.",
  },
  {
    q: "Do we need to replace our current tools?",
    a: "No. Integrations wrap around the tools you already use. The goal is one reliable flow between existing systems, not a rip-and-replace.",
  },
  {
    q: "What happens when an integration fails?",
    a: "Failed calls are retried where safe and anything unresolvable lands in an exception queue with the payload and reason attached — visible to your team instead of silently dropped.",
  },
  {
    q: "How is access kept secure?",
    a: "Every integration gets scoped credentials — API keys or tokens limited to exactly what that flow needs — so no connection can touch more than its own job.",
  },
  {
    q: "Who maintains the integrations afterwards?",
    a: "You receive an endpoint and event inventory plus handover notes, and every flow ships with logging and monitoring hooks so your team sees failures first.",
  },
];

const SI_RELATED = [
  {
    title: "Odoo Solutions",
    desc: "ERP, CRM and business applications tailored to how you operate.",
    href: "/odoo-customization",
    accent: "#8B7CFF",
  },
  {
    title: "Workflow Automation",
    desc: "Automate repetitive operations across the tools you already use.",
    href: "/workflow-automation",
    accent: "#F59E0B",
  },
  {
    title: "AI Automation & Agents",
    desc: "AI agents and intelligent workflows that remove manual work.",
    href: "/ai-automation",
    accent: "#22D3EE",
  },
];

function HeroVisual() {
  return (
    <svg
      viewBox="0 0 560 508"
      className="si-hero-svg"
      role="img"
      aria-label="Integration architecture: CRM and ERP exchange requests and data both ways through a central API layer, which also serves the database, webhooks and external systems, producing a connected business flow"
    >
      <defs>
        <path id="si-p0" d="M160 88 L220 160" fill="none" />
        <path id="si-p1" d="M340 160 L400 88" fill="none" />
        <path id="si-p2" d="M400 88 L340 160" fill="none" />
        <path id="si-p3" d="M220 244 L115 320" fill="none" />
        <path id="si-p4" d="M360 244 L360 440" fill="none" />
      </defs>
      {/* connectors — bidirectional where communication flows both ways */}
      <g className="si-flow-line" strokeWidth="2">
        <line x1="160" y1="88" x2="220" y2="160" />
        <line x1="340" y1="160" x2="400" y2="88" />
        <line x1="400" y1="88" x2="340" y2="160" />
        <line x1="220" y1="244" x2="115" y2="320" />
        <line x1="280" y1="244" x2="280" y2="320" strokeDasharray="5 5" />
        <line x1="340" y1="244" x2="415" y2="320" />
        <line x1="445" y1="320" x2="340" y2="244" strokeDasharray="5 5" />
        <line x1="360" y1="244" x2="360" y2="440" />
      </g>
      {/* data packets follow the actual paths */}
      <g className="si-pulses" aria-hidden="true">
        {[
          { pid: "si-p0", begin: "0.5s" },
          { pid: "si-p1", begin: "1.6s" },
          { pid: "si-p2", begin: "2.7s" },
          { pid: "si-p3", begin: "3.8s" },
          { pid: "si-p4", begin: "5s" },
        ].map((p) => (
          <circle key={p.pid} r={4} fill={ACCENT}>
            <animateMotion dur="7s" begin={p.begin} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;0.16" calcMode="linear">
              <mpath href={`#${p.pid}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.02;0.14;0.18" dur="7s" begin={p.begin} repeatCount="indefinite" />
          </circle>
        ))}
      </g>

      <g fontFamily="'Space Grotesk','Plus Jakarta Sans',sans-serif">
        <rect x="60" y="36" width="200" height="52" rx="12" className="si-node si-ph-src" />
        <text x="160" y="67" textAnchor="middle" className="si-node-text">CRM</text>
        <rect x="300" y="36" width="200" height="52" rx="12" className="si-node si-ph-src" />
        <text x="400" y="67" textAnchor="middle" className="si-node-text">ERP</text>

        {/* center: API layer */}
        <rect x="180" y="160" width="200" height="84" rx="14" fill={ACCENT} />
        <text x="280" y="199" textAnchor="middle" className="si-node-text si-node-text--on-accent">API LAYER</text>
        <text x="280" y="218" textAnchor="middle" className="si-node-sub si-node-sub--on-accent">requests · data</text>
        <rect x="171" y="151" width="218" height="102" rx="18" fill="none" stroke={ACCENT} strokeWidth="2" className="si-ring" aria-hidden="true" />

        {/* consumers */}
        <rect x="40" y="320" width="150" height="56" rx="12" className="si-node si-ph-src" />
        <text x="115" y="351" textAnchor="middle" className="si-node-text si-node-text--sm">DATABASE</text>
        <rect x="210" y="320" width="140" height="56" rx="12" className="si-node si-ph-src" />
        <text x="280" y="351" textAnchor="middle" className="si-node-text si-node-text--sm">EXTERNAL SYSTEM</text>
        <rect x="370" y="320" width="150" height="56" rx="12" className="si-node si-ph-src" />
        <text x="445" y="351" textAnchor="middle" className="si-node-text si-node-text--sm">WEBHOOK</text>
        <text x="445" y="367" textAnchor="middle" className="si-node-sub">event trigger</text>

        {/* outcome */}
        <rect x="260" y="440" width="200" height="52" rx="12" className="si-node si-node--flow" />
        <text x="360" y="471" textAnchor="middle" className="si-node-text si-node-text--sm">CONNECTED BUSINESS FLOW</text>
        <rect x="251" y="431" width="218" height="70" rx="18" fill="none" stroke={ACCENT} strokeWidth="2" className="si-flow-hi" aria-hidden="true" />
      </g>
    </svg>
  );
}

function ArchitectureVisual() {
  return (
    <svg
      viewBox="0 0 900 420"
      className="si-arch-svg"
      role="img"
      aria-label="Integration flow: source systems pass through an integration layer with API, webhook, validation and retry handling into the business workflow"
    >
      <g stroke="var(--border-strong)" strokeWidth="2">
        <line x1="180" y1="90" x2="380" y2="150" />
        <line x1="180" y1="150" x2="380" y2="170" />
        <line x1="180" y1="210" x2="380" y2="190" />
        <line x1="180" y1="270" x2="380" y2="210" />
        <line x1="180" y1="330" x2="380" y2="230" />
        <line x1="560" y1="190" x2="700" y2="190" />
        <line x1="630" y1="250" x2="630" y2="330" strokeDasharray="6 6" />
        <line x1="630" y1="330" x2="380" y2="330" strokeDasharray="6 6" />
      </g>
      <g fontFamily="'Space Grotesk','Plus Jakarta Sans',sans-serif">
        {[
          { y: 64, t: "ERP" },
          { y: 124, t: "CRM" },
          { y: 184, t: "Database" },
          { y: 244, t: "Payments" },
          { y: 304, t: "External services" },
        ].map((n) => (
          <g key={n.t}>
            <rect x="40" y={n.y} width="140" height="46" rx="10" className="si-node" />
            <text x="110" y={n.y + 29} textAnchor="middle" className="si-node-text si-node-text--sm">{n.t}</text>
          </g>
        ))}

        <rect x="380" y="110" width="180" height="150" rx="14" className="si-node si-node--panel" />
        <text x="470" y="138" textAnchor="middle" className="si-node-text si-node-text--sm">INTEGRATION LAYER</text>
        {[
          { y: 152, t: "API" },
          { y: 182, t: "Webhook" },
          { y: 212, t: "Validation" },
          { y: 242, t: "Retry" },
        ].map((c) => (
          <g key={c.t}>
            <rect x="398" y={c.y} width="144" height="26" rx="8" fill={`color-mix(in srgb, ${ACCENT} 12%, transparent)`} stroke="none" />
            <text x="470" y={c.y + 18} textAnchor="middle" className="si-node-text si-node-text--sm">{c.t}</text>
          </g>
        ))}

        <rect x="700" y="150" width="160" height="80" rx="14" fill={ACCENT} />
        <text x="780" y="184" textAnchor="middle" className="si-node-text si-node-text--sm si-node-text--on-accent">BUSINESS</text>
        <text x="780" y="204" textAnchor="middle" className="si-node-text si-node-text--sm si-node-text--on-accent">WORKFLOW</text>

        <rect x="560" y="318" width="140" height="40" rx="10" className="si-node" />
        <text x="630" y="343" textAnchor="middle" className="si-node-text si-node-text--sm">Exception queue</text>
      </g>
    </svg>
  );
}

export default function SystemIntegrationsPage() {
  return (
    <div
      className="si-page"
      style={{
        "--svc": ACCENT,
        "--svc-rgb": ACCENT_RGB,
        "--svc-text": ACCENT_TEXT,
      }}
    >
      <Meta
        title="System Integration & APIs"
        description="Connect ERP, CRM, databases and business applications through reliable APIs, webhooks and workflows built by SystemaOps."
        canonical="/system-integrations"
        keywords="system integration, API integration, webhooks, ERP CRM integration, data synchronization, integration services"
      />

      <ServiceSchema
        name="System Integration & APIs"
        description="Integration services connecting ERP, CRM, databases and business applications through APIs, webhooks and monitored workflows."
        url="/system-integrations"
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/#services" },
          { name: "System Integration & APIs", href: "/system-integrations" },
        ]}
      />

      {/* ==================== HERO ==================== */}
      <Reveal>
        <section className="si-hero">
          <div className="si-hero-inner">
            <div className="si-hero-copy">
              <span className="si-eyebrow">
                <span className="si-eyebrow-dot" />
                SYSTEM INTEGRATION &amp; APIS
              </span>
              <h1 className="si-title">
                Make your systems talk.
                <br />
                <span className="si-title-accent">Make operations flow.</span>
              </h1>
              <p className="si-hero-desc">
                Connect ERP, CRM, databases, applications and
                operational tools through reliable APIs, webhooks
                and workflows — one controlled flow instead of
                manual handoffs.
              </p>
              <div className="si-hero-actions">
                <Link to="/contact" className="si-primary-btn">
                  <CalendarDays size={18} />
                  Discuss an integration
                  <ArrowRight size={16} />
                </Link>
                <a href="#si-arch" className="si-secondary-btn">
                  See how it works
                </a>
              </div>
            </div>
            <div className="si-hero-visual" aria-hidden="false">
              <HeroVisual />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== WHY ==================== */}
      <Reveal delay={0.06}>
        <section className="si-section">
          <div className="si-container">
            <span className="si-eyebrow">WHY INTEGRATION</span>
            <h2 className="si-section-title">
              Your tools are separate.
              <span className="si-title-accent"> Your operation shouldn&apos;t be.</span>
            </h2>
            <ul className="si-problem-list">
              <li><strong>Trapped information</strong> — customer, order and stock data lives in one system while the team that needs it works in another.</li>
              <li><strong>Manual data movement</strong> — people copy records between tools, re-keying the same information every day.</li>
              <li><strong>Dead-end events</strong> — a payment succeeds or a status changes, and nothing downstream reacts.</li>
              <li><strong>Duplicate records</strong> — the same customer exists three times with three different details.</li>
              <li><strong>Untraceable failures</strong> — when a sync breaks, nobody can see where the data stopped.</li>
            </ul>
          </div>
        </section>
      </Reveal>

      {/* ==================== CAPABILITIES ==================== */}
      <Reveal delay={0.08}>
        <section className="si-section si-section--tight">
          <div className="si-container">
            <div className="si-section-header center">
              <span className="si-eyebrow">CAPABILITIES</span>
              <h2 className="si-section-title">What the integration covers.</h2>
            </div>
            <div className="si-grid">
              {CAPABILITIES.map((c) => (
                <div key={c.title} className="si-card">
                  <div className="si-card-icon">
                    <c.icon size={26} />
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== ARCHITECTURE ==================== */}
      <Reveal delay={0.08}>
        <section id="si-arch" className="si-section">
          <div className="si-container">
            <span className="si-eyebrow">ARCHITECTURE</span>
            <h2 className="si-section-title">How the systems connect.</h2>
            <p className="si-section-desc">
              Every source system talks to one integration layer —
              never a tangle of point-to-point links. Validation and
              retry handling sit in the middle, and anything that
              can&apos;t be resolved lands in an exception queue a
              person can inspect.
            </p>
            <div className="si-arch-frame">
              <ArchitectureVisual />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== TECHNOLOGY ==================== */}

      <ServiceTech
        eyebrow="TECHNOLOGY"
        title="Built from the systems you already run."
        desc="Integrations are assembled from proven connectivity — grouped here by role, so you see what each part does instead of a logo wall."
        groups={SI_TECH}
      />

      {/* ==================== PROCESS ==================== */}
      <Reveal delay={0.1}>
        <section className="si-section si-section--tight">
          <div className="si-container">
            <div className="si-section-header center">
              <span className="si-eyebrow">HOW IT WORKS</span>
              <h2 className="si-section-title">From mapping to operation.</h2>
            </div>
            <div className="si-process">
              {PROCESS.map((s) => (
                <div key={s.n} className="si-process-item">
                  <span className="si-process-number" style={{ color: s.color }}>{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== USE CASES ==================== */}
      <Reveal delay={0.08}>
        <section className="si-section si-section--tight">
          <div className="si-container">
            <span className="si-eyebrow">USE CASES</span>
            <h2 className="si-section-title">Where integrations pay off.</h2>
            <div className="si-usecases">
              {USE_CASES.map((u, i) => (
                <div key={u.title} className="si-usecase">
                  <span className="si-usecase-index">0{i + 1}</span>
                  <div>
                    <h3>{u.title}</h3>
                    <p>{u.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== SELECTED REAL WORK ==================== */}

      <RealWork
        eyebrow="SELECTED WORK"
        title="Build areas this service connects to."
        desc="Integration work lands in real, maintained systems — these are the build areas from our own portfolio that integrations plug into."
        items={selectedWork.filter((w) => SI_WORK_IDS.includes(w.id))}
      />

      {/* ==================== INCLUDES ==================== */}
      <Reveal delay={0.08}>
        <section className="si-section si-section--tight">
          <div className="si-container">
            <div className="si-includes">
              <div>
                <span className="si-eyebrow">DELIVERY</span>
                <h2 className="si-section-title">What the implementation includes.</h2>
              </div>
              <ul className="si-checklist">
                {INCLUDES.map((item) => (
                  <li key={item}>
                    <span className="si-check" aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== FAQ ==================== */}

      <ServiceFaq
        eyebrow="QUESTIONS"
        title="Integration, answered directly."
        items={SI_FAQ}
      />

      {/* ==================== RELATED ==================== */}

      <RelatedServices
        eyebrow="KEEP EXPLORING"
        title="Related services."
        items={SI_RELATED}
      />

      {/* ==================== CTA ==================== */}
      <Reveal delay={0.12}>
        <section className="si-cta-section">
          <div className="si-cta-box">
            <div className="si-cta-inner">
              <span className="si-eyebrow">READY WHEN YOU ARE</span>
              <h2>
                Have systems that need to <span className="si-title-accent">work together?</span>
              </h2>
              <p>
                Tell us which systems hold your operation together
                today. We&apos;ll map the connections worth building first.
              </p>
              <Link to="/contact" className="si-primary-btn">
                <CalendarDays size={18} />
                Plan an integration
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
