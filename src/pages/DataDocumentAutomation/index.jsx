/**
 * pages/DataDocumentAutomation/index.jsx
 *
 * Data & Document Automation service page.
 * Story: document → understand → validate → structure → act.
 */

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
import {
  ServiceTech,
  RealWork,
  ServiceFaq,
  RelatedServices,
} from "../../components/service/ServiceSections";
import "../../components/service/ServiceShared.css";
import { selectedWork } from "../../data/about";

import "./DataDocumentAutomation.css";

const ACCENT = "#F97316";
const ACCENT_RGB = "249, 115, 22";
const ACCENT_TEXT = "#C2410C";

const CAPABILITIES = [
  {
    icon: Inbox,
    title: "Document intake",
    desc: "A single entry point for incoming files and form data — email attachments, uploads and shared folders collected into one workflow.",
  },
  {
    icon: ScanSearch,
    title: "Information extraction",
    desc: "The fields that matter — totals, dates, reference numbers, line items — pulled out of documents into usable values.",
  },
  {
    icon: ListChecks,
    title: "Validation & rules",
    desc: "Business rules check every record: required fields, expected formats, sensible ranges. Anything doubtful is flagged, not forced through.",
  },
  {
    icon: ArrowDownUp,
    title: "Data normalization",
    desc: "Inconsistent formats become one clean structure, so downstream systems receive data they can actually consume.",
  },
  {
    icon: Send,
    title: "Routing & workflow",
    desc: "Validated records flow into Odoo, CRM or custom workflows automatically — with the source document attached for traceability.",
  },
  {
    icon: UserCheck,
    title: "Human review",
    desc: "Exceptions route to a person with full context. Approved or corrected records rejoin the flow; nothing stalls silently.",
  },
];

const PROCESS = [
  {
    n: "01",
    color: "#F97316",
    title: "Capture",
    desc: "Incoming documents and data are brought into one workflow, whatever format they arrive in.",
  },
  {
    n: "02",
    color: "#22D3EE",
    title: "Extract",
    desc: "The fields your process needs are identified and pulled out as structured values.",
  },
  {
    n: "03",
    color: "#8B7CFF",
    title: "Validate",
    desc: "Rules run over every record; exceptions go to a human with the full picture attached.",
  },
  {
    n: "04",
    color: "var(--accent-primary)",
    title: "Act",
    desc: "Clean, structured information lands in the system that handles the next step.",
  },
];

const USE_CASES = [
  {
    tag: "Operations",
    title: "RFQ processing",
    desc: "Incoming requests for quotation are captured, key details extracted and structured, then routed into the quoting workflow — with unclear requests flagged for review.",
  },
  {
    tag: "Back office",
    title: "Document intake at scale",
    desc: "High volumes of routine documents move through the same pipeline: captured, validated and filed into the right system without per-file handling.",
  },
  {
    tag: "Finance ops",
    title: "Structured business data extraction",
    desc: "Totals, dates and line items leave the PDF and become fields your ERP and reporting can work with directly.",
  },
  {
    tag: "Regulated work",
    title: "Compliance-oriented document workflows",
    desc: "Where traceability matters, every record keeps its source document, validation history and review decision attached.",
  },
];

const INCLUDES = [
  "Intake design — where documents enter and how they are tracked",
  "Field mapping — which values matter and where each one goes",
  "Validation rules tuned to your formats and tolerances",
  "Exception routing with full context for the reviewer",
  "Delivery into Odoo, CRM or workflow systems",
  "Handover notes your team can maintain",
];

const DD_TECH = [
  {
    role: "Sources",
    items: ["Email attachments", "Uploads", "Shared folders", "Forms", "Invoices", "RFQs"],
  },
  {
    role: "Processing",
    items: ["Field extraction", "Validation rules", "Format normalization", "Duplicate detection"],
  },
  {
    role: "Destinations",
    items: ["Odoo ERP", "CRM systems", "n8n workflows", "Structured records"],
  },
  {
    role: "Oversight",
    items: ["Human review queues", "Source traceability", "Review history"],
  },
];

const DD_WORK_IDS = ["aml", "ai", "workflow"];

const DD_FAQ = [
  {
    q: "What kinds of documents can you automate?",
    a: "Routine business documents with repeatable structure — invoices, forms, RFQs and standard back-office files. If a document type is too irregular to handle reliably, we tell you during mapping.",
  },
  {
    q: "Do you use OCR or AI for extraction?",
    a: "Where appropriate. Extraction is paired with validation rules and human review for exceptions, so automation speeds up the routine without gambling on the ambiguous.",
  },
  {
    q: "What happens to a document that fails validation?",
    a: "It routes to a human reviewer with the source document and the reason attached. Approved or corrected records rejoin the flow — nothing stalls silently.",
  },
  {
    q: "Where does the structured data end up?",
    a: "In the system that handles the next step — typically Odoo, a CRM, or a workflow — with the source document attached for traceability.",
  },
  {
    q: "How do you handle sensitive documents?",
    a: "Intake, access and retention are designed around your requirements: scoped access, source traceability, and review history on compliance-sensitive records.",
  },
];

const DD_RELATED = [
  {
    title: "AI Automation & Agents",
    desc: "AI agents and intelligent workflows that remove manual work.",
    href: "/ai-automation",
    accent: "#22D3EE",
  },
  {
    title: "Workflow Automation",
    desc: "Automate repetitive operations across the tools you already use.",
    href: "/workflow-automation",
    accent: "#F59E0B",
  },
  {
    title: "Odoo Solutions",
    desc: "ERP, CRM and business applications tailored to how you operate.",
    href: "/odoo-customization",
    accent: "#8B7CFF",
  },
];

function HeroPipeline() {
  const dur = "7s";
  const stages = [
    { t: "DOCUMENT", s: "raw file", y: 24, delay: "0s" },
    { t: "CAPTURE", s: "collected", y: 100, delay: "-0.66s" },
    { t: "EXTRACT", s: "fields pulled", y: 176, hot: true, delay: "-1.46s" },
    { t: "VALIDATE", s: "rules · checks", y: 286, delay: "-2.86s" },
    { t: "STRUCTURED DATA", s: "clean record", y: 370, delay: "-3.86s" },
    { t: "BUSINESS SYSTEM", s: "next step", y: 454, delay: "-4.86s" },
  ];
  const links = [
    { id: "dd-p0", d: "M180 72 L180 100", begin: "0.4s" },
    { id: "dd-p1", d: "M180 148 L180 176", begin: "1.2s" },
    { id: "dd-p2", d: "M180 260 L180 286", begin: "2.6s" },
    { id: "dd-p3", d: "M180 334 L180 370", begin: "3.6s" },
    { id: "dd-p4", d: "M180 418 L180 454", begin: "4.6s" },
  ];
  return (
    <svg
      viewBox="0 0 360 526"
      className="dd-hero-svg"
      role="img"
      aria-label="Document pipeline: a document is captured, extracted showing name, date and amount fields, validated against rules, structured into data, and delivered to the business system"
    >
      <defs>
        {links.map((l) => (
          <path key={l.id} id={l.id} d={l.d} fill="none" />
        ))}
      </defs>
      <g className="dd-flow-line" strokeWidth="2">
        <line x1="180" y1="72" x2="180" y2="100" />
        <line x1="180" y1="148" x2="180" y2="176" />
        <line x1="180" y1="260" x2="180" y2="286" />
        <line x1="180" y1="334" x2="180" y2="370" />
        <line x1="180" y1="418" x2="180" y2="454" />
      </g>
      <g className="dd-pulses" aria-hidden="true">
        {links.map((l) => (
          <circle key={l.id} r={4} fill={ACCENT}>
            <animateMotion dur={dur} begin={l.begin} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;0.16" calcMode="linear">
              <mpath href={`#${l.id}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.02;0.14;0.18" dur={dur} begin={l.begin} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
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
                fill={s.hot ? ACCENT : "none"}
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
                  {["NAME", "DATE", "AMOUNT"].map((f, fi) => (
                    <g key={f}>
                      <rect x={88 + fi * 64} y={s.y + 52} width={56} height={22} rx={7} fill="rgba(10,17,32,0.22)" />
                      <text x={116 + fi * 64} y={s.y + 67} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0A1120">
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

function ProcessingVisual() {
  return (
    <svg
      viewBox="0 0 900 400"
      className="dd-arch-svg"
      role="img"
      aria-label="Processing flow: document to extract to validate to structure to Odoo or ERP, with a human review branch off validation"
    >
      <g stroke="var(--border-strong)" strokeWidth="2">
        <line x1="170" y1="150" x2="225" y2="150" />
        <line x1="375" y1="150" x2="430" y2="150" />
        <line x1="580" y1="150" x2="635" y2="150" />
        <line x1="480" y1="196" x2="480" y2="300" strokeDasharray="6 6" />
        <line x1="480" y1="300" x2="735" y2="300" strokeDasharray="6 6" />
        <line x1="735" y1="300" x2="735" y2="196" strokeDasharray="6 6" />
      </g>
      <g fontFamily="'Space Grotesk','Plus Jakarta Sans',sans-serif">
        {/* document cue: folded corner */}
        <rect x="40" y="118" width="130" height="64" rx="10" className="dd-node" />
        <path d="M150 118 L150 138 L170 138" fill="none" stroke="var(--border-strong)" strokeWidth="2" />
        <text x="100" y="147" textAnchor="middle" className="dd-node-text dd-node-text--sm">DOCUMENT</text>
        <text x="100" y="165" textAnchor="middle" className="dd-node-sub">invoice · form</text>

        <rect x="225" y="118" width="150" height="64" rx="12" fill={ACCENT} />
        <text x="300" y="147" textAnchor="middle" className="dd-node-text dd-node-text--sm dd-node-text--on-accent">EXTRACT</text>
        <text x="300" y="165" textAnchor="middle" className="dd-node-sub dd-node-sub--on-accent">fields · values</text>

        <rect x="430" y="118" width="150" height="64" rx="12" className="dd-node" />
        <text x="505" y="147" textAnchor="middle" className="dd-node-text dd-node-text--sm">VALIDATE</text>
        <text x="505" y="165" textAnchor="middle" className="dd-node-sub">rules · checks</text>

        <rect x="580" y="118" width="0" height="0" fill="none" />
        <rect x="635" y="118" width="150" height="64" rx="12" className="dd-node" />
        <text x="710" y="147" textAnchor="middle" className="dd-node-text dd-node-text--sm">STRUCTURE</text>
        <text x="710" y="165" textAnchor="middle" className="dd-node-sub">clean record</text>

        <rect x="660" y="230" width="150" height="64" rx="12" fill={ACCENT} />
        <text x="735" y="259" textAnchor="middle" className="dd-node-text dd-node-text--sm dd-node-text--on-accent">ODOO / ERP</text>
        <text x="735" y="277" textAnchor="middle" className="dd-node-sub dd-node-sub--on-accent">next system</text>

        <rect x="405" y="288" width="150" height="56" rx="12" className="dd-node dd-node--review" />
        <text x="480" y="311" textAnchor="middle" className="dd-node-text dd-node-text--sm">HUMAN REVIEW</text>
        <text x="480" y="329" textAnchor="middle" className="dd-node-sub">exceptions</text>
      </g>
    </svg>
  );
}

export default function DataDocumentAutomationPage() {
  return (
    <div
      className="dd-page"
      style={{
        "--svc": ACCENT,
        "--svc-rgb": ACCENT_RGB,
        "--svc-text": ACCENT_TEXT,
      }}
    >
      <Meta
        title="Data & Document Automation"
        description="Capture documents and data, extract what matters, validate it and route it into Odoo, CRM and business workflows — with human review where it counts."
        canonical="/data-document-automation"
        keywords="document automation, data extraction, document processing, document workflow, data validation, Odoo document automation"
      />

      <ServiceSchema
        name="Data & Document Automation"
        description="Document and data automation: intake, extraction, validation, normalization and routing into business systems with human oversight."
        url="/data-document-automation"
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/#services" },
          { name: "Data & Document Automation", href: "/data-document-automation" },
        ]}
      />

      {/* ==================== HERO ==================== */}
      <Reveal>
        <section className="dd-hero">
          <div className="dd-hero-inner">
            <div className="dd-hero-copy">
              <span className="dd-eyebrow">
                <span className="dd-eyebrow-dot" />
                DATA &amp; DOCUMENT AUTOMATION
              </span>
              <h1 className="dd-title">
                Turn documents into
                <br />
                <span className="dd-title-accent">decisions your systems can use.</span>
              </h1>
              <p className="dd-hero-desc">
                Capture documents and data, extract the information
                that matters, validate it and route it into the
                systems that handle the next step — with a human
                checkpoint wherever judgment is required.
              </p>
              <div className="dd-hero-actions">
                <Link to="/contact" className="dd-primary-btn">
                  <CalendarDays size={18} />
                  Automate a document workflow
                  <ArrowRight size={16} />
                </Link>
                <a href="#dd-flow" className="dd-secondary-btn">
                  See the pipeline
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
            <span className="dd-eyebrow">WHY DOCUMENT AUTOMATION</span>
            <h2 className="dd-section-title">
              Useful information should not <span className="dd-title-accent">stay trapped in files.</span>
            </h2>
            <div className="dd-why-grid">
              <div className="dd-why-item">
                <h3>Repetitive manual entry</h3>
                <p>Teams retype the same values from PDFs and forms into systems, day after day.</p>
              </div>
              <div className="dd-why-item">
                <h3>Inconsistent formats</h3>
                <p>Every sender formats things differently — dates, totals, references — and someone has to reconcile them.</p>
              </div>
              <div className="dd-why-item">
                <h3>Delayed processing</h3>
                <p>Documents wait in inboxes and folders until a person gets around to them.</p>
              </div>
              <div className="dd-why-item">
                <h3>Routine human review</h3>
                <p>Straightforward cases get the same attention as genuinely ambiguous ones.</p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== CAPABILITIES ==================== */}
      <Reveal delay={0.08}>
        <section className="dd-section dd-section--tight">
          <div className="dd-container">
            <div className="dd-section-header center">
              <span className="dd-eyebrow">CAPABILITIES</span>
              <h2 className="dd-section-title">From inbox to structured record.</h2>
            </div>
            <div className="dd-grid">
              {CAPABILITIES.map((c) => (
                <div key={c.title} className="dd-card">
                  <div className="dd-card-icon">
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

      {/* ==================== PROCESSING FLOW ==================== */}
      <Reveal delay={0.08}>
        <section id="dd-flow" className="dd-section">
          <div className="dd-container">
            <span className="dd-eyebrow">THE PIPELINE</span>
            <h2 className="dd-section-title">Controlled automation, end to end.</h2>
            <p className="dd-section-desc">
              Documents travel left to right: extraction pulls out
              the values, validation checks them, and structured
              records land in Odoo or your ERP. Anything the rules
              can&apos;t resolve drops to human review — with the
              source document and the reason attached.
            </p>
            <div className="dd-arch-frame">
              <ProcessingVisual />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== TECHNOLOGY ==================== */}

      <ServiceTech
        eyebrow="TECHNOLOGY"
        title="Every stage uses the right tool."
        desc="The pipeline is assembled from intake, processing and destination tooling — grouped by role so the responsibilities stay clear."
        groups={DD_TECH}
      />

      {/* ==================== PROCESS ==================== */}
      <Reveal delay={0.1}>
        <section className="dd-section dd-section--tight">
          <div className="dd-container">
            <div className="dd-section-header center">
              <span className="dd-eyebrow">HOW IT WORKS</span>
              <h2 className="dd-section-title">Capture, extract, validate, act.</h2>
            </div>
            <div className="dd-process">
              {PROCESS.map((s) => (
                <div key={s.n} className="dd-process-item">
                  <span className="dd-process-number" style={{ color: s.color }}>{s.n}</span>
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
                <span className="dd-eyebrow">HUMAN OVERSIGHT</span>
                <h2 className="dd-section-title">Automation with a human checkpoint.</h2>
                <p className="dd-section-desc">
                  Not every decision should be fully automated. The
                  pipeline is designed so routine cases flow straight
                  through while anything uncertain stops where a
                  person can judge it.
                </p>
              </div>
              <ol className="dd-checkpoint-steps">
                <li><strong>Automation</strong> extracts and checks every record.</li>
                <li><strong>Validation</strong> passes clean records, flags the rest.</li>
                <li><strong>Exception</strong> carries the document plus the reason.</li>
                <li><strong>Human review</strong> approves or corrects with one action.</li>
                <li><strong>Continue</strong> — the record rejoins the flow.</li>
              </ol>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ==================== USE CASES ==================== */}
      <Reveal delay={0.08}>
        <section className="dd-section dd-section--tight">
          <div className="dd-container">
            <span className="dd-eyebrow">USE CASES</span>
            <h2 className="dd-section-title">Document-heavy work, handled.</h2>
            <div className="dd-usecases">
              {USE_CASES.map((u) => (
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
        eyebrow="SELECTED WORK"
        title="Where document work lands."
        desc="Extracted, validated records flow into maintained systems — these build areas from our own portfolio are typical destinations."
        items={selectedWork.filter((w) => DD_WORK_IDS.includes(w.id))}
      />

      {/* ==================== INCLUDES ==================== */}
      <Reveal delay={0.08}>
        <section className="dd-section dd-section--tight">
          <div className="dd-container">
            <div className="dd-includes">
              <div>
                <span className="dd-eyebrow">DELIVERY</span>
                <h2 className="dd-section-title">What the implementation includes.</h2>
              </div>
              <ul className="dd-checklist">
                {INCLUDES.map((item) => (
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
        eyebrow="QUESTIONS"
        title="Document automation, answered directly."
        items={DD_FAQ}
      />

      {/* ==================== RELATED ==================== */}

      <RelatedServices
        eyebrow="KEEP EXPLORING"
        title="Related services."
        items={DD_RELATED}
      />

      {/* ==================== CTA ==================== */}
      <Reveal delay={0.12}>
        <section className="dd-cta-section">
          <div className="dd-cta-box">
            <div className="dd-cta-inner">
              <span className="dd-eyebrow">READY WHEN YOU ARE</span>
              <h2>
                Have a <span className="dd-title-accent">document-heavy process?</span>
              </h2>
              <p>
                Show us one representative document and where it
                needs to go. We&apos;ll map the workflow from there.
              </p>
              <Link to="/contact" className="dd-primary-btn">
                <CalendarDays size={18} />
                Map the workflow
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
