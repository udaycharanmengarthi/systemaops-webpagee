/**
 * pages/SystemIntegrations/index.jsx
 *
 * System Integration & APIs service page.
 * Story: different systems, one reliable flow.
 * Accent: SystemaOps brand tokens (no per-service hue).
 * Copy: centralized t("serviceDetail.integration.*"). Icons stay local.
 */

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Boxes,
  CalendarDays,
  PlugZap,
  ShoppingCart,
  UserCheck,
  Users,
  Wallet,
  Warehouse,
  Wrench,
} from "lucide-react";

import { Link } from "react-router-dom";

import Meta from "../../seo/Meta";
import ServiceSchema from "../../seo/schema/ServiceSchema";
import BreadcrumbSchema from "../../seo/schema/BreadcrumbSchema";
import Reveal from "../../components/ui/Reveal";
import { useLanguage } from "../../i18n/useLanguage";
import FlowLines from "../../components/diagrams/FlowLines";
import {
  ServiceFaq,
  RelatedServices,
} from "../../components/service/ServiceSections";
import PremiumCTA from "../../components/service/PremiumCTA";
import { buildCTAContent, buildCTADiagram } from "../../components/service/serviceCTAConfig";
import "../../components/service/ServiceShared.css";
import "../../components/service/ServiceDemo.css";
import { useReducedMotion } from "../../components/service/useReducedMotion";

import "./SystemIntegrations.css";

/* Icons stay local; all copy comes from t("serviceDetail.integration.*"). */

const CONNECT_ICONS = [
  Boxes,
  Users,
  Wallet,
  UserCheck,
  Warehouse,
  ShoppingCart,
  Wrench,
  PlugZap,
];

const PROCESS_COLORS = [
  "var(--brand-primary)",
  "var(--brand-deep)",
  "var(--brand-deep)",
  "var(--brand-primary)",
];

const RELATED_HREFS = [
  "/odoo-customization",
  "/workflow-automation",
  "/ai-automation",
];

/* ── INTEGRATION NETWORK: hero visual. Six business systems
      orbit the SystemaOps integration core. One path activates
      at a time: a packet travels node → core, the core answers,
      and the packet continues to its destination. The cycle
      advances on its own; selecting a node traces it directly.
      Reduced motion shows state only. ── */

const NET_CX = 280;
const NET_CY = 228;
const NET_RX = 196;
const NET_RY = 148;
const NET_ANGLES = [-90, -30, 30, 90, 150, 210];

function netPos(i) {
  const a = ((NET_ANGLES[i % NET_ANGLES.length] || 0) * Math.PI) / 180;
  return {
    x: NET_CX + NET_RX * Math.cos(a),
    y: NET_CY + NET_RY * Math.sin(a),
  };
}

function netCurve(x1, y1, bow) {
  const mx = (x1 + NET_CX) / 2;
  const my = (y1 + NET_CY) / 2;
  const dx = NET_CX - x1;
  const dy = NET_CY - y1;
  const len = Math.hypot(dx, dy) || 1;
  const qx = mx + ((-dy / len) * bow);
  const qy = my + ((dx / len) * bow);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${NET_CX} ${NET_CY}`;
}

function IntegrationNetwork() {
  const { t } = useLanguage();
  const net = t("serviceDetail.integration.network") || {};
  const nodes = net.nodes || [];
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const count = Math.max(nodes.length, 1);
  const current = active % count;
  const dest = current === 1 ? 0 : 1;

  /* Slow elegant cycle: one path at a time. Any selection
     restarts the pause, so reading never races the motion. */
  useEffect(() => {
    if (reduced) return undefined;
    const id = setTimeout(
      () => setActive((a) => (a + 1) % count),
      3200
    );
    return () => clearTimeout(id);
  }, [active, count, reduced]);

  const caption = t(
    "serviceDetail.integration.network.activeDesc",
    {
      source: nodes[current]?.t || "",
      dest: nodes[dest]?.t || "",
    }
  );

  const onNodeKey = (e, i) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActive(i);
    }
  };

  const from = netPos(current);
  const to = netPos(dest);

  const fwdD = `M${NET_CX} ${NET_CY} Q${((NET_CX + to.x) / 2).toFixed(1)} ${((NET_CY + to.y) / 2 - 26).toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;

  /* Looping gold packets on every spoke; the active route carries
     two extra signals (request in, forward out). Remounting on
     tab change restarts the active route from its source. */
  const netFlows = [
    ...nodes.map((n, i) => {
      const p = netPos(i);
      return {
        id: `spoke-${n.t || i}`,
        d: netCurve(p.x, p.y, i % 2 ? 30 : -30),
        dur: 4.2 + (i % 3) * 0.4,
        delay: i * 0.35,
      };
    }),
    { id: "req", d: netCurve(from.x, from.y, 30), dur: 3.2, delay: 0 },
    { id: "fwd", d: fwdD, dur: 3.2, delay: 0.8 },
  ];

  return (
    <div className="si-net">
      <div
        className="si-net-tabs"
        role="tablist"
        aria-label={net.tabsLabel}
      >
        {nodes.map((n, i) => (
          <button
            key={n.t || i}
            type="button"
            role="tab"
            aria-selected={current === i}
            tabIndex={current === i ? 0 : -1}
            className={`si-arch-tab ${current === i ? "si-arch-tab--active" : ""}`}
            onClick={() => setActive(i)}
          >
            {n.t}
          </button>
        ))}
      </div>
      <svg
        viewBox="0 0 560 480"
        className="si-net-svg"
        role="img"
        aria-label={net.aria}
      >
        <FlowLines key={`nw-${current}`} flows={netFlows} />
        <g fontFamily="'Space Grotesk','Plus Jakarta Sans',sans-serif">
          {nodes.map((n, i) => {
            const p = netPos(i);
            const on = current === i || dest === i;
            return (
              <g
                key={n.t || i}
                role="button"
                tabIndex={0}
                aria-label={n.t}
                style={{ cursor: "pointer", outline: "none" }}
                opacity={on ? 1 : 0.5}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onNodeKey(e, i)}
              >
                <rect
                  x={p.x - 62}
                  y={p.y - 27}
                  width={124}
                  height={54}
                  rx={13}
                  className={`si-node${current === i ? " si-node--hot" : ""}`}
                />
                <text
                  x={p.x}
                  y={p.y - 1}
                  textAnchor="middle"
                  className="si-node-text si-node-text--sm"
                >
                  {n.t}
                </text>
                <text
                  x={p.x}
                  y={p.y + 16}
                  textAnchor="middle"
                  className="si-node-sub"
                >
                  {n.s}
                </text>
              </g>
            );
          })}
          <rect
            x={NET_CX - 88}
            y={NET_CY - 50}
            width={176}
            height={100}
            rx={18}
            fill="var(--brand-primary)"
          />
          <text
            x={NET_CX}
            y={NET_CY - 8}
            textAnchor="middle"
            className="si-node-text si-node-text--on-accent"
          >
            {net.core}
          </text>
          <text
            x={NET_CX}
            y={NET_CY + 14}
            textAnchor="middle"
            className="si-node-sub si-node-sub--on-accent"
          >
            {net.coreSub}
          </text>
        </g>
      </svg>
      <div className="si-net-flow" aria-hidden="true">
        <span className="si-net-chip">{nodes[current]?.t}</span>
        <span className="si-net-arrow">↓</span>
        <span className="si-net-chip si-net-chip--core">{net.core}</span>
        <span className="si-net-arrow">↓</span>
        <span className="si-net-chip">{nodes[dest]?.t}</span>
      </div>
      <p key={`nw-cap-${current}`} className="si-net-caption demo-caption-swap">
        <strong>{nodes[current]?.t}</strong>
        {caption ? ` ${caption}` : ""}
      </p>
    </div>
  );
}

/* ── ARCHITECTURE: one complete static diagram.
      Source systems feed a vertical bus into the SystemaOps
      integration layer (API, webhook, validation, retry), which
      drives the business workflow; unresolved cases land in the
      exception queue. No tabs, no hover, no hidden states.
      A one-time, viewport-triggered entrance traces the
      connectors once, then settles. ── */

const SI_SRC_Y = [24, 88, 152, 216, 280];

function siArrow(x1, y1, x2, y2, size = 8) {
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
  const arch = t("serviceDetail.integration.diagram.arch") || {};
  const sources = arch.sources || [];
  const layerItems = arch.layerItems || [];
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

  /* Fiber flows mirror the node layout; SMIL loops replace the
     old one-shot timer signals. */
  const stubFlows = SI_SRC_Y.slice(0, sources.length).map((baseY, i) => {
    const y = baseY + 22;
    return {
      id: `src-${i}`,
      x1: 170, y1: y, x2: 246, y2: y,
      bow: i % 2 ? -7 : 7,
      dur: 3.6 + i * 0.3,
      delay: i * 0.45,
      drawDelay: 0.1 + i * 0.08,
    };
  });

  const fullFlows = [
    ...stubFlows,
    { id: "bus", x1: 246, y1: 46, x2: 246, y2: 302, bow: 8, dur: 4.6, delay: 0.3, drawDelay: 0.55 },
    { id: "bus-layer", x1: 246, y1: 174, x2: 326, y2: 174, dur: 3.4, delay: 0.6, drawDelay: 0.75 },
    { id: "layer-flow", x1: 530, y1: 174, x2: 596, y2: 174, dur: 3.4, delay: 0.9, drawDelay: 1.05 },
    { id: "except", d: "M430 222 Q430 344 198 344", dashed: true, dur: 4.4, delay: 1.2 },
  ];

  const compactFlows = [
    { id: "c-layer", x1: 160, y1: 244, x2: 160, y2: 278, dur: 3.4, delay: 0, drawDelay: 0.55 },
    { id: "c-flow", x1: 160, y1: 370, x2: 160, y2: 402, dur: 3.8, delay: 0.6, drawDelay: 0.8 },
    { id: "c-except", x1: 160, y1: 458, x2: 160, y2: 488, dashed: true, dur: 4.2, delay: 1.2 },
  ];

  const font = "'Space Grotesk','Plus Jakarta Sans',sans-serif";

  return (
    <div
      ref={wrapRef}
      className={`si-arch-wrap${inView ? " si-arch-wrap--on" : ""}`}
    >
      {/* ── DESKTOP / TABLET ── */}
      <svg
        viewBox="0 0 860 390"
        className="si-arch-svg si-arch-svg--full"
        role="img"
        aria-label={arch.aria}
        style={{ fontFamily: font }}
      >
        {/* Fiber connectors + looping gold particles */}
        <FlowLines draw={inView} flows={fullFlows} />

        <polygon points={siArrow(246, 174, 330, 174)} className="si-arch-arrow si-arch-node" style={{ "--d": "1.4s" }} />

        <polygon points={siArrow(530, 174, 600, 174)} className="si-arch-arrow si-arch-node" style={{ "--d": "1.7s" }} />

        <polygon points={siArrow(430, 344, 196, 344, 7)} className="si-arch-arrow si-arch-node" style={{ "--d": "2.4s" }} />

        {/* Source nodes */}
        {sources.map((s, i) => {
          const y = SI_SRC_Y[i];
          return (
            <g key={s || i} className="si-arch-node" style={{ "--d": `${0.05 + i * 0.06}s` }}>
              <rect x="20" y={y} width="150" height="44" rx="10" className="si-node" />
              <text x="95" y={y + 28} textAnchor="middle" className="si-node-text si-node-text--sm">{s}</text>
            </g>
          );
        })}

        {/* Integration layer panel */}
        <g className="si-arch-node" style={{ "--d": "0.6s" }}>
          <rect x="330" y="126" width="200" height="96" rx="14" className="si-node si-node--panel si-core-node" />
          <text x="430" y="148" textAnchor="middle" className="si-node-text si-node-text--sm">{arch.layerTitle}</text>
          {layerItems.map((item, i) => (
            <g key={item || i}>
              <rect x={342 + (i % 2) * 96} y={156 + Math.floor(i / 2) * 28} width="90" height="22" rx="8" fill="color-mix(in srgb, var(--brand-primary) 12%, transparent)" stroke="none" />
              <text x={387 + (i % 2) * 96} y={156 + Math.floor(i / 2) * 28 + 15} textAnchor="middle" className="si-node-text si-node-text--sm">{item}</text>
            </g>
          ))}
        </g>

        {/* Business workflow */}
        <g className="si-arch-node" style={{ "--d": "1.0s" }}>
          <rect x="600" y="146" width="240" height="56" rx="14" fill="var(--brand-primary)" className="si-core-node" />
          <text x="720" y="168" textAnchor="middle" className="si-node-text si-node-text--sm si-node-text--on-accent">{arch.businessLine1}</text>
          <text x="720" y="186" textAnchor="middle" className="si-node-text si-node-text--sm si-node-text--on-accent">{arch.businessLine2}</text>
        </g>

        {/* Exception queue */}
        <g className="si-arch-node" style={{ "--d": "2.0s" }}>
          <rect x="40" y="322" width="150" height="44" rx="10" className="si-node" />
          <text x="115" y="350" textAnchor="middle" className="si-node-text si-node-text--sm">{arch.exceptionLabel}</text>
        </g>
      </svg>

      {/* ── MOBILE: vertical stack ── */}
      <svg
        viewBox="0 0 320 550"
        className="si-arch-svg si-arch-svg--compact"
        role="img"
        aria-label={arch.aria}
        style={{ fontFamily: font }}
      >
        {sources.map((s, i) => {
          const y = 14 + i * 48;
          return (
            <g key={s || i} className="si-arch-node" style={{ "--d": `${0.05 + i * 0.06}s` }}>
              <rect x="60" y={y} width="200" height="38" rx="10" className="si-node" />
              <text x="160" y={y + 25} textAnchor="middle" className="si-node-text si-node-text--sm">{s}</text>
            </g>
          );
        })}

        <FlowLines draw={inView} flows={compactFlows} />
        <polygon points={siArrow(160, 244, 160, 282)} className="si-arch-arrow si-arch-node" style={{ "--d": "1.15s" }} />
        <polygon points={siArrow(160, 370, 160, 406)} className="si-arch-arrow si-arch-node" style={{ "--d": "1.4s" }} />
        <polygon points={siArrow(160, 458, 160, 492, 7)} className="si-arch-arrow si-arch-node" style={{ "--d": "2.1s" }} />

        {/* Integration layer panel */}
        <g className="si-arch-node" style={{ "--d": "0.5s" }}>
          <rect x="60" y="282" width="200" height="88" rx="14" className="si-node si-node--panel si-core-node" />
          <text x="160" y="300" textAnchor="middle" className="si-node-text si-node-text--sm">{arch.layerTitle}</text>
          {layerItems.map((item, i) => (
            <g key={item || i}>
              <rect x={70 + (i % 2) * 90} y={308 + Math.floor(i / 2) * 26} width="82" height="20" rx="8" fill="color-mix(in srgb, var(--brand-primary) 12%, transparent)" stroke="none" />
              <text x={111 + (i % 2) * 90} y={308 + Math.floor(i / 2) * 26 + 14} textAnchor="middle" className="si-node-text si-node-text--sm">{item}</text>
            </g>
          ))}
        </g>

        {/* Business workflow */}
        <g className="si-arch-node" style={{ "--d": "0.9s" }}>
          <rect x="60" y="406" width="200" height="52" rx="14" fill="var(--brand-primary)" className="si-core-node" />
          <text x="160" y="426" textAnchor="middle" className="si-node-text si-node-text--sm si-node-text--on-accent">{arch.businessLine1}</text>
          <text x="160" y="444" textAnchor="middle" className="si-node-text si-node-text--sm si-node-text--on-accent">{arch.businessLine2}</text>
        </g>

        {/* Exception queue */}
        <g className="si-arch-node" style={{ "--d": "1.7s" }}>
          <rect x="60" y="492" width="200" height="44" rx="10" className="si-node" />
          <text x="160" y="520" textAnchor="middle" className="si-node-text si-node-text--sm">{arch.exceptionLabel}</text>
        </g>
      </svg>
    </div>
  );
}

/* ── ORDER TIMELINE: an order travels to the invoice.
      Steps and stages light in sequence when the section
      enters the viewport; clicking replays. Reduced motion
      shows the completed timeline. ── */

function OrderTimeline() {
  const { t } = useLanguage();
  const order = t("serviceDetail.integration.order") || {};
  const steps = order.steps || [];
  const stages = order.stages || [];
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
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const play = entered && !reduced;

  return (
    <button
      type="button"
      className="si-order"
      ref={ref}
      aria-label={order.title}
      onClick={() => setRunId((n) => n + 1)}
    >
      <ol
        key={`o-${runId}-${entered}-${reduced}`}
        className={`si-order-steps${play ? " si-order-steps--play" : ""}`}
      >
        {steps.map((s, i) => (
          <li
            key={s.t}
            className="si-order-step"
            style={{ "--d": `${0.15 + i * 0.42}s` }}
          >
            <span className="si-order-num" aria-hidden="true">
              {i + 1}
            </span>
            <strong>{s.t}</strong>
            <span className="si-order-sub">{s.s}</span>
          </li>
        ))}
      </ol>
      <ol
        className={`si-order-stages${play ? " si-order-stages--play" : ""}`}
        aria-hidden="true"
        key={`st-${runId}-${entered}-${reduced}`}
      >
        {stages.map((s, i) => (
          <li key={s} style={{ "--d": `${0.5 + i * 0.62}s` }}>
            {s}
          </li>
        ))}
      </ol>
    </button>
  );
}

export default function SystemIntegrationsPage() {
  const { t } = useLanguage();
  const svc = t("serviceDetail.integration") || {};
  const meta = svc.meta || {};
  const hero = svc.hero || {};
  const narrative = svc.narrative || {};
  const problemN = narrative.problem || {};
  const connectN = narrative.connect || {};
  const processN = narrative.process || {};
  const casesN = narrative.cases || {};
  const deliverN = narrative.deliver || {};
  const exampleN = narrative.example || {};
  const faq = svc.faq || {};
  const related = svc.related || {};
  const cta = buildCTAContent(t, "integration");
  const ctaDiagram = buildCTADiagram(t, "integration");
    const relatedItems = (related.items || []).map((r, i) => ({
    ...r,
    href: RELATED_HREFS[i] || r.href,
    accent: "var(--brand-primary)",
  }));

  return (
    <div
      className="si-page"
      style={{
        "--svc": "var(--brand-primary)",
        "--svc-rgb": "var(--brand-rgb)",
        "--svc-text": "var(--brand-deep)",
      }}
    >
      <Meta
        title={meta.title}
        description={meta.description}
        canonical="/system-integrations"
        keywords={meta.keywords}
      />

      <ServiceSchema
        name={meta.schemaName}
        description={meta.schemaDesc}
        url="/system-integrations"
      />

      <BreadcrumbSchema
        items={[
          { name: t("nav.home"), href: "/" },
          { name: t("nav.services"), href: "/#services" },
          { name: hero.title, href: "/system-integrations" },
        ]}
      />

      {/* ==================== HERO ==================== */}
      <Reveal>
        <section className="si-hero">
          <div className="si-hero-inner">
            <div className="si-hero-copy">
              <h1 className="si-title">
                {hero.title}
                <br />
                <span className="si-title-accent">{hero.highlight}</span>
              </h1>
              <p className="si-hero-desc">
                {hero.description}
              </p>
              <div className="si-hero-actions">
                <Link to="/contact" className="si-primary-btn">
                  <CalendarDays size={18} />
                  {hero.primaryCta}
                  <ArrowRight size={16} />
                </Link>
                <a href="#si-arch" className="si-secondary-btn">
                  {hero.secondaryCta}
                </a>
              </div>
            </div>
            <div className="si-hero-visual" aria-hidden="false">
              <IntegrationNetwork />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== 1 — PROBLEM ==================== */}
      <Reveal delay={0.06}>
        <section className="si-section">
          <div className="si-container">
            <h2 className="si-section-title">
              {problemN.title}
              <span className="si-title-accent"> {problemN.highlight}</span>
            </h2>
            <p className="si-section-desc">{problemN.desc}</p>
            <div className="si-pain-grid">
              {(problemN.items || []).map((c, i) => (
                <div key={c.t} className="si-pain-card">
                  <span className="si-pain-num" aria-hidden="true">0{i + 1}</span>
                  <h3>{c.t}</h3>
                  <ul>
                    {(c.points || []).map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== 2 — WHAT WE CONNECT ==================== */}
      <Reveal delay={0.08}>
        <section className="si-section si-section--tight">
          <div className="si-container">
            <div className="si-section-header center">
              <h2 className="si-section-title">{connectN.title}</h2>
              <p className="si-section-desc">{connectN.desc}</p>
            </div>
            <div className="si-connect-grid">
              {(connectN.items || []).map((c, i) => {
                const Icon = CONNECT_ICONS[i] || PlugZap;
                return (
                  <div key={c.t} className="si-connect-item">
                    <span className="si-connect-icon" aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <span className="si-connect-body">
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

      {/* ==================== 3 — HOW INTEGRATION WORKS ==================== */}
      <Reveal delay={0.08}>
        <section id="si-arch" className="si-section">
          <div className="si-container">
            <h2 className="si-section-title">{processN.title}</h2>
            <p className="si-section-desc">{processN.desc}</p>
            <div className="si-process">
              {(processN.steps || []).map((s, i) => (
                <div key={s.t} className="si-process-item">
                  <span className="si-process-number" style={{ color: PROCESS_COLORS[i % PROCESS_COLORS.length] }}>0{i + 1}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
            <div className="si-arch-frame">
              <ArchitectureVisual />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== 4 — REAL BUSINESS USE CASES ==================== */}
      <Reveal delay={0.08}>
        <section className="si-section si-section--tight">
          <div className="si-container">
            <h2 className="si-section-title">{casesN.title}</h2>
            <p className="si-section-desc">{casesN.desc}</p>
            <div className="si-cases">
              {(casesN.items || []).map((c, i) => (
                <div key={c.t} className="si-case">
                  <span className="si-case-num" aria-hidden="true">0{i + 1}</span>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== 5 — WHAT WE DELIVER ==================== */}
      <Reveal delay={0.08}>
        <section className="si-section si-section--tight">
          <div className="si-container">
            <h2 className="si-section-title">{deliverN.title}</h2>
            <p className="si-section-desc">{deliverN.desc}</p>
            <div className="si-deliver-grid">
              {(deliverN.items || []).map((c) => (
                <div key={c.t} className="si-deliver-item">
                  <span className="si-deliver-check" aria-hidden="true">✓</span>
                  <div>
                    <h3>{c.t}</h3>
                    <p>{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== 6 — PRACTICAL FLOW ==================== */}
      <Reveal delay={0.08}>
        <section className="si-section si-section--tight">
          <div className="si-container">
            <h2 className="si-section-title">{exampleN.title}</h2>
            <p className="si-section-desc">{exampleN.desc}</p>
            <div className="si-arch-frame">
              <OrderTimeline />
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
