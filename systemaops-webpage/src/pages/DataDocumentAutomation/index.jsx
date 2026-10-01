/**
 * pages/DataDocumentAutomation/index.jsx
 *
 * Data & Document Automation service page.
 * Story: document → understand → validate → structure → act.
 * Accent: SystemaOps brand tokens (no per-service hue).
 * Copy: centralized t("serviceDetail.data.*"). Icons stay local.
 */

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Inbox,
  ScanSearch,
  ListChecks,
  ArrowDownUp,
  Send,
  UserCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

import Meta from "../../seo/Meta";
import ServiceSchema from "../../seo/schema/ServiceSchema";
import BreadcrumbSchema from "../../seo/schema/BreadcrumbSchema";
import Reveal from "../../components/ui/Reveal";
import { useLanguage } from "../../i18n/useLanguage";
import FlowLines from "../../components/diagrams/FlowLines";
import {
  ServiceTech,
  RealWork,
  ServiceFaq,
  RelatedServices,
} from "../../components/service/ServiceSections";
import PremiumCTA from "../../components/service/PremiumCTA";
import { buildCTAContent, buildCTADiagram } from "../../components/service/serviceCTAConfig";
import "../../components/service/ServiceShared.css";
import "../../components/service/ServiceDemo.css";
import { useReducedMotion } from "../../components/service/useReducedMotion";


import "./DataDocumentAutomation.css";

/* Icons stay local; all copy comes from t("serviceDetail.data.*"). */
const CAPABILITY_ICONS = [
  Inbox,
  ScanSearch,
  ListChecks,
  ArrowDownUp,
  Send,
  UserCheck,
];

const PROCESS_COLORS = [
  "var(--brand-primary)",
  "var(--brand-deep)",
  "var(--brand-deep)",
  "var(--brand-primary)",
];

const RELATED_HREFS = [
  "/ai-automation",
  "/workflow-automation",
  "/odoo-customization",
];

const BRAND = "var(--brand-primary)";

function HeroPipeline() {
  const { t } = useLanguage();
  const diagram = t("serviceDetail.data.diagram.hero") || {};
  const copyStages = diagram.stages || [];
  const fields = diagram.fields || [];
  const dur = "7s";
  /* Geometry stays local; copy comes from diagram.stages by index. */
  const geometry = [
    { y: 24, delay: "0s" },
    { y: 100, delay: "-0.66s" },
    { y: 176, hot: true, delay: "-1.46s" },
    { y: 286, delay: "-2.86s" },
    { y: 370, delay: "-3.86s" },
    { y: 454, delay: "-4.86s" },
  ];
  const stages = copyStages.map((s, i) => ({ ...s, ...geometry[i] }));
  const links = [
    { id: "dd-p0", d: "M180 72 L180 100" },
    { id: "dd-p1", d: "M180 148 L180 176" },
    { id: "dd-p2", d: "M180 260 L180 286" },
    { id: "dd-p3", d: "M180 334 L180 370" },
    { id: "dd-p4", d: "M180 418 L180 454" },
  ];
  /* Fiber spine: the same five links as thin base paths with
     looping gold particles (stagger preserved, infinite loop). */
  const spineFlows = links.map((l, i) => ({
    id: l.id,
    d: l.d,
    dur: 7,
    delay: [0.4, 1.2, 2.6, 3.6, 4.6][i] || 0,
  }));
  return (
    <svg
      viewBox="0 0 360 526"
      className="dd-hero-svg"
      role="img"
      aria-label={diagram.aria}
    >
      <FlowLines flows={spineFlows} />
      <g fontFamily="'Space Grotesk','Plus Jakarta Sans',sans-serif">
        {stages.map((s) => {
          const h = s.hot ? 84 : 48;
          return (
            <g key={s.t}>
              <rect
                x={s.hot ? 80 : 95}
                y={s.y}
                width={s.hot ? 200 : 170}
                height={h}
                rx={12}
                fill={s.hot ? BRAND : "none"}
                className={s.hot ? "dd-stage" : `dd-node dd-stage`}
                style={s.delay !== "0s" ? { animationDelay: s.delay } : undefined}
              />
              <text
                x="180"
                y={s.y + (s.hot ? 26 : 24)}
                textAnchor="middle"
                className={s.hot ? "dd-node-text dd-node-text--on-accent" : "dd-node-text"}
              >
                {s.t}
              </text>
              <text
                x="180"
                y={s.y + (s.hot ? 42 : 40)}
                textAnchor="middle"
                className={s.hot ? "dd-node-sub dd-node-sub--on-accent" : "dd-node-sub"}
              >
                {s.s}
              </text>
              {s.hot && (
                <g className="dd-fields" opacity="0" aria-hidden="true">
                  <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.28;0.36;0.55;0.63" dur={dur} repeatCount="indefinite" />
                  {fields.map((f, fi) => (
                    <g key={f}>
                      <rect x={88 + fi * 64} y={s.y + 52} width={56} height={22} rx={7} fill="var(--bg-surface)" stroke="var(--border-strong)" />
                      <text x={116 + fi * 64} y={s.y + 67} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="var(--text-primary)">
                        {f}
                      </text>
                    </g>
                  ))}
                </g>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ── DOCUMENT DEMO: messy document → usable data.
      A realistic invoice card is scanned, its fields light up
      one by one, structured rows appear with validation checks,
      and the record lands ready for Odoo. Reduced motion jumps
      to the final state. ── */

function DocumentDemo() {
  const { t } = useLanguage();
  const demo = t("common.demo") || {};
  const diagram = t("serviceDetail.data.diagram.processing") || {};
  const sample = diagram.sample || {};
  const fields = sample.fields || [];
  const checkpoint = t("serviceDetail.data.checkpoint") || {};
  const steps = checkpoint.steps || [];
  const [phase, setPhase] = useState("idle");
  const [runId, setRunId] = useState(0);
  const reduced = useReducedMotion();
  const timers = useRef([]);

  const active = phase !== "idle";
  const done = phase === "done";
  const rowsLive =
    phase === "extracting" || phase === "validating" || done;

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    []
  );

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunId((n) => n + 1);
    if (reduced) {
      setPhase("done");
      return;
    }
    setPhase("scanning");
    timers.current.push(setTimeout(() => setPhase("extracting"), 950));
    timers.current.push(setTimeout(() => setPhase("validating"), 2350));
    timers.current.push(setTimeout(() => setPhase("done"), 3250));
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("idle");
  };

  const capIndex =
    phase === "validating" ? 2 : phase === "done" ? 4 : 0;
  const cap = steps[capIndex] || {};
  const progressLabel = done
    ? null
    : phase === "validating"
      ? (steps[1] || {}).lead
      : (steps[0] || {}).lead;

  return (
    <div className="dd-doc-demo">
      <div className="dd-doc-grid">
        <div className="dd-doc-card">
          <span className="dd-doc-title">{sample.docTitle}</span>
          <ul key={`doc-${runId}`} className="dd-doc-lines">
            {fields.map((f, i) => (
              <li
                key={f.k}
                className={
                  phase === "scanning" || phase === "extracting"
                    ? "dd-field--scan"
                    : ""
                }
                style={{ "--d": `${0.15 + i * 0.18}s` }}
              >
                <span>{f.k}</span>
                <strong>{f.v}</strong>
              </li>
            ))}
          </ul>
          {phase === "scanning" && (
            <span
              key={`scan-${runId}`}
              className="dd-scanline"
              aria-hidden="true"
            />
          )}
        </div>
        <span className="dd-doc-arrow" aria-hidden="true">
          →
        </span>
        <div className="dd-rows-card">
          <ul key={`rows-${runId}`} className="dd-rows">
            {fields.map((f, i) => (
              <li
                key={f.k}
                className={rowsLive ? "dd-row--in" : "dd-row--idle"}
                style={{ "--d": `${i * 0.22}s` }}
              >
                <span>{f.k}</span>
                <strong>{f.v}</strong>
                {(phase === "validating" || done) && (
                  <span
                    className="dd-check"
                    style={{ "--d": `${0.3 + i * 0.2}s` }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="dd-rows-status">
            {done ? (
              <span key={`ready-${runId}`} className="dd-ready">
                {sample.ready}
              </span>
            ) : (
              active &&
              progressLabel && (
                <span className="dd-progress">{progressLabel}…</span>
              )
            )}
          </div>
        </div>
      </div>
      <div className="demo-controls">
        <button
          type="button"
          className="demo-btn"
          onClick={run}
          disabled={active && !done}
        >
          {demo.processDocument || "Process document"}
        </button>
        <button
          type="button"
          className="demo-btn demo-btn--ghost"
          onClick={reset}
          disabled={!active}
        >
          {demo.reset || "Reset"}
        </button>
      </div>
      {active && cap.lead && (
        <p
          key={`cap-${phase}-${runId}`}
          className="dd-arch-caption demo-caption-swap"
          role="status"
        >
          <strong>{cap.lead}</strong> {cap.text}
        </p>
      )}
    </div>
  );
}

export default function DataDocumentAutomationPage() {
  const { t } = useLanguage();
  const svc = t("serviceDetail.data") || {};
  const meta = svc.meta || {};
  const hero = svc.hero || {};
  const problem = svc.problem || {};
  const problemItems = problem.items || [];
  const capabilities = svc.capabilities || {};
  const capabilityItems = capabilities.items || [];
  const architecture = svc.architecture || {};
  const process = svc.process || {};
  const tech = svc.tech || {};
  const checkpoint = svc.checkpoint || {};
  const checkpointSteps = checkpoint.steps || [];
  const useCases = svc.useCases || {};
  const useCaseItems = useCases.items || [];
  const work = svc.work || {};
  const workItems = (work.items || []).map((w) => ({
    ...w,
    accent: "var(--brand-primary)",
    accentRgb: "var(--brand-rgb)",
    accentText: "var(--brand-deep)",
  }));
  const engagement = svc.engagement || {};
  const faq = svc.faq || {};
  const related = svc.related || {};
  const cta = buildCTAContent(t, "data");
  const ctaDiagram = buildCTADiagram(t, "data");
  const relatedItems = (related.items || []).map((r, i) => ({
    ...r,
    href: RELATED_HREFS[i] || r.href,
    accent: "var(--brand-primary)",
  }));

  return (
    <div
      className="dd-page"
      style={{
        "--svc": "var(--brand-primary)",
        "--svc-rgb": "var(--brand-rgb)",
        "--svc-text": "var(--brand-deep)",
      }}
    >
      <Meta
        title={meta.title}
        description={meta.description}
        canonical="/data-document-automation"
        keywords={meta.keywords}
      />

      <ServiceSchema
        name={meta.schemaName}
        description={meta.schemaDesc}
        url="/data-document-automation"
      />

      <BreadcrumbSchema
        items={[
          { name: t("nav.home"), href: "/" },
          { name: t("nav.services"), href: "/#services" },
          { name: meta.title, href: "/data-document-automation" },
        ]}
      />

      {/* ==================== HERO ==================== */}
      <Reveal>
        <section className="dd-hero">
          <div className="dd-hero-inner">
            <div className="dd-hero-copy">
              <h1 className="dd-title">
                {hero.title}
                <br />
                <span className="dd-title-accent">{hero.highlight}</span>
              </h1>
              <p className="dd-hero-desc">
                {hero.description}
              </p>
              <div className="dd-hero-actions">
                <Link to="/contact" className="dd-primary-btn">
                  <CalendarDays size={18} />
                  {hero.primaryCta}
                  <ArrowRight size={16} />
                </Link>
                <a href="#dd-flow" className="dd-secondary-btn">
                  {hero.secondaryCta}
                </a>
              </div>
            </div>
            <div className="dd-hero-visual">
              <HeroPipeline />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== WHY ==================== */}
      <Reveal delay={0.06}>
        <section className="dd-section">
          <div className="dd-container">
            <h2 className="dd-section-title">
              {problem.title} <span className="dd-title-accent">{problem.highlight}</span>
            </h2>
            <div className="dd-why-grid">
              {problemItems.map((w) => (
                <div key={w.title} className="dd-why-item">
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== CAPABILITIES ==================== */}
      <Reveal delay={0.08}>
        <section className="dd-section dd-section--tight">
          <div className="dd-container">
            <div className="dd-section-header center">
              <h2 className="dd-section-title">{capabilities.title}</h2>
            </div>
            <div className="dd-grid">
              {capabilityItems.map((c, i) => {
                const Icon = CAPABILITY_ICONS[i] || CAPABILITY_ICONS[0];
                return (
                  <div key={c.title} className="dd-card">
                    <div className="dd-card-icon">
                      <Icon size={26} />
                    </div>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== PROCESSING FLOW ==================== */}
      <Reveal delay={0.08}>
        <section id="dd-flow" className="dd-section">
          <div className="dd-container">
            <h2 className="dd-section-title">{architecture.title}</h2>
            <p className="dd-section-desc">
              {architecture.desc}
            </p>
            <div className="dd-arch-frame">
              <DocumentDemo />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== TECHNOLOGY ==================== */}

      <ServiceTech
        eyebrow={tech.eyebrow}
        title={tech.title}
        desc={tech.desc}
        groups={tech.groups || []}
      />

      {/* ==================== PROCESS ==================== */}
      <Reveal delay={0.1}>
        <section className="dd-section dd-section--tight">
          <div className="dd-container">
            <div className="dd-section-header center">
              <h2 className="dd-section-title">{process.title}</h2>
            </div>
            <div className="dd-process">
              {(process.steps || []).map((s, i) => (
                <div key={s.title} className="dd-process-item">
                  <span className="dd-process-number" style={{ color: PROCESS_COLORS[i % PROCESS_COLORS.length] }}>0{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== HUMAN CHECKPOINT ==================== */}
      <Reveal delay={0.08}>
        <section className="dd-section dd-section--tight">
          <div className="dd-container">
            <div className="dd-checkpoint">
              <div>
                <h2 className="dd-section-title">{checkpoint.title}</h2>
                <p className="dd-section-desc">
                  {checkpoint.desc}
                </p>
              </div>
              <ol className="dd-checkpoint-steps">
                {checkpointSteps.map((step) => (
                  <li key={step.lead}><strong>{step.lead}</strong>{" "}{step.text}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== USE CASES ==================== */}
      <Reveal delay={0.08}>
        <section className="dd-section dd-section--tight">
          <div className="dd-container">
            <h2 className="dd-section-title">{useCases.title}</h2>
            <div className="dd-usecases">
              {useCaseItems.map((u) => (
                <div key={u.title} className="dd-usecase">
                  <span className="dd-usecase-tag">{u.tag}</span>
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
        eyebrow={work.eyebrow}
        title={work.title}
        desc={work.desc}
        items={workItems}
      />

      {/* ==================== INCLUDES ==================== */}
      <Reveal delay={0.08}>
        <section className="dd-section dd-section--tight">
          <div className="dd-container">
            <div className="dd-includes">
              <div>
                <h2 className="dd-section-title">{engagement.title}</h2>
              </div>
              <ul className="dd-checklist">
                {(engagement.items || []).map((item) => (
                  <li key={item}>
                    <span className="dd-check" aria-hidden="true">✓</span>
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
