/**
 * pages/Odoo/index.jsx
 *
 * Odoo Solutions service page.
 * Story: Odoo fits the business process — never the other way round.
 * Accent: violet #8B7CFF / #A78BFA.
 */

import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  SlidersHorizontal,
  GitBranch,
  Cpu,
  Blocks,
  Compass,
} from "lucide-react";

import { Link } from "react-router-dom";

import Meta from "../../seo/Meta";
import ServiceSchema from "../../seo/schema/ServiceSchema";
import BreadcrumbSchema from "../../seo/schema/BreadcrumbSchema";
import Reveal from "../../components/ui/Reveal";
import {
  ServiceTech,
  ServiceFaq,
  RelatedServices,
} from "../../components/service/ServiceSections";
import "../../components/service/ServiceShared.css";
import { OdooArchitecture } from "../../components/service/Architecture";
import "../../components/service/Architecture.css";

import "./Odoo.css";

const ACCENT = "#8B7CFF";
const ACCENT_RGB = "139, 124, 255";
const ACCENT_TEXT = "#6659D9";

const CAPABILITIES = [
  {
    icon: ClipboardList,
    n: "01",
    title: "Odoo implementation",
    desc: "Odoo set up around your operation from the start — apps, access, and structure matched to how the business actually runs.",
  },
  {
    icon: SlidersHorizontal,
    n: "02",
    title: "Customization",
    desc: "Views, fields, flows and rules adjusted so standard Odoo behavior follows your process instead of fighting it.",
  },
  {
    icon: GitBranch,
    n: "03",
    title: "Workflow configuration",
    desc: "Pipelines, stages and approvals configured per team — sales, warehouse, finance — with handoffs that mirror reality.",
  },
  {
    icon: Cpu,
    n: "04",
    title: "Business logic",
    desc: "The rules your operation runs on — pricing, stock, invoicing logic — implemented where the work happens.",
  },
  {
    icon: Blocks,
    n: "05",
    title: "Module integration",
    desc: "CRM, sales, inventory, accounting, HR and custom modules working as one system, not five disconnected apps.",
  },
  {
    icon: Compass,
    n: "06",
    title: "Process alignment",
    desc: "Existing processes mapped first, then Odoo shaped to them — gaps closed deliberately instead of paved over.",
  },
];

const PROCESS = [
  {
    n: "01",
    color: "#8B7CFF",
    title: "Understand",
    desc: "We map the operation: workflows, handoffs, rules and where standard processes break down.",
  },
  {
    n: "02",
    color: "#3B82F6",
    title: "Configure",
    desc: "Odoo is aligned with the existing workflow — apps, pipelines and permissions set up per team.",
  },
  {
    n: "03",
    color: "#22D3EE",
    title: "Customize",
    desc: "Required business logic is implemented in custom modules, tested against real operating scenarios.",
  },
  {
    n: "04",
    color: "var(--accent-primary)",
    title: "Operate",
    desc: "The system goes live under observation — then we improve, extend and adapt as the business changes.",
  },
];

const TECH_GROUPS = [
  {
    role: "Odoo modules",
    items: ["CRM", "Sales", "Inventory", "Invoicing", "Accounting", "HR & Payroll"],
  },
  {
    role: "Business workflows",
    items: ["Pipelines", "Approvals", "Fulfillment", "Lead tracking"],
  },
  {
    role: "Integrations",
    items: ["REST APIs", "Webhooks", "Payment platforms", "Third-party systems"],
  },
  {
    role: "Data",
    items: ["Products", "Stock", "Customers", "Finance records"],
  },
  {
    role: "Custom logic",
    items: ["Python modules", "Business rules", "Custom views", "Automated actions"],
  },
];

const USE_CASES = [
  {
    title: "ERP workflows that match the floor",
    flow: ["Order arrives", "Stock & rules checked", "Fulfillment + invoice"],
    desc: "Sales, warehouse and finance move through one connected flow — configured around how fulfillment actually happens.",
  },
  {
    title: "CRM processes sales teams follow",
    flow: ["Lead captured", "Pipeline + follow-ups", "Quote → order"],
    desc: "Pipelines, stages and reminders shaped to the sales motion — not a default template nobody opens.",
  },
  {
    title: "Business operations in one place",
    flow: ["Request logged", "Approval routed", "Record updated"],
    desc: "Day-to-day operational requests travel through Odoo with approvals and history attached.",
  },
  {
    title: "Module customization for edge cases",
    flow: ["Gap identified", "Custom module built", "Standard + custom unified"],
    desc: "Where standard Odoo stops, Python modules continue — integrated so users never feel the seam.",
  },
];

const ENGAGEMENT = [
  "Discovery — operation mapping across teams and handoffs",
  "App scoping — which Odoo modules, and what each must do",
  "Configuration — pipelines, permissions and workflows per team",
  "Customization — views, fields, rules and Python modules",
  "Integrations — payments, external platforms and connected tools",
  "Testing — real operating scenarios before go-live",
  "Handover — notes, training support and a path for extension",
];

const ODOO_FAQ = [
  {
    q: "Can Odoo be customized around our process?",
    a: "Yes — that is the core of the service. Views, fields, workflows and Python modules are shaped around how your teams already work, instead of forcing the operation into a default template.",
  },
  {
    q: "Do we need to replace our existing systems?",
    a: "Not necessarily. Odoo can become the operational core while existing tools connect through APIs and webhooks. We map what stays, what moves, and what integrates.",
  },
  {
    q: "Can Odoo integrate with other applications?",
    a: "Yes. Payment platforms, CRMs, logistics and third-party systems connect to Odoo through APIs and webhooks, so data flows instead of being re-entered.",
  },
  {
    q: "How does implementation work?",
    a: "Understand the operation first, then configure Odoo around it, customize where standard behavior falls short, and go live under observation — with testing against real scenarios throughout.",
  },
  {
    q: "What happens after go-live?",
    a: "The system is monitored, improved and extended as the business changes — with handover notes your team can maintain and a clear path for new modules.",
  },
];

const ODOO_RELATED = [
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

/* ── ARCHITECTURE: hover a module to trace its path ── */

function ArchitectureVisual() {
  const [active, setActive] = useState("CRM");
  const rows = [
    { m: "CRM", y: 60 },
    { m: "Sales", y: 124 },
    { m: "Inventory", y: 188 },
    { m: "Finance", y: 252 },
    { m: "HR", y: 316 },
  ];

  return (
    <div className="od-arch-wrap">
      <div className="od-arch-legend" role="tablist" aria-label="Odoo modules">
        {rows.map((r) => (
          <button
            key={r.m}
            role="tab"
            aria-selected={active === r.m}
            className={`od-arch-tab ${active === r.m ? "od-arch-tab--active" : ""}`}
            onClick={() => setActive(r.m)}
          >
            {r.m}
          </button>
        ))}
      </div>
      <svg
        viewBox="0 0 900 400"
        className="od-arch-svg"
        role="img"
        aria-label="ERP architecture: five business modules converge into the Odoo core, which drives business workflows"
      >
        <g stroke="var(--border-strong)" strokeWidth="2">
          {rows.map((r) => (
            <line
              key={r.m}
              x1="230"
              y1={r.y + 26}
              x2="420"
              y2="200"
              className={active === r.m ? "od-arch-line--hot" : "od-arch-line--dim"}
            />
          ))}
          <line x1="580" y1="200" x2="700" y2="200" />
        </g>
        <g fontFamily="'Space Grotesk','Plus Jakarta Sans',sans-serif">
          {rows.map((r) => (
            <g key={r.m} opacity={active === r.m ? 1 : 0.45}>
              <rect x="80" y={r.y} width="150" height="52" rx="12" className="od-node" />
              <text x="155" y={r.y + 32} textAnchor="middle" className="od-node-text">{r.m}</text>
            </g>
          ))}

          <rect x="420" y="130" width="160" height="140" rx="16" fill={ACCENT} />
          <text x="500" y="192" textAnchor="middle" className="od-node-text od-node-text--on-accent">ODOO</text>
          <text x="500" y="212" textAnchor="middle" className="od-node-text od-node-text--on-accent">CORE</text>
          <text x="500" y="232" textAnchor="middle" className="od-node-sub od-node-sub--on-accent">logic · rules</text>

          <rect x="700" y="150" width="160" height="100" rx="14" className="od-node od-node--ops" />
          <text x="780" y="192" textAnchor="middle" className="od-node-text od-node-text--sm">BUSINESS</text>
          <text x="780" y="212" textAnchor="middle" className="od-node-text od-node-text--sm">WORKFLOWS</text>
          <text x="780" y="230" textAnchor="middle" className="od-node-sub">live operations</text>
        </g>
      </svg>
      <p className="od-arch-caption">
        Tracing <strong>{active}</strong> — configured pipelines, business rules and custom logic carry it from module into the workflows teams run daily.
      </p>
    </div>
  );
}

export default function OdooPage() {
  return (
    <div
      className="od-page"
      style={{
        "--svc": ACCENT,
        "--svc-rgb": ACCENT_RGB,
        "--svc-text": ACCENT_TEXT,
      }}
    >
      <Meta
        title="Odoo Solutions & ERP Customization"
        description="Implement and customize Odoo around your workflows, business logic and operational needs — CRM, sales, inventory, finance and connected modules."
        canonical="/odoo-customization"
        keywords="Odoo customization, Odoo ERP, Odoo implementation, Odoo modules, ERP customization, business workflows"
      />

      <ServiceSchema
        name="Odoo Solutions"
        description="Odoo ERP implementation and customization services built around real business workflows and operational needs."
        url="/odoo-customization"
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/#services" },
          { name: "Odoo Solutions", href: "/odoo-customization" },
        ]}
      />

      {/* ==================== HERO ==================== */}
      <Reveal>
        <section className="od-hero">
          <div className="od-hero-inner">
            <div className="od-hero-copy">
              <span className="od-eyebrow">
                <span className="od-eyebrow-dot" />
                ODOO SOLUTIONS
              </span>
              <h1 className="od-title">
                Make Odoo fit
                <br />
                <span className="od-title-accent">the way your business works.</span>
              </h1>
              <p className="od-hero-desc">
                Implement and customize Odoo around your workflows,
                business logic and operational needs — instead of
                bending the operation to fit the software.
              </p>
              <div className="od-hero-actions">
                <Link to="/contact" className="od-primary-btn">
                  <CalendarDays size={18} />
                  Discuss Odoo
                  <ArrowRight size={16} />
                </Link>
                <a href="#od-arch" className="od-secondary-btn">
                  See how it works
                </a>
              </div>
            </div>
            <div className="od-hero-visual">
              <OdooArchitecture />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== PROBLEM ==================== */}
      <Reveal delay={0.06}>
        <section className="od-section">
          <div className="od-container">
            <span className="od-eyebrow">THE PROBLEM</span>
            <h2 className="od-section-title">
              Your ERP should support the operation —{" "}
              <span className="od-title-accent">not force it into a template.</span>
            </h2>
            <div className="od-before-after">
              <div className="od-before">
                <span className="od-ba-label">WITHOUT FIT</span>
                <ul>
                  <li>Disconnected processes across teams and tools</li>
                  <li>Manual handoffs between sales, stock and finance</li>
                  <li>Business rules living in people&apos;s heads</li>
                  <li>Standard configuration fighting the real workflow</li>
                </ul>
              </div>
              <div className="od-after">
                <span className="od-ba-label">WITH ODOO FITTED</span>
                <ul>
                  <li>One system carrying the whole operation</li>
                  <li>Handoffs configured to mirror reality</li>
                  <li>Rules implemented where the work happens</li>
                  <li>Workflows shaped to the teams using them</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== CAPABILITIES ==================== */}
      <Reveal delay={0.08}>
        <section className="od-section od-section--tight">
          <div className="od-container">
            <div className="od-section-header center">
              <span className="od-eyebrow">CAPABILITIES</span>
              <h2 className="od-section-title">Everything Odoo should do for you.</h2>
            </div>
            <ol className="od-cap-list">
              {CAPABILITIES.map((c) => (
                <li key={c.n} className="od-cap">
                  <span className="od-cap-num">{c.n}</span>
                  <div className="od-cap-icon">
                    <c.icon size={24} />
                  </div>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Reveal>

      {/* ==================== ARCHITECTURE ==================== */}
      <Reveal delay={0.08}>
        <section id="od-arch" className="od-section">
          <div className="od-container">
            <span className="od-eyebrow">ARCHITECTURE</span>
            <h2 className="od-section-title">Five modules. One core. Live workflows.</h2>
            <p className="od-section-desc">
              Hover a module to trace its path: configured pipelines
              and custom logic carry each area through the Odoo core
              into the workflows teams run every day.
            </p>
            <div className="od-arch-frame">
              <ArchitectureVisual />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== PROCESS ==================== */}
      <Reveal delay={0.1}>
        <section className="od-section od-section--tight">
          <div className="od-container">
            <div className="od-section-header center">
              <span className="od-eyebrow">HOW WE IMPLEMENT IT</span>
              <h2 className="od-section-title">Understand, configure, customize, operate.</h2>
            </div>
            <div className="od-process">
              {PROCESS.map((s) => (
                <div key={s.n} className="od-process-item">
                  <span className="od-process-number" style={{ color: s.color }}>{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== TECHNOLOGY ==================== */}
      <ServiceTech
        eyebrow="TECHNOLOGY"
        title="The Odoo stack, grouped by job."
        desc="Modules, workflows, integrations, data and custom logic — each group has one clear responsibility."
        groups={TECH_GROUPS}
      />

      {/* ==================== USE CASES ==================== */}
      <Reveal delay={0.08}>
        <section className="od-section od-section--tight">
          <div className="od-container">
            <span className="od-eyebrow">USE CASES</span>
            <h2 className="od-section-title">Operations running on Odoo.</h2>
            <div className="od-usecases">
              {USE_CASES.map((u, i) => (
                <div key={u.title} className="od-usecase">
                  <span className="od-usecase-index">0{i + 1}</span>
                  <h3>{u.title}</h3>
                  <div className="od-flow" aria-hidden="true">
                    {u.flow.map((f, j) => (
                      <span key={f} className="od-flow-step">
                        {f}
                        {j < u.flow.length - 1 && <span className="od-flow-arrow">→</span>}
                      </span>
                    ))}
                  </div>
                  <p>{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== ENGAGEMENT ==================== */}
      <Reveal delay={0.08}>
        <section className="od-section od-section--tight">
          <div className="od-container">
            <div className="od-includes">
              <div>
                <span className="od-eyebrow">ENGAGEMENT</span>
                <h2 className="od-section-title">What the implementation includes.</h2>
              </div>
              <ul className="od-checklist">
                {ENGAGEMENT.map((item) => (
                  <li key={item}>
                    <span className="od-check" aria-hidden="true">✓</span>
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
        title="Odoo, answered directly."
        items={ODOO_FAQ}
      />

      {/* ==================== RELATED ==================== */}
      <RelatedServices
        eyebrow="KEEP EXPLORING"
        title="Related services."
        items={ODOO_RELATED}
      />

      {/* ==================== CTA ==================== */}
      <Reveal delay={0.12}>
        <section className="od-cta-section">
          <div className="od-cta-box">
            <div className="od-cta-inner">
              <span className="od-eyebrow">READY WHEN YOU ARE</span>
              <h2>
                Let&apos;s make Odoo <span className="od-title-accent">fit your operation.</span>
              </h2>
              <p>
                Walk us through how work moves today. We&apos;ll show
                where Odoo fits — and what needs shaping.
              </p>
              <Link to="/contact" className="od-primary-btn">
                <CalendarDays size={18} />
                Discuss Odoo
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
