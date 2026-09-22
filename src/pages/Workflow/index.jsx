/**
 * pages/Workflow/index.jsx
 *
 * Business Workflow Automation service page.
 * Story: orchestration — event → process → decision → action,
 * with exception → human review and monitoring throughout.
 * Accent: amber #F59E0B / #FBBF24.
 */

import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Zap,
  GitBranch,
  UserCheck,
  PlugZap,
  Bell,
  ShieldAlert,
  CalendarClock,
  Activity,
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
import { WorkflowArchitecture } from "../../components/service/Architecture";
import "../../components/service/Architecture.css";

import "./Workflow.css";

const ACCENT = "#F59E0B";
const ACCENT_RGB = "245, 158, 11";
const ACCENT_TEXT = "#B45309";

const CAPABILITIES = [
  { icon: Zap, title: "Triggers", desc: "Events that start work: new records, status changes, schedules and incoming messages." },
  { icon: GitBranch, title: "Business logic", desc: "Conditions, branches and rules that route each case down the right path." },
  { icon: UserCheck, title: "Approvals", desc: "Human sign-off steps with full context, timeouts and escalation when nobody responds." },
  { icon: PlugZap, title: "API actions", desc: "Reads and writes across Odoo, CRMs, sheets, chat and databases inside the flow." },
  { icon: Bell, title: "Notifications", desc: "The right message to the right person at the right step — never noise." },
  { icon: ShieldAlert, title: "Exception handling", desc: "Retries where safe, review queues where not, and no silent failures." },
  { icon: CalendarClock, title: "Scheduling", desc: "Recurring runs, follow-up timing and SLAs the workflow enforces itself." },
  { icon: Activity, title: "Monitoring", desc: "Every run visible: what fired, what succeeded, what needs attention." },
];

const PROCESS = [
  {
    n: "01",
    color: "#3B82F6",
    title: "Discover",
    desc: "We map repetitive operations, handoffs and bottlenecks to find the workflows worth automating first.",
  },
  {
    n: "02",
    color: "#8B7CFF",
    title: "Design",
    desc: "Triggers, logic, approvals and exception paths are designed around the real process — the automation blueprint.",
  },
  {
    n: "03",
    color: "#22D3EE",
    title: "Build",
    desc: "Production workflows are built in n8n with APIs, webhooks and orchestration connecting every system involved.",
  },
  {
    n: "04",
    color: "#F59E0B",
    title: "Deploy",
    desc: "Launch happens safely: tested against real scenarios, with monitoring and safeguards from day one.",
  },
  {
    n: "05",
    color: "var(--accent-primary)",
    title: "Optimize",
    desc: "Runs are watched, failures reviewed and flows improved as the business and its edge cases evolve.",
  },
];

const TECH_GROUPS = [
  {
    role: "Orchestration",
    items: ["n8n", "Event triggers", "Conditional logic", "Schedules"],
  },
  {
    role: "Business systems",
    items: ["Odoo ERP", "CRMs", "Databases", "Google Sheets", "Slack", "Email"],
  },
  {
    role: "Execution",
    items: ["Approvals", "Notifications", "Record updates", "Follow-ups"],
  },
  {
    role: "Reliability",
    items: ["Failure handling", "Monitoring", "Exception paths"],
  },
];

const USE_CASES = [
  {
    title: "New request to resolved record",
    flow: ["Request arrives", "Validated & enriched", "ERP updated", "Team notified"],
    desc: "Incoming requests travel from inbox to system of record with validation, enrichment and notifications handled along the way.",
  },
  {
    title: "Approvals without chasing",
    flow: ["Approval needed", "Reviewer notified", "Decision recorded", "Flow continues"],
    desc: "Quotes, expenses and exceptions route to the right approver with context — and escalate instead of stalling.",
  },
  {
    title: "Systems kept in sync",
    flow: ["Change detected", "Records matched", "All systems updated"],
    desc: "A change in one tool propagates to the others on a schedule or trigger your team controls.",
  },
  {
    title: "Follow-ups on rails",
    flow: ["Deadline set", "Reminder sent", "Overdue escalated"],
    desc: "Time-based follow-ups fire automatically, with overdue cases routed to a person instead of forgotten.",
  },
];

const ENGAGEMENT = [
  "Workflow discovery — repetitive operations, handoffs and bottlenecks",
  "Automation architecture — triggers, logic, approvals and exception paths",
  "Implementation in n8n with APIs, webhooks and orchestration",
  "Integration with CRMs, sheets, chat, ERP, databases and email",
  "Testing against real operating scenarios",
  "Deployment with monitoring and operational safeguards",
  "Optimization — watched runs, reviewed failures, evolving flows",
  "Handover notes your team can maintain",
];

const WF_FAQ = [
  {
    q: "Which workflows should be automated first?",
    a: "Repetitive, rule-based work with clear triggers — data entry, notifications, follow-ups, approvals and record sync. Discovery ranks candidates by frequency and failure cost.",
  },
  {
    q: "Do you use n8n?",
    a: "Yes. Production workflows are typically built in n8n with APIs, webhooks and process orchestration — it gives self-hosted control with visibility into every run.",
  },
  {
    q: "What happens if a workflow fails?",
    a: "Failures are handled by design: safe retries, exception queues for the rest, and monitoring so nothing fails silently. Every run leaves a trace.",
  },
  {
    q: "Can humans approve certain steps?",
    a: "Yes — approvals are first-class steps with context, timeouts and escalation. The workflow waits where judgment is needed and flows where it isn't.",
  },
  {
    q: "Do we need to replace existing systems?",
    a: "No. Workflows connect your CRMs, sheets, chat tools, ERP systems, databases and email — automation wraps around the tools you already use.",
  },
];

const WF_RELATED = [
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

/* ── TECHNICAL VISUAL: trigger → workflow → decision → action + exception ── */

const WF_PATHS = [
  { id: "happy", label: "Standard path", desc: "Trigger fires, the workflow processes, the decision passes, and the action executes across connected systems." },
  { id: "exception", label: "Exception path", desc: "When a check fails or a case doesn't fit, the run diverts to human review — then rejoins or closes with a record." },
  { id: "monitor", label: "Monitoring", desc: "Every run emits status: what fired, what succeeded, how long it took, and what needs attention." },
];

function TechnicalVisual() {
  const [active, setActive] = useState("happy");
  const dim = (id) => (active === id ? "" : "wf-dim");

  return (
    <div className="wf-arch-wrap">
      <div className="wf-arch-legend" role="tablist" aria-label="Workflow paths">
        {WF_PATHS.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={active === p.id}
            className={`wf-arch-tab ${active === p.id ? "wf-arch-tab--active" : ""}`}
            onClick={() => setActive(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <svg
        viewBox="0 0 900 400"
        className="wf-arch-svg"
        role="img"
        aria-label="Workflow orchestration: trigger leads to workflow, decision, action and monitored runs, with exceptions routing to human review"
      >
        <g stroke="var(--border-strong)" strokeWidth="2">
          <line x1="150" y1="170" x2="210" y2="170" className={dim("happy")} />
          <line x1="350" y1="170" x2="410" y2="170" className={dim("happy")} />
          <line x1="550" y1="170" x2="610" y2="170" className={dim("happy")} />
          <line x1="480" y1="222" x2="480" y2="300" strokeDasharray="6 6" className={dim("exception")} />
          <line x1="480" y1="300" x2="240" y2="300" strokeDasharray="6 6" className={dim("exception")} />
          <line x1="240" y1="300" x2="240" y2="230" strokeDasharray="6 6" className={dim("exception")} />
          <line x1="760" y1="222" x2="760" y2="300" strokeDasharray="4 6" className={dim("monitor")} />
          <line x1="760" y1="300" x2="640" y2="300" strokeDasharray="4 6" className={dim("monitor")} />
        </g>
        <g fontFamily="'Space Grotesk','Plus Jakarta Sans',sans-serif">
          <rect x="40" y="140" width="110" height="60" rx="12" className={`wf-node ${dim("happy")}`} />
          <text x="95" y="166" textAnchor="middle" className="wf-node-text wf-node-text--sm">TRIGGER</text>
          <text x="95" y="184" textAnchor="middle" className="wf-node-sub">event · time</text>

          <rect x="210" y="140" width="140" height="60" rx="12" className={`wf-node ${dim("happy")}`} />
          <text x="280" y="166" textAnchor="middle" className="wf-node-text wf-node-text--sm">WORKFLOW</text>
          <text x="280" y="184" textAnchor="middle" className="wf-node-sub">n8n steps</text>

          <rect x="410" y="130" width="140" height="80" rx="14" fill={ACCENT} />
          <text x="480" y="166" textAnchor="middle" className="wf-node-text wf-node-text--on-accent wf-node-text--sm">DECISION</text>
          <text x="480" y="186" textAnchor="middle" className="wf-node-sub wf-node-sub--on-accent">rules · approval</text>

          <rect x="610" y="140" width="150" height="60" rx="12" fill="#22D3EE" className={dim("happy")} />
          <text x="685" y="166" textAnchor="middle" className="wf-node-text wf-node-text--sm wf-node-text--on-accent">ACTION</text>
          <text x="685" y="184" textAnchor="middle" className="wf-node-sub wf-node-sub--on-accent">sync · notify</text>

          <rect x="160" y="300" width="160" height="56" rx="12" className={`wf-node wf-node--violet ${dim("exception")}`} />
          <text x="240" y="324" textAnchor="middle" className="wf-node-text wf-node-text--sm">HUMAN REVIEW</text>
          <text x="240" y="342" textAnchor="middle" className="wf-node-sub">exception</text>

          <rect x="480" y="300" width="160" height="56" rx="12" className={`wf-node ${dim("monitor")}`} />
          <text x="560" y="324" textAnchor="middle" className="wf-node-text wf-node-text--sm">RUN LOG</text>
          <text x="560" y="342" textAnchor="middle" className="wf-node-sub">status · timing</text>
        </g>
      </svg>
      <p className="wf-arch-caption">
        {WF_PATHS.find((p) => p.id === active)?.desc}
      </p>
    </div>
  );
}

export default function WorkflowPage() {
  return (
    <div
      className="wf-page"
      style={{
        "--svc": ACCENT,
        "--svc-rgb": ACCENT_RGB,
        "--svc-text": ACCENT_TEXT,
      }}
    >
      <Meta
        title="Business Workflow Automation"
        description="Intelligent business automation systems that reduce operational friction — triggers, logic, approvals, actions and monitoring built in n8n."
        canonical="/workflow-automation"
        keywords="workflow automation, business automation, n8n workflows, process automation, approval workflows, operations automation"
      />

      <ServiceSchema
        name="Business Workflow Automation"
        description="Workflow automation services: triggers, business logic, approvals, API actions and monitored execution across business tools."
        url="/workflow-automation"
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/#services" },
          { name: "Workflow Automation", href: "/workflow-automation" },
        ]}
      />

      {/* ==================== HERO ==================== */}
      <Reveal>
        <section className="wf-hero">
          <div className="wf-hero-inner">
            <div className="wf-hero-copy">
              <span className="wf-eyebrow">
                <span className="wf-eyebrow-dot" />
                BUSINESS WORKFLOW AUTOMATION
              </span>
              <h1 className="wf-title">
                Automate business operations,
                <br />
                <span className="wf-title-accent">not just tasks.</span>
              </h1>
              <p className="wf-hero-desc">
                We design intelligent business automation systems
                that reduce operational friction, streamline
                workflows and help teams move faster with fewer
                manual processes.
              </p>
              <div className="wf-hero-actions">
                <Link to="/contact" className="wf-primary-btn">
                  <CalendarDays size={18} />
                  Discuss workflow automation
                  <ArrowRight size={16} />
                </Link>
                <a href="#wf-arch" className="wf-secondary-btn">
                  See how it works
                </a>
              </div>
            </div>
            <div className="wf-hero-visual">
              <WorkflowArchitecture />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== PROBLEM ==================== */}
      <Reveal delay={0.06}>
        <section className="wf-section">
          <div className="wf-container">
            <span className="wf-eyebrow">THE PROBLEM</span>
            <h2 className="wf-section-title">
              Manual handoffs are <span className="wf-title-accent">where work slows down.</span>
            </h2>
            <div className="wf-friction">
              <div className="wf-friction-item">
                <h3>Copy / paste</h3>
                <p>The same information retyped between tools, with a fresh chance of error every time.</p>
              </div>
              <div className="wf-friction-item">
                <h3>Approvals</h3>
                <p>Decisions wait in inboxes and chats instead of routing to the right person with context.</p>
              </div>
              <div className="wf-friction-item">
                <h3>Notifications</h3>
                <p>Status updates assembled by hand — late, inconsistent, or forgotten entirely.</p>
              </div>
              <div className="wf-friction-item">
                <h3>Data entry</h3>
                <p>Records created and updated manually long after the work already happened.</p>
              </div>
              <div className="wf-friction-item wf-friction-item--wide">
                <h3>Disconnected applications</h3>
                <p>Each tool holds part of the process and nobody owns the gaps between them — so work stalls in the seams.</p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== CAPABILITIES ==================== */}
      <Reveal delay={0.08}>
        <section className="wf-section wf-section--tight">
          <div className="wf-container">
            <div className="wf-section-header center">
              <span className="wf-eyebrow">CAPABILITIES</span>
              <h2 className="wf-section-title">Every part of an orchestrated flow.</h2>
            </div>
            <div className="wf-cap-grid">
              {CAPABILITIES.map((c) => (
                <div key={c.title} className="wf-cap">
                  <div className="wf-cap-icon">
                    <c.icon size={24} />
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== TECHNICAL VISUAL ==================== */}
      <Reveal delay={0.08}>
        <section id="wf-arch" className="wf-section">
          <div className="wf-container">
            <span className="wf-eyebrow">ORCHESTRATION</span>
            <h2 className="wf-section-title">Trigger, decide, act — and handle the rest.</h2>
            <p className="wf-section-desc">
              Hover a path to trace it: the standard route from
              trigger to action, the exception route to human
              review, and the monitoring that watches every run.
            </p>
            <div className="wf-arch-frame">
              <TechnicalVisual />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== PROCESS ==================== */}
      <Reveal delay={0.1}>
        <section className="wf-section wf-section--tight">
          <div className="wf-container">
            <div className="wf-section-header center">
              <span className="wf-eyebrow">HOW WE IMPLEMENT IT</span>
              <h2 className="wf-section-title">Discover to optimize, in five steps.</h2>
            </div>
            <div className="wf-process">
              {PROCESS.map((s) => (
                <div key={s.n} className="wf-process-item">
                  <span className="wf-process-number" style={{ color: s.color }}>{s.n}</span>
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
        title="Orchestration around your tools."
        desc="Grouped by role — orchestration, connected systems, execution and reliability — so each part's job stays visible."
        groups={TECH_GROUPS}
      />

      {/* ==================== USE CASES ==================== */}
      <Reveal delay={0.08}>
        <section className="wf-section wf-section--tight">
          <div className="wf-container">
            <span className="wf-eyebrow">USE CASES</span>
            <h2 className="wf-section-title">Flows that run themselves.</h2>
            <div className="wf-usecases">
              {USE_CASES.map((u, i) => (
                <div key={u.title} className="wf-usecase">
                  <span className="wf-usecase-index">0{i + 1}</span>
                  <h3>{u.title}</h3>
                  <div className="wf-flow" aria-hidden="true">
                    {u.flow.map((f, j) => (
                      <span key={f} className="wf-flow-step">
                        {f}
                        {j < u.flow.length - 1 && <span className="wf-flow-arrow">→</span>}
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
        <section className="wf-section wf-section--tight">
          <div className="wf-container">
            <div className="wf-includes">
              <div>
                <span className="wf-eyebrow">ENGAGEMENT</span>
                <h2 className="wf-section-title">What the implementation includes.</h2>
              </div>
              <ul className="wf-checklist">
                {ENGAGEMENT.map((item) => (
                  <li key={item}>
                    <span className="wf-check" aria-hidden="true">✓</span>
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
        title="Workflow automation, answered directly."
        items={WF_FAQ}
      />

      {/* ==================== RELATED ==================== */}
      <RelatedServices
        eyebrow="KEEP EXPLORING"
        title="Related services."
        items={WF_RELATED}
      />

      {/* ==================== CTA ==================== */}
      <Reveal delay={0.12}>
        <section className="wf-cta-section">
          <div className="wf-cta-box">
            <div className="wf-cta-inner">
              <span className="wf-eyebrow">READY WHEN YOU ARE</span>
              <h2>
                Let&apos;s remove <span className="wf-title-accent">the friction.</span>
              </h2>
              <p>
                Show us where handoffs slow you down. We&apos;ll map
                the workflows worth orchestrating first.
              </p>
              <Link to="/contact" className="wf-primary-btn">
                <CalendarDays size={18} />
                Design a workflow
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
