/**
 * pages/Workflow/index.jsx
 *
 * Business Workflow Automation service page.
 * Story: orchestration — event → process → decision → action,
 * with exception → human review and monitoring throughout.
 * Accent: SystemaOps brand tokens (no per-service hue).
 * Copy: centralized t("serviceDetail.workflow.*"). Icons stay local.
 */

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Zap,
  GitBranch,
  UserCheck,
  PlugZap,
  Bell,
  Activity,
} from "lucide-react";

import { Link } from "react-router-dom";

import Meta from "../../seo/Meta";
import ServiceSchema from "../../seo/schema/ServiceSchema";
import BreadcrumbSchema from "../../seo/schema/BreadcrumbSchema";
import Reveal from "../../components/ui/Reveal";
import FlowLines from "../../components/diagrams/FlowLines";
import { useLanguage } from "../../i18n/useLanguage";
import {
  ServiceFaq,
  RelatedServices,
} from "../../components/service/ServiceSections";
import PremiumCTA from "../../components/service/PremiumCTA";
import { buildCTAContent, buildCTADiagram } from "../../components/service/serviceCTAConfig";
import "../../components/service/ServiceShared.css";
import "../../components/service/ServiceDemo.css";
import { useReducedMotion } from "../../components/service/useReducedMotion";

import "./Workflow.css";

/* Icons stay local; all copy comes from t("serviceDetail.workflow.*"). */
const CAPABILITY_ICONS = [
  Zap,
  PlugZap,
  GitBranch,
  UserCheck,
  Activity,
  Bell,
];

const RELATED_HREFS = [
  "/ai-automation",
  "/odoo-customization",
  "/system-integrations",
];

/* ── TECHNICAL VISUAL: one complete static workflow diagram.
      TRIGGER → WORKFLOW → DECISION → ACTION, with the exception
      route diverting to HUMAN REVIEW and monitoring watching
      every run (RUN LOG). No tabs, no hover, no hidden states.
      A one-time, viewport-triggered entrance traces the
      connectors once, then settles. ── */

function wfArrow(x1, y1, x2, y2, size = 8) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x2 - ux * size;
  const by = y2 - uy * size;
  const s = size * 0.42;
  return (
    `${x2},${y2} ` +
    `${bx - uy * s},${by + ux * s} ` +
    `${bx + uy * s},${by - ux * s}`
  );
}

function TechnicalVisual() {
  const { t } = useLanguage();
  const diagram = t("serviceDetail.workflow.diagram.tech") || {};
  const nodes = diagram.nodes || {};
  const trigger = nodes.trigger || {};
  const workflow = nodes.workflow || {};
  const decision = nodes.decision || {};
  const action = nodes.action || {};
  const review = nodes.review || {};
  const runlog = nodes.runlog || {};
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(false);

  /* Start the one-time entrance when the diagram enters the viewport. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    let observer = null;
    const rafId = requestAnimationFrame(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer?.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
    });
    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, []);

  /* Fiber flows mirror the node layout; SMIL loops replace
     the old one-shot timer signals. */
  const fullFlows = [
    { id: "run-1", x1: 140, y1: 150, x2: 196, y2: 150, dur: 3.4, delay: 0, drawDelay: 0.1 },
    { id: "run-2", x1: 340, y1: 150, x2: 396, y2: 150, dur: 3.6, delay: 0.4, drawDelay: 0.5 },
    { id: "run-3", x1: 540, y1: 152, x2: 596, y2: 150, dur: 3.8, delay: 0.8, drawDelay: 0.9 },
    { id: "except", d: "M470 194 Q470 270 290 270", dashed: true, dur: 4.4, delay: 1.2 },
    { id: "monitor", x1: 675, y1: 180, x2: 675, y2: 262, dashed: true, dur: 4, delay: 1.6 },
  ];

  const compactFlows = [
    { id: "c-1", x1: 160, y1: 58, x2: 160, y2: 80, dur: 3.4, delay: 0, drawDelay: 0.1 },
    { id: "c-2", x1: 160, y1: 128, x2: 160, y2: 150, dur: 3.6, delay: 0.4, drawDelay: 0.5 },
    { id: "c-3", x1: 160, y1: 214, x2: 160, y2: 240, dur: 3.8, delay: 0.8, drawDelay: 0.9 },
    { id: "c-4", x1: 160, y1: 292, x2: 160, y2: 328, dashed: true, dur: 4.2, delay: 1.2 },
    { id: "c-5", x1: 160, y1: 384, x2: 160, y2: 396, dashed: true, dur: 4.4, delay: 1.6 },
  ];

  const font = "'Space Grotesk','Plus Jakarta Sans',sans-serif";

  return (
    <div
      ref={wrapRef}
      className={`wf-arch-wrap${inView ? " wf-arch-wrap--on" : ""}`}
    >
      {/* ── DESKTOP / TABLET ── */}
      <svg
        viewBox="0 0 900 350"
        className="wf-arch-svg wf-arch-svg--full"
        role="img"
        aria-label={diagram.aria}
        style={{ fontFamily: font }}
      >
        {/* Fiber connectors + looping gold particles */}
        <FlowLines draw={inView} flows={fullFlows} />

        <polygon points={wfArrow(140, 150, 200, 150)} className="wf-arch-arrow wf-arch-node" style={{ "--d": "0.75s" }} />
        <polygon points={wfArrow(340, 150, 400, 150)} className="wf-arch-arrow wf-arch-node" style={{ "--d": "1.15s" }} />
        <polygon points={wfArrow(540, 152, 600, 150)} className="wf-arch-arrow wf-arch-node" style={{ "--d": "1.55s" }} />
        <polygon points={wfArrow(470, 270, 288, 270, 7)} className="wf-arch-arrow wf-arch-node" style={{ "--d": "2.4s" }} />
        <polygon points={wfArrow(675, 180, 675, 268, 7)} className="wf-arch-arrow wf-arch-node" style={{ "--d": "2.65s" }} />

        {/* Nodes */}
        <g className="wf-arch-node" style={{ "--d": "0.05s" }}>
          <rect x="20" y="120" width="120" height="60" rx="12" className="wf-node" />
          <text x="80" y="146" textAnchor="middle" className="wf-node-text wf-node-text--sm">{trigger.t}</text>
          <text x="80" y="164" textAnchor="middle" className="wf-node-sub">{trigger.s}</text>
        </g>
        <g className="wf-arch-node" style={{ "--d": "0.2s" }}>
          <rect x="200" y="120" width="140" height="60" rx="12" className="wf-node" />
          <text x="270" y="146" textAnchor="middle" className="wf-node-text wf-node-text--sm">{workflow.t}</text>
          <text x="270" y="164" textAnchor="middle" className="wf-node-sub">{workflow.s}</text>
        </g>
        <g className="wf-arch-node" style={{ "--d": "0.6s" }}>
          <rect x="400" y="110" width="140" height="84" rx="14" fill="var(--brand-primary)" className="wf-core-node" />
          <text x="470" y="148" textAnchor="middle" className="wf-node-text wf-node-text--on-accent wf-node-text--sm">{decision.t}</text>
          <text x="470" y="168" textAnchor="middle" className="wf-node-sub wf-node-sub--on-accent">{decision.s}</text>
        </g>
        <g className="wf-arch-node" style={{ "--d": "1.2s" }}>
          <rect x="600" y="120" width="150" height="60" rx="12" className="wf-node wf-node--action" />
          <text x="675" y="146" textAnchor="middle" className="wf-node-text wf-node-text--sm wf-node-text--action">{action.t}</text>
          <text x="675" y="164" textAnchor="middle" className="wf-node-sub">{action.s}</text>
        </g>
        <g className="wf-arch-node" style={{ "--d": "1.9s" }}>
          <rect x="120" y="270" width="160" height="56" rx="12" className="wf-node wf-node--exception" />
          <text x="200" y="294" textAnchor="middle" className="wf-node-text wf-node-text--sm">{review.t}</text>
          <text x="200" y="312" textAnchor="middle" className="wf-node-sub">{review.s}</text>
        </g>
        <g className="wf-arch-node" style={{ "--d": "2.2s" }}>
          <rect x="600" y="270" width="160" height="56" rx="12" className="wf-node" />
          <text x="680" y="294" textAnchor="middle" className="wf-node-text wf-node-text--sm">{runlog.t}</text>
          <text x="680" y="312" textAnchor="middle" className="wf-node-sub">{runlog.s}</text>
        </g>
      </svg>

      {/* ── MOBILE: vertical stack ── */}
      <svg
        viewBox="0 0 320 470"
        className="wf-arch-svg wf-arch-svg--compact"
        role="img"
        aria-label={diagram.aria}
        style={{ fontFamily: font }}
      >
        <FlowLines draw={inView} flows={compactFlows} />
        <polygon points={wfArrow(160, 58, 160, 84)} className="wf-arch-arrow wf-arch-node" style={{ "--d": "0.75s" }} />
        <polygon points={wfArrow(160, 128, 160, 154)} className="wf-arch-arrow wf-arch-node" style={{ "--d": "1.15s" }} />
        <polygon points={wfArrow(160, 214, 160, 244)} className="wf-arch-arrow wf-arch-node" style={{ "--d": "1.55s" }} />
        <polygon points={wfArrow(160, 292, 160, 332, 7)} className="wf-arch-arrow wf-arch-node" style={{ "--d": "2.4s" }} />
        <polygon points={wfArrow(160, 384, 160, 400, 7)} className="wf-arch-arrow wf-arch-node" style={{ "--d": "2.65s" }} />

        <g className="wf-arch-node" style={{ "--d": "0.05s" }}>
          <rect x="60" y="14" width="200" height="44" rx="12" className="wf-node" />
          <text x="160" y="32" textAnchor="middle" className="wf-node-text wf-node-text--sm">{trigger.t}</text>
          <text x="160" y="48" textAnchor="middle" className="wf-node-sub">{trigger.s}</text>
        </g>
        <g className="wf-arch-node" style={{ "--d": "0.2s" }}>
          <rect x="60" y="84" width="200" height="44" rx="12" className="wf-node" />
          <text x="160" y="102" textAnchor="middle" className="wf-node-text wf-node-text--sm">{workflow.t}</text>
          <text x="160" y="118" textAnchor="middle" className="wf-node-sub">{workflow.s}</text>
        </g>
        <g className="wf-arch-node" style={{ "--d": "0.6s" }}>
          <rect x="60" y="154" width="200" height="60" rx="14" fill="var(--brand-primary)" className="wf-core-node" />
          <text x="160" y="180" textAnchor="middle" className="wf-node-text wf-node-text--on-accent wf-node-text--sm">{decision.t}</text>
          <text x="160" y="198" textAnchor="middle" className="wf-node-sub wf-node-sub--on-accent">{decision.s}</text>
        </g>
        <g className="wf-arch-node" style={{ "--d": "1.2s" }}>
          <rect x="60" y="244" width="200" height="48" rx="12" className="wf-node wf-node--action" />
          <text x="160" y="264" textAnchor="middle" className="wf-node-text wf-node-text--sm wf-node-text--action">{action.t}</text>
          <text x="160" y="280" textAnchor="middle" className="wf-node-sub">{action.s}</text>
        </g>
        <g className="wf-arch-node" style={{ "--d": "1.9s" }}>
          <rect x="60" y="336" width="200" height="48" rx="12" className="wf-node wf-node--exception" />
          <text x="160" y="356" textAnchor="middle" className="wf-node-text wf-node-text--sm">{review.t}</text>
          <text x="160" y="372" textAnchor="middle" className="wf-node-sub">{review.s}</text>
        </g>
        <g className="wf-arch-node" style={{ "--d": "2.2s" }}>
          <rect x="60" y="404" width="200" height="48" rx="12" className="wf-node" />
          <text x="160" y="424" textAnchor="middle" className="wf-node-text wf-node-text--sm">{runlog.t}</text>
          <text x="160" y="440" textAnchor="middle" className="wf-node-sub">{runlog.s}</text>
        </g>
      </svg>
    </div>
  );
}

/* ── HERO EXECUTION STRIP: the engine running once.
      Plays when it scrolls into view; clicking replays.
      Steps come from the first translated use case. ── */

function HeroExecStrip() {
  const { t } = useLanguage();
  const cases = t("serviceDetail.workflow.useCases") || {};
  const first = (cases.items || [])[0] || {};
  const steps = (first.flow || []).slice(0, 5);
  const [runId, setRunId] = useState(0);
  const [entered, setEntered] = useState(false);
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setEntered(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setEntered(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <button
      type="button"
      className="wf-hero-exec"
      ref={ref}
      aria-label={first.title}
      onClick={() => setRunId((n) => n + 1)}
    >
      <span className="wf-exec-rail" aria-hidden="true">
        {entered && !reduced && (
          <span
            key={`dot-${runId}-${entered}`}
            className="wf-exec-dot"
          />
        )}
      </span>
      <ol key={`steps-${runId}-${entered}`}>
        {steps.map((s, i) => (
          <li
            key={s}
            className="wf-exec-step"
            style={{ "--d": `${i * 0.45}s` }}
          >
            <span aria-hidden="true" />
            {s}
          </li>
        ))}
      </ol>
    </button>
  );
}

/* ── ECOSYSTEM MAP: satellites → engine → process.
      Satellites come from the translated tech groups. ── */

function EcosystemMap() {
  const { t } = useLanguage();
  const eco = t("serviceDetail.workflow.ecosystem") || {};
  const tech = t("serviceDetail.workflow.tech") || {};
  const sats = [
    ...new Set(
      (tech.groups || []).flatMap((g) => g.items || [])
    ),
  ].slice(0, 8);

  return (
    <div className="wf-eco-grid">
      <ul className="wf-eco-sats" aria-label={eco.title}>
        {sats.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <span className="wf-eco-arrow" aria-hidden="true">→</span>
      <div className="wf-eco-engine">{eco.engine}</div>
      <span className="wf-eco-arrow" aria-hidden="true">→</span>
      <div className="wf-eco-out">{eco.output}</div>
    </div>
  );
}

/* ── OUTCOME BAND: large measurable-style statements. ── */

function OutcomeBand() {
  const { t } = useLanguage();
  const out = t("serviceDetail.workflow.outcome") || {};
  const items = out.items || [];

  return (
    <div className="wf-out-grid">
      {items.map((item, i) => (
        <Reveal key={item} delay={Math.min(i * 0.04, 0.2)}>
          <div className="wf-out-item">
            <span aria-hidden="true">0{i + 1}</span>
            {item}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default function WorkflowPage() {
  const { t } = useLanguage();
  const svc = t("serviceDetail.workflow") || {};
  const meta = svc.meta || {};
  const hero = svc.hero || {};
  const problem = svc.problem || {};
  const automation = svc.automation || {};
  const automationItems = automation.items || [];
  const architecture = svc.architecture || {};
  const cases = svc.cases || {};
  const systems = svc.systems || {};
  const control = svc.control || {};
  const outcome = svc.outcome || {};
  const scope = svc.scope || {};
  const faq = svc.faq || {};
  const related = svc.related || {};
  const cta = buildCTAContent(t, "workflow");
  const ctaDiagram = buildCTADiagram(t, "workflow");
  const relatedItems = (related.items || []).map((r, i) => ({
    ...r,
    href: RELATED_HREFS[i] || r.href,
    accent: "var(--brand-primary)",
  }));

  return (
    <div
      className="wf-page"
      style={{
        "--svc": "var(--brand-primary)",
        "--svc-rgb": "var(--brand-rgb)",
        "--svc-text": "var(--brand-deep)",
      }}
    >
      <Meta
        title={meta.title}
        description={meta.description}
        canonical="/workflow-automation"
        keywords={meta.keywords}
      />

      <ServiceSchema
        name={meta.schemaName}
        description={meta.schemaDesc}
        url="/workflow-automation"
      />

      <BreadcrumbSchema
        items={[
          { name: t("nav.home"), href: "/" },
          { name: t("nav.services"), href: "/#services" },
          { name: hero.title, href: "/workflow-automation" },
        ]}
      />

      {/* ==================== HERO ==================== */}
      <Reveal>
        <section className="wf-hero">
          <div className="wf-hero-inner">
            <div className="wf-hero-copy">
              <h1 className="wf-title">
                {hero.title}
                <br />
                <span className="wf-title-accent">{hero.highlight}</span>
              </h1>
              <p className="wf-hero-desc">
                {hero.description}
              </p>
              <div className="wf-hero-actions">
                <Link to="/contact" className="wf-primary-btn">
                  <CalendarDays size={18} />
                  {hero.primaryCta}
                  <ArrowRight size={16} />
                </Link>
                <a href="#wf-arch" className="wf-secondary-btn">
                  {hero.secondaryCta}
                </a>
              </div>
            </div>
            <div className="wf-hero-visual">
              <HeroExecStrip />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== PROBLEM ==================== */}
      <Reveal delay={0.06}>
        <section className="wf-section">
          <div className="wf-container">
            <h2 className="wf-section-title">
              {problem.title} <span className="wf-title-accent">{problem.highlight}</span>
            </h2>
            <div className="wf-pain-grid">
              {(problem.areas || []).map((a, i) => (
                <div key={a.t} className="wf-pain-card">
                  <span className="wf-pain-num" aria-hidden="true">0{i + 1}</span>
                  <h3>{a.t}</h3>
                  <p>{a.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== WHAT WE AUTOMATE ==================== */}
      <Reveal delay={0.08}>
        <section className="wf-section wf-section--tight">
          <div className="wf-container">
            <h2 className="wf-section-title">{automation.title}</h2>
            <p className="wf-section-desc">{automation.desc}</p>
            <div className="wf-cap-grid">
              {automationItems.map((c, i) => {
                const Icon = CAPABILITY_ICONS[i] || Zap;
                return (
                  <div key={c.t} className="wf-cap">
                    <div className="wf-cap-icon">
                      <Icon size={24} />
                    </div>
                    <h3>{c.t}</h3>
                    <p>{c.d}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== USE CASES ==================== */}
      <Reveal delay={0.08}>
        <section className="wf-section wf-section--tight">
          <div className="wf-container">
            <h2 className="wf-section-title">{cases.title}</h2>
            <p className="wf-section-desc">{cases.desc}</p>
            <div className="wf-usecases">
              {(cases.items || []).map((u, i) => (
                <div key={u.t} className="wf-usecase">
                  <span className="wf-usecase-index">0{i + 1}</span>
                  <h3>{u.t}</h3>
                  <div className="wf-flow" aria-hidden="true">
                    {(u.flow || []).map((f, j) => (
                      <span key={f} className="wf-flow-step">
                        {f}
                        {j < (u.flow || []).length - 1 && <span className="wf-flow-arrow">→</span>}
                      </span>
                    ))}
                  </div>
                  <p>{u.d}</p>
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
            <h2 className="wf-section-title">{architecture.title}</h2>
            <p className="wf-section-desc">
              {architecture.desc}
            </p>
            <div className="wf-arch-frame">
              <TechnicalVisual />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== SYSTEMS + ORCHESTRATION ==================== */}
      <Reveal delay={0.08}>
        <section className="wf-section wf-section--tight">
          <div className="wf-container">
            <h2 className="wf-section-title">{systems.title}</h2>
            <p className="wf-section-desc">
              {systems.desc}
            </p>
            <div className="wf-arch-frame">
              <EcosystemMap />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== HUMAN EXCEPTION / CONTROL ==================== */}
      <Reveal delay={0.08}>
        <section className="wf-section wf-section--tight">
          <div className="wf-container">
            <h2 className="wf-section-title">{control.title}</h2>
            <p className="wf-section-desc">
              {control.desc}
            </p>
            <div className="wf-control-grid">
              {(control.items || []).map((c, i) => (
                <div key={c.t} className="wf-control-item">
                  <span className="wf-control-label" aria-hidden="true">0{i + 1}</span>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== OUTCOME ==================== */}
      <Reveal delay={0.08}>
        <section className="wf-section wf-section--tight">
          <div className="wf-container">
            <h2 className="wf-section-title">{outcome.title}</h2>
            <OutcomeBand />
          </div>
        </section>
      </Reveal>

      {/* ==================== IMPLEMENTATION SCOPE ==================== */}
      <Reveal delay={0.08}>
        <section className="wf-section wf-section--tight">
          <div className="wf-container">
            <h2 className="wf-section-title">{scope.title}</h2>
            <p className="wf-section-desc">
              {scope.desc}
            </p>
            <div className="wf-scope-grid">
              {(scope.items || []).map((s, i) => (
                <div key={s.t} className="wf-scope-item">
                  <span className="wf-scope-num" aria-hidden="true">0{i + 1}</span>
                  <div>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== FAQ ==================== */}
      <ServiceFaq
        eyebrow={faq.eyebrow}
        title={faq.title}
        items={faq.items || []}
      />

      {/* ==================== RELATED ==================== */}
      <RelatedServices
        eyebrow={related.eyebrow}
        title={related.title}
        linkLabel={related.linkLabel}
        items={relatedItems}
      />

      {/* ==================== CTA ==================== */}
      <Reveal delay={0.12}>
        <PremiumCTA
        eyebrow={cta.eyebrow}
        title={cta.title}
        highlight={cta.highlight}
        desc={cta.desc}
        button={cta.button}
        diagram={ctaDiagram}
      />
      </Reveal>
    </div>
  );
}
