/**
 * pages/AIConsulting/index.jsx
 *
 * AI Consulting service page.
 * Story: strategy before build — assess, rank, roadmap, deliver.
 * Accent: SystemaOps brand tokens.
 * Copy: centralized t("serviceDetail.consulting.*").
 */

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Bot,
  ScanSearch,
  Workflow,
  BookOpen,
  Gauge,
  TrendingUp,
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

import "./AIConsulting.css";

const RELATED_HREFS = [
  "/ai-automation",
  "/workflow-automation",
  "/system-integrations",
];

/* ── HERO ROADMAP: Assess → Rank → Roadmap → Deliver.
      Hover or select a stage to read it; a packet travels the
      line on every selection. Reduced motion shows state only. ── */

function HeroRoadmap() {
  const { t } = useLanguage();
  const steps = (t("serviceDetail.consulting.process") || {}).steps || [];
  const [active, setActive] = useState(0);

  const onKey = (e) => {
    const tabs = Array.from(
      e.currentTarget.querySelectorAll('[role="tab"]')
    );
    const at = tabs.indexOf(document.activeElement);
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = (at + 1 + tabs.length) % tabs.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = (at - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = tabs.length - 1;
    }
    if (next >= 0 && tabs[next]) {
      e.preventDefault();
      tabs[next].focus();
    }
  };

  const current = steps[active] || {};

  return (
    <div className="ac-roadmap">
      <div
        className="ac-roadmap-tabs"
        role="tablist"
        aria-label="roadmap"
        onKeyDown={onKey}
      >
        {steps.map((s, i) => (
          <button
            key={s.title}
            type="button"
            role="tab"
            aria-selected={active === i}
            tabIndex={active === i ? 0 : -1}
            className={`ac-roadmap-tab ${active === i ? "ac-roadmap-tab--active" : ""}`}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <span className="ac-roadmap-num" aria-hidden="true">
              0{i + 1}
            </span>
            {s.title}
          </button>
        ))}
      </div>
      <svg
        viewBox="0 0 640 84"
        className="ac-roadmap-svg"
        aria-hidden="true"
      >
        {/* Thin fiber rail + one looping gold packet */}
        <FlowLines
          flows={[
            { id: "ac-road", d: "M40 42 H600", dur: 3.6, delay: 0 },
          ]}
        />
        {[40, 227, 413, 600].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={42}
            r={6}
            className={i === active ? "ac-road-dot--hot" : "ac-road-dot"}
          />
        ))}
      </svg>
      <p key={`ac-road-cap-${active}`} className="ac-roadmap-desc demo-caption-swap">
        <strong>
          0{active + 1} {current.title}
        </strong>{" "}
        {current.desc}
      </p>
    </div>
  );
}

/* ── MAIN ARCHITECTURE: BUSINESS NEEDS → AI STRATEGY →
      CONNECTED SYSTEMS → OPERATIONAL OUTCOMES. One complete
      static diagram. No tabs, no hover — everything visible.
      A one-time, viewport-triggered entrance traces the
      connectors once, then settles. ── */

const ARCH_NEED_Y = [24, 80, 136, 192];
const ARCH_SYS_Y = [20, 74, 128, 182, 236, 290];
const ARCH_OUT_X = [40, 250, 460, 670];

function acArrow(x1, y1, x2, y2, size = 8) {
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

function ArchFlow() {
  const { t } = useLanguage();
  const arch = t("serviceDetail.consulting.narrative.arch") || {};
  const needs = (arch.needs || {}).items || [];
  const core = arch.core || {};
  const coreItems = core.items || [];
  const systems = (arch.systems || {}).items || [];
  const outcomes = (arch.outcomes || {}).items || [];
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

  /* Fiber flows: thin bowed connectors + looping gold particles.
     Geometry mirrors the node layout above; SMIL loops run
     continuously with zero JS timers. */
  const needFlows = ARCH_NEED_Y.slice(0, needs.length).map((baseY, i) => {
    const y = baseY + 22;
    return {
      id: `need-${i}`,
      x1: 180, y1: y, x2: 250, y2: y,
      bow: i % 2 ? -7 : 7,
      dur: 3.6 + i * 0.3,
      delay: i * 0.45,
      drawDelay: 0.1 + i * 0.08,
    };
  });

  const sysFlows = ARCH_SYS_Y.slice(0, systems.length).map((baseY, i) => {
    const y = baseY + 22;
    return {
      id: `sys-${i}`,
      x1: 646, y1: y, x2: 700, y2: y,
      bow: i % 2 ? 5 : -5,
      dur: 3.2 + i * 0.15,
      delay: 1.4 + i * 0.25,
      drawDelay: 2.0 + i * 0.07,
    };
  });

  const outFlows = ARCH_OUT_X.slice(0, outcomes.length).map((baseX, i) => {
    const x = baseX + 100;
    return {
      id: `out-${i}`,
      x1: x, y1: 336, x2: x, y2: 382,
      dur: 3.2,
      delay: 2 + i * 0.3,
      drawDelay: 3.1 + i * 0.08,
    };
  });

  const fullFlows = [
    ...needFlows,
    { id: "bus-l", x1: 250, y1: 46, x2: 250, y2: 214, bow: 8, dur: 4.6, delay: 0.3, drawDelay: 0.55 },
    { id: "bus-core", x1: 250, y1: 156, x2: 326, y2: 156, dur: 3.4, delay: 0.6, drawDelay: 1.2 },
    { id: "core-bus", x1: 550, y1: 156, x2: 626, y2: 156, dur: 3.4, delay: 0.9, drawDelay: 1.65 },
    { id: "bus-r", x1: 646, y1: 42, x2: 646, y2: 312, bow: -8, dur: 4.8, delay: 1.1, drawDelay: 1.8 },
    ...sysFlows,
    { id: "core-rail", x1: 440, y1: 226, x2: 440, y2: 336, dur: 3.8, delay: 1.6, drawDelay: 2.4 },
    { id: "rail", x1: 140, y1: 336, x2: 770, y2: 336, bow: 10, dur: 5, delay: 1.8, drawDelay: 2.6 },
    ...outFlows,
  ];

  const compactFlows = [
    { id: "c-needs", x1: 160, y1: 168, x2: 160, y2: 192, dur: 3.4, delay: 0, drawDelay: 0.55 },
    { id: "c-core", x1: 160, y1: 292, x2: 160, y2: 316, dur: 3.8, delay: 0.6, drawDelay: 0.8 },
    { id: "c-out", x1: 160, y1: 454, x2: 160, y2: 478, dur: 4.2, delay: 1.2, drawDelay: 1.1 },
  ];

  const font = "'Space Grotesk','Plus Jakarta Sans',sans-serif";

  return (
    <div ref={wrapRef} className={`ac-opp${inView ? " ac-opp--on" : ""}`}>
      {/* ── DESKTOP / TABLET ── */}
      <svg
        viewBox="0 0 900 470"
        className="ac-opp-svg ac-opp-svg--full"
        role="img"
        aria-label={arch.title}
        style={{ fontFamily: font }}
      >
        {/* Fiber connectors + looping gold particles.
            Static lines stay visible under reduced motion;
            the CSS layer hides the travelling particles. */}
        <FlowLines draw={inView} flows={fullFlows} />

        <polygon points={acArrow(250, 156, 330, 156)} className="ac-opp-arrow ac-opp-item" style={{ "--d": "1.85s" }} />
        <polygon points={acArrow(550, 156, 630, 156)} className="ac-opp-arrow ac-opp-item" style={{ "--d": "2.3s" }} />
        <polygon points={acArrow(440, 226, 440, 340)} className="ac-opp-arrow ac-opp-item" style={{ "--d": "3.05s" }} />

        {/* Labels */}
        <text x="100" y="12" textAnchor="middle" className="ac-opp-label">{arch.needs?.label}</text>
        <text x="790" y="8" textAnchor="middle" className="ac-opp-label">{arch.systems?.label}</text>
        <text x="455" y="380" textAnchor="middle" className="ac-opp-label">{arch.outcomes?.label}</text>

        {/* Needs nodes */}
        {needs.map((n, i) => {
          const y = ARCH_NEED_Y[i];
          return (
            <g key={`nn-${n}`} className="ac-opp-item" style={{ "--d": `${0.05 + i * 0.06}s` }}>
              <rect x="20" y={y} width="160" height="44" rx="12" className="ac-opp-node" />
              <text x="100" y={y + 27} textAnchor="middle" className="ac-opp-node-text">{n}</text>
            </g>
          );
        })}

        {/* AI Strategy core */}
        <g className="ac-opp-item" style={{ "--d": "1.1s" }}>
          <rect x="330" y="86" width="220" height="140" rx="18" fill="var(--brand-primary)" className="ac-core-node" />
          <text x="440" y="122" textAnchor="middle" className="ac-opp-core-text">{core.label}</text>
          <text x="440" y="142" textAnchor="middle" className="ac-opp-core-sub">{core.sub}</text>
          {coreItems.map((c, i) => (
            <text key={c} x="440" y={168 + i * 20} textAnchor="middle" className="ac-opp-core-item">{c}</text>
          ))}
          <circle cx="538" cy="98" r="3" fill="var(--brand-gold)" opacity="0.9" />
        </g>

        {/* Systems nodes */}
        {systems.map((s, i) => {
          const y = ARCH_SYS_Y[i];
          return (
            <g key={`sn-${s}`} className="ac-opp-item" style={{ "--d": `${1.9 + i * 0.06}s` }}>
              <rect x="700" y={y} width="180" height="44" rx="12" className="ac-opp-node" />
              <text x="790" y={y + 27} textAnchor="middle" className="ac-opp-node-text">{s}</text>
            </g>
          );
        })}

        {/* Outcome nodes */}
        {outcomes.map((o, i) => (
          <g key={`on-${o}`} className="ac-opp-item" style={{ "--d": `${3.0 + i * 0.07}s` }}>
            <rect x={ARCH_OUT_X[i]} y="386" width="200" height="52" rx="12" className="ac-opp-node ac-opp-node--outcome" />
            <text x={ARCH_OUT_X[i] + 100} y="417" textAnchor="middle" className="ac-opp-node-text">{o}</text>
          </g>
        ))}
      </svg>

      {/* ── MOBILE: vertical stack ── */}
      <svg
        viewBox="0 0 320 620"
        className="ac-opp-svg ac-opp-svg--compact"
        role="img"
        aria-label={arch.title}
        style={{ fontFamily: font }}
      >
        <text x="160" y="16" textAnchor="middle" className="ac-opp-label">{arch.needs?.label}</text>
        {needs.map((n, i) => {
          const y = 28 + i * 36;
          return (
            <g key={`cn-${n}`} className="ac-opp-item" style={{ "--d": `${0.05 + i * 0.06}s` }}>
              <rect x="60" y={y} width="200" height="32" rx="10" className="ac-opp-node" />
              <text x="160" y={y + 21} textAnchor="middle" className="ac-opp-node-text">{n}</text>
            </g>
          );
        })}
        <FlowLines draw={inView} flows={compactFlows} />
        <polygon points={acArrow(160, 168, 160, 196)} className="ac-opp-arrow ac-opp-item" style={{ "--d": "1.15s" }} />

        <g className="ac-opp-item" style={{ "--d": "0.6s" }}>
          <rect x="60" y="196" width="200" height="96" rx="16" fill="var(--brand-primary)" className="ac-core-node" />
          <text x="160" y="228" textAnchor="middle" className="ac-opp-core-text">{core.label}</text>
          <text x="160" y="248" textAnchor="middle" className="ac-opp-core-sub">{core.sub}</text>
          {coreItems.map((c, i) => (
            <text key={c} x="160" y={268 + i * 16} textAnchor="middle" className="ac-opp-core-item">{c}</text>
          ))}
          <circle cx="246" cy="208" r="3" fill="var(--brand-gold)" opacity="0.9" />
        </g>
        <polygon points={acArrow(160, 292, 160, 320)} className="ac-opp-arrow ac-opp-item" style={{ "--d": "1.4s" }} />

        <text x="160" y="334" textAnchor="middle" className="ac-opp-label">{arch.systems?.label}</text>
        {systems.map((s, i) => {
          const x = i % 2 === 0 ? 60 : 165;
          const y = 348 + Math.floor(i / 2) * 38;
          return (
            <g key={`cs-${s}`} className="ac-opp-item" style={{ "--d": `${0.9 + i * 0.05}s` }}>
              <rect x={x} y={y} width="95" height="30" rx="10" className="ac-opp-node" />
              <text x={x + 47} y={y + 20} textAnchor="middle" className="ac-opp-node-text">{s}</text>
            </g>
          );
        })}
        <polygon points={acArrow(160, 454, 160, 482)} className="ac-opp-arrow ac-opp-item" style={{ "--d": "1.7s" }} />

        <text x="160" y="496" textAnchor="middle" className="ac-opp-label">{arch.outcomes?.label}</text>
        {outcomes.map((o, i) => {
          const x = i % 2 === 0 ? 60 : 165;
          const y = 508 + Math.floor(i / 2) * 48;
          return (
            <g key={`co-${o}`} className="ac-opp-item" style={{ "--d": `${1.6 + i * 0.06}s` }}>
              <rect x={x} y={y} width="95" height="38" rx="10" className="ac-opp-node ac-opp-node--outcome" />
              <text x={x + 47} y={y + 24} textAnchor="middle" className="ac-opp-node-text">{o}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── ECOSYSTEM FLOW: sources → AI layer → team tools.
      Compact HTML structure, visually distinct from the main
      architecture diagram. ── */

function EcosystemFlow() {
  const { t } = useLanguage();
  const eco = t("serviceDetail.consulting.narrative.ecosystem") || {};

  return (
    <div className="ac-eco-flow">
      <div className="ac-eco-row">
        {(eco.top || []).map((s) => (
          <span key={s} className="ac-eco-node">{s}</span>
        ))}
      </div>
      <span className="ac-eco-arrow" aria-hidden="true">↓</span>
      <div className="ac-eco-core">{eco.core}</div>
      <span className="ac-eco-arrow" aria-hidden="true">↓</span>
      <div className="ac-eco-row">
        {(eco.bottom || []).map((s) => (
          <span key={s} className="ac-eco-node">{s}</span>
        ))}
      </div>
    </div>
  );
}

export default function AIConsultingPage() {
  const { t } = useLanguage();
  const svc = t("serviceDetail.consulting") || {};
  const meta = svc.meta || {};
  const hero = svc.hero || {};
  const narrative = svc.narrative || {};
  const problemN = narrative.problem || {};
  const frameworkN = narrative.framework || {};
  const archN = narrative.arch || {};
  const casesN = narrative.cases || {};
  const pathN = narrative.path || {};
  const outcomesN = narrative.outcomes || {};
  const strategyN = narrative.strategy || {};
  const ecosystemN = narrative.ecosystem || {};
  const groundedN = narrative.grounded || {};
  const faq = svc.faq || {};
  const related = svc.related || {};
  const cta = buildCTAContent(t, "consulting");
  const ctaDiagram = buildCTADiagram(t, "consulting");
  const relatedItems = (related.items || []).map((r, i) => ({
    ...r,
    href: RELATED_HREFS[i] || r.href,
    accent: "var(--brand-primary)",
  }));

  return (
    <div
      className="ac-page"
      style={{
        "--svc": "var(--brand-primary)",
        "--svc-rgb": "var(--brand-rgb)",
        "--svc-text": "var(--brand-deep)",
      }}
    >
      <Meta
        title={meta.title}
        description={meta.description}
        canonical="/ai-consulting"
        keywords={meta.keywords}
      />

      <ServiceSchema
        name={meta.schemaName}
        description={meta.schemaDesc}
        url="/ai-consulting"
      />

      <BreadcrumbSchema
        items={[
          { name: t("nav.home"), href: "/" },
          { name: t("nav.services"), href: "/#services" },
          { name: hero.title, href: "/ai-consulting" },
        ]}
      />

      {/* ==================== HERO ==================== */}
      <Reveal>
        <section className="ac-hero">
          <div className="ac-hero-inner">
            <div className="ac-hero-copy">
              <h1 className="ac-title">
                {hero.title}
                <br />
                <span className="ac-title-accent">{hero.highlight}</span>
              </h1>
              <p className="ac-hero-desc">
                {hero.description}
              </p>
              <div className="ac-hero-actions">
                <Link to="/contact" className="ac-primary-btn">
                  <CalendarDays size={18} />
                  {hero.primaryCta}
                  <ArrowRight size={16} />
                </Link>
                <a href="#ac-process" className="ac-secondary-btn">
                  {hero.secondaryCta}
                </a>
              </div>
            </div>
            <div className="ac-hero-visual">
              <HeroRoadmap />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== REAL PROBLEM ==================== */}
      <Reveal delay={0.06}>
        <section className="ac-section">
          <div className="ac-container">
            <h2 className="ac-section-title">{problemN.title}</h2>
            <p className="ac-section-desc">{problemN.desc}</p>
            <div className="ac-p3-grid">
              {(problemN.items || []).map((c, i) => (
                <div key={c.t} className="ac-p3-card">
                  <span className="ac-p3-num" aria-hidden="true">0{i + 1}</span>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== OPPORTUNITY FRAMEWORK ==================== */}
      <Reveal delay={0.08}>
        <section className="ac-section ac-section--tight">
          <div className="ac-container">
            <div className="ac-section-header center">
              <h2 className="ac-section-title">{frameworkN.title}</h2>
              <p className="ac-section-desc">{frameworkN.desc}</p>
            </div>
            <div className="ac-fw-grid">
              {(frameworkN.steps || []).map((s, i) => (
                <div key={s.t} className="ac-fw-card">
                  <span className="ac-fw-num" aria-hidden="true">0{i + 1}</span>
                  <h3>{s.t}</h3>
                  <ul>
                    {(s.points || []).map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== MAIN ARCHITECTURE ==================== */}
      <Reveal delay={0.08}>
        <section className="ac-section ac-section--tight">
          <div className="ac-container">
            <h2 className="ac-section-title">{archN.title}</h2>
            <p className="ac-section-desc">{archN.desc}</p>
            <div className="ac-arch-frame">
              <ArchFlow />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== USE CASES ==================== */}
      <Reveal delay={0.08}>
        <section className="ac-section ac-section--tight">
          <div className="ac-container">
            <div className="ac-section-header center">
              <h2 className="ac-section-title">{casesN.title}</h2>
              <p className="ac-section-desc">{casesN.desc}</p>
            </div>
            <div className="ac-cap-grid">
              {(casesN.items || []).map((c, i) => {
                const Icon = [ScanSearch, Workflow, BookOpen, Gauge, Bot, TrendingUp][i] || Bot;
                return (
                  <div key={c.t} className="ac-cap">
                    <div className="ac-cap-icon">
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

      {/* ==================== IMPLEMENTATION PATH ==================== */}
      <Reveal delay={0.08}>
        <section id="ac-process" className="ac-section ac-section--tight">
          <div className="ac-container">
            <h2 className="ac-section-title">{pathN.title}</h2>
            <p className="ac-section-desc">{pathN.desc}</p>
            <ol className="ac-path">
              {(pathN.steps || []).map((s, i) => (
                <li key={s.t} className="ac-path-step">
                  <span className="ac-path-num" aria-hidden="true">0{i + 1}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                  {i < (pathN.steps || []).length - 1 && (
                    <span className="ac-path-arrow" aria-hidden="true">→</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Reveal>

      {/* ==================== OUTCOMES ==================== */}
      <Reveal delay={0.08}>
        <section className="ac-section ac-section--tight">
          <div className="ac-container">
            <div className="ac-section-header center">
              <h2 className="ac-section-title">{outcomesN.title}</h2>
            </div>
            <div className="ac-out-grid">
              {(outcomesN.items || []).map((c) => (
                <div key={c.t} className="ac-out-item">
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== STRATEGY → IMPLEMENTATION ==================== */}
      <Reveal delay={0.08}>
        <section className="ac-section ac-section--tight">
          <div className="ac-container">
            <h2 className="ac-section-title">{strategyN.title}</h2>
            <p className="ac-section-desc">{strategyN.desc}</p>
            <div className="ac-why-grid">
              {(strategyN.items || []).map((c) => (
                <div key={c.t} className="ac-why-card">
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== REAL SYSTEM CONNECTIONS ==================== */}
      <Reveal delay={0.08}>
        <section className="ac-section ac-section--tight">
          <div className="ac-container">
            <h2 className="ac-section-title">{ecosystemN.title}</h2>
            <p className="ac-section-desc">{ecosystemN.desc}</p>
            <div className="ac-arch-frame">
              <EcosystemFlow />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== GROUNDED IN REAL SYSTEMS ==================== */}
      <Reveal delay={0.08}>
        <section className="ac-section ac-section--tight">
          <div className="ac-container">
            <h2 className="ac-section-title">{groundedN.title}</h2>
            <p className="ac-section-desc">{groundedN.desc}</p>
            <div className="ac-chips">
              {(groundedN.chips || []).map((chip) => (
                <span key={chip} className="ac-chip">{chip}</span>
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
