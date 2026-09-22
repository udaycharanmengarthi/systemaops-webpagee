import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  BotMessageSquare,
  CalendarDays,
  Code2,
  Eye,
  GitBranch,
  Handshake,
  PencilRuler,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  TrendingUp,
  Trophy,
  Users,
  Utensils,
  Workflow,
} from "lucide-react";

import Meta from "../../../seo/Meta";
import BreadcrumbSchema from "../../../seo/schema/BreadcrumbSchema";
import OrganizationSchema from "../../../seo/schema/OrganizationSchema";
import { useLanguage } from "../../../i18n/LanguageContext";
import {
  presenceItems,
  fieldPosts,
  selectedWork,
  processStepAccents,
} from "../../../data/about";

import "./About.css";

/* ============================================================
   WORK-STEP ICONS
============================================================ */

const workIcons = [
  ScanSearch,   // Discover
  PencilRuler,  // Design
  Code2,        // Build
  RefreshCw,    // Improve
];

/* ============================================================
   SELECTED-WORK ICONS
============================================================ */

const workIconMap = {
  blocks: Blocks,
  workflow: Workflow,
  utensils: Utensils,
  shield: ShieldCheck,
  "git-branch": GitBranch,
  bot: BotMessageSquare,
};

/* ============================================================
   PRESENCE CARD ICONS
============================================================ */

const presenceIconMap = {
  events: CalendarDays,
  hackathons: Trophy,
  community: Users,
  product: Code2,
};

/* ============================================================
   PRODUCT / BUILD — purpose-built technical visual
============================================================ */

function ProductBuildVisual() {
  return (
    <svg
      viewBox="0 0 640 400"
      className="about-presence-svg"
      role="img"
      aria-label="A production workflow diagram: trigger, process, action"
      style={{
        fontFamily:
          "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
      }}
    >
      <rect
        x="1"
        y="1"
        width="638"
        height="398"
        rx="18"
        fill="var(--bg-surface)"
        stroke="var(--border-soft)"
      />
      <g>
        <rect
          x="60"
          y="150"
          width="140"
          height="76"
          rx="14"
          fill="var(--bg-subtle)"
          stroke="var(--border)"
        />
        <text
          x="130"
          y="183"
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize="15"
          fontWeight="700"
        >
          Trigger
        </text>
        <text
          x="130"
          y="205"
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="11"
        >
          event fires
        </text>
      </g>
      <path
        d="M204 188 H 246"
        stroke="var(--border-strong)"
        strokeWidth="2.5"
        strokeDasharray="3 7"
        strokeLinecap="round"
      />
      <polygon
        points="248,182 260,188 248,194"
        fill="var(--border-strong)"
      />
      <g>
        <rect
          x="264"
          y="130"
          width="160"
          height="116"
          rx="16"
          fill="#3B82F6"
        />
        <text
          x="344"
          y="178"
          textAnchor="middle"
          fill="#0A1120"
          fontSize="16"
          fontWeight="700"
        >
          Process
        </text>
        <text
          x="344"
          y="202"
          textAnchor="middle"
          fill="#0A1120"
          opacity="0.8"
          fontSize="11"
        >
          validate · enrich
        </text>
        <text
          x="344"
          y="224"
          textAnchor="middle"
          fill="#0A1120"
          opacity="0.6"
          fontSize="11"
        >
          with observability
        </text>
      </g>
      <path
        d="M428 188 H 470"
        stroke="var(--border-strong)"
        strokeWidth="2.5"
        strokeDasharray="3 7"
        strokeLinecap="round"
      />
      <polygon
        points="472,182 484,188 472,194"
        fill="var(--border-strong)"
      />
      <g>
        <rect
          x="488"
          y="150"
          width="92"
          height="76"
          rx="14"
          fill="var(--accent-soft)"
          stroke="rgba(var(--accent-rgb), 0.4)"
        />
        <text
          x="534"
          y="183"
          textAnchor="middle"
          fill="var(--accent-primary)"
          fontSize="15"
          fontWeight="700"
        >
          Action
        </text>
        <text
          x="534"
          y="205"
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="11"
        >
          sync · notify
        </text>
      </g>
      <g>
        <rect
          x="60"
          y="262"
          width="520"
          height="76"
          rx="14"
          fill="var(--bg-subtle)"
          stroke="var(--border)"
        />
        <circle cx="98" cy="300" r="6" fill="#22D3EE" />
        <rect
          x="118"
          y="294"
          width="180"
          height="11"
          rx="5.5"
          fill="var(--border-strong)"
          opacity="0.8"
        />
        <circle cx="342" cy="300" r="6" fill="#F59E0B" />
        <rect
          x="362"
          y="294"
          width="130"
          height="11"
          rx="5.5"
          fill="var(--border-strong)"
          opacity="0.6"
        />
        <rect
          x="510"
          y="286"
          width="60"
          height="28"
          rx="14"
          fill="var(--accent-primary)"
        />
        <text
          x="540"
          y="304"
          textAnchor="middle"
          fill="var(--text-inverse)"
          fontSize="10.5"
          fontWeight="700"
        >
          OK
        </text>
      </g>
    </svg>
  );
}

/* ============================================================
   BUILT IN THE REAL WORLD — interactive showcase
============================================================ */

function PresenceShowcase() {
  const [activeId, setActiveId] = useState(
    presenceItems[0].id
  );

  const active =
    presenceItems.find((item) => item.id === activeId) ||
    presenceItems[0];

  return (
    <div className="about-presence-grid">

      {/* LEFT — cards */}

      <div
        className="about-presence-cards"
        role="tablist"
        aria-label="SystemaOps real-world presence"
      >
        {presenceItems.map((item) => {
          const Icon = presenceIconMap[item.id];
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`about-presence-card ${
                isActive
                  ? "about-presence-card--active"
                  : ""
              }`}
              onMouseEnter={() => setActiveId(item.id)}
              onFocus={() => setActiveId(item.id)}
              onClick={() => setActiveId(item.id)}
            >
              <span
                className="about-presence-card-icon"
                aria-hidden="true"
              >
                <Icon size={20} strokeWidth={1.8} />
              </span>

              <span className="about-presence-card-copy">
                <span className="about-presence-card-label">
                  {item.label}
                </span>

                <span className="about-presence-card-sub">
                  {item.eyebrow}
                </span>
              </span>

              <ArrowUpRight
                size={16}
                className="about-presence-card-arrow"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      {/* RIGHT — media stage */}

      <div
        className="about-presence-showcase"
        role="tabpanel"
        aria-label={active.label}
      >
        <div className="about-presence-media">
          {active.media?.type === "svg" ? (
            <ProductBuildVisual key={active.id} />
          ) : (
            <img
              key={active.id}
              src={active.media?.src}
              alt={active.media?.alt || active.caption}
              className="about-presence-photo"
              loading="lazy"
            />
          )}
        </div>

        <div className="about-presence-copy">
          <span className="about-presence-eyebrow">
            {active.eyebrow}
          </span>

          <h3 className="about-presence-title">
            {active.title}
          </h3>

          <p className="about-presence-desc">
            {active.description}
          </p>

          <div className="about-presence-foot">
            <span className="about-presence-caption">
              {active.caption}
            </span>

            {active.link &&
              (active.link.startsWith("/") ? (
                <Link
                  to={active.link}
                  className="about-presence-link"
                >
                  {active.linkLabel}

                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <a
                  href={active.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-presence-link"
                >
                  {active.linkLabel}

                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                  />
                </a>
              ))}
          </div>
        </div>
      </div>

    </div>
  );
}

/* ============================================================
   HOW WE WORK — interactive process journey
============================================================ */

function ProcessJourney() {
  const { t } = useLanguage();
  const steps = t("about.processSteps") || [];
  const [activeStep, setActiveStep] = useState(0);

  const active = steps[activeStep] || steps[0];
  const activeMeta =
    processStepAccents[activeStep] ||
    processStepAccents[0];

  return (
    <div className="about-process">
      {/* ── STEP NODES ── */}

      <div
        className="about-process-steps"
        role="tablist"
        aria-label="SystemaOps process"
      >
        {steps.map((step, index) => {
          const meta = processStepAccents[index];
          const Icon = workIcons[index];
          const isActive = index === activeStep;

          return (
            <button
              key={step.step}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`about-process-step ${
                isActive
                  ? "about-process-step--active"
                  : ""
              }`}
              style={{
                "--c": meta.accent,
                "--c-rgb": meta.rgb,
                "--c-text": meta.text,
              }}
              onClick={() => setActiveStep(index)}
              onFocus={() => setActiveStep(index)}
              onMouseEnter={() => setActiveStep(index)}
            >
              <span className="about-process-step-top">
                <span className="about-process-step-num">
                  {step.step}
                </span>

                <span
                  className="about-process-step-icon"
                  aria-hidden="true"
                >
                  <Icon
                    size={20}
                    strokeWidth={1.8}
                  />
                </span>
              </span>

              <span className="about-process-step-title">
                {step.title}
              </span>

              <span className="about-process-step-summary">
                {step.summary}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── CONNECTOR ── */}

      <div
        className="about-process-connector"
        aria-hidden="true"
        style={{ "--c": activeMeta.accent }}
      >
        <div className="about-process-connector-track" />
        <div
          className="about-process-connector-fill"
          style={{
            width: `${(activeStep / Math.max(steps.length - 1, 1)) * 100}%`,
          }}
        />
      </div>

      {/* ── DETAIL PANEL ── */}

      <div
        className="about-process-detail"
        style={{
          "--c": activeMeta.accent,
          "--c-rgb": activeMeta.rgb,
          "--c-text": activeMeta.text,
        }}
      >
        <div className="about-process-detail-copy">
          <span className="about-process-detail-eyebrow">
            {active.step} / {active.title}
          </span>

          <h3 className="about-process-detail-title">
            {active.titleLong}
          </h3>

          <p className="about-process-detail-desc">
            {active.desc}
          </p>

          <ul className="about-process-detail-list">
            {(active.details || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="about-process-output">
            <span className="about-process-output-label">
              {t("about.processOutputLabel")}
            </span>

            <span className="about-process-output-value">
              {active.output}
            </span>
          </div>
        </div>

        {/* ── MEDIA STAGE ── */}

        <div
          className="about-process-media"
          key={`media-${activeStep}`}
        >
          <ProcessStepVisual
            type={activeMeta.media}
            accent={activeMeta.accent}
          />

          <div className="about-process-media-foot">
            <span className="about-process-media-eyebrow">
              {active.step} / {active.title}
            </span>

            <span className="about-process-media-title">
              {active.titleLong}
            </span>

            {activeMeta.link && (
              <Link
                to={activeMeta.link}
                className="about-process-media-link"
              >
                {activeMeta.linkLabel}

                <ArrowRight
                  size={14}
                  aria-hidden="true"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   WHAT WE BUILD — purpose-built technical visuals
   One shared visual system: neutral nodes + service accents.
============================================================ */

function OdooVisual({ accent }) {
  return (
    <svg viewBox="0 0 640 280" className="about-build-svg" role="img" aria-label="Odoo ERP system architecture: CRM, sales and inventory feeding a central Odoo hub with invoicing" style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}>
      <PNode x={44} y={30} w={130} h={48} label="CRM" />
      <PNode x={255} y={30} w={130} h={48} label="Sales" />
      <PNode x={466} y={30} w={130} h={48} label="Inventory" />
      <PArrow x1={109} y1={78} x2={262} y2={112} dashed />
      <PArrow x1={320} y1={78} x2={320} y2={112} dashed />
      <PArrow x1={531} y1={78} x2={378} y2={112} dashed />
      <PNode x={250} y={112} w={140} h={70} label="ODOO" sub="central system" accent fill={accent} />
      <PArrow x1={320} y1={182} x2={320} y2={214} />
      <PNode x={250} y={214} w={140} h={48} label="Invoicing" />
    </svg>
  );
}

function WorkflowVisual({ accent }) {
  return (
    <svg viewBox="0 0 640 280" className="about-build-svg" role="img" aria-label="Workflow orchestration: event through n8n, process and condition, with approve and review branches leading to ERP and CRM" style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}>
      <PNode x={36} y={102} w={92} h={50} label="Event" />
      <PArrow x1={128} y1={127} x2={156} y2={127} />
      <PNode x={156} y={88} w={104} h={78} label="n8n" sub="orchestration" accent fill={accent} />
      <PArrow x1={260} y1={127} x2={288} y2={127} />
      <PNode x={288} y={102} w={110} h={50} label="Process" />
      <PArrow x1={398} y1={127} x2={426} y2={127} />
      <PNode x={426} y={102} w={120} h={50} label="Condition" />
      <PArrow x1={486} y1={152} x2={430} y2={196} />
      <PArrow x1={486} y1={152} x2={556} y2={196} />
      <PNode x={330} y={196} w={104} h={46} label="Approve" />
      <PNode x={510} y={196} w={92} h={46} label="Review" />
      <PArrow x1={382} y1={196} x2={330} y2={152} />
      <PNode x={256} y={30} w={120} h={40} label="ERP / CRM" />
      <PArrow x1={288} y1={70} x2={208} y2={88} dashed />
    </svg>
  );
}

function FudoVisual({ accent }) {
  return (
    <svg viewBox="0 0 640 280" className="about-build-svg" role="img" aria-label="Restaurant operations pipeline: POS to order to kitchen operations to business data, with a payment side step" style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}>
      <PNode x={44} y={26} w={180} h={46} label="POS" />
      <PArrow x1={134} y1={72} x2={134} y2={98} />
      <PNode x={44} y={98} w={180} h={46} label="Order" accent fill={accent} />
      <PArrow x1={134} y1={144} x2={134} y2={170} />
      <PNode x={44} y={170} w={180} h={46} label="Kitchen / Operations" />
      <PNode x={300} y={98} w={150} h={46} label="Payment" />
      <PArrow x1={224} y1={121} x2={300} y2={121} dashed />
      <PNode x={300} y={170} w={150} h={46} label="Business Data" />
      <PArrow x1={224} y1={193} x2={300} y2={193} />
    </svg>
  );
}

function AMLVisual({ accent }) {
  return (
    <svg viewBox="0 0 640 280" className="about-build-svg" role="img" aria-label="Compliance document pipeline: document, extraction, checks and human review with risk and rules indicators" style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}>
      <PNode x={44} y={24} w={160} h={46} label="Document" />
      <PArrow x1={124} y1={70} x2={124} y2={96} />
      <PNode x={44} y={96} w={160} h={46} label="Extract" accent fill={accent} />
      <PArrow x1={124} y1={142} x2={124} y2={168} />
      <PNode x={44} y={168} w={160} h={46} label="Check" />
      <PArrow x1={124} y1={214} x2={124} y2={240} />
      <PNode x={44} y={240} w={160} h={40} label="Review" />
      <PNode x={300} y={56} w={120} h={42} label="Risk" />
      <PNode x={300} y={130} w={120} h={42} label="Rules" />
      <PNode x={300} y={204} w={120} h={42} label="Human Review" />
      <PArrow x1={204} y1={96} x2={300} y2={77} dashed />
      <PArrow x1={204} y1={168} x2={300} y2={151} dashed />
      <PArrow x1={204} y1={240} x2={300} y2={225} dashed />
    </svg>
  );
}

function IntegrationVisual({ accent }) {
  return (
    <svg viewBox="0 0 640 280" className="about-build-svg" role="img" aria-label="Integration architecture: CRM, ERP, database and webhooks connected through a central API layer" style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}>
      <PNode x={44} y={40} w={110} h={46} label="CRM" />
      <PNode x={44} y={190} w={110} h={46} label="ERP" />
      <PNode x={486} y={40} w={110} h={46} label="Database" />
      <PNode x={486} y={190} w={110} h={46} label="Webhooks" />
      <PArrow x1={154} y1={63} x2={250} y2={122} dashed />
      <PArrow x1={154} y1={213} x2={250} y2={158} dashed />
      <PArrow x1={486} y1={63} x2={390} y2={122} dashed />
      <PArrow x1={486} y1={213} x2={390} y2={158} dashed />
      <PNode x={250} y={108} w={140} h={64} label="API Layer" sub="auth · sync" accent fill={accent} />
    </svg>
  );
}

function AIVisual({ accent }) {
  return (
    <svg viewBox="0 0 640 280" className="about-build-svg" role="img" aria-label="AI automation: input through an AI agent using tools, data and context, producing an action with human review" style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}>
      <PNode x={36} y={112} w={92} h={50} label="Input" />
      <PArrow x1={128} y1={137} x2={158} y2={137} />
      <PNode x={158} y={94} w={150} h={86} label="AI Agent" sub="reasoning" accent fill={accent} />
      <PArrow x1={308} y1={110} x2={352} y2={66} />
      <PArrow x1={308} y1={137} x2={352} y2={137} />
      <PArrow x1={308} y1={164} x2={352} y2={208} />
      <PNode x={352} y={44} w={104} h={44} label="Tools" />
      <PNode x={352} y={115} w={104} h={44} label="Data" />
      <PNode x={352} y={186} w={104} h={44} label="Context" />
      <PArrow x1={456} y1={66} x2={500} y2={122} />
      <PArrow x1={456} y1={137} x2={500} y2={137} />
      <PArrow x1={456} y1={208} x2={500} y2={152} />
      <PNode x={500} y={112} w={104} h={50} label="Action" />
      <PArrow x1={552} y1={162} x2={552} y2={196} />
      <PNode x={452} y={220} w={160} h={44} label="Human Review" />
      <PArrow x1={452} y1={242} x2={392} y2={242} />
    </svg>
  );
}

const BUILD_VISUAL_MAP = {
  odoo: OdooVisual,
  workflow: WorkflowVisual,
  fudo: FudoVisual,
  aml: AMLVisual,
  integrations: IntegrationVisual,
  ai: AIVisual,
};

function BuildAreaVisual({ type, accent }) {
  const Visual = BUILD_VISUAL_MAP[type] || OdooVisual;
  return <Visual accent={accent} />;
}

/* ============================================================
   PROCESS STEP VISUAL — purpose-built technical diagrams
============================================================ */

function PNode({ x, y, w, h, label, sub, fill }) {
  const cx = x + w / 2;
  const isAccent = Boolean(fill);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="12"
        fill={isAccent ? fill : "var(--bg-surface)"}
        stroke={isAccent ? "none" : "var(--border-strong)"}
        strokeWidth={isAccent ? 0 : 1.4}
      />
      <text
        x={cx}
        y={y + h / 2 + (sub ? -4 : 5)}
        textAnchor="middle"
        fill={isAccent ? "#0A1120" : "var(--text-primary)"}
        fontSize="13.5"
        fontWeight="700"
        letterSpacing="-0.2"
      >
        {label}
      </text>
      {sub && (
        <text
          x={cx}
          y={y + h / 2 + 14}
          textAnchor="middle"
          fill={isAccent ? "#0A1120" : "var(--text-muted)"}
          opacity={isAccent ? 0.8 : 1}
          fontSize="9.5"
          fontWeight="500"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function PArrow({ x1, y1, x2, y2, dashed }) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="var(--border-strong)"
        strokeWidth="2"
        strokeDasharray={dashed ? "3 7" : undefined}
        strokeLinecap="round"
      />
    </g>
  );
}

function ProcessStepVisual({ type, accent }) {
  if (type === "architecture") {
    return (
      <svg viewBox="0 0 640 340" className="about-process-svg" role="img" aria-label="Solution architecture diagram" style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}>
        {[
          { x: 52, y: 52, l: "ERP" },
          { x: 52, y: 240, l: "CRM" },
          { x: 468, y: 52, l: "Database" },
          { x: 468, y: 240, l: "Automation" },
        ].map((n) => (
          <PNode key={n.l} x={n.x} y={n.y} w={120} h={48} label={n.l} />
        ))}
        <PArrow x1={172} y1={76} x2={250} y2={146} dashed />
        <PArrow x1={172} y1={264} x2={250} y2={194} dashed />
        <PArrow x1={468} y1={76} x2={390} y2={146} dashed />
        <PArrow x1={468} y1={264} x2={390} y2={194} dashed />
        <PNode x={250} y={126} w={140} h={88} label="Solution" sub="architecture" accent={accent} fill={accent} />
      </svg>
    );
  }

  if (type === "pipeline") {
    return (
      <svg viewBox="0 0 640 340" className="about-process-svg" role="img" aria-label="Build pipeline diagram" style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}>
        <PNode x={48} y={132} w={128} h={64} label="Build" sub="logic + automation" accent={accent} fill={accent} />
        <PArrow x1={176} y1={164} x2={224} y2={164} />
        <PNode x={224} y={132} w={120} h={64} label="Connect" sub="APIs · systems" />
        <PArrow x1={344} y1={164} x2={392} y2={164} />
        <PNode x={392} y={132} w={112} h={64} label="Test" sub="real workflows" />
        <PArrow x1={504} y1={164} x2={548} y2={164} />
        <PNode x={548} y={132} w={46} h={64} label="Ship" />
      </svg>
    );
  }

  if (type === "loop") {
    return (
      <svg viewBox="0 0 640 340" className="about-process-svg" role="img" aria-label="Continuous improvement loop diagram" style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}>
        <PNode x={240} y={48} w={160} h={64} label="Monitor" sub="logs · metrics" accent={accent} fill={accent} />
        <PNode x={480} y={150} w={112} h={64} label="Fix" sub="edge cases" />
        <PNode x={48} y={150} w={112} h={64} label="Extend" sub="new needs" />
        <PArrow x1={400} y1={112} x2={528} y2={160} />
        <PArrow x1={480} y1={182} x2={160} y2={182} />
        <PArrow x1={104} y1={150} x2={270} y2={104} />
        <circle cx="320" cy="182" r="4" fill="var(--border-strong)" />
      </svg>
    );
  }

  /* map — discover */
  return (
    <svg viewBox="0 0 640 340" className="about-process-svg" role="img" aria-label="Workflow mapping diagram" style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}>
      {[
        { x: 52, y: 60, l: "Team" },
        { x: 52, y: 232, l: "Tools" },
        { x: 468, y: 146, l: "Process" },
      ].map((n) => (
        <PNode key={n.l} x={n.x} y={n.y} w={112} h={56} label={n.l} />
      ))}
      <PArrow x1={164} y1={88} x2={248} y2={150} dashed />
      <PArrow x1={164} y1={260} x2={248} y2={190} dashed />
      <PArrow x1={468} y1={174} x2={394} y2={170} dashed />
      <rect
        x={248}
        y={120}
        width={146}
        height={100}
        rx="16"
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeDasharray="5 6"
      />
      <text
        x={321}
        y={168}
        textAnchor="middle"
        fill={accent}
        fontSize="13.5"
        fontWeight="700"
      >
        Workflow map
      </text>
      <text
        x={321}
        y={190}
        textAnchor="middle"
        fill="var(--text-muted)"
        fontSize="10"
      >
        handoffs · bottlenecks
      </text>
    </svg>
  );
}

/* ============================================================
   OUR STORY — editorial journey: FROM → THROUGH → TO
   Vertical timeline rail removed. Three-stage journey with
   subtle progression line pointing right toward origin visual.
============================================================ */

// Story data source lives in i18n about.storyTimeline.
// We keep the same data but re-present as editorial journey.

function StoryJourneyStage({ index, t }) {
  const items = t("about.storyTimeline") || [];
  const item = items[index];

  const stageNames = ["FROM", "THROUGH", "TO"];
  const accents = ["violet", "cyan", "green"];
  const accent = accents[index];
  const vOffset = (index - 1) * 8;

  return (
    <div
      key={item.year}
      className="about-story-journey-stage"
      data-accent={accent}
      style={{ marginTop: `${vOffset}px` }}
    >
      <div className="about-stage-header">
        <span className="about-stage-label">{stageNames[index]}</span>
        <span className="about-stage-phase">{item.year}</span>
      </div>
      <h3 className="about-stage-title">{item.title}</h3>
      <p className="about-stage-desc">{item.desc}</p>
    </div>
  );
}

function OriginVisual() {
  return (
    <svg
      viewBox="0 0 640 460"
      className="about-origin-svg"
      role="img"
      aria-label="SystemaOps origin map: from IDEA through AI, Automation, Odoo and Integration to WORKING SYSTEMS"
      style={{
        fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
      }}
    >
      <PNode x={250} y={26} w={140} h={52} label="IDEA" />

      <PArrow x1={320} y1={78} x2={320} y2={122} />

      <PNode
        x={230}
        y={122}
        w={180}
        h={74}
        label="SYSTEMAOPS"
        sub="one system approach"
        fill="var(--accent-primary)"
      />

      <PArrow x1={268} y1={196} x2={104} y2={248} dashed />
      <PArrow x1={320} y1={196} x2={282} y2={248} dashed />
      <PArrow x1={372} y1={196} x2={460} y2={248} dashed />

      <PNode x={22} y={248} w={128} h={52} label="AI" fill="#22D3EE" />
      <PNode x={216} y={248} w={132} h={52} label="Automation" fill="#F59E0B" />
      <PNode x={410} y={248} w={100} h={52} label="Odoo" fill="#8B7CFF" />
      <PNode x={536} y={248} w={82} h={52} label="Integration" fill="#3B82F6" />

      <PArrow x1={86} y1={300} x2={260} y2={366} dashed />
      <PArrow x1={282} y1={300} x2={316} y2={366} dashed />
      <PArrow x1={460} y1={300} x2={380} y2={366} dashed />
      <PArrow x1={577} y1={300} x2={440} y2={366} dashed />

      <PNode x={230} y={366} w={180} h={66} label="WORKING SYSTEMS" />
    </svg>
  );
}

/* ============================================================
   ABOUT PAGE
=========================================================== */

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
      {/* ============================================================
         SEO
      ============================================================ */}

      <Meta
        title={t("about.metaTitle")}
        description={t("about.metaDesc")}
        canonical="/about"
        keywords="about SystemaOps, company, mission, team, AI automation company, Odoo ERP partner, workflow automation team"
      />

      <BreadcrumbSchema
        items={[
          {
            name: t("breadcrumbs.home"),
            href: "/",
          },
          {
            name: t("breadcrumbs.about"),
            href: "/about",
          },
        ]}
      />

      <OrganizationSchema />

      {/* ============================================================
          01. HERO
      ============================================================ */}

      <section className="about-hero">
        <div className="about-hero-inner">

          <span className="about-hero-eyebrow">
            <span
              className="about-hero-eyebrow-dot"
              aria-hidden="true"
            />

            {t("about.eyebrow")}
          </span>

          <h1 className="about-hero-title">
            {t("about.heroTitle")}
          </h1>

          <p className="about-hero-desc">
            {t("about.heroStatement")}
          </p>

          <Link
            to="/contact"
            className="about-hero-cta"
          >
            <CalendarDays size={18} />

            {t("about.bookCall")}

            <ArrowRight size={16} />
          </Link>

        </div>
      </section>

      {/* ============================================================
          DIVIDER
      ============================================================ */}

      <div className="about-divider">
        <div className="about-divider-line" />
      </div>

      {/* ============================================================
          02. OUR STORY
      ============================================================ */}

      <section className="about-section">
        <div className="about-inner">

<div className="about-section-header">

              <span className="about-eyebrow">
                {t("about.ourStory")}
              </span>

              <h2 className="about-section-title">
                {t("about.storyTitle1")}{" "}
                <span className="gradient-text">
                  {t("about.storyTitleAccent")}
                </span>
              </h2>

              <p className="about-section-lead">
                {t("about.storyIntro")}
              </p>

            </div>

          <div className="about-story-grid">

            {/* ── LEFT: EDITORIAL JOURNEY — FROM → THROUGH → TO ── */}

            <div className="about-story-chapters">
              {[0, 1, 2].map((i) => (
                <StoryJourneyStage key={i} index={i} t={t} />
              ))}
                          </div>

            {/* ── RIGHT: ORIGIN VISUAL ── */}

            <div className="about-story-visual-panel">
              <OriginVisual />

              <div className="about-story-visual-meta">
                <span className="about-story-visual-overline">
                  From idea to system
                </span>
                <p className="about-story-visual-statement">
                  {t("about.storyIntro")}
                </p>
                <span className="about-story-visual-caption">
                  One team, real systems — automation, Odoo, integrations and AI working together.
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          DIVIDER
      ============================================================ */}

      <div className="about-divider">
        <div className="about-divider-line" />
      </div>

      {/* ============================================================
          03. BUILT IN THE REAL WORLD
      ============================================================ */}

      <section className="about-section">
        <div className="about-inner">

          <div className="about-section-header center">

            <span className="about-eyebrow">
              {t("about.realWorldEyebrow")}
            </span>

            <h2 className="about-section-title">
              {t("about.realWorldTitle")}
            </h2>

            <p className="about-section-desc">
              {t("about.realWorldDesc")}
            </p>

          </div>

          <PresenceShowcase />

        </div>
      </section>

      {/* ============================================================
          DIVIDER
      ============================================================ */}

      <div className="about-divider">
        <div className="about-divider-line" />
      </div>

      {/* ============================================================
          04. HOW WE WORK
      ============================================================ */}

      <section className="about-section">
        <div className="about-inner">

          <div className="about-section-header center">

            <span className="about-eyebrow">
              {t("about.processEyebrow")}
            </span>

            <h2 className="about-section-title">
              {t("about.processTitle")}
            </h2>

            <p className="about-section-desc">
              {t("about.processDesc")}
            </p>

          </div>

          <ProcessJourney />

        </div>
      </section>

      {/* ============================================================
          DIVIDER
      ============================================================ */}

      <div className="about-divider">
        <div className="about-divider-line" />
      </div>
      {/* ============================================================
          05. SELECTED WORK
      ============================================================ */}

      <section className="about-section">
        <div className="about-inner">

          <div className="about-section-header center">

            <span className="about-eyebrow">
              {t("about.selectedWorkEyebrow")}
            </span>

            <h2 className="about-section-title">
              {t("about.selectedWorkTitle")}
            </h2>

            <p className="about-section-desc">
              {t("about.selectedWorkDesc")}
            </p>

          </div>

          <div className="about-work-grid">

            {selectedWork
              .filter((project) => project.featured)
              .map((project) => {

                const Icon = workIconMap[project.icon] ||
                  Blocks;

                return (
                  <Link
                    key={project.id}
                    to={project.href}
                    className="about-work-card about-work-card--featured"
                    style={{
                      "--c": project.accent,
                      "--c-rgb": project.accentRgb,
                      "--c-text": project.accentText,
                    }}
                  >
                    <div className="about-work-card-top">
                      <div
                        className="about-work-icon"
                        aria-hidden="true"
                      >
                        <Icon
                          size={24}
                          strokeWidth={1.8}
                        />
                      </div>

                      <span className="about-work-category">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="about-work-title">
                      {project.title}
                    </h3>

                    <p className="about-work-text">
                      {project.description}
                    </p>

                    <div className="about-work-visual-wrap">
                      <BuildAreaVisual
                        type={project.visual}
                        accent={project.accent}
                      />
                    </div>

                    <div className="about-work-tags">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="about-work-tag"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="about-work-link">
                      {project.linkLabel}

                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                );
              })}

            {selectedWork
              .filter((project) => !project.featured)
              .map((project) => {

                const Icon = workIconMap[project.icon] ||
                  Blocks;

                return (
                  <Link
                    key={project.id}
                    to={project.href}
                    className="about-work-card about-work-card--compact"
                    style={{
                      "--c": project.accent,
                      "--c-rgb": project.accentRgb,
                      "--c-text": project.accentText,
                    }}
                  >
                    <div className="about-work-card-top">
                      <div
                        className="about-work-icon"
                        aria-hidden="true"
                      >
                        <Icon
                          size={20}
                          strokeWidth={1.8}
                        />
                      </div>

                      <span className="about-work-category">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="about-work-title">
                      {project.title}
                    </h3>

                    <p className="about-work-text">
                      {project.description}
                    </p>

                    <div className="about-work-visual-wrap">
                      <BuildAreaVisual
                        type={project.visual}
                        accent={project.accent}
                      />
                    </div>

                    <div className="about-work-tags">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="about-work-tag"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="about-work-link">
                      {project.linkLabel}

                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                );
              })}

          </div>

        </div>
      </section>

      {/* ============================================================
          DIVIDER
      ============================================================ */}

      <div className="about-divider">
        <div className="about-divider-line" />
      </div>


      {/* ============================================================
          06. FROM THE SYSTEMAOPS FIELD
      ============================================================ */}

      <section className="about-section">
        <div className="about-inner">

          <div className="about-section-header center">

            <span className="about-eyebrow">
              {t("about.fieldEyebrow")}
            </span>

            <h2 className="about-section-title">
              {t("about.fieldTitle")}
            </h2>

            <p className="about-section-desc">
              {t("about.fieldDesc")}
            </p>

          </div>

          <div className="about-field-grid">

            {fieldPosts.map((post) => (
              <article
                key={post.id}
                className={`about-field-card ${
                  post.id === "gitex-day1"
                    ? "about-field-card--day1"
                    : ""
                }`}
              >
                <div className="about-field-media">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="about-field-photo"
                    loading="lazy"
                  />
                </div>  

                <div className="about-field-body">
                  <span className="about-field-category">
                    {post.category}
                  </span>

                  <h3 className="about-field-title">
                    {post.title}
                  </h3>

                  <p className="about-field-excerpt">
                    {post.excerpt}
                  </p>

                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-field-link"
                  >
                    {t("about.fieldViewOnLinkedIn")}

                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </article>
            ))}

          </div>

        </div>
      </section>

      {/* ============================================================
          DIVIDER
      ============================================================ */}

      <div className="about-divider">
        <div className="about-divider-line" />
      </div>

      {/* ============================================================
          07. OUR ENGINEERING PRINCIPLES
      ============================================================ */}

      <section className="about-section">
        <div className="about-inner">

          <div className="about-section-header center">

            <span className="about-eyebrow">
              {t("about.principlesEyebrow")}
            </span>

            <h2 className="about-section-title">
              {t("about.principlesTitle")}
            </h2>

            <p className="about-section-desc">
              {t("about.principlesDesc")}
            </p>

          </div>

          <div className="about-principles-grid">

            {(t("about.principles") || []).map(
              (principle, index) => {

                const principleIcons = [
                  ShieldCheck,  // Reliable
                  Handshake,    // Practical
                  Workflow,     // Automated
                  Eye,          // Observable
                  TrendingUp,   // Scalable
                ];

                const Icon = principleIcons[index];

                return (
                  <div
                    key={principle.title}
                    className="about-principle-card"
                  >

                    <div
                      className="about-principle-icon"
                      aria-hidden="true"
                    >
                      <Icon
                        size={24}
                        strokeWidth={1.8}
                      />
                    </div>

                    <h3 className="about-principle-title">
                      {principle.title}
                    </h3>

                    <p className="about-principle-text">
                      {principle.desc}
                    </p>

                  </div>
                );
              }
            )}

          </div>

        </div>
      </section>

      {/* ============================================================
          DIVIDER
      ============================================================ */}

      <div className="about-divider">
        <div className="about-divider-line" />
      </div>

      {/* ============================================================
          08. CTA
      ============================================================ */}

      <section className="about-cta-section">

        <div className="about-cta-box">

          <div className="about-cta-inner">

            <span className="about-cta-label">
              {t("about.readyLabel")}
            </span>

            <h2 className="about-cta-title">
              {t("about.readyTitle")}
            </h2>

            <p className="about-cta-text">
              {t("about.readyDesc")}
            </p>

            <Link
              to="/contact"
              className="about-cta-btn"
            >
              <CalendarDays size={18} />

              {t("about.bookCall")}

              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      </section>
    </>
  );
}
