/**
 * pages/Odoo/index.jsx
 *
 * Odoo Solutions service page.
 * Story: Odoo fits the business process, never the other way round.
 * Accent: SystemaOps brand tokens (no per-service hue).
 * Copy: centralized t("serviceDetail.odoo.*"). Icons stay local.
 */

import { useEffect, useRef, useState } from "react";
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
import FlowLines from "../../components/diagrams/FlowLines";
import { useLanguage } from "../../i18n/useLanguage";
import PremiumCTA from "../../components/service/PremiumCTA";
import { buildCTAContent, buildCTADiagram } from "../../components/service/serviceCTAConfig";
import "../../components/service/ServiceShared.css";
import "../../components/service/ServiceDemo.css";
import { OdooArchitecture } from "../../components/service/Architecture";
import "../../components/service/Architecture.css";

import "./Odoo.css";

/* Icons stay local; all copy comes from t("serviceDetail.odoo.*"). */
const CAPABILITY_ICONS = [
  ClipboardList,
  SlidersHorizontal,
  GitBranch,
  Cpu,
  Blocks,
  Compass,
];

const PROCESS_COLORS = [
  "var(--brand-primary)",
  "var(--brand-deep)",
  "var(--brand-deep)",
  "var(--brand-primary)",
];

/* ── ARCHITECTURE: one complete enterprise diagram.
      Five business modules converge through a vertical bus into
      the Odoo core, which drives business workflows. No hover,
      no tabs, no selection — the full architecture is visible
      immediately. A viewport-triggered entrance traces the
      connectors once; the travelling signals then replay in a
      calm loop while the architecture itself stays static. ── */

/* Desktop module rows (y). */
const MODULE_Y = [16, 74, 132, 190, 248];

/* Arrowhead polygon for a connector segment. */
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
  const diagram = t("serviceDetail.odoo.diagram");
  const nodes = diagram.nodes || [];
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

  /* Fiber flows mirror the module layout; SMIL loops replace
     the old one-shot timer signals. */
  const stubFlows = MODULE_Y.slice(0, nodes.length).map((baseY, i) => {
    const y = baseY + 23;
    return {
      id: `mod-${i}`,
      x1: 170, y1: y, x2: 246, y2: y,
      bow: i % 2 ? -7 : 7,
      dur: 3.6 + i * 0.3,
      delay: i * 0.45,
      drawDelay: 0.1 + i * 0.08,
    };
  });

  const fullFlows = [
    ...stubFlows,
    { id: "bus", x1: 246, y1: 39, x2: 246, y2: 271, bow: 8, dur: 4.6, delay: 0.3, drawDelay: 0.55 },
    { id: "bus-core", x1: 246, y1: 155, x2: 326, y2: 155, dur: 3.4, delay: 0.6, drawDelay: 0.75 },
    { id: "core-flow", x1: 530, y1: 155, x2: 614, y2: 155, dur: 3.4, delay: 0.9, drawDelay: 1.05 },
  ];

  const compactFlows = [0, 1, 2, 3].map((i) => ({
    id: `stub-${i}`,
    x1: 160, y1: 56 + i * 58, x2: 160, y2: 72 + i * 58,
    dur: 3.4,
    delay: i * 0.4,
    drawDelay: 0.1 + i * 0.08,
  })).concat([
    { id: "c-core", x1: 160, y1: 288, x2: 160, y2: 324, dur: 3.8, delay: 0.5, drawDelay: 0.55 },
    { id: "c-flow", x1: 160, y1: 408, x2: 160, y2: 440, dur: 4.2, delay: 1.1, drawDelay: 0.8 },
  ]);

  const font = "'Space Grotesk','Plus Jakarta Sans',sans-serif";

  return (
    <div
      ref={wrapRef}
      className={`od-arch-wrap${inView ? " od-arch-wrap--on" : ""}`}
    >
      {/* ── DESKTOP / TABLET ── */}
      <svg
        viewBox="0 0 860 320"
        className="od-arch-svg od-arch-svg--full"
        role="img"
        aria-label={diagram.aria}
        style={{ fontFamily: font }}
      >
        {/* Fiber connectors + looping gold particles */}
        <FlowLines draw={inView} flows={fullFlows} />

        <polygon
          points={archArrow(246, 155, 330, 155)}
          className="od-arch-arrow od-arch-node"
          style={{ "--d": "1.4s" }}
        />

        {/* Odoo Core → Business Workflows */}
        <polygon
          points={archArrow(530, 155, 620, 155)}
          className="od-arch-arrow od-arch-node"
          style={{ "--d": "1.7s" }}
        />

        {/* Module nodes */}
        {nodes.map((n, i) => {
          const y = MODULE_Y[i];
          return (
            <g
              key={n.t}
              className="od-arch-node"
              style={{ "--d": `${0.05 + i * 0.06}s` }}
            >
              <rect x="20" y={y} width="150" height="46" rx="12" className="od-node" />
              <text x="95" y={y + 20} textAnchor="middle" className="od-node-text">
                {n.t}
              </text>
              <text x="95" y={y + 34} textAnchor="middle" className="od-node-sub">
                {n.s}
              </text>
            </g>
          );
        })}

        {/* Odoo Core */}
        <g className="od-arch-node" style={{ "--d": "0.6s" }}>
          <rect
            x="330"
            y="112"
            width="200"
            height="86"
            rx="16"
            fill="var(--brand-primary)"
            className="od-core-node"
          />
          <text x="430" y="148" textAnchor="middle" className="od-core-title od-node-text--on-accent">
            {diagram.coreTitle}
          </text>
          <text x="430" y="168" textAnchor="middle" className="od-core-title od-node-text--on-accent">
            {diagram.coreLine2}
          </text>
          <text x="430" y="186" textAnchor="middle" className="od-node-sub od-node-sub--on-accent">
            {diagram.coreSub}
          </text>
          {/* Subtle gold logo accent */}
          <line
            x1="504"
            y1="126"
            x2="516"
            y2="126"
            stroke="var(--brand-gold)"
            strokeWidth="1.5"
            opacity="0.9"
          />
          <circle cx="520" cy="126" r="3" fill="var(--brand-gold)" opacity="0.9" />
        </g>

        {/* Business Workflows */}
        <g className="od-arch-node" style={{ "--d": "1.0s" }}>
          <rect x="620" y="126" width="220" height="58" rx="14" className="od-node od-node--ops" />
          <text x="730" y="146" textAnchor="middle" className="od-node-text od-node-text--sm">
            {diagram.opsLine1}
          </text>
          <text x="730" y="164" textAnchor="middle" className="od-node-text od-node-text--sm">
            {diagram.opsLine2}
          </text>
          <text x="730" y="178" textAnchor="middle" className="od-node-sub">
            {diagram.opsSub}
          </text>
        </g>
      </svg>

      {/* ── MOBILE: vertical stack ── */}
      <svg
        viewBox="0 0 320 500"
        className="od-arch-svg od-arch-svg--compact"
        role="img"
        aria-label={diagram.ariaCompact}
        style={{ fontFamily: font }}
      >
        {nodes.map((n, i) => {
          const y = 14 + i * 58;
          return (
            <g key={n.t}>
              <g className="od-arch-node" style={{ "--d": `${0.05 + i * 0.06}s` }}>
                <rect x="60" y={y} width="200" height="42" rx="12" className="od-node" />
                <text x="160" y={y + 18} textAnchor="middle" className="od-node-text">
                  {n.t}
                </text>
                <text x="160" y={y + 32} textAnchor="middle" className="od-node-sub">
                  {n.s}
                </text>
              </g>
            </g>
          );
        })}

        {/* Fiber connectors + looping gold particles */}
        <FlowLines draw={inView} flows={compactFlows} />

        <polygon
          points={archArrow(160, 288, 160, 328)}
          className="od-arch-arrow od-arch-node"
          style={{ "--d": "1.15s" }}
        />

        {/* Core → Workflows */}
        <polygon
          points={archArrow(160, 408, 160, 444)}
          className="od-arch-arrow od-arch-node"
          style={{ "--d": "1.4s" }}
        />

        {/* Odoo Core */}
        <g className="od-arch-node" style={{ "--d": "0.5s" }}>
          <rect
            x="60"
            y="328"
            width="200"
            height="80"
            rx="16"
            fill="var(--brand-primary)"
            className="od-core-node"
          />
          <text x="160" y="362" textAnchor="middle" className="od-core-title od-node-text--on-accent">
            {diagram.coreTitle}
          </text>
          <text x="160" y="380" textAnchor="middle" className="od-core-title od-node-text--on-accent">
            {diagram.coreLine2}
          </text>
          <text x="160" y="398" textAnchor="middle" className="od-node-sub od-node-sub--on-accent">
            {diagram.coreSub}
          </text>
          <circle cx="246" cy="340" r="3" fill="var(--brand-gold)" opacity="0.9" />
        </g>

        {/* Business Workflows */}
        <g className="od-arch-node" style={{ "--d": "0.9s" }}>
          <rect x="60" y="444" width="200" height="52" rx="14" className="od-node od-node--ops" />
          <text x="160" y="466" textAnchor="middle" className="od-node-text od-node-text--sm">
            {diagram.opsLine1}
          </text>
          <text x="160" y="480" textAnchor="middle" className="od-node-text od-node-text--sm">
            {diagram.opsLine2}
          </text>
        </g>
      </svg>

      <p className="od-arch-caption">
        {diagram.captionFullPre} <strong>{diagram.captionFullCore}</strong>
        {diagram.captionFullPost}
      </p>
    </div>
  );
}

export default function OdooPage() {
  const { t } = useLanguage();
  const svc = t("serviceDetail.odoo");
  const meta = svc.meta || {};
  const hero = svc.hero || {};
  const problem = svc.problem || {};
  const architecture = svc.architecture || {};
  const middle = svc.middle || {};
const cta = buildCTAContent(t, "odoo");
const ctaDiagram = buildCTADiagram(t, "odoo");

  return (
    <div
      className="od-page"
      style={{
        "--svc": "var(--brand-primary)",
        "--svc-rgb": "var(--brand-rgb)",
        "--svc-text": "var(--brand-deep)",
      }}
    >
      <Meta
        title={meta.title}
        description={meta.description}
        canonical="/odoo-customization"
        keywords={meta.keywords}
      />

      <ServiceSchema
        name={meta.schemaName}
        description={meta.schemaDesc}
        url="/odoo-customization"
      />

      <BreadcrumbSchema
        items={[
          { name: t("nav.home"), href: "/" },
          { name: t("nav.services"), href: "/#services" },
          { name: hero.title, href: "/odoo-customization" },
        ]}
      />

      {/* ==================== HERO ==================== */}
      <Reveal>
        <section className="od-hero">
          <div className="od-hero-inner">
            <div className="od-hero-copy">
              <h1 className="od-title">
                {hero.title}
                <br />
                <span className="od-title-accent">{hero.highlight}</span>
              </h1>
              <p className="od-hero-desc">
                {hero.description}
              </p>
              <div className="od-hero-actions">
                <Link to="/contact" className="od-primary-btn">
                  <CalendarDays size={18} />
                  {hero.primaryCta}
                  <ArrowRight size={16} />
                </Link>
                <a href="#od-arch" className="od-secondary-btn">
                  {hero.secondaryCta}
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
            <h2 className="od-section-title">
              {problem.title}{" "}
              <span className="od-title-accent">{problem.highlight}</span>
            </h2>
            <div className="od-before-after">
              <div className="od-before">
                <span className="od-ba-label">{problem.beforeLabel}</span>
                <ul>
                  {(problem.beforeItems || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="od-after">
                <span className="od-ba-label">{problem.afterLabel}</span>
                <ul>
                  {(problem.afterItems || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== ARCHITECTURE ==================== */}
      <Reveal delay={0.08}>
        <section id="od-arch" className="od-section">
          <div className="od-container">
            <h2 className="od-section-title">{architecture.title}</h2>
            <p className="od-section-desc">
              {architecture.desc}
            </p>
            <div className="od-arch-frame">
              <ArchitectureVisual />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== WHAT WE SOLVE ==================== */}
      <Reveal delay={0.08}>
        <section className="od-section od-section--tight">
          <div className="od-container">
            <h2 className="od-section-title">{(middle.solve || {}).title}</h2>
            <p className="od-section-desc">{(middle.solve || {}).desc}</p>
            <div className="od-solve">
              {((middle.solve || {}).items || []).map((s, i) => (
                <div key={s.t} className="od-solve-item">
                  <span className="od-process-number" style={{ color: PROCESS_COLORS[i % PROCESS_COLORS.length] }}>0{i + 1}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== WHAT WE PROVIDE ==================== */}
      <Reveal delay={0.08}>
        <section className="od-section od-section--tight">
          <div className="od-container">
            <h2 className="od-section-title">{(middle.provide || {}).title}</h2>
            <p className="od-section-desc">{(middle.provide || {}).desc}</p>
            <div className="od-cap-list">
              {((middle.provide || {}).items || []).map((c, i) => {
                const Icon = CAPABILITY_ICONS[i] || ClipboardList;
                return (
                  <div key={c.t} className="od-cap-mini">
                    <span className="od-cap-mini-icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <div className="od-cap-mini-body">
                      <h3>{c.t}</h3>
                      <p>{c.d}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== USE CASES ==================== */}
      <Reveal delay={0.08}>
        <section className="od-section od-section--tight">
          <div className="od-container">
            <h2 className="od-section-title">{(middle.usecases || {}).title}</h2>
            <p className="od-section-desc">{(middle.usecases || {}).desc}</p>
            <div className="od-usecases">
              {((middle.usecases || {}).items || []).map((u, i, arr) => (
                <div
                  key={u.t}
                  className={`od-usecase${i === arr.length - 1 && arr.length % 2 === 1 ? " od-usecase--wide" : ""}`}
                >
                  <span className="od-usecase-index">0{i + 1}</span>
                  <h3>{u.t}</h3>
                  <div className="od-flow" aria-hidden="true">
                    {(u.flow || []).map((f, j) => (
                      <span key={f} className="od-flow-step">
                        {f}
                        {j < (u.flow || []).length - 1 && <span className="od-flow-arrow">→</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== HOW WE WORK ==================== */}
      <Reveal delay={0.1}>
        <section className="od-section od-section--tight">
          <div className="od-container">
            <h2 className="od-section-title">{(middle.delivery || {}).title}</h2>
            <div className="od-steps">
              {((middle.delivery || {}).items || []).map((s, i) => (
                <div key={s.t} className="od-step">
                  <span className="od-step-num">0{i + 1}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

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
