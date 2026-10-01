/**
 * pages/AIAutomation/index.jsx
 *
 * AI Automation service page.
 * Story: agents + intelligent workflows inside real business processes.
 * Accent: SystemaOps brand tokens (no per-service hue).
 * Copy: centralized t("serviceDetail.ai.*"). Icons stay local.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Box,
  BrainCircuit,
  CalendarDays,
  Database,
  FileText,
  PlugZap,
  ShieldCheck,
  UserCheck,
  Workflow,
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

import "./AIAutomation.css";

const PROCESS_COLORS = [
  "var(--brand-primary)",
  "var(--brand-deep)",
  "var(--brand-deep)",
  "var(--brand-primary)",
];

/* Capability matrix icons: Application → Alerts. */
const MATRIX_ICONS = [Box, BrainCircuit, Database, PlugZap, Workflow, Bell];

const RELATED_HREFS = [
  "/odoo-customization",
  "/workflow-automation",
  "/data-document-automation",
];

/* ── ARCHITECTURE: one complete static diagram.
      USER / EVENT → CONTEXT → AI AGENT, which fans out to
      TOOLS, DATA and RULES while the main path continues to
      ACTION, with a HUMAN CHECK exception checkpoint. No tabs,
      no hover, no hidden states. A one-time, viewport-triggered
      entrance traces the connectors once, then settles. ── */

function archArrow(x1, y1, x2, y2, size = 8) {
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

function ArchitectureVisual() {
  const { t } = useLanguage();
  const visual = t("serviceDetail.ai.diagram.visual") || {};
  const nodes = visual.nodes || {};
  const context = nodes.context || {};
  const agent = nodes.agent || {};
  const tools = nodes.tools || {};
  const data = nodes.data || {};
  const rules = nodes.rules || {};
  const action = nodes.action || {};
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
    { id: "user", x1: 170, y1: 58, x2: 226, y2: 58, dur: 3.4, delay: 0, drawDelay: 0.1 },
    { id: "ctx", x1: 315, y1: 84, x2: 315, y2: 108, dur: 3.4, delay: 0.4, drawDelay: 0.5 },
    { id: "agent-bus", x1: 325, y1: 204, x2: 325, y2: 260, dur: 3.6, delay: 0.7, drawDelay: 0.8 },
    { id: "bus", x1: 105, y1: 264, x2: 705, y2: 264, bow: 8, dur: 4.6, delay: 1, drawDelay: 1.15 },
    ...[105, 305, 505, 705].map((x, i) => ({
      id: `drop-${x}`,
      x1: x, y1: 264, x2: x, y2: 288,
      dur: 3,
      delay: 1.2 + i * 0.2,
      drawDelay: 1.45 + i * 0.1,
    })),
    { id: "review", x1: 705, y1: 344, x2: 705, y2: 380, dashed: true, dur: 4, delay: 1.8 },
  ];

  const compactFlows = [
    { id: "c-1", x1: 160, y1: 58, x2: 160, y2: 80, dur: 3.4, delay: 0, drawDelay: 0.1 },
    { id: "c-2", x1: 160, y1: 128, x2: 160, y2: 150, dur: 3.6, delay: 0.4, drawDelay: 0.5 },
    { id: "c-3", x1: 160, y1: 230, x2: 160, y2: 246, dur: 3.6, delay: 0.7, drawDelay: 0.8 },
    { id: "c-bus", x1: 64, y1: 246, x2: 256, y2: 246, dur: 4.2, delay: 1, drawDelay: 1.15 },
    { id: "c-drop", x1: 160, y1: 246, x2: 160, y2: 256, dur: 3, delay: 1.2, drawDelay: 1.45 },
    { id: "c-act", x1: 160, y1: 308, x2: 160, y2: 332, dur: 3.8, delay: 1.5, drawDelay: 1.75 },
    { id: "c-rev", x1: 160, y1: 384, x2: 160, y2: 408, dashed: true, dur: 4.2, delay: 1.9 },
  ];

  const font = "'Space Grotesk','Plus Jakarta Sans',sans-serif";

  return (
    <div
      ref={wrapRef}
      className={`ai2-arch-wrap${inView ? " ai2-arch-wrap--on" : ""}`}
    >
      {/* ── DESKTOP / TABLET ── */}
      <svg
        viewBox="0 0 900 460"
        className="ai2-arch-svg ai2-arch-svg--full"
        role="img"
        aria-label={visual.aria}
        style={{ fontFamily: font }}
      >
        {/* Fiber connectors + looping gold particles */}
        <FlowLines draw={inView} flows={fullFlows} />

        <polygon points={archArrow(170, 58, 230, 58)} className="ai2-arch-arrow ai2-arch-node" style={{ "--d": "0.75s" }} />

        <polygon points={archArrow(315, 84, 315, 112)} className="ai2-arch-arrow ai2-arch-node" style={{ "--d": "1.15s" }} />

        <polygon points={archArrow(325, 204, 325, 264)} className="ai2-arch-arrow ai2-arch-node" style={{ "--d": "1.45s" }} />
        <polygon points={archArrow(705, 344, 705, 384)} className="ai2-arch-arrow ai2-arch-node" style={{ "--d": "2.85s" }} />

        {/* USER / EVENT */}
        <g className="ai2-arch-node" style={{ "--d": "0.05s" }}>
          <rect x="20" y="32" width="150" height="52" rx="12" className="ai2-node" />
          <text x="95" y="54" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">{nodes.user1}</text>
          <text x="95" y="72" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">{nodes.user2}</text>
        </g>

        {/* CONTEXT */}
        <g className="ai2-arch-node" style={{ "--d": "0.2s" }}>
          <rect x="230" y="32" width="170" height="52" rx="12" className="ai2-node" />
          <text x="315" y="54" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">{context.t}</text>
          <text x="315" y="72" textAnchor="middle" className="ai2-node-sub">{context.s}</text>
        </g>

        {/* AI AGENT — the visual focal point */}
        <g className="ai2-arch-node" style={{ "--d": "0.6s" }}>
          <rect x="240" y="112" width="170" height="92" rx="16" fill="var(--brand-primary)" className="ai2-core-node" />
          <text x="325" y="150" textAnchor="middle" className="ai2-node-text ai2-node-text--on-accent">{agent.t}</text>
          <text x="325" y="170" textAnchor="middle" className="ai2-node-sub ai2-node-sub--on-accent">{agent.s1}</text>
          <text x="325" y="186" textAnchor="middle" className="ai2-node-sub ai2-node-sub--on-accent">{agent.s2}</text>
        </g>

        {/* TOOLS / DATA / RULES / ACTION */}
        {[
          { x: 30, t: tools.t, s: tools.s },
          { x: 230, t: data.t, s: data.s },
          { x: 430, t: rules.t, s: rules.s },
        ].map((n, i) => (
          <g key={n.t} className="ai2-arch-node" style={{ "--d": `${1.3 + i * 0.1}s` }}>
            <rect x={n.x} y="292" width="150" height="52" rx="12" className="ai2-node" />
            <text x={n.x + 75} y="314" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">{n.t}</text>
            <text x={n.x + 75} y="332" textAnchor="middle" className="ai2-node-sub">{n.s}</text>
          </g>
        ))}
        <g className="ai2-arch-node" style={{ "--d": "1.6s" }}>
          <rect x="630" y="292" width="150" height="52" rx="12" className="ai2-node ai2-node--action" />
          <text x="705" y="322" textAnchor="middle" className="ai2-node-text ai2-node-text--sm ai2-node-text--action">{action.t}</text>
        </g>

        {/* HUMAN CHECK — exception checkpoint */}
        <g className="ai2-arch-node" style={{ "--d": "2.3s" }}>
          <rect x="630" y="384" width="150" height="52" rx="12" className="ai2-node ai2-node--review" />
          <text x="705" y="416" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">{nodes.review?.t}</text>
        </g>
      </svg>

      {/* ── MOBILE: vertical stack ── */}
      <svg
        viewBox="0 0 320 480"
        className="ai2-arch-svg ai2-arch-svg--compact"
        role="img"
        aria-label={visual.aria}
        style={{ fontFamily: font }}
      >
        <FlowLines draw={inView} flows={compactFlows} />
        <polygon points={archArrow(160, 58, 160, 84)} className="ai2-arch-arrow ai2-arch-node" style={{ "--d": "0.75s" }} />
        <polygon points={archArrow(160, 128, 160, 154)} className="ai2-arch-arrow ai2-arch-node" style={{ "--d": "1.15s" }} />

        <polygon points={archArrow(160, 308, 160, 336)} className="ai2-arch-arrow ai2-arch-node" style={{ "--d": "2.4s" }} />
        <polygon points={archArrow(160, 384, 160, 412)} className="ai2-arch-arrow ai2-arch-node" style={{ "--d": "2.85s" }} />

        <g className="ai2-arch-node" style={{ "--d": "0.05s" }}>
          <rect x="60" y="14" width="200" height="44" rx="12" className="ai2-node" />
          <text x="160" y="32" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">{nodes.user1} {nodes.user2}</text>
        </g>
        <g className="ai2-arch-node" style={{ "--d": "0.2s" }}>
          <rect x="60" y="84" width="200" height="44" rx="12" className="ai2-node" />
          <text x="160" y="102" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">{context.t}</text>
          <text x="160" y="118" textAnchor="middle" className="ai2-node-sub">{context.s}</text>
        </g>
        <g className="ai2-arch-node" style={{ "--d": "0.6s" }}>
          <rect x="60" y="154" width="200" height="76" rx="16" fill="var(--brand-primary)" className="ai2-core-node" />
          <text x="160" y="184" textAnchor="middle" className="ai2-node-text ai2-node-text--on-accent">{agent.t}</text>
          <text x="160" y="202" textAnchor="middle" className="ai2-node-sub ai2-node-sub--on-accent">{agent.s1}</text>
          <text x="160" y="218" textAnchor="middle" className="ai2-node-sub ai2-node-sub--on-accent">{agent.s2}</text>
        </g>
        {[
          { x: 20, t: tools.t },
          { x: 116, t: data.t },
          { x: 212, t: rules.t },
        ].map((n, i) => (
          <g key={n.t} className="ai2-arch-node" style={{ "--d": `${1.3 + i * 0.1}s` }}>
            <rect x={n.x} y="260" width="88" height="48" rx="12" className="ai2-node" />
            <text x={n.x + 44} y="289" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">{n.t}</text>
          </g>
        ))}
        <g className="ai2-arch-node" style={{ "--d": "1.6s" }}>
          <rect x="60" y="336" width="200" height="48" rx="12" className="ai2-node ai2-node--action" />
          <text x="160" y="366" textAnchor="middle" className="ai2-node-text ai2-node-text--sm ai2-node-text--action">{action.t}</text>
        </g>
        <g className="ai2-arch-node" style={{ "--d": "2.3s" }}>
          <rect x="60" y="412" width="200" height="48" rx="12" className="ai2-node ai2-node--review" />
          <text x="160" y="442" textAnchor="middle" className="ai2-node-text ai2-node-text--sm">{nodes.review?.t}</text>
        </g>
      </svg>
    </div>
  );
}

/* ── AGENT WORKSPACE: hero visual.
      Premium enterprise AI execution trace (display-only pipeline).
      Vertical order: Context → AI Agent → Tools → Data → Rules →
      Human Review → Result. Exactly ONE step is active at a time;
      cards are NOT interactive (no hover/click). Only the Run button
      controls execution via real React state + controlled timers. ── */

/* Exact execution order. IDs map to ws.nodes + core agent + result. */
const EXECUTION_ORDER = [
  "context",
  "agent",
  "tools",
  "data",
  "rules",
  "review",
  "result",
];

/* Pipeline index → legacy console step index (console has 8 steps). */
const PIPELINE_TO_CONSOLE = [1, 0, 2, 4, 5, 6, 7];

/* Slow, deliberate pacing: ~1.1s per execution step so the
   signal glide and each active state can be followed easily. */
const EXEC_STEP_MS = 1100;

/* Thin-line icons in the existing lucide visual language. */
const PIPELINE_ICONS = {
  context: FileText,
  agent: BrainCircuit,
  tools: PlugZap,
  data: Database,
  rules: ShieldCheck,
  review: UserCheck,
  result: Workflow,
};

/* Started by the card button and the hero secondary CTA. */
let heroFlowStarter = null;

function AgentWorkspace() {
  const { t } = useLanguage();
  const ws = t("serviceDetail.ai.workspace") || {};
  const nodes = ws.nodes || {};
  const steps = ws.steps || [];
  const controls = ws.controls || {};
  const result = ws.result || null;
  const reduced = useReducedMotion();

  /* Single-active execution state. Only one pipeline card is ever lit. */
  const [activeStep, setActiveStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const timersRef = useRef([]);
  const runRef = useRef(null);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  /* Clean up all timers on unmount. */
  useEffect(
    () => () => {
      clearTimers();
    },
    []
  );

  /* Smooth rail signal: one dot glides down the connector axis,
     resting on whichever card is currently executing. */
  const listRef = useRef(null);
  const rowRefs = useRef([]);
  const [signalTop, setSignalTop] = useState(0);
  const [signalFaded, setSignalFaded] = useState(false);
  const [runId, setRunId] = useState(0);
  /* Derived visibility: lit while a run is on the trace. */
  const signalOn = activeStep >= 0 && !reduced && !signalFaded;

  const placeSignal = useCallback(() => {
    const list = listRef.current;
    const row = rowRefs.current[activeStep];
    if (!list || !row || activeStep < 0) return;
    const listBox = list.getBoundingClientRect();
    const rowBox = row.getBoundingClientRect();
    setSignalTop(rowBox.top - listBox.top + rowBox.height / 2);
  }, [activeStep]);

  /* Glide the signal to each newly active card. */
  useEffect(() => {
    if (activeStep < 0 || reduced) return;
    placeSignal();
  }, [activeStep, reduced, placeSignal]);

  /* Stay aligned if the layout shifts mid-run. */
  useEffect(() => {
    if (activeStep < 0) return undefined;
    window.addEventListener("resize", placeSignal);
    return () => window.removeEventListener("resize", placeSignal);
  }, [activeStep, placeSignal]);

  /* Rest the signal on Result briefly, then dissolve it. */
  useEffect(() => {
    if (!isCompleted) return undefined;
    const t = setTimeout(() => setSignalFaded(true), 800);
    timersRef.current.push(t);
    return () => clearTimeout(t);
  }, [isCompleted]);

  /* Run: reset, then walk Context → … → Result on controlled timers. */
  const run = () => {
    if (isRunning) return;
    clearTimers();
    setIsCompleted(false);
    setIsRunning(true);
    setSignalTop(0);
    setSignalFaded(false);
    setRunId((n) => n + 1);
    setActiveStep(0);
    if (reduced) {
      timersRef.current.push(
        setTimeout(() => {
          setActiveStep(EXECUTION_ORDER.length - 1);
          setIsRunning(false);
          setIsCompleted(true);
        }, 400)
      );
      return;
    }
    for (let i = 1; i < EXECUTION_ORDER.length; i += 1) {
      timersRef.current.push(
        setTimeout(() => {
          setActiveStep(i);
          if (i === EXECUTION_ORDER.length - 1) {
            setIsRunning(false);
            setIsCompleted(true);
          }
        }, EXEC_STEP_MS * i)
      );
    }
  };

  /* Hero secondary CTA replays the same execution. */
  useEffect(() => {
    runRef.current = run;
    heroFlowStarter = () => runRef.current();
    return () => {
      heroFlowStarter = null;
    };
  });

  const flowInfo = (id) => {
    if (id === "agent") return { t: ws.coreTitle, s: ws.coreSub };
    if (id === "result") {
      return result ? { t: result.title, s: result.desc } : null;
    }
    return nodes[id] || null;
  };

  /* Console shares the run: map pipeline index to its console step. */
  const consoleActive =
    activeStep >= 0 ? PIPELINE_TO_CONSOLE[activeStep] ?? -1 : -1;
  const consoleCurrent =
    consoleActive >= 0 && consoleActive < steps.length
      ? steps[consoleActive]
      : null;

  const statusWord = isRunning
    ? controls.running
    : isCompleted
      ? controls.completed || "Completed"
      : controls.readyStatus;

  const runLabel = isRunning
    ? `${controls.running}...`
    : isCompleted
      ? controls.again
      : controls.play;

  return (
    <>
      <div className="ai2-agent-card">
        <div className="ai2-flow-card">
          <div className="ai2-flow-head">
            <span className="ai2-agent-core-mini" aria-hidden="true" />
            <span className="ai2-flow-head-text">
              <strong>{ws.coreTitle}</strong>
              <span>{ws.coreSub}</span>
            </span>
            <span className="ai2-flow-state" role="status">
              <span
                className={`ai2-flow-state-dot${isRunning ? " ai2-flow-state-dot--run" : ""}${isCompleted ? " ai2-flow-state-dot--done" : ""}`}
                aria-hidden="true"
              />
              {statusWord}
            </span>
            <button
              type="button"
              className="demo-btn ai2-flow-run"
              onClick={run}
              disabled={isRunning}
              aria-busy={isRunning}
              aria-label={runLabel}
            >
              {runLabel}
            </button>
          </div>

          {/* Display-only execution trace: no hover, no click targets.
              A single signal dot glides along the connector axis. */}
          <ol ref={listRef} className="ai2-flow-list" aria-label={ws.aria}>
            {EXECUTION_ORDER.map((id, i) => {
              const info = flowInfo(id) || {};
              const Icon = PIPELINE_ICONS[id] || FileText;
              const isActive = activeStep === i;
              return (
                <li
                  key={id}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  className="ai2-flow-row"
                >
                  <div
                    className={`ai2-flow-node ai2-flow-node--${id}${isActive ? " ai2-flow-node--active" : ""}`}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`${info.t}: ${info.s}`}
                  >
                    <span className="ai2-flow-ico" aria-hidden="true">
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <span className="ai2-flow-text">
                      <strong>{info.t}</strong>
                      <span>{info.s}</span>
                    </span>
                    <span
                      className={`ai2-flow-exec-dot${isActive ? " ai2-flow-exec-dot--active" : ""}`}
                      aria-hidden="true"
                    />
                  </div>
                  {i < EXECUTION_ORDER.length - 1 && (
                    <span className="ai2-flow-link" aria-hidden="true" />
                  )}
                </li>
              );
            })}
            {!reduced && (
              <span
                key={`sig-${runId}`}
                className={`ai2-flow-signal${signalOn ? " ai2-flow-signal--on" : ""}`}
                style={{ top: signalTop }}
                aria-hidden="true"
              />
            )}
          </ol>

          <div className="ai2-flow-status" aria-live="polite">
            {activeStep < 0 ? (
              <span className="ai2-flow-hint">{controls.hint}</span>
            ) : isCompleted && result ? (
              <div key="flow-result" className="ai2-flow-result" role="status">
                <span className="ai2-flow-result-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      fill="none"
                      stroke="#fff"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ai2-flow-result-tick"
                    />
                  </svg>
                </span>
                <span className="ai2-flow-result-body">
                  <strong>{result.title}</strong>
                  <span>{result.desc}</span>
                </span>
              </div>
            ) : consoleCurrent ? (
              <span key={`flow-${activeStep}`}>
                <strong>{consoleCurrent.title}</strong> —{" "}
                {consoleCurrent.detail}
              </span>
            ) : (
              <span className="ai2-flow-hint">{controls.hint}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── FEATURE STRIP: four proof points under the hero ── */

const FEATURE_ICONS = [ShieldCheck, Database, UserCheck, BarChart3];

function FeatureStrip({ items }) {
  return (
    <div className="ai2-strip">
      {(items || []).map((f, i) => {
        const Icon = FEATURE_ICONS[i] || ShieldCheck;
        return (
          <div key={f.t} className="ai2-strip-item">
            <span className="ai2-strip-icon" aria-hidden="true">
              <Icon size={20} />
            </span>
            <span className="ai2-strip-body">
              <strong>{f.t}</strong>
              <span>{f.d}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AIAutomationPage() {
  const { t } = useLanguage();
  const svc = t("serviceDetail.ai") || {};
  const meta = svc.meta || {};
  const hero = svc.hero || {};
  const story = svc.narrative || {};
  const problem2 = story.problem || {};
  const capabilities2 = story.capabilities || {};
  const signal = story.signal || {};
  const visual = story.visual || {};
  const cases = story.cases || {};
  const operating = story.operating || {};
  const actions = story.actions || {};
  const control = story.control || {};
  const outcomes = story.outcomes || {};
  const implementation = story.implementation || {};
  const faq = svc.faq || {};
  const related = svc.related || {};
  const cta = buildCTAContent(t, "ai");
  const ctaDiagram = buildCTADiagram(t, "ai");
  const relatedItems = (related.items || []).map((r, i) => ({
    ...r,
    href: RELATED_HREFS[i] || r.href,
    accent: "var(--brand-primary)",
  }));

  return (
    <div
      className="ai2-page"
      style={{
        "--svc": "var(--brand-primary)",
        "--svc-rgb": "var(--brand-rgb)",
        "--svc-text": "var(--brand-deep)",
      }}
    >
      <Meta
        title={meta.title}
        description={meta.description}
        canonical="/ai-automation"
        keywords={meta.keywords}
      />

      <ServiceSchema
        name={meta.schemaName}
        description={meta.schemaDesc}
        url="/ai-automation"
      />

      <BreadcrumbSchema
        items={[
          { name: t("nav.home"), href: "/" },
          { name: t("nav.services"), href: "/#services" },
          { name: hero.title, href: "/ai-automation" },
        ]}
      />

      {/* ==================== HERO ==================== */}
      <Reveal>
        <section className="ai2-hero">
          <div className="ai2-hero-inner">
            <div className="ai2-hero-copy">
              <h1 className="ai2-title">
                {hero.title}
                <br />
                <span className="ai2-title-accent">{hero.highlight}</span>
              </h1>
              <p className="ai2-hero-desc">
                {hero.description}
              </p>
              <div className="ai2-hero-actions">
                <Link to="/contact" className="ai2-primary-btn">
                  <CalendarDays size={18} />
                  {hero.primaryCta}
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="#ai-arch"
                  className="ai2-secondary-btn"
                  onClick={() => {
                    if (typeof heroFlowStarter === "function") heroFlowStarter();
                  }}
                >
                  {hero.secondaryCta}
                </a>
              </div>
            </div>
            <AgentWorkspace />
          </div>
        </section>
      </Reveal>

      {/* ==================== TRUST STRIP ==================== */}
      <Reveal delay={0.04}>
        <section className="ai2-section ai2-section--tight">
          <div className="ai2-container">
            <FeatureStrip items={(svc.workspace || {}).features} />
          </div>
        </section>
      </Reveal>

      {/* ==================== 1 — PROBLEM ==================== */}
      <Reveal delay={0.06}>
        <section className="ai2-section">
          <div className="ai2-container">
            <h2 className="ai2-section-title">
              {problem2.title} <span className="ai2-title-accent">{problem2.highlight}</span>
            </h2>
            <div className="ai2-pain-grid">
              {(problem2.areas || []).map((a, i) => (
                <div key={a.t} className="ai2-pain-card">
                  <span className="ai2-pain-num" aria-hidden="true">0{i + 1}</span>
                  <h3>{a.t}</h3>
                  <p>{a.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== 2 — CAPABILITIES ==================== */}
      <Reveal delay={0.08}>
        <section className="ai2-section ai2-section--tight">
          <div className="ai2-container">
            <h2 className="ai2-section-title">{capabilities2.title}</h2>
            <p className="ai2-section-desc">{capabilities2.desc}</p>
            <div className="ai2-matrix">
              {(capabilities2.items || []).map((c, i) => {
                const Icon = MATRIX_ICONS[i] || Box;
                return (
                  <div key={c.t} className="ai2-matrix-item">
                    <span className="ai2-matrix-icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <span className="ai2-matrix-body">
                      <strong>{c.t}</strong>
                      <span>{c.d}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== 3 — SIGNAL MODEL ==================== */}
      <Reveal delay={0.08}>
        <section className="ai2-section ai2-section--tight">
          <div className="ai2-container">
            <h2 className="ai2-section-title">{signal.title}</h2>
            <p className="ai2-section-desc">{signal.desc}</p>
            <ol className="ai2-runflow">
              {(signal.steps || []).map((s, i, arr) => (
                <li key={s.t} className="ai2-runflow-step">
                  <span className="ai2-runflow-num" aria-hidden="true">0{i + 1}</span>
                  <span className="ai2-runflow-body">
                    <strong>{s.t}</strong>
                    <span>{s.d}</span>
                  </span>
                  {i < arr.length - 1 && (
                    <span className="ai2-runflow-arrow" aria-hidden="true">→</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Reveal>

      {/* ==================== 4 — MAIN AI VISUAL ==================== */}
      <Reveal delay={0.08}>
        <section id="ai-arch" className="ai2-section">
          <div className="ai2-container">
            <h2 className="ai2-section-title">{visual.title}</h2>
            <p className="ai2-section-desc">{visual.desc}</p>
            <div className="ai2-arch-frame">
              <ArchitectureVisual />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== 5 — USE CASES ==================== */}
      <Reveal delay={0.08}>
        <section className="ai2-section ai2-section--tight">
          <div className="ai2-container">
            <h2 className="ai2-section-title">{cases.title}</h2>
            <p className="ai2-section-desc">{cases.desc}</p>
            <div className="ai2-cases">
              {(cases.items || []).map((u, i) => (
                <div key={u.t} className="ai2-case">
                  <span className="ai2-case-num" aria-hidden="true">0{i + 1}</span>
                  <h3>{u.t}</h3>
                  <span className="ai2-case-flow">{u.flow}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== 6 — AI OPERATING MODEL ==================== */}
      <Reveal delay={0.08}>
        <section className="ai2-section ai2-section--tight">
          <div className="ai2-container">
            <h2 className="ai2-section-title">{operating.title}</h2>
            <div className="ai2-process">
              {(operating.items || []).map((s, i) => (
                <div key={s.t} className="ai2-process-item">
                  <span className="ai2-process-number" style={{ color: PROCESS_COLORS[i % PROCESS_COLORS.length] }}>0{i + 1}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== 7 — WHAT THE AI ACTUALLY DOES ==================== */}
      <Reveal delay={0.08}>
        <section className="ai2-section ai2-section--tight">
          <div className="ai2-container">
            <h2 className="ai2-section-title">{actions.title}</h2>
            <div className="ai2-actions-grid">
              {(actions.items || []).map((a) => (
                <div key={a.t} className="ai2-action">
                  <h3>{a.t}</h3>
                  <p>{a.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== 8 — HUMAN CONTROL ==================== */}
      <Reveal delay={0.08}>
        <section className="ai2-section ai2-section--tight">
          <div className="ai2-container">
            <h2 className="ai2-section-title">{control.title}</h2>
            <p className="ai2-section-desc">{control.desc}</p>
            <div className="ai2-control-grid">
              {(control.items || []).map((c, i) => (
                <div key={c.t} className="ai2-control-item">
                  <span className="ai2-control-label" aria-hidden="true">0{i + 1}</span>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== 9 — BUSINESS OUTCOMES ==================== */}
      <Reveal delay={0.08}>
        <section className="ai2-section ai2-section--tight">
          <div className="ai2-container">
            <h2 className="ai2-section-title">{outcomes.title}</h2>
            <div className="ai2-outcomes">
              {(outcomes.items || []).map((o) => (
                <div key={o.t} className="ai2-outcome">
                  <span className="ai2-outcome-marker" aria-hidden="true" />
                  <strong>{o.t}</strong>
                  <p>{o.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== 10 — IMPLEMENTATION ==================== */}
      <Reveal delay={0.08}>
        <section className="ai2-section ai2-section--tight">
          <div className="ai2-container">
            <h2 className="ai2-section-title">{implementation.title}</h2>
            <div className="ai2-impl-grid">
              {(implementation.items || []).map((s, i) => (
                <div key={s.t} className="ai2-impl-item">
                  <span className="ai2-impl-num" aria-hidden="true">0{i + 1}</span>
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
