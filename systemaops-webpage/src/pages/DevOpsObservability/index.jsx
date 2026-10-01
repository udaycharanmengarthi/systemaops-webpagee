/**
 * pages/DevOpsObservability/index.jsx
 *
 * DevOps & Observability service page.
 * Story: deploy → observe → detect → respond.
 * Accent: SystemaOps brand tokens (no per-service hue).
 * Copy: centralized t("serviceDetail.devops.*"). Icons stay local.
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
import { useLanguage } from "../../i18n/useLanguage";
import {
  ServiceTech,
  ServiceFaq,
  RelatedServices,
} from "../../components/service/ServiceSections";
import PremiumCTA from "../../components/service/PremiumCTA";
import { buildCTAContent, buildCTADiagram } from "../../components/service/serviceCTAConfig";
import "../../components/service/ServiceShared.css";
import DevOpsControlRoom from "../../components/service/DevOpsControlRoom";
import "../../components/service/DevOpsControlRoom.css";

import "./DevOpsObservability.css";

/* Icons stay local; all copy comes from t("serviceDetail.devops.*"). */
const CAPABILITY_ICONS = [
  Rocket,
  MonitorDot,
  ScrollText,
  Gauge,
  HeartPulse,
  BellRing,
];

const PROCESS_COLORS = [
  "var(--brand-primary)",
  "var(--brand-deep)",
  "var(--brand-deep)",
  "var(--brand-primary)",
];

const RELATED_HREFS = [
  "/workflow-automation",
  "/system-integrations",
  "/ai-automation",
];

/* ── HERO SNAPSHOT: compact healthy-system status card.
      Static by design; the interactive control room lives in
      the architecture section below. Labels come from
      t("serviceDetail.devops.demo.*"). ── */

function HeroStatus() {
  const { t } = useLanguage();
  const demo = t("serviceDetail.devops.demo") || {};
  const services = demo.services || {};
  const metrics = demo.metrics || {};
  const status = demo.status || {};
  return (
    <div className="do-snapshot" role="img" aria-label={demo.aria}>
      <div className="do-snapshot-row">
        {[services.api, services.worker, services.database].map((s) => (
          <span key={s} className="do-snapshot-svc">
            <span className="dc-dot" aria-hidden="true" />
            {s}
          </span>
        ))}
      </div>
      <div className="do-snapshot-metrics">
        <div className="do-snapshot-metric">
          <span>{metrics.latency}</span>
          <strong>42 ms</strong>
        </div>
        <div className="do-snapshot-metric">
          <span>{metrics.errorRate}</span>
          <strong>0.2%</strong>
        </div>
      </div>
      <span className="dc-badge">
        <span className="dc-dot dc-dot--live" aria-hidden="true" />
        {status.healthy}
      </span>
    </div>
  );
}

/* ── SIMPLIFIED ARCHITECTURE: one-row FlowStrip. Titles/descs come from
      t("serviceDetail.devops.diagram.flow.steps"). ── */

export default function DevOpsObservabilityPage() {
  const { t, language } = useLanguage();
  const svc = t("serviceDetail.devops") || {};
  const meta = svc.meta || {};
  const hero = svc.hero || {};
  const problem = svc.problem || {};
  const capabilities = svc.capabilities || {};
  const capabilityItems = capabilities.items || [];
  const architecture = svc.architecture || {};
  const diagram = svc.diagram || {};
  const flowSteps = (diagram.flow && diagram.flow.steps) || [];
  const loop = svc.loop || {};
  const process = svc.process || {};
  const tech = svc.tech || {};
  const useCases = svc.useCases || {};
  const useCaseItems = useCases.items || [];
  const engagement = svc.engagement || {};
  const faq = svc.faq || {};
  const related = svc.related || {};
  const cta = buildCTAContent(t, "devops");
  const ctaDiagram = buildCTADiagram(t, "devops");
    const relatedItems = (related.items || []).map((r, i) => ({
    ...r,
    href: RELATED_HREFS[i] || r.href,
    accent: "var(--brand-primary)",
  }));

  return (
    <div
      className="do-page"
      style={{
        "--svc": "var(--brand-primary)",
        "--svc-rgb": "var(--brand-rgb)",
        "--svc-text": "var(--brand-deep)",
      }}
    >
      <Meta
        title={meta.title}
        description={meta.description}
        canonical="/devops-observability"
        keywords={meta.keywords}
      />

      <ServiceSchema
        name={meta.schemaName}
        description={meta.schemaDesc}
        url="/devops-observability"
      />

      <BreadcrumbSchema
        items={[
          { name: t("nav.home"), href: "/" },
          { name: t("nav.services"), href: "/#services" },
          { name: hero.title, href: "/devops-observability" },
        ]}
      />

      {/* ==================== HERO ==================== */}
      <Reveal>
        <section className="do-hero">
          <div className="do-hero-inner">
            <div className="do-hero-copy">
              <h1 className="do-title">
                {hero.title}
                <br />
                <span className="do-title-accent">{hero.highlight}</span>
              </h1>
              <p className="do-hero-desc">
                {hero.description}
              </p>
              <div className="do-hero-actions">
                <Link to="/contact" className="do-primary-btn">
                  <CalendarDays size={18} />
                  {hero.primaryCta}
                  <ArrowRight size={16} />
                </Link>
                <a href="#do-loop" className="do-secondary-btn">
                  {hero.secondaryCta}
                </a>
              </div>
            </div>
            <div className="do-hero-visual">
              <HeroStatus />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== WHY ==================== */}
      <Reveal delay={0.06}>
        <section className="do-section">
          <div className="do-container">
            <h2 className="do-section-title">
              {problem.title} <span className="do-title-accent">{problem.highlight}</span>
            </h2>
            <div className="do-usecases">
              <div className="do-usecase">
                <span className="do-usecase-tag">{problem.beforeLabel}</span>
                <ul className="do-problem-list">
                  {(problem.beforeItems || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="do-usecase">
                <span className="do-usecase-tag">{problem.afterLabel}</span>
                <ul className="do-problem-list">
                  {(problem.afterItems || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== CAPABILITIES ==================== */}
      <Reveal delay={0.08}>
        <section className="do-section do-section--tight">
          <div className="do-container">
            <div className="do-section-header center">
              <h2 className="do-section-title">{capabilities.title}</h2>
            </div>
            <div className="do-grid">
              {capabilityItems.map((c, i) => {
                const Icon = CAPABILITY_ICONS[i] || Rocket;
                return (
                  <div key={c.title} className="do-card">
                    <div className="do-card-icon">
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

      {/* ==================== OPERATIONAL LOOP ==================== */}
      <Reveal delay={0.08}>
        <section id="do-loop" className="do-section">
          <div className="do-container">
            <div className="do-loop-grid">
              <div>
                <h2 className="do-section-title">{loop.title}</h2>
                <p className="do-section-desc">
                  {loop.desc}
                </p>
              </div>
              <div className="do-loop-frame">
                <ol className="do-checklist">
                  {flowSteps.map((s, i) => (
                    <li key={s.title}>
                      <span className="do-check" aria-hidden="true">{i + 1}</span>
                      <span>
                        <strong style={{ color: "var(--text-primary)" }}>{s.title}</strong>
                        {`: ${s.desc}`}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== ARCHITECTURE ==================== */}
      <Reveal delay={0.08}>
        <section className="do-section do-section--tight">
          <div className="do-container">
            <h2 className="do-section-title">{architecture.title}</h2>
            <p className="do-section-desc">
              {architecture.desc}
            </p>
            <div className="do-arch-frame">
              <DevOpsControlRoom key={language} />
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
        <section className="do-section do-section--tight">
          <div className="do-container">
            <div className="do-section-header center">
              <h2 className="do-section-title">{process.title}</h2>
            </div>
            <div className="do-process">
              {(process.steps || []).map((s, i) => (
                <div key={s.title} className="do-process-item">
                  <span className="do-process-number" style={{ color: PROCESS_COLORS[i % PROCESS_COLORS.length] }}>0{i + 1}</span>
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
            <h2 className="do-section-title">{useCases.title}</h2>
            <div className="do-usecases">
              {useCaseItems.map((u) => (
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

      {/* ==================== INCLUDES ==================== */}
      <Reveal delay={0.08}>
        <section className="do-section do-section--tight">
          <div className="do-container">
            <div className="do-includes">
              <div>
                <h2 className="do-section-title">{engagement.title}</h2>
              </div>
              <ul className="do-checklist">
                {(engagement.items || []).map((item) => (
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
