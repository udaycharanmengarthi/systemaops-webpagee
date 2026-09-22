/**
 * pages/DevOpsObservability/index.jsx
 *
 * DevOps & Observability service page.
 * Story: deploy → observe → detect → respond.
 */

import {
  ArrowRight,
  CalendarDays,
  Rocket,
  MonitorDot,
  ScrollText,
  Gauge,
  HeartPulse,
  BellRing,
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

import "./DevOpsObservability.css";

const ACCENT = "#EC4899";
const ACCENT_RGB = "236, 72, 153";
const ACCENT_TEXT = "#BE185D";

const CAPABILITIES = [
  {
    icon: Rocket,
    title: "Deployment visibility",
    desc: "See what is running, which version went out, and when — so a new problem can be traced back to a specific change.",
  },
  {
    icon: MonitorDot,
    title: "Application monitoring",
    desc: "Runtime behavior of applications and services watched continuously, with the signals that matter surfaced first.",
  },
  {
    icon: ScrollText,
    title: "Logs",
    desc: "Application and workflow logs collected in one place, searchable when something needs explaining.",
  },
  {
    icon: Gauge,
    title: "Metrics",
    desc: "Key numbers tracked over time — throughput, errors, durations — so unusual behavior stands out early.",
  },
  {
    icon: HeartPulse,
    title: "Health checks",
    desc: "Simple, regular checks that answer one question: is this system doing what it should right now?",
  },
  {
    icon: BellRing,
    title: "Alerts with context",
    desc: "Notifications that arrive with the relevant logs, metrics and recent changes attached — not just a red light.",
  },
];

const PROCESS = [
  {
    n: "01",
    color: "#EC4899",
    title: "Instrument",
    desc: "We expose the signals that matter: logs, metrics and health endpoints on the systems being watched.",
  },
  {
    n: "02",
    color: "#3B82F6",
    title: "Observe",
    desc: "Metrics, logs and health information are collected where the team can see them together.",
  },
  {
    n: "03",
    color: "#8B7CFF",
    title: "Detect",
    desc: "Thresholds and checks identify unusual behavior or outright failures as they happen.",
  },
  {
    n: "04",
    color: "var(--accent-primary)",
    title: "Respond",
    desc: "Alerts arrive with enough context — what changed, what broke, where to look — to act on.",
  },
];

const USE_CASES = [
  {
    tag: "Production",
    title: "Application health monitoring",
    desc: "Business applications and customer-facing tools watched continuously, with health checks confirming they behave as expected.",
  },
  {
    tag: "Automation",
    title: "Workflow monitoring",
    desc: "n8n and automation workflows observed for failures, stuck runs and unusual durations — before users notice.",
  },
  {
    tag: "Connectivity",
    title: "API & integration visibility",
    desc: "The integrations from the rest of the stack stay observable: call volumes, errors and latency trends in view.",
  },
  {
    tag: "Background work",
    title: "Background worker monitoring",
    desc: "Queues, schedulers and background jobs checked for progress and failure, with alerts that carry the job context.",
  },
];

const INCLUDES = [
  "Signal inventory — what gets logged, measured and checked",
  "Health endpoints on applications and key workflows",
  "Log collection with searchable, centralized access",
  "Alert rules with thresholds tuned to real behavior",
  "Incident context — recent changes attached to every alert",
  "Handover notes your team can maintain",
];

const DO_TECH = [
  {
    role: "Watched systems",
    items: ["Applications", "Services", "Databases", "Workers", "n8n workflows", "API integrations"],
  },
  {
    role: "Signals",
    items: ["Logs", "Metrics", "Health checks", "Deployment events"],
  },
  {
    role: "Detection",
    items: ["Thresholds", "Failure checks", "Unusual-behavior review"],
  },
  {
    role: "Response",
    items: ["Contextual alerts", "Incident context", "Handover notes"],
  },
];

const DO_WORK_IDS = ["workflow", "integrations", "ai"];

const DO_FAQ = [
  {
    q: "Does this replace our hosting or deployment process?",
    a: "No. Observability sits alongside how you already deploy — it adds visibility, health signals and alerts over your existing applications, services and workflows.",
  },
  {
    q: "What signals do you actually collect?",
    a: "Logs, metrics, health-check status and deployment events — scoped to what your team needs to understand behavior and find failures, not everything measurable.",
  },
  {
    q: "How do you avoid alert fatigue?",
    a: "Thresholds are tuned to real behavior, and every alert carries context — the relevant logs, metrics and recent changes — so notifications mean something actionable.",
  },
  {
    q: "What happens after an alert fires?",
    a: "The team gets the failure plus its context: what changed recently, where to look, and which system is affected. Responses feed back into better checks.",
  },
  {
    q: "Is this only for large engineering teams?",
    a: "No. Smaller teams start with the critical systems — the workflows and applications the business depends on — and expand coverage as needed.",
  },
];

const DO_RELATED = [
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
  {
    title: "AI Automation & Agents",
    desc: "AI agents and intelligent workflows that remove manual work.",
    href: "/ai-automation",
    accent: "#22D3EE",
  },
];

function ObservabilityLoop() {
  const dur = "8s";
  const steps = [
    { t: "DEPLOY", y: 20, delay: "0s" },
    { t: "RUNTIME", y: 92, delay: "-0.9s" },
    { t: "SIGNALS", y: 164, tall: true, delay: "-1.9s" },
    { t: "DETECT", s: "unusual behavior", y: 272, delay: "-3.4s" },
    { t: "ALERT", s: "notify team", y: 344, delay: "-4.4s" },
    { t: "RESPOND", y: 416, delay: "-5.4s" },
    { t: "IMPROVE", y: 488, delay: "-6.4s" },
  ];
  const links = [
    { id: "do-p0", d: "M240 68 L240 92", begin: "0.4s" },
    { id: "do-p1", d: "M240 140 L240 164", begin: "1.2s" },
    { id: "do-p2", d: "M240 260 L240 272", begin: "2.6s" },
    { id: "do-p3", d: "M240 320 L240 344", begin: "3.6s" },
    { id: "do-p4", d: "M240 392 L240 416", begin: "4.6s" },
    { id: "do-p5", d: "M240 464 L240 488", begin: "5.6s" },
    { id: "do-p6", d: "M330 512 L330 200 L240 140", begin: "6.6s" },
  ];
  return (
    <svg
      viewBox="0 0 480 560"
      className="do-hero-svg"
      role="img"
      aria-label="Observability loop: deploy flows to runtime, signals from metrics, logs and health feed detection, alerts notify the team, response leads to improvement which loops back"
    >
      <defs>
        {links.map((l) => (
          <path key={l.id} id={l.id} d={l.d} fill="none" />
        ))}
      </defs>
      <g className="do-flow-line" strokeWidth="2">
        <line x1="240" y1="68" x2="240" y2="92" />
        <line x1="240" y1="140" x2="240" y2="164" />
        <line x1="240" y1="260" x2="240" y2="272" />
        <line x1="240" y1="320" x2="240" y2="344" />
        <line x1="240" y1="392" x2="240" y2="416" />
        <line x1="240" y1="464" x2="240" y2="488" />
        <line x1="330" y1="512" x2="330" y2="200" />
        <line x1="330" y1="200" x2="240" y2="140" strokeDasharray="5 5" />
      </g>
      <g className="do-pulses" aria-hidden="true">
        {links.map((l) => (
          <circle key={l.id} r={4} fill={ACCENT}>
            <animateMotion dur={dur} begin={l.begin} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;0.14" calcMode="linear">
              <mpath href={`#${l.id}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.02;0.12;0.16" dur={dur} begin={l.begin} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      <g fontFamily="'Space Grotesk','Plus Jakarta Sans',sans-serif">
        {steps.map((s) => {
          const h = s.tall ? 72 : 48;
          return (
            <g key={s.t}>
              <rect
                x={s.t === "SIGNALS" ? 120 : 140}
                y={s.y}
                width={s.t === "SIGNALS" ? 240 : 200}
                height={h}
                rx={12}
                fill={s.t === "SIGNALS" ? ACCENT : "none"}
                className={s.t === "SIGNALS" ? "do-stage" : "do-node do-stage"}
                style={s.delay !== "0s" ? { animationDelay: s.delay } : undefined}
              />
              <text
                x="240"
                y={s.y + (s.tall ? 30 : 24) + (s.s ? -3 : 5)}
                textAnchor="middle"
                className={s.t === "SIGNALS" ? "do-node-text do-node-text--on-accent" : "do-node-text"}
              >
                {s.t}
              </text>
              {s.s ? (
                <text
                  x="240"
                  y={s.y + (s.tall ? 30 : 24) + 16}
                  textAnchor="middle"
                  className="do-node-sub"
                >
                  {s.s}
                </text>
              ) : (
                s.t === "SIGNALS" && (
                  <g aria-hidden="true">
                    {["METRICS", "LOGS", "HEALTH"].map((m, mi) => (
                      <g key={m}>
                        <rect x={132 + mi * 74} y={s.y + 38} width={66} height={22} rx={7} fill="rgba(10,17,32,0.22)" />
                        <text x={165 + mi * 74} y={s.y + 53} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0A1120">
                          {m}
                        </text>
                      </g>
                    ))}
                  </g>
                )
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function ObservabilityArchitecture() {
  return (
    <svg
      viewBox="0 0 900 430"
      className="do-arch-svg"
      role="img"
      aria-label="Observability architecture: applications, services, database and workers feed an observability layer producing metrics, logs, health and alerts for engineering response"
    >
      <g stroke="var(--border-strong)" strokeWidth="2">
        <line x1="175" y1="80" x2="400" y2="150" />
        <line x1="175" y1="145" x2="400" y2="170" />
        <line x1="175" y1="210" x2="400" y2="190" />
        <line x1="175" y1="275" x2="400" y2="210" />
        <line x1="620" y1="180" x2="720" y2="180" />
        <line x1="450" y1="250" x2="450" y2="300" strokeDasharray="6 6" />
        <line x1="510" y1="180" x2="510" y2="300" />
        <line x1="570" y1="250" x2="570" y2="300" strokeDasharray="6 6" />
        <line x1="720" y1="330" x2="720" y2="220" />
      </g>
      <g fontFamily="'Space Grotesk','Plus Jakarta Sans',sans-serif">
        {[
          { y: 54, t: "Applications" },
          { y: 119, t: "Services" },
          { y: 184, t: "Database" },
          { y: 249, t: "Workers" },
        ].map((n) => (
          <g key={n.t}>
            <rect x="55" y={n.y} width="120" height="46" rx="10" className="do-node" />
            <text x="115" y={n.y + 29} textAnchor="middle" className="do-node-text do-node-text--sm">{n.t}</text>
          </g>
        ))}

        <rect x="400" y="110" width="220" height="150" rx="14" fill={ACCENT} />
        <text x="510" y="142" textAnchor="middle" className="do-node-text do-node-text--sm do-node-text--on-accent">OBSERVABILITY</text>
        <text x="510" y="162" textAnchor="middle" className="do-node-text do-node-text--sm do-node-text--on-accent">LAYER</text>
        <text x="510" y="186" textAnchor="middle" className="do-node-sub do-node-sub--on-accent">collect · correlate</text>
        <text x="510" y="230" textAnchor="middle" className="do-node-sub do-node-sub--on-accent">logs · metrics · checks</text>

        <rect x="400" y="300" width="340" height="60" rx="12" className="do-node" />
        <text x="570" y="324" textAnchor="middle" className="do-node-text do-node-text--sm">METRICS · LOGS · HEALTH · ALERTS</text>
        <text x="570" y="344" textAnchor="middle" className="do-node-sub">signals with context</text>

        <rect x="720" y="150" width="140" height="70" rx="12" className="do-node" />
        <text x="790" y="179" textAnchor="middle" className="do-node-text do-node-text--sm">ENGINEERING</text>
        <text x="790" y="199" textAnchor="middle" className="do-node-text do-node-text--sm">RESPONSE</text>
      </g>
    </svg>
  );
}

function OperationalLoop() {
  const steps = ["SYSTEM", "SIGNALS", "OBSERVATION", "ALERT", "RESPONSE", "IMPROVEMENT"];
  const cx = 260;
  const cy = 170;
  const r = 120;
  const pos = steps.map((_, i) => {
    const a = (-90 + i * 60) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
  return (
    <svg
      viewBox="0 0 520 360"
      className="do-loop-svg"
      role="img"
      aria-label="Operational loop: system to signals to observation to alert to response to improvement and back"
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border-strong)" strokeWidth="2" strokeDasharray="4 8" />
      <circle cx={cx + r} cy={cy - 104} r="4" className="do-orbit" fill={ACCENT} />
      <g fontFamily="'Space Grotesk','Plus Jakarta Sans',sans-serif">
        {steps.map((s, i) => (
          <g key={s}>
            <rect x={pos[i].x - 74} y={pos[i].y - 24} width="148" height="48" rx="12"
              fill={i === 0 ? ACCENT : "none"}
              className={i === 0 ? "" : "do-node"} />
            <text x={pos[i].x} y={pos[i].y + 5} textAnchor="middle"
              className={i === 0 ? "do-node-text do-node-text--sm do-node-text--on-accent" : "do-node-text do-node-text--sm"}>
              {s}
            </text>
          </g>
        ))}
        <text x={cx} y={cy + 6} textAnchor="middle" className="do-node-sub">continuous loop</text>
      </g>
    </svg>
  );
}

export default function DevOpsObservabilityPage() {
  return (
    <div
      className="do-page"
      style={{
        "--svc": ACCENT,
        "--svc-rgb": ACCENT_RGB,
        "--svc-text": ACCENT_TEXT,
      }}
    >
      <Meta
        title="DevOps & Observability"
        description="Bring deployment, runtime visibility, monitoring and alerts together so teams understand system behavior and respond with context."
        canonical="/devops-observability"
        keywords="observability, application monitoring, logs, metrics, health checks, alerts, devops services"
      />

      <ServiceSchema
        name="DevOps & Observability"
        description="Observability services: deployment visibility, monitoring, logs, metrics, health checks and contextual alerts."
        url="/devops-observability"
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/#services" },
          { name: "DevOps & Observability", href: "/devops-observability" },
        ]}
      />

      {/* ==================== HERO ==================== */}
      <Reveal>
        <section className="do-hero">
          <div className="do-hero-inner">
            <div className="do-hero-copy">
              <span className="do-eyebrow">
                <span className="do-eyebrow-dot" />
                DEVOPS &amp; OBSERVABILITY
              </span>
              <h1 className="do-title">
                Know what your systems are doing
                <br />
                <span className="do-title-accent">before something breaks.</span>
              </h1>
              <p className="do-hero-desc">
                Bring deployment, runtime visibility, monitoring and
                alerts together — so teams understand system behavior
                and respond to issues with context, not guesswork.
              </p>
              <div className="do-hero-actions">
                <Link to="/contact" className="do-primary-btn">
                  <CalendarDays size={18} />
                  Discuss observability
                  <ArrowRight size={16} />
                </Link>
                <a href="#do-loop" className="do-secondary-btn">
                  See the loop
                </a>
              </div>
            </div>
            <div className="do-hero-visual">
              <ObservabilityLoop />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== WHY ==================== */}
      <Reveal delay={0.06}>
        <section className="do-section">
          <div className="do-container">
            <span className="do-eyebrow">WHY OBSERVABILITY</span>
            <h2 className="do-section-title">
              When something changes, <span className="do-title-accent">your team should know why.</span>
            </h2>
            <ul className="do-problem-list">
              <li><strong>Hidden runtime failures</strong> — something stops working and nobody notices until a customer reports it.</li>
              <li><strong>Disconnected logs</strong> — the evidence exists, but it is scattered across systems nobody looks at together.</li>
              <li><strong>Missing health signals</strong> — no simple answer to whether each part of the operation is healthy right now.</li>
              <li><strong>Unclear failure paths</strong> — when one thing breaks, it is not obvious what else is affected.</li>
              <li><strong>Alerts without context</strong> — a notification arrives with no logs, no recent changes, no next step.</li>
            </ul>
          </div>
        </section>
      </Reveal>

      {/* ==================== CAPABILITIES ==================== */}
      <Reveal delay={0.08}>
        <section className="do-section do-section--tight">
          <div className="do-container">
            <div className="do-section-header center">
              <span className="do-eyebrow">CAPABILITIES</span>
              <h2 className="do-section-title">Visibility, layer by layer.</h2>
            </div>
            <div className="do-grid">
              {CAPABILITIES.map((c) => (
                <div key={c.title} className="do-card">
                  <div className="do-card-icon">
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

      {/* ==================== OPERATIONAL LOOP ==================== */}
      <Reveal delay={0.08}>
        <section id="do-loop" className="do-section">
          <div className="do-container">
            <div className="do-loop-grid">
              <div>
                <span className="do-eyebrow">THE LOOP</span>
                <h2 className="do-section-title">Every signal has somewhere to go.</h2>
                <p className="do-section-desc">
                  Observability is not a dashboard — it is a loop.
                  Systems emit signals, the team observes them,
                  unusual behavior raises an alert, the response
                  improves the system, and the loop starts again.
                </p>
              </div>
              <div className="do-loop-frame">
                <OperationalLoop />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== ARCHITECTURE ==================== */}
      <Reveal delay={0.08}>
        <section className="do-section do-section--tight">
          <div className="do-container">
            <span className="do-eyebrow">ARCHITECTURE</span>
            <h2 className="do-section-title">One layer watching everything.</h2>
            <p className="do-section-desc">
              Applications, services, databases and workers all feed
              the same observability layer. Signals are collected
              together, so an alert about one part of the system
              arrives with the state of the rest attached.
            </p>
            <div className="do-arch-frame">
              <ObservabilityArchitecture />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== TECHNOLOGY ==================== */}

      <ServiceTech
        eyebrow="TECHNOLOGY"
        title="Signals, grouped by job."
        desc="Observability is assembled from watched systems, collected signals and response tooling — each group has one clear responsibility."
        groups={DO_TECH}
      />

      {/* ==================== PROCESS ==================== */}
      <Reveal delay={0.1}>
        <section className="do-section do-section--tight">
          <div className="do-container">
            <div className="do-section-header center">
              <span className="do-eyebrow">HOW IT WORKS</span>
              <h2 className="do-section-title">Instrument, observe, detect, respond.</h2>
            </div>
            <div className="do-process">
              {PROCESS.map((s) => (
                <div key={s.n} className="do-process-item">
                  <span className="do-process-number" style={{ color: s.color }}>{s.n}</span>
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
        <section className="do-section do-section--tight">
          <div className="do-container">
            <span className="do-eyebrow">USE CASES</span>
            <h2 className="do-section-title">What stays visible.</h2>
            <div className="do-usecases">
              {USE_CASES.map((u) => (
                <div key={u.title} className="do-usecase">
                  <span className="do-usecase-tag">{u.tag}</span>
                  <h3>{u.title}</h3>
                  <p>{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== SELECTED REAL WORK ==================== */}

      <RealWork
        eyebrow="SELECTED WORK"
        title="Systems worth watching."
        desc="Monitoring is only useful attached to real operations — these build areas from our own portfolio are what observability keeps visible."
        items={selectedWork.filter((w) => DO_WORK_IDS.includes(w.id))}
      />

      {/* ==================== INCLUDES ==================== */}
      <Reveal delay={0.08}>
        <section className="do-section do-section--tight">
          <div className="do-container">
            <div className="do-includes">
              <div>
                <span className="do-eyebrow">DELIVERY</span>
                <h2 className="do-section-title">What the implementation includes.</h2>
              </div>
              <ul className="do-checklist">
                {INCLUDES.map((item) => (
                  <li key={item}>
                    <span className="do-check" aria-hidden="true">✓</span>
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
        title="Observability, answered directly."
        items={DO_FAQ}
      />

      {/* ==================== RELATED ==================== */}

      <RelatedServices
        eyebrow="KEEP EXPLORING"
        title="Related services."
        items={DO_RELATED}
      />

      {/* ==================== CTA ==================== */}
      <Reveal delay={0.12}>
        <section className="do-cta-section">
          <div className="do-cta-box">
            <div className="do-cta-inner">
              <span className="do-eyebrow">READY WHEN YOU ARE</span>
              <h2>
                Visibility is <span className="do-title-accent">part of the system.</span>
              </h2>
              <p>
                Build systems your team can understand, monitor and
                improve — instead of systems you hope are working.
              </p>
              <Link to="/contact" className="do-primary-btn">
                <CalendarDays size={18} />
                Plan observability
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
