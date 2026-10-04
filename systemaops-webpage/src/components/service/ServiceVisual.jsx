/**
 * components/service/ServiceVisual.jsx
 *
 * ONE DESIGN SYSTEM — SIX VISUAL LANGUAGES.
 *
 * Responsive-first service visuals. Every label is real HTML
 * text (never SVG <text>, never textLength) so typography can
 * never stretch, clip, or distort at any viewport.
 *
 * One component per service, one shared data shape from
 * buildCTADiagram(): { center, centerSub, nodes: [{t, s}] }.
 * Layouts reflow with flex/grid (row on desktop, column on
 * mobile) — the desktop composition is never squeezed.
 *
 * Motion is CSS-only (transform/opacity): travelling pulse
 * dots, breathing focal glow, roadmap traveler, sparkline
 * drift. All gated by prefers-reduced-motion in CSS.
 *
 * aria-hidden: the adjacent CTA copy carries the meaning.
 */

import "./ServiceVisual.css";

function n(diagram, i) {
  return {
    t: diagram.nodes?.[i]?.t || "",
    s: diagram.nodes?.[i]?.s || "",
  };
}

/* ── shared primitives (HTML, reflow-safe) ── */

function Card({ title, sub, focal = false, className = "" }) {
  return (
    <div
      className={`sv-card${focal ? " sv-card--focal" : ""}${className ? ` ${className}` : ""}`}
    >
      <b className="sv-card-t">{title}</b>
      {sub ? <span className="sv-card-s">{sub}</span> : null}
    </div>
  );
}

/* Connector between two cards. Horizontal on desktop, vertical
   on mobile — switched purely by CSS. */
function FlowLink() {
  return (
    <span className="sv-link" aria-hidden="true">
      <i className="sv-link-dot" />
    </span>
  );
}

/* ================================================================
   1. AI AUTOMATION — intelligent pipeline
   feeders → AI focal → action
================================================================ */

function AIPipeline({ diagram }) {
  const feeders = [n(diagram, 0), n(diagram, 1), n(diagram, 2)];
  const out = n(diagram, 3);
  return (
    <div className="sv-pipe">
      <div className="sv-feeders">
        {feeders.map((f, i) => (
          <Card key={i} title={f.t} sub={f.s} />
        ))}
      </div>
      <FlowLink />
      <Card title={diagram.center} sub={diagram.centerSub} focal />
      <FlowLink />
      <Card title={out.t} sub={out.s} />
    </div>
  );
}

/* ================================================================
   2. ODOO ERP — enterprise hub (radial suits ERP modules)
   Stable center, hover highlights a module, no rotation.
================================================================ */

function OdooHub({ diagram }) {
  const modules = [n(diagram, 0), n(diagram, 1), n(diagram, 2), n(diagram, 3)];
  return (
    <div className="sv-hub">
      <div className="sv-hub-row sv-hub-row--single">
        <Card title={modules[0].t} sub={modules[0].s} />
      </div>
      <FlowLink />
      <div className="sv-hub-row">
        <Card title={modules[1].t} sub={modules[1].s} />
        <Card title={diagram.center} sub={diagram.centerSub} focal className="sv-hub-core" />
        <Card title={modules[2].t} sub={modules[2].s} />
      </div>
      <FlowLink />
      <div className="sv-hub-row sv-hub-row--single">
        <Card title={modules[3].t} sub={modules[3].s} />
      </div>
    </div>
  );
}

/* ================================================================
   3. WORKFLOW AUTOMATION — process graph with a branch.
   `linear` renders the same component as a straight chain
   (used by the Data & Document page).
================================================================ */

function WorkflowGraph({ diagram, linear = false }) {
  const stages = [n(diagram, 0), n(diagram, 1), n(diagram, 2), n(diagram, 3)];

  if (linear) {
    return (
      <div className="sv-chain">
        {stages.map((s, i) => (
          <span key={i} className="sv-chain-step">
            <Card title={s.t} sub={s.s} />
            {i < stages.length - 1 ? <FlowLink /> : null}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="sv-flow">
      <div className="sv-flow-main">
        <Card title={stages[0].t} sub={stages[0].s} />
        <FlowLink />
        <Card title={stages[1].t} sub={stages[1].s} focal />
      </div>
      <FlowLink />
      <div className="sv-branch">
        <Card title={stages[2].t} sub={stages[2].s} />
        <Card title={stages[3].t} sub={stages[3].s} />
      </div>
    </div>
  );
}

/* ================================================================
   4. AIOPS MONITORING — observability dashboard (HTML: reflows)
================================================================ */

function AIOpsDashboard({ diagram }) {
  const tiles = [n(diagram, 0), n(diagram, 1), n(diagram, 2), n(diagram, 3)];
  return (
    <div className="sv-dash" aria-hidden="true">
      <div className="sv-dash-head">
        <strong>{diagram.center}</strong>
        <span className="sv-live">
          <i />
          Live
        </span>
      </div>
      <p className="sv-dash-sub">{diagram.centerSub}</p>
      <svg viewBox="0 0 400 84" className="sv-spark" aria-hidden="true">
        <path
          d="M0,62 L36,56 L64,60 L96,44 L128,50 L160,34 L192,42 L224,28 L256,36 L288,22 L320,30 L352,18 L400,24"
          fill="none"
          className="sv-spark-line sv-spark-line--flow"
        />
        <path
          d="M0,62 L36,56 L64,60 L96,44 L128,50 L160,34 L192,42 L224,28 L256,36 L288,22 L320,30 L352,18 L400,24 V84 H0 Z"
          className="sv-spark-area"
        />
        <circle cx={352} cy={18} r={4} className="sv-spark-dot" />
      </svg>
      <ul className="sv-dash-tiles">
        {tiles.map((item, i) => (
          <li key={i} style={{ "--d": `${i * 0.5}s` }}>
            <i aria-hidden="true" />
            <div>
              <b>{item.t}</b>
              <span>{item.s}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================================================================
   5. AI CONSULTING — strategy roadmap (HTML: reflows)
================================================================ */

function ConsultingRoadmap({ diagram }) {
  const steps = [n(diagram, 0), n(diagram, 1), n(diagram, 2), n(diagram, 3)];
  return (
    <div className="sv-road" aria-hidden="true">
      <div className="sv-road-goal">
        <strong>{diagram.center}</strong>
        <span>{diagram.centerSub}</span>
      </div>
      <ol className="sv-road-steps">
        {steps.map((item, i) => (
          <li key={i}>
            <span className="sv-road-dot">
              <i>{i + 1}</i>
            </span>
            <div>
              <b>{item.t}</b>
              <span>{item.s}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ================================================================
   6. SYSTEM INTEGRATIONS — layered bridge ecosystem (not radial)
================================================================ */

function IntegrationMesh({ diagram }) {
  const top = [n(diagram, 0), n(diagram, 1)];
  const bottom = [n(diagram, 2), n(diagram, 3)];
  return (
    <div className="sv-mesh">
      <div className="sv-mesh-row">
        {top.map((item, i) => (
          <Card key={i} title={item.t} sub={item.s} />
        ))}
      </div>
      <div className="sv-mesh-links">
        <FlowLink />
        <FlowLink />
      </div>
      <Card title={diagram.center} sub={diagram.centerSub} focal />
      <div className="sv-mesh-links">
        <FlowLink />
        <FlowLink />
      </div>
      <div className="sv-mesh-row">
        {bottom.map((item, i) => (
          <Card key={i} title={item.t} sub={item.s} />
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   DISPATCHER
================================================================ */

const VISUALS = {
  "ai-pipeline": AIPipeline,
  "odoo-hub": OdooHub,
  "workflow-graph": WorkflowGraph,
  "doc-chain": WorkflowGraph,
  "aiops-dashboard": AIOpsDashboard,
  "consulting-roadmap": ConsultingRoadmap,
  "integration-mesh": IntegrationMesh,
};

export default function ServiceVisual({ variant, diagram }) {
  if (!diagram || (!diagram.center && !(diagram.nodes || []).length)) {
    return null;
  }
  const Visual = VISUALS[variant] || OdooHub;
  const linear = variant === "doc-chain";
  return (
    <div className="sv" data-variant={variant}>
      <Visual diagram={diagram} linear={linear} />
    </div>
  );
}
