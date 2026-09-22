/**
 * pages/AIAutomation/index.jsx
 *
 * AI Automation service page.
 * Story: agents + intelligent workflows inside real business processes.
 * Accent: cyan #22D3EE / teal #2DD4BF.
 */

import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Bot,
  PlugZap,
  FileSearch,
  ListTodo,
  UserCheck,
  Workflow,
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
import { AIAgentArchitecture } from "../../components/service/Architecture";
import "../../components/service/Architecture.css";

import "./AIAutomation.css";

const ACCENT = "#22D3EE";
const ACCENT_RGB = "34, 211, 238";
const ACCENT_TEXT = "#0891B2";
const TEAL = "#2DD4BF";

const CAPABILITIES = [
  {
    icon: Bot,
    title: "AI agents",
    desc: "Agents that understand requests, make bounded decisions and execute tasks inside your tools — scoped to jobs you define.",
    span: true,
  },
  {
    icon: PlugZap,
    title: "Tool calling & integrations",
    desc: "Agents act through APIs and workflows: updating records, triggering flows and moving information between systems.",
  },
  {
    icon: FileSearch,
    title: "Document workflows",
    desc: "Capture, extraction and validation turn incoming files into structured values the rest of the operation can use.",
  },
  {
    icon: ListTodo,
    title: "Task automation",
    desc: "Follow-ups, notifications, data entry and routine administration handled consistently, every time.",
  },
  {
    icon: UserCheck,
    title: "Human-in-the-loop",
    desc: "Approval checkpoints where judgment matters. People decide; the system prepares everything around the decision.",
  },
  {
    icon: Workflow,
    title: "Workflow orchestration",
    desc: "Agents run as steps inside larger n8n workflows — with retries, branches and exception paths around them.",
  },
];

const PROCESS = [
  {
    n: "01",
    color: "#22D3EE",
    title: "Identify",
    desc: "We find the repeatable work: recurring requests, decisions and manual system actions worth handing over.",
  },
  {
    n: "02",
    color: "#8B7CFF",
    title: "Ground",
    desc: "The agent gets what it needs — context from your data, tools it may call, and rules it must follow.",
  },
  {
    n: "03",
    color: "#F59E0B",
    title: "Act",
    desc: "The agent executes the appropriate workflow action: updating systems, sending responses, moving work forward.",
  },
  {
    n: "04",
    color: "var(--accent-primary)",
    title: "Review",
    desc: "A human checkpoint stands where appropriate. Approved work continues; exceptions come back with context.",
  },
];

const TECH_GROUPS = [
  {
    role: "AI / Models",
    items: ["LLM agents", "Classification", "Summarization", "Decision support"],
  },
  {
    role: "Tools",
    items: ["API actions", "Tool calling", "n8n steps", "Notifications"],
  },
  {
    role: "Data / Context",
    items: ["Documents", "Databases", "Email", "Google Sheets", "Slack"],
  },
  {
    role: "Integrations",
    items: ["Odoo ERP", "CRM systems", "Webhooks", "REST APIs"],
  },
  {
    role: "Workflow",
    items: ["Approvals", "Exception paths", "Monitoring", "Review queues"],
  },
];

const USE_CASES = [
  {
    title: "Recurring internal requests",
    flow: ["Request arrives", "Agent classifies & prepares", "Structured response sent"],
    desc: "Repeat questions and standard requests get consistent, grounded answers — with handoff to a person when the case doesn't fit.",
  },
  {
    title: "Document intake to record",
    flow: ["File captured", "Fields extracted & checked", "Record created in ERP"],
    desc: "Incoming documents become structured records in Odoo or your CRM, validated before anything is written.",
  },
  {
    title: "Follow-ups that never slip",
    flow: ["Event detected", "Agent drafts & sends", "Human reviews exceptions"],
    desc: "Quotes, reminders and status updates go out on time, while anything unusual waits for a person.",
  },
  {
    title: "Reporting without the grind",
    flow: ["Data collected", "AI summarizes", "Report delivered"],
    desc: "Operational data from your systems becomes readable summaries and reports on a schedule your team sets.",
  },
];

const ENGAGEMENT = [
  "Discovery — where repeatable work and decisions live today",
  "Agent design — scope, context sources, tools and boundaries",
  "Integration — connections to Odoo, CRM, n8n and everyday tools",
  "Workflow implementation — agents running inside monitored flows",
  "Testing — edge cases, failure paths and quality checks",
  "Monitoring — visibility into what agents do and where they stop",
  "Human review — checkpoints designed around judgment, not habit",
];

const AI_FAQ = [
  {
    q: "Where should AI be used first?",
    a: "Where work repeats with clear patterns: recurring requests, document handling, follow-ups and structured responses. We look for high-frequency tasks with verifiable outputs — those pay back fastest and fail safest.",
  },
  {
    q: "Can AI work with our existing systems?",
    a: "Yes. Agents act through the tools you already run — Odoo, CRMs, n8n workflows, databases, email and chat — via APIs and webhooks. Nothing needs replacing for AI to start helping.",
  },
  {
    q: "How do you handle human approval?",
    a: "Approval checkpoints are designed into the workflow wherever judgment matters. The agent prepares everything — context, draft, recommendation — and a person approves with one action.",
  },
  {
    q: "What happens when an agent cannot complete a task?",
    a: "It stops instead of guessing. The case routes to a human with everything the agent gathered so far, so no work is lost and the failure is visible.",
  },
  {
    q: "How do agents stay grounded in our reality?",
    a: "They work from your data and documents, call only the tools you allow, and follow rules defined during design. Anything outside those boundaries goes to a person.",
  },
];

const AI_RELATED = [
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
    title: "Data & Document Automation",
    desc: "Process, route and sync documents and data automatically.",
    href: "/data-document-automation",
    accent: "#F97316",
  },
];

/* ── ARCHITECTURE: interactive path highlighting ── */

const ARCH_PATHS = [
  { id: "tools", label: "Tools path", desc: "The agent calls approved APIs and workflow steps to change things in real systems." },
  { id: "context", label: "Context path", desc: "Documents, records and business rules ground every decision in your reality." },
  { id: "action", label: "Execution path", desc: "Decisions become workflow actions — with a human checkpoint where judgment matters." },
];

function ArchitectureVisual() {
  const [active, setActive] = useState("tools");
  const dim = (id) => (active === id ? "" : "ai2-dim");

  return (
    <div className="ai2-arch-wrap">
      <div className="ai2-arch-legend" role="tablist" aria-label="Architecture paths">
        {ARCH_PATHS.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={active === p.id}
            className={`ai2-arch-tab ${active === p.id ? "ai2-arch-tab--active" : ""}`}
            onClick={() => setActive(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <svg
        viewBox="0 0 900 400"
        className="ai2-arch-svg"
        role="img"
        aria-label="Agent architecture: user or event flows through context into an AI agent connected to tools, data and rules, producing actions checked by a human"
      >
        <g stroke="var(--border-strong)" strokeWidth="2">
          <line x1="110" y1="200" x2="230" y2="200" className={dim("context")} />
          <line x1="370" y1="200" x2="440" y2="200" className={dim("context")} />
          <line x1="510" y1="130" x2="640" y2="120" className={dim("tools")} />
          <line x1="510" y1="200" x2="640" y2="200" className={dim("context")} />
          <line x1="510" y1="270" x2="640" y2="280" className={dim("context")} />
          <line x1="780" y1="200" x2="800" y2="200" className={dim("action")} />
          <line x1="440" y1="260" x2="440" y2="330" strokeDasharray="6 6" className={dim("action")} />
          <line x1="440" y1="330" x2="760" y2="330" strokeDasharray="6 6" className={dim("action")} />
          <line x1="760" y1="330" x2="760" y2="256" strokeDasharray="6 6" className={dim("action")} />
        </g>
        <g fontFamily="'Space Grotesk','Plus Jakarta Sans',sans-serif">
          <rect x="20" y="170" width="90" height="60" rx="12" className={`ai2-node ${dim("context")}`} />
          <text x="65" y="196" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">USER /</text>
          <text x="65" y="214" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">EVENT</text>

          <rect x="230" y="170" width="140" height="60" rx="12" className={`ai2-node ${dim("context")}`} />
          <text x="300" y="196" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">CONTEXT</text>
          <text x="300" y="214" textAnchor="middle" className="ai2-node-sub">docs · history</text>

          <rect x="370" y="130" width="140" height="140" rx="16" fill={ACCENT} />
          <text x="440" y="192" textAnchor="middle" className="ai2-node-text ai2-node-text--on-accent">AI AGENT</text>
          <text x="440" y="212" textAnchor="middle" className="ai2-node-sub ai2-node-sub--on-accent">bounded</text>
          <text x="440" y="228" textAnchor="middle" className="ai2-node-sub ai2-node-sub--on-accent">grounded</text>

          <rect x="640" y="92" width="140" height="56" rx="12" className={`ai2-node ${dim("tools")}`} />
          <text x="710" y="115" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">TOOLS</text>
          <text x="710" y="133" textAnchor="middle" className="ai2-node-sub">APIs · flows</text>
          <rect x="640" y="172" width="140" height="56" rx="12" className={`ai2-node ${dim("context")}`} />
          <text x="710" y="195" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">DATA</text>
          <text x="710" y="213" textAnchor="middle" className="ai2-node-sub">records</text>
          <rect x="640" y="252" width="140" height="56" rx="12" className={`ai2-node ${dim("context")}`} />
          <text x="710" y="275" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">RULES</text>
          <text x="710" y="293" textAnchor="middle" className="ai2-node-sub">boundaries</text>

          <rect x="800" y="168" width="80" height="64" rx="12" fill={TEAL} className={dim("action")} />
          <text x="840" y="195" textAnchor="middle" className="ai2-node-text ai2-node-text--sm ai2-node-text--on-accent">ACTION</text>

          <rect x="370" y="318" width="140" height="48" rx="12" className={`ai2-node ai2-node--review ${dim("action")}`} />
          <text x="440" y="347" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">HUMAN CHECK</text>
        </g>
      </svg>
      <p className="ai2-arch-caption">
        {ARCH_PATHS.find((p) => p.id === active)?.desc}
      </p>
    </div>
  );
}

export default function AIAutomationPage() {
  return (
    <div
      className="ai2-page"
      style={{
        "--svc": ACCENT,
        "--svc-rgb": ACCENT_RGB,
        "--svc-text": ACCENT_TEXT,
      }}
    >
      <Meta
        title="AI Automation Services"
        description="Build AI agents and intelligent workflows that work with the systems your team already uses — handling repeatable tasks with people in the loop where judgment matters."
        canonical="/ai-automation"
        keywords="AI automation, AI agents, business automation, intelligent workflows, AI automation services, human in the loop"
      />

      <ServiceSchema
        name="AI Automation"
        description="AI automation services that help businesses automate repetitive operations, improve workflows, and scale efficiently."
        url="/ai-automation"
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/#services" },
          { name: "AI Automation", href: "/ai-automation" },
        ]}
      />

      {/* ==================== HERO ==================== */}
      <Reveal>
        <section className="ai2-hero">
          <div className="ai2-hero-inner">
            <div className="ai2-hero-copy">
              <span className="ai2-eyebrow">
                <span className="ai2-eyebrow-dot" />
                AI AUTOMATION
              </span>
              <h1 className="ai2-title">
                Put AI to work
                <br />
                <span className="ai2-title-accent">inside the operation.</span>
              </h1>
              <p className="ai2-hero-desc">
                Build AI agents and intelligent workflows that work
                with the systems your team already uses, handle
                repeatable tasks and keep people in the loop where
                judgment matters.
              </p>
              <div className="ai2-hero-actions">
                <Link to="/contact" className="ai2-primary-btn">
                  <CalendarDays size={18} />
                  Discuss AI automation
                  <ArrowRight size={16} />
                </Link>
                <a href="#ai-arch" className="ai2-secondary-btn">
                  See how it works
                </a>
              </div>
            </div>
            <div className="ai2-hero-visual">
              <AIAgentArchitecture />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== PROBLEM ==================== */}
      <Reveal delay={0.06}>
        <section className="ai2-section">
          <div className="ai2-container">
            <span className="ai2-eyebrow">THE PROBLEM</span>
            <h2 className="ai2-section-title">
              AI is useful <span className="ai2-title-accent">when it fits the workflow.</span>
            </h2>
            <ul className="ai2-problem-list">
              <li><strong>Repetitive internal requests</strong> — the same questions arrive daily and someone types the same answers.</li>
              <li><strong>Document handling</strong> — files arrive faster than anyone can read, extract and file them.</li>
              <li><strong>Recurring decisions</strong> — routine approvals and classifications wait on busy people.</li>
              <li><strong>Structured responses</strong> — quotes, confirmations and follow-ups assembled by hand each time.</li>
              <li><strong>Manual system actions</strong> — copying decisions into tools, updating records, sending the next message.</li>
            </ul>
          </div>
        </section>
      </Reveal>

      {/* ==================== CAPABILITIES ==================== */}
      <Reveal delay={0.08}>
        <section className="ai2-section ai2-section--tight">
          <div className="ai2-container">
            <div className="ai2-section-header center">
              <span className="ai2-eyebrow">CAPABILITIES</span>
              <h2 className="ai2-section-title">What the agents actually do.</h2>
            </div>
            <div className="ai2-cap-grid">
              {CAPABILITIES.map((c) => (
                <div
                  key={c.title}
                  className={`ai2-cap ${c.span ? "ai2-cap--wide" : ""}`}
                >
                  <div className="ai2-cap-icon">
                    <c.icon size={26} />
                  </div>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== ARCHITECTURE ==================== */}
      <Reveal delay={0.08}>
        <section id="ai-arch" className="ai2-section">
          <div className="ai2-container">
            <span className="ai2-eyebrow">ARCHITECTURE</span>
            <h2 className="ai2-section-title">Grounded agents, visible paths.</h2>
            <p className="ai2-section-desc">
              Every agent sits between context and action. Hover a
              path to trace it: tools the agent may call, context it
              reasons over, and the execution route to a human check.
            </p>
            <div className="ai2-arch-frame">
              <ArchitectureVisual />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== PROCESS ==================== */}
      <Reveal delay={0.1}>
        <section className="ai2-section ai2-section--tight">
          <div className="ai2-container">
            <div className="ai2-section-header center">
              <span className="ai2-eyebrow">HOW WE IMPLEMENT IT</span>
              <h2 className="ai2-section-title">Identify, ground, act, review.</h2>
            </div>
            <div className="ai2-process">
              {PROCESS.map((s) => (
                <div key={s.n} className="ai2-process-item">
                  <span className="ai2-process-number" style={{ color: s.color }}>{s.n}</span>
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
        title="AI connected to real systems."
        desc="Agents are only useful inside the operation — grouped here by role, from the models that reason to the systems they act on."
        groups={TECH_GROUPS}
      />

      {/* ==================== USE CASES ==================== */}
      <Reveal delay={0.08}>
        <section className="ai2-section ai2-section--tight">
          <div className="ai2-container">
            <span className="ai2-eyebrow">USE CASES</span>
            <h2 className="ai2-section-title">Repeatable work, handled.</h2>
            <div className="ai2-usecases">
              {USE_CASES.map((u, i) => (
                <div key={u.title} className="ai2-usecase">
                  <span className="ai2-usecase-index">0{i + 1}</span>
                  <h3>{u.title}</h3>
                  <div className="ai2-flow" aria-hidden="true">
                    {u.flow.map((f, j) => (
                      <span key={f} className="ai2-flow-step">
                        {f}
                        {j < u.flow.length - 1 && <span className="ai2-flow-arrow">→</span>}
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
        <section className="ai2-section ai2-section--tight">
          <div className="ai2-container">
            <div className="ai2-includes">
              <div>
                <span className="ai2-eyebrow">ENGAGEMENT</span>
                <h2 className="ai2-section-title">What the implementation includes.</h2>
              </div>
              <ul className="ai2-checklist">
                {ENGAGEMENT.map((item) => (
                  <li key={item}>
                    <span className="ai2-check" aria-hidden="true">✓</span>
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
        title="AI automation, answered directly."
        items={AI_FAQ}
      />

      {/* ==================== RELATED ==================== */}
      <RelatedServices
        eyebrow="KEEP EXPLORING"
        title="Related services."
        items={AI_RELATED}
      />

      {/* ==================== CTA ==================== */}
      <Reveal delay={0.12}>
        <section className="ai2-cta-section">
          <div className="ai2-cta-box">
            <div className="ai2-cta-inner">
              <span className="ai2-eyebrow">READY WHEN YOU ARE</span>
              <h2>
                Let&apos;s put AI <span className="ai2-title-accent">where it earns its place.</span>
              </h2>
              <p>
                Tell us where repeatable work slows your team down.
                We&apos;ll point to where agents fit — and where they don&apos;t.
              </p>
              <Link to="/contact" className="ai2-primary-btn">
                <CalendarDays size={18} />
                Discuss AI automation
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
