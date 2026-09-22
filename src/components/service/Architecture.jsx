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
import "./Architecture.css";

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

const ODOO_ROW1 = [
  { t: "CRM", s: "customer relationships" },
  { t: "Sales", s: "orders" },
  { t: "Inventory", s: "stock" },
];
const ODOO_ROW2 = [
  { t: "Finance", s: "invoices · accounting" },
  { t: "HR", s: "people" },
];

export function OdooArchitecture() {
  const wrapRef = useRef(null);
  useStaticOnReducedMotion(wrapRef);
  const uid = useId().replace(/:/g, "");
  const dur = "7s";
  const r1x = [41, 205, 369];
  const r2x = [123, 287];
  const tops = [220, 280, 340, 250, 310];

  return (
    <div className="arch" ref={wrapRef}>
      {/* ── FULL ── */}
      <svg
        viewBox="0 0 560 410"
        className="arch-svg od-svg arch-full"
        role="img"
        aria-label="Odoo system architecture: customer relationships, orders, stock, finance and people modules converge into the Odoo core, driving connected business operations"
        style={{ fontFamily: FONT }}
      >
        <defs>
          {r1x.map((x, i) => (
            <path
              key={i}
              id={`${uid}-s${i}`}
              d={`M${x + 75} 80 L${tops[i]} 196`}
              fill="none"
            />
          ))}
          {r2x.map((x, i) => (
            <path
              key={`b${i}`}
              id={`${uid}-s${i + 3}`}
              d={`M${x + 75} 160 L${tops[i + 3]} 196`}
              fill="none"
            />
          ))}
          <path id={`${uid}-out`} d="M280 288 L280 340" fill="none" />
        </defs>

        {r1x.map((x, i) => (
          <Conn key={i} x1={x + 75} y1={80} x2={tops[i]} y2={196} phase="ph-conn" />
        ))}
        {r2x.map((x, i) => (
          <Conn
            key={`b${i}`}
            x1={x + 75}
            y1={160}
            x2={tops[i + 3]}
            y2={196}
            phase="ph-conn"
          />
        ))}
        <Conn x1={280} y1={288} x2={280} y2={340} phase="ph-conn" />

        <Pulse pid={`${uid}-s0`} begin="0.9s" dur={dur} color="#8B7CFF" />
        <Pulse pid={`${uid}-s1`} begin="1.15s" dur={dur} color="#8B7CFF" />
        <Pulse pid={`${uid}-s2`} begin="1.4s" dur={dur} color="#8B7CFF" />
        <Pulse pid={`${uid}-s3`} begin="1.65s" dur={dur} color="#8B7CFF" />
        <Pulse pid={`${uid}-s4`} begin="1.9s" dur={dur} color="#8B7CFF" />
        <Pulse pid={`${uid}-out`} begin="4.3s" dur={dur} color="#8B7CFF" />

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
          sub="configured · customized"
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
        aria-label="Odoo system: business modules feed Odoo, driving operations"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <path id={`${uid}-cm`} d="M180 130 L180 168" fill="none" />
          <path id={`${uid}-co`} d="M180 252 L180 308" fill="none" />
        </defs>
        {[
          { x: 18, t: "CRM" },
          { x: 138, t: "Sales" },
          { x: 258, t: "Stock" },
          { x: 78, t: "Finance", y: 76 },
          { x: 198, t: "HR", y: 76 },
        ].map((n) => (
          <g key={n.t}>
            <line
              x1={n.x + 42}
              y1={(n.y || 24) + 40}
              x2={180}
              y2={168}
              stroke="var(--arch-line)"
              strokeWidth="2"
              aria-hidden="true"
            />
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
        <Pulse pid={`${uid}-cm`} begin="0.6s" dur="5s" color="#8B7CFF" />
        <Pulse pid={`${uid}-co`} begin="2.6s" dur="5s" color="#8B7CFF" />
        <rect x={90} y={168} width={180} height={84} rx={16} fill="#8B7CFF" />
        <text x={180} y={206} textAnchor="middle" className="arch-t arch-t--lg arch-t--on-acc">
          ODOO
        </text>
        <text x={180} y={228} textAnchor="middle" className="arch-s arch-s--on-acc">
          core system
        </text>
        <rect x={90} y={308} width={180} height={52} rx={12} className="arch-node arch-node--endpoint" />
        <text x={180} y={339} textAnchor="middle" className="arch-t arch-t--sm">
          OPERATIONS
        </text>
      </svg>

      <p className="arch-caption">
        Five business modules converge into <strong>one Odoo core</strong>;
        a single pulse carries the result to connected operations.
      </p>
    </div>
  );
}

/* =========================================================
   AI — input → context → agent → tools → action → review · 9s
   ========================================================= */

export function AIAgentArchitecture() {
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
        aria-label="AI agent architecture: input and context reach a reasoning agent that consults tools, data and guardrails before deciding, acting, and passing human review to completion"
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

        <Pulse pid={`${uid}-a0`} begin="0.2s" dur={dur} color="#22D3EE" />
        <Pulse pid={`${uid}-a1`} begin="1s" dur={dur} color="#22D3EE" />
        <Pulse pid={`${uid}-a2`} begin="2.4s" dur={dur} color="#22D3EE" />
        <Pulse pid={`${uid}-a3`} begin="2.65s" dur={dur} color="#22D3EE" />
        <Pulse pid={`${uid}-a4`} begin="2.9s" dur={dur} color="#22D3EE" />
        <Pulse pid={`${uid}-a5`} begin="3.9s" dur={dur} color="#22D3EE" />
        <Pulse pid={`${uid}-a6`} begin="4.15s" dur={dur} color="#22D3EE" />
        <Pulse pid={`${uid}-a7`} begin="4.8s" dur={dur} color="#22D3EE" />
        <Pulse pid={`${uid}-a8`} begin="5.5s" dur={dur} color="#22D3EE" />
        <Pulse pid={`${uid}-a9`} begin="6.4s" dur={dur} color="#22D3EE" />
        <Pulse pid={`${uid}-a10`} begin="7.4s" dur={dur} color="#22D3EE" />

        <Node x={200} y={12} w={160} h={44} title="INPUT" className="ph-in" />
        <Node
          x={200}
          y={72}
          w={160}
          h={48}
          title="CONTEXT"
          sub="docs · history"
          className="ph-ctx"
        />
        <Node
          x={175}
          y={136}
          w={210}
          h={100}
          title="AI AGENT"
          sub="reasoning · planning"
          variant="focal"
        />
        <rect x={167} y={128} width={226} height={116} rx={20} className="arch-ring ph-agent" aria-hidden="true" />

        <Node x={30} y={260} w={150} h={52} title="TOOLS" sub="APIs · actions" className="ph-tools" />
        <Node x={205} y={260} w={150} h={52} title="DATA" sub="records · inputs" className="ph-tools" />
        <Node x={380} y={260} w={150} h={52} title="RULES" sub="guardrails" className="ph-tools" />

        <Node x={200} y={336} w={160} h={44} title="DECISION" className="ph-d1" />
        <Node x={200} y={396} w={160} h={44} title="ACTION" className="ph-d2" />
        <Node
          x={200}
          y={448}
          w={160}
          h={48}
          title="HUMAN REVIEW"
          sub="human oversight"
          variant="endpoint"
          className="ph-d3"
        />
        <Node x={200} y={504} w={160} h={36} title="COMPLETE" sub="workflow complete" />
      </svg>

      {/* ── COMPACT ── */}
      <svg
        viewBox="0 0 360 430"
        className="arch-svg ai-svg arch-compact"
        role="img"
        aria-label="AI agent flow: input to agent to tools and context to action to human review"
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
        <Pulse pid={`${uid}-cm`} begin="0.5s" dur="5s" color="#22D3EE" />
        <Pulse pid={`${uid}-co`} begin="2.5s" dur="5s" color="#22D3EE" />
        <rect x={90} y={16} width={180} height={44} rx={12} className="arch-node ph-c" />
        <text x={180} y={43} textAnchor="middle" className="arch-t arch-t--sm">INPUT</text>
        <rect x={75} y={76} width={210} height={88} rx={16} fill="#22D3EE" />
        <text x={180} y={116} textAnchor="middle" className="arch-t arch-t--lg arch-t--on-acc">AI AGENT</text>
        <text x={180} y={140} textAnchor="middle" className="arch-s arch-s--on-acc">reasoning · planning</text>
        <rect x={45} y={180} width={270} height={48} rx={12} className="arch-node ph-c" />
        <text x={180} y={209} textAnchor="middle" className="arch-t arch-t--sm">TOOLS · DATA · RULES</text>
        <rect x={90} y={244} width={180} height={44} rx={12} className="arch-node ph-c" />
        <text x={180} y={271} textAnchor="middle" className="arch-t arch-t--sm">ACTION</text>
        <rect x={90} y={304} width={180} height={44} rx={12} className="arch-node arch-node--endpoint ph-c" />
        <text x={180} y={331} textAnchor="middle" className="arch-t arch-t--sm">HUMAN REVIEW</text>
      </svg>

      <p className="arch-caption">
        The agent consults <strong>tools, data and guardrails before acting</strong> —
        every decision lands in a workflow, checked by a human.
      </p>
    </div>
  );
}

/* =========================================================
   WORKFLOW — event → trigger → process → condition → branch
   12s loop: approve half + review half
   ========================================================= */

export function WorkflowArchitecture() {
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
        aria-label="Workflow orchestration: an event triggers a process, a condition branches into approve-to-system or review-by-human paths, merging into action and completion"
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

        <Pulse pid={`${uid}-w0`} begin="0.2s;6.2s" dur={dur} color="#F59E0B" />
        <Pulse pid={`${uid}-w1`} begin="0.9s;6.9s" dur={dur} color="#F59E0B" />
        <Pulse pid={`${uid}-w2`} begin="1.7s;7.7s" dur={dur} color="#F59E0B" />
        <Pulse pid={`${uid}-w3`} begin="3.3s" dur={dur} color="#F59E0B" />
        <Pulse pid={`${uid}-w5`} begin="4.1s" dur={dur} color="#F59E0B" />
        <Pulse pid={`${uid}-w7`} begin="4.8s" dur={dur} color="#F59E0B" />
        <Pulse pid={`${uid}-w4`} begin="8.6s" dur={dur} color="#F59E0B" />
        <Pulse pid={`${uid}-w6`} begin="9.4s" dur={dur} color="#F59E0B" />
        <Pulse pid={`${uid}-w7`} begin="10.2s" dur={dur} color="#F59E0B" />

        <Node x={210} y={12} w={140} h={44} title="EVENT" className="ph-pre" />
        <Node x={210} y={76} w={140} h={48} title="TRIGGER" className="ph-pre" />
        <Node x={210} y={144} w={140} h={52} title="PROCESS" className="ph-pre" />
        <Node x={195} y={216} w={170} h={56} title="CONDITION" variant="focal" className="ph-cond" />

        <Node x={50} y={300} w={180} h={56} title="APPROVE" sub="→ system" className="ph-approve" />
        <Node x={330} y={300} w={180} h={56} title="REVIEW" sub="→ human" className="ph-review" />

        <text x={140} y={384} textAnchor="middle" className="arch-s ph-cap-a" aria-hidden="true">
          approve path
        </text>
        <text x={420} y={384} textAnchor="middle" className="arch-s ph-cap-b" aria-hidden="true">
          review path
        </text>

        <Node x={210} y={388} w={140} h={44} title="ACTION" variant="endpoint" className="ph-act" />
        <Node x={210} y={444} w={140} h={40} title="COMPLETE" />
      </svg>

      {/* ── COMPACT ── */}
      <svg
        viewBox="0 0 360 440"
        className="arch-svg wf-svg arch-compact"
        role="img"
        aria-label="Workflow: event, trigger, process and condition branch into approve or review, merging into action"
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
        <Pulse pid={`${uid}-cm`} begin="0.5s" dur="5s" color="#F59E0B" />
        <Pulse pid={`${uid}-co`} begin="2.5s" dur="5s" color="#F59E0B" />
        {[
          { y: 12, t: "EVENT" },
          { y: 68, t: "TRIGGER" },
          { y: 124, t: "PROCESS" },
        ].map((n) => (
          <g key={n.t}>
            <rect x={110} y={n.y} width={140} height={42} rx={12} className="arch-node ph-c" />
            <text x={180} y={n.y + 27} textAnchor="middle" className="arch-t arch-t--sm">{n.t}</text>
          </g>
        ))}
        <rect x={95} y={182} width={170} height={52} rx={12} fill="#F59E0B" />
        <text x={180} y={213} textAnchor="middle" className="arch-t arch-t--sm arch-t--on-acc">CONDITION</text>
        <rect x={20} y={250} width={150} height={48} rx={12} className="arch-node ph-c" />
        <text x={95} y={279} textAnchor="middle" className="arch-t arch-t--sm">APPROVE</text>
        <rect x={190} y={250} width={150} height={48} rx={12} className="arch-node ph-c" />
        <text x={265} y={279} textAnchor="middle" className="arch-t arch-t--sm">REVIEW</text>
        <rect x={110} y={344} width={140} height={44} rx={12} className="arch-node arch-node--endpoint ph-c" />
        <text x={180} y={371} textAnchor="middle" className="arch-t arch-t--sm">ACTION</text>
      </svg>

      <p className="arch-caption">
        The loop alternates: one cycle takes the <strong>approve path</strong> to
        the system, the next takes the <strong>review path</strong> to a human —
        both merge into action.
      </p>
    </div>
  );
}
