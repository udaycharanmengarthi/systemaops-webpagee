/**
 * components/service/Architecture.jsx
 *
 * Autonomous interactive system architectures for the
 * AI / Odoo / Workflow hero visuals.
 *
 * - SVG + CSS/SMIL only. Motion explains behavior:
 *   input → processing → decision → output.
 * - No hover, no click, no cursor dependency. The loop runs
 *   on its own; reduced-motion shows the static architecture.
 */

import { useEffect, useId, useRef } from "react";
import { useLanguage } from "../../i18n/useLanguage";
import FlowLines from "../diagrams/FlowLines";
import "./Architecture.css";

/* Brand pulse: single SystemaOps identity for all data-flow dots. */
const BRAND_PULSE = "var(--brand-primary)";

const FONT = "'Space Grotesk','Plus Jakarta Sans',sans-serif";

/* ── geometry helper: arrowhead polygon ── */

function arrowPoints(x1, y1, x2, y2, size = 9) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x2 - ux * size;
  const by = y2 - uy * size;
  const nx = -uy;
  const ny = ux;
  const s = size * 0.45;
  return (
    `${x2},${y2} ` +
    `${bx + nx * s},${by + ny * s} ` +
    `${bx - nx * s},${by - ny * s}`
  );
}

/* ── reduced motion: freeze the loop, keep the diagram ── */

function useStaticOnReducedMotion(ref) {
  useEffect(() => {
    if (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")
        .matches
    ) {
      ref.current
        ?.querySelectorAll("svg")
        .forEach((s) => {
          try {
            s.pauseAnimations();
          } catch {
            /* svg api unavailable */
          }
        });
    }
  }, [ref]);
}

/* ── primitives (no interaction) ── */

function Node({
  x,
  y,
  w,
  h,
  title,
  sub,
  variant,
  className = "",
}) {
  return (
    <g className={className}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        className={`arch-node${variant === "focal" ? " arch-node--focal" : ""}${
          variant === "endpoint" ? " arch-node--endpoint" : ""
        }`}
        fill={variant === "focal" ? "var(--acc)" : undefined}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + (sub ? -3 : 5)}
        textAnchor="middle"
        className={`arch-t${w < 130 ? " arch-t--sm" : ""}${
          variant === "focal" ? " arch-t--on-acc" : ""
        }${h >= 88 ? " arch-t--lg" : ""}`}
      >
        {title}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 16}
          textAnchor="middle"
          className={`arch-s${
            variant === "focal" ? " arch-s--on-acc" : ""
          }`}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Conn({ x1, y1, x2, y2, phase = "", dashed = false }) {
  return (
    <g className={`arch-conn ${phase}`.trim()} aria-hidden="true">
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeDasharray={dashed ? "5 5" : undefined}
      />
      <polygon points={arrowPoints(x1, y1, x2, y2)} />
    </g>
  );
}

function Pulse({ pid, begin, dur, color }) {
  return (
    <g className="arch-pulses" aria-hidden="true">
      <circle r={4} fill={color}>
        <animateMotion
          dur={dur}
          begin={begin}
          repeatCount="indefinite"
          keyPoints="0;1"
          keyTimes="0;0.16"
          calcMode="linear"
        >
          <mpath href={`#${pid}`} />
        </animateMotion>
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.02;0.14;0.18"
          dur={dur}
          begin={begin}
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}

/* =========================================================
   ODOO — sources → core → operations · 7s loop
   ========================================================= */

export function OdooArchitecture() {
  const { t } = useLanguage();
  const diagram = t("serviceDetail.odoo.diagram");
  const allNodes = diagram.nodes || [];
  const ODOO_ROW1 = allNodes.slice(0, 3);
  const ODOO_ROW2 = allNodes.slice(3, 5);
  const wrapRef = useRef(null);
  useStaticOnReducedMotion(wrapRef);
  const r1x = [41, 205, 369];
  const r2x = [123, 287];

  /* Fiber flows mirror the defs geometry; looping gold
     particles replace the old teal pulses. */
  const heroFlows = [
    { id: "s0", x1: 116, y1: 80, x2: 220, y2: 196, bow: 10, dur: 4.2, delay: 0 },
    { id: "s1", x1: 280, y1: 80, x2: 280, y2: 196, bow: -8, dur: 4.4, delay: 0.3 },
    { id: "s2", x1: 444, y1: 80, x2: 340, y2: 196, bow: 10, dur: 4.2, delay: 0.6 },
    { id: "s3", x1: 198, y1: 160, x2: 250, y2: 196, bow: 6, dur: 3.8, delay: 0.9 },
    { id: "s4", x1: 362, y1: 160, x2: 310, y2: 196, bow: -6, dur: 3.8, delay: 1.1 },
    { id: "out", x1: 280, y1: 288, x2: 280, y2: 340, dur: 3.6, delay: 1.6 },
  ];

  const heroCompactFlows = [
    { x: 18, t: allNodes[0]?.t },
    { x: 138, t: allNodes[1]?.t },
    { x: 258, t: allNodes[2]?.t },
    { x: 78, t: allNodes[3]?.t, y: 76 },
    { x: 198, t: allNodes[4]?.t, y: 76 },
  ].map((n, i) => ({
    id: `spoke-${i}`,
    x1: n.x + 42,
    y1: (n.y || 24) + 40,
    x2: 180,
    y2: 168,
    dur: 3.6 + i * 0.2,
    delay: i * 0.3,
  }));

  return (
    <div className="arch" ref={wrapRef}>
      {/* ── FULL ── */}
      <svg
        viewBox="0 0 560 410"
        className="arch-svg od-svg arch-full"
        role="img"
        aria-label={diagram.aria}
        style={{ fontFamily: FONT }}
      >
        <FlowLines draw flows={heroFlows} />

        {ODOO_ROW1.map((n, i) => (
          <Node
            key={n.t}
            x={r1x[i]}
            y={24}
            w={150}
            h={56}
            title={n.t}
            sub={n.s}
            className="ph-src"
          />
        ))}
        {ODOO_ROW2.map((n, i) => (
          <Node
            key={n.t}
            x={r2x[i]}
            y={104}
            w={150}
            h={56}
            title={n.t}
            sub={n.s}
            className="ph-src"
          />
        ))}

        <Node
          x={170}
          y={196}
          w={220}
          h={92}
          title="ODOO"
          sub="configured, customized"
          variant="focal"
        />
        <rect
          x={161}
          y={187}
          width={238}
          height={110}
          rx={20}
          className="arch-ring ph-ring"
          aria-hidden="true"
        />

        <Node
          x={170}
          y={340}
          w={220}
          h={56}
          title="BUSINESS OPERATIONS"
          sub="connected workflows"
          variant="endpoint"
        />
        <rect
          x={161}
          y={331}
          width={238}
          height={74}
          rx={18}
          className="arch-hi ph-ops"
          aria-hidden="true"
        />
      </svg>

      {/* ── COMPACT (mobile reflow) ── */}
      <svg
        viewBox="0 0 360 440"
        className="arch-svg od-svg arch-compact"
        role="img"
        aria-label={diagram.ariaCompact}
        style={{ fontFamily: FONT }}
      >
        <FlowLines
          draw
          flows={[
            ...heroCompactFlows,
            { id: "cm", x1: 180, y1: 130, x2: 180, y2: 168, dur: 3.4, delay: 0.2 },
            { id: "co", x1: 180, y1: 252, x2: 180, y2: 308, dur: 3.8, delay: 0.8 },
          ]}
        />
        {[
          { x: 18, t: allNodes[0]?.t },
          { x: 138, t: allNodes[1]?.t },
          { x: 258, t: allNodes[2]?.t },
          { x: 78, t: allNodes[3]?.t, y: 76 },
          { x: 198, t: allNodes[4]?.t, y: 76 },
        ].map((n) => (
          <g key={n.t}>
            <rect
              x={n.x}
              y={n.y || 24}
              width={84}
              height={40}
              rx={10}
              className="arch-node ph-c"
            />
            <text
              x={n.x + 42}
              y={(n.y || 24) + 25}
              textAnchor="middle"
              className="arch-t arch-t--sm"
            >
              {n.t}
            </text>
          </g>
        ))}
        <rect x={90} y={168} width={180} height={84} rx={16} fill="var(--brand-primary)" />
        <text x={180} y={206} textAnchor="middle" className="arch-t arch-t--lg arch-t--on-acc">
          {diagram.coreTitle}
        </text>
        <text x={180} y={228} textAnchor="middle" className="arch-s arch-s--on-acc">
          {diagram.coreSub}
        </text>
        <rect x={90} y={308} width={180} height={52} rx={12} className="arch-node arch-node--endpoint" />
        <text x={180} y={339} textAnchor="middle" className="arch-t arch-t--sm">
          {diagram.opsTitle}
        </text>
      </svg>

      <p className="arch-caption">
        {diagram.captionFullPre} <strong>{diagram.captionFullCore}</strong>
        {diagram.captionFullPost}
      </p>
    </div>
  );
}

/* =========================================================
   AI — input → context → agent → tools → action → review · 9s
   ========================================================= */

export function AIAgentArchitecture() {
  const { t } = useLanguage();
  const diagram = t("serviceDetail.ai.diagram.arch");
  const wrapRef = useRef(null);
  useStaticOnReducedMotion(wrapRef);
  const uid = useId().replace(/:/g, "");
  const dur = "9s";

  return (
    <div className="arch" ref={wrapRef}>
      <svg
        viewBox="0 0 560 548"
        className="arch-svg ai-svg arch-full"
        role="img"
        aria-label={diagram.aria}
        style={{ fontFamily: FONT }}
      >
        <defs>
          <path id={`${uid}-a0`} d="M280 56 L280 72" fill="none" />
          <path id={`${uid}-a1`} d="M280 120 L280 136" fill="none" />
          <path id={`${uid}-a2`} d="M225 236 L140 260" fill="none" />
          <path id={`${uid}-a3`} d="M280 236 L280 260" fill="none" />
          <path id={`${uid}-a4`} d="M335 236 L420 260" fill="none" />
          <path id={`${uid}-a5`} d="M140 312 L225 248" fill="none" />
          <path id={`${uid}-a6`} d="M280 312 L280 248" fill="none" />
          <path id={`${uid}-a7`} d="M280 312 L280 336" fill="none" />
          <path id={`${uid}-a8`} d="M280 380 L280 396" fill="none" />
          <path id={`${uid}-a9`} d="M280 440 L280 448" fill="none" />
          <path id={`${uid}-a10`} d="M280 496 L280 504" fill="none" />
        </defs>

        <Conn x1={280} y1={56} x2={280} y2={72} />
        <Conn x1={280} y1={120} x2={280} y2={136} />
        <Conn x1={225} y1={236} x2={140} y2={260} />
        <Conn x1={280} y1={236} x2={280} y2={260} />
        <Conn x1={335} y1={236} x2={420} y2={260} />
        <Conn x1={280} y1={312} x2={280} y2={336} />
        <Conn x1={280} y1={380} x2={280} y2={396} />
        <Conn x1={280} y1={440} x2={280} y2={448} />
        <Conn x1={280} y1={496} x2={280} y2={504} />

        <Pulse pid={`${uid}-a0`} begin="0.2s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-a1`} begin="1s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-a2`} begin="2.4s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-a3`} begin="2.65s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-a4`} begin="2.9s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-a5`} begin="3.9s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-a6`} begin="4.15s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-a7`} begin="4.8s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-a8`} begin="5.5s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-a9`} begin="6.4s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-a10`} begin="7.4s" dur={dur} color={BRAND_PULSE} />

        <Node x={200} y={12} w={160} h={44} title={diagram.input} className="ph-in" />
        <Node
          x={200}
          y={72}
          w={160}
          h={48}
          title={diagram.context.t}
          sub={diagram.context.s}
          className="ph-ctx"
        />
        <Node
          x={175}
          y={136}
          w={210}
          h={100}
          title={diagram.agent.t}
          sub={diagram.agent.s}
          variant="focal"
        />
        <rect x={167} y={128} width={226} height={116} rx={20} className="arch-ring ph-agent" aria-hidden="true" />

        <Node x={30} y={260} w={150} h={52} title={diagram.tools.t} sub={diagram.tools.s} className="ph-tools" />
        <Node x={205} y={260} w={150} h={52} title={diagram.data.t} sub={diagram.data.s} className="ph-tools" />
        <Node x={380} y={260} w={150} h={52} title={diagram.rules.t} sub={diagram.rules.s} className="ph-tools" />

        <Node x={200} y={336} w={160} h={44} title={diagram.decision} className="ph-d1" />
        <Node x={200} y={396} w={160} h={44} title={diagram.action} className="ph-d2" />
        <Node
          x={200}
          y={448}
          w={160}
          h={48}
          title={diagram.review.t}
          sub={diagram.review.s}
          variant="endpoint"
          className="ph-d3"
        />
        <Node x={200} y={504} w={160} h={36} title={diagram.complete.t} sub={diagram.complete.s} />
      </svg>

      {/* ── COMPACT ── */}
      <svg
        viewBox="0 0 360 430"
        className="arch-svg ai-svg arch-compact"
        role="img"
        aria-label={diagram.ariaCompact}
        style={{ fontFamily: FONT }}
      >
        <defs>
          <path id={`${uid}-cm`} d="M180 120 L180 236" fill="none" />
          <path id={`${uid}-co`} d="M180 284 L180 342" fill="none" />
        </defs>
        {[
          [164, 180],
          [228, 244],
          [288, 304],
        ].map(([y1, y2], i) => (
          <g key={i} className="arch-conn" aria-hidden="true">
            <line x1={180} y1={y1} x2={180} y2={y2} />
            <polygon points={arrowPoints(180, y1, 180, y2)} />
          </g>
        ))}
        <Pulse pid={`${uid}-cm`} begin="0.5s" dur="5s" color={BRAND_PULSE} />
        <Pulse pid={`${uid}-co`} begin="2.5s" dur="5s" color={BRAND_PULSE} />
        <rect x={90} y={16} width={180} height={44} rx={12} className="arch-node ph-c" />
        <text x={180} y={43} textAnchor="middle" className="arch-t arch-t--sm">{diagram.input}</text>
        <rect x={75} y={76} width={210} height={88} rx={16} fill="var(--brand-primary)" />
        <text x={180} y={116} textAnchor="middle" className="arch-t arch-t--lg arch-t--on-acc">{diagram.agent.t}</text>
        <text x={180} y={140} textAnchor="middle" className="arch-s arch-s--on-acc">{diagram.agent.s}</text>
        <rect x={45} y={180} width={270} height={48} rx={12} className="arch-node ph-c" />
        <text x={180} y={209} textAnchor="middle" className="arch-t arch-t--sm">{diagram.toolsRow}</text>
        <rect x={90} y={244} width={180} height={44} rx={12} className="arch-node ph-c" />
        <text x={180} y={271} textAnchor="middle" className="arch-t arch-t--sm">{diagram.action}</text>
        <rect x={90} y={304} width={180} height={44} rx={12} className="arch-node arch-node--endpoint ph-c" />
        <text x={180} y={331} textAnchor="middle" className="arch-t arch-t--sm">{diagram.review.t}</text>
      </svg>

      <p className="arch-caption">
        {diagram.captionPre} <strong>{diagram.captionCore}</strong>
        {diagram.captionPost}
      </p>
    </div>
  );
}

/* =========================================================
   WORKFLOW — event → trigger → process → condition → branch
   12s loop: approve half + review half
   ========================================================= */

export function WorkflowArchitecture() {
  const { t } = useLanguage();
  const diagram = t("serviceDetail.workflow.diagram.arch");
  const wrapRef = useRef(null);
  useStaticOnReducedMotion(wrapRef);
  const uid = useId().replace(/:/g, "");
  const dur = "12s";

  return (
    <div className="arch" ref={wrapRef}>
      <svg
        viewBox="0 0 560 496"
        className="arch-svg wf-svg arch-full"
        role="img"
        aria-label={diagram.aria}
        style={{ fontFamily: FONT }}
      >
        <defs>
          <path id={`${uid}-w0`} d="M280 56 L280 76" fill="none" />
          <path id={`${uid}-w1`} d="M280 124 L280 144" fill="none" />
          <path id={`${uid}-w2`} d="M280 196 L280 216" fill="none" />
          <path id={`${uid}-w3`} d="M235 272 L160 300" fill="none" />
          <path id={`${uid}-w4`} d="M325 272 L400 300" fill="none" />
          <path id={`${uid}-w5`} d="M140 356 L245 388" fill="none" />
          <path id={`${uid}-w6`} d="M420 356 L315 388" fill="none" />
          <path id={`${uid}-w7`} d="M280 432 L280 444" fill="none" />
        </defs>

        <Conn x1={280} y1={56} x2={280} y2={76} phase="ph-pre" />
        <Conn x1={280} y1={124} x2={280} y2={144} phase="ph-pre" />
        <Conn x1={280} y1={196} x2={280} y2={216} phase="ph-pre" />
        <Conn x1={235} y1={272} x2={160} y2={300} phase="ph-approve" />
        <Conn x1={325} y1={272} x2={400} y2={300} phase="ph-review" />
        <Conn x1={140} y1={356} x2={245} y2={388} phase="ph-approve" />
        <Conn x1={420} y1={356} x2={315} y2={388} phase="ph-review" />
        <Conn x1={280} y1={432} x2={280} y2={444} />

        <Pulse pid={`${uid}-w0`} begin="0.2s;6.2s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-w1`} begin="0.9s;6.9s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-w2`} begin="1.7s;7.7s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-w3`} begin="3.3s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-w5`} begin="4.1s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-w7`} begin="4.8s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-w4`} begin="8.6s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-w6`} begin="9.4s" dur={dur} color={BRAND_PULSE} />
        <Pulse pid={`${uid}-w7`} begin="10.2s" dur={dur} color={BRAND_PULSE} />

        <Node x={210} y={12} w={140} h={44} title={diagram.event} className="ph-pre" />
        <Node x={210} y={76} w={140} h={48} title={diagram.trigger} className="ph-pre" />
        <Node x={210} y={144} w={140} h={52} title={diagram.process} className="ph-pre" />
        <Node x={195} y={216} w={170} h={56} title={diagram.condition} variant="focal" className="ph-cond" />

        <Node x={50} y={300} w={180} h={56} title={diagram.approve} sub={diagram.approveSub} className="ph-approve" />
        <Node x={330} y={300} w={180} h={56} title={diagram.review} sub={diagram.reviewSub} className="ph-review" />

        <text x={140} y={384} textAnchor="middle" className="arch-s ph-cap-a" aria-hidden="true">
          {diagram.pathApprove}
        </text>
        <text x={420} y={384} textAnchor="middle" className="arch-s ph-cap-b" aria-hidden="true">
          {diagram.pathReview}
        </text>

        <Node x={210} y={388} w={140} h={44} title={diagram.action} variant="endpoint" className="ph-act" />
        <Node x={210} y={444} w={140} h={40} title={diagram.complete} />
      </svg>

      {/* ── COMPACT ── */}
      <svg
        viewBox="0 0 360 440"
        className="arch-svg wf-svg arch-compact"
        role="img"
        aria-label={diagram.ariaCompact}
        style={{ fontFamily: FONT }}
      >
        <defs>
          <path id={`${uid}-cm`} d="M180 56 L180 196" fill="none" />
          <path id={`${uid}-co`} d="M180 344 L180 388" fill="none" />
        </defs>
        <g className="arch-conn" aria-hidden="true">
          <line x1={180} y1={56} x2={180} y2={196} />
          <polygon points={arrowPoints(180, 56, 180, 196)} />
        </g>
        <g className="arch-conn" aria-hidden="true">
          <line x1={180} y1={344} x2={180} y2={388} />
          <polygon points={arrowPoints(180, 344, 180, 388)} />
        </g>
        <Pulse pid={`${uid}-cm`} begin="0.5s" dur="5s" color={BRAND_PULSE} />
        <Pulse pid={`${uid}-co`} begin="2.5s" dur="5s" color={BRAND_PULSE} />
        {[
          { y: 12, t: diagram.event },
          { y: 68, t: diagram.trigger },
          { y: 124, t: diagram.process },
        ].map((n) => (
          <g key={n.t}>
            <rect x={110} y={n.y} width={140} height={42} rx={12} className="arch-node ph-c" />
            <text x={180} y={n.y + 27} textAnchor="middle" className="arch-t arch-t--sm">{n.t}</text>
          </g>
        ))}
        <rect x={95} y={182} width={170} height={52} rx={12} fill="var(--brand-primary)" />
        <text x={180} y={213} textAnchor="middle" className="arch-t arch-t--sm arch-t--on-acc">{diagram.condition}</text>
        <rect x={20} y={250} width={150} height={48} rx={12} className="arch-node ph-c" />
        <text x={95} y={279} textAnchor="middle" className="arch-t arch-t--sm">{diagram.approve}</text>
        <rect x={190} y={250} width={150} height={48} rx={12} className="arch-node ph-c" />
        <text x={265} y={279} textAnchor="middle" className="arch-t arch-t--sm">{diagram.review}</text>
        <rect x={110} y={344} width={140} height={44} rx={12} className="arch-node arch-node--endpoint ph-c" />
        <text x={180} y={371} textAnchor="middle" className="arch-t arch-t--sm">{diagram.action}</text>
      </svg>

      <p className="arch-caption">
        {diagram.captionPre} <strong>{diagram.captionApprove}</strong>
        {diagram.captionMid} <strong>{diagram.captionReview}</strong>
        {diagram.captionPost}
      </p>
    </div>
  );
}
