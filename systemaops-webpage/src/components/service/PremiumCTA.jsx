/**
 * components/service/PremiumCTA.jsx
 *
 * One reusable CTA system for every service page.
 * Large curved dark-navy surface with restrained teal/blue
 * glows, and a service-specific orbital diagram on the right.
 *
 * Pass `orbit = { center: { t, s }, nodes: [{ t, s } x4] }` to
 * get the semantic diagram for the current service. A simple
 * `nodes = [string]` list renders the legacy chip fallback.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useId } from "react";
import "./PremiumCTA.css";

/* ── ORBIT GEOMETRY ── */

const O_CX = 230;
const O_CY = 162;
const O_POS = [
  { cx: 230, cy: 34, x: 155, y: 8 },
  { cx: 402, cy: 162, x: 327, y: 136 },
  { cx: 230, cy: 290, x: 155, y: 264 },
  { cx: 58, cy: 162, x: -17, y: 136 },
];

function orbitCurve(x1, y1, bow) {
  const mx = (x1 + O_CX) / 2;
  const my = (y1 + O_CY) / 2;
  const dx = O_CX - x1;
  const dy = O_CY - y1;
  const len = Math.hypot(dx, dy) || 1;
  const qx = mx + (-dy / len) * bow;
  const qy = my + (dx / len) * bow;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${O_CX} ${O_CY}`;
}

function OrbitDiagram({ orbit }) {
  const reduced = useReducedMotionStatic();
  const nodes = (orbit.nodes || []).slice(0, 4);
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (reduced || nodes.length < 2) return undefined;
    timerRef.current = setInterval(
      () => setActive((a) => (a + 1) % nodes.length),
      2400
    );
    return () => clearInterval(timerRef.current);
  }, [reduced, nodes.length]);

  if (!nodes.length) return null;

  const next = (active + 1) % nodes.length;
  const from = O_POS[active];
  const to = O_POS[next];
  const pathIn = orbitCurve(from.cx, from.cy, 26);
  const pathOut = orbitCurve(to.cx, to.cy, 26);

  return (
    <svg
      viewBox="0 0 460 324"
      className="pcta-orbit-svg"
      aria-hidden="true"
    >
      <defs>
        <path id="pcta-orbit-in" d={pathIn} fill="none" />
        <path id="pcta-orbit-out" d={pathOut} fill="none" />
      </defs>

      {/* rings */}
      {!reduced && (
        <g className="pcta-orb-rings" aria-hidden="true">
          <circle cx={O_CX} cy={O_CY} r={78} className="pcta-orbit-ring" />
          <circle cx={O_CX} cy={O_CY} r={112} className="pcta-orbit-ring pcta-orbit-ring--outer" />
        </g>
      )}

      {/* connectors */}
      <g fill="none" className="pcta-orbit-paths">
        {nodes.map((n, i) => {
          const p = O_POS[i];
          const hot = i === active;
          return (
            <path
              key={n.t || i}
              d={orbitCurve(p.cx, p.cy, 26)}
              className={
                hot
                  ? "pcta-orbit-path pcta-orbit-path--hot"
                  : `pcta-orbit-path${active >= 0 ? " pcta-orbit-path--muted" : ""}`
              }
            />
          );
        })}
      </g>

      {/* travelling particles */}
      {!reduced && (
        <g key={`pcta-pkt-${active}`} className="pcta-orbit-packets" aria-hidden="true">
          <circle r={4} className="pcta-orbit-packet">
            <animateMotion dur="1s" repeatCount="1" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href="#pcta-orbit-in" />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.85;1" dur="1s" repeatCount="1" />
          </circle>
          <circle r={4} className="pcta-orbit-packet">
            <animateMotion dur="1s" begin="1.15s" repeatCount="1" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href="#pcta-orbit-out" />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.85;1" dur="1s" begin="1.15s" repeatCount="1" />
          </circle>
        </g>
      )}

      {/* nodes */}
      {nodes.map((n, i) => {
        const p = O_POS[i];
        const hot = i === active;
        return (
          <g
            key={n.t || i}
            className={`pcta-orbit-node${hot ? " pcta-orbit-node--active" : ""}`}
            transform={`translate(${p.x}, ${p.y})`}
          >
            <rect width={150} height={48} rx={14} className="pcta-orbit-node-rect" />
            <circle cx={142} cy={10} r={3} className="pcta-orbit-node-dot" />
            <text x={14} y={21} className="pcta-orbit-node-title">
              {n.t}
            </text>
            <text x={14} y={38} className="pcta-orbit-node-sub">
              {n.s}
            </text>
          </g>
        );
      })}

      {/* center */}
      <g className="pcta-orbit-core">
        {!reduced && (
          <circle cx={O_CX} cy={O_CY} r={62} className="pcta-core-halo" />
        )}
        <circle cx={O_CX} cy={O_CY} r={52} className="pcta-orbit-core-fill" />
        <text x={O_CX} y={O_CY - 5} textAnchor="middle" className="pcta-orbit-core-title">
          {orbit.center?.t}
        </text>
        {orbit.center?.s && (
          <text x={O_CX} y={O_CY + 14} textAnchor="middle" className="pcta-orbit-core-sub">
            {orbit.center.s}
          </text>
        )}
      </g>
    </svg>
  );
}

/* Lightweight reduced-motion flag (local to this visual). */
function useReducedMotionStatic() {
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  return reduced;
}

/* ── LEGACY CHIP VISUAL (fallback when only labels exist) ── */

function ChipVisual({ labels }) {
  const uid = useId().replace(/:/g, "");
  const pathId = `${uid}-path`;
  const limited = (labels || []).slice(0, 5);
  return (
    <svg viewBox="0 0 460 300" className="pcta-svg" aria-hidden="true">
      <defs>
        <path id={pathId} d="M230 62 C 90 78, 96 224, 230 244" fill="none" />
      </defs>
      <circle cx={230} cy={153} r={118} className="pcta-orb pcta-orb--outer" />
      <circle cx={230} cy={153} r={78} className="pcta-orb pcta-orb--inner" />
      <circle cx={230} cy={153} r={30} className="pcta-core" />
      <circle r={3.5} className="pcta-packet">
        <animateMotion dur="7s" repeatCount="indefinite">
          <mpath href={`#${pathId}`} />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="7s" repeatCount="indefinite" />
      </circle>
      {limited.map((label, i) => {
        const a = -90 + i * (360 / limited.length);
        const r = 118;
        const x = 230 + r * Math.cos((a * Math.PI) / 180);
        const y = 153 + r * Math.sin((a * Math.PI) / 180);
        return (
          <g key={`${label}-${i}`} className="pcta-chip">
            <rect x={x - 44} y={y - 15} width={88} height={30} rx={15} className="pcta-chip-rect" />
            <text x={x} y={y + 4} textAnchor="middle" className="pcta-chip-text">
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── PREMIUM CTA ── */

export default function PremiumCTA({
  eyebrow,
  title,
  highlight,
  desc,
  button,
  buttonHref = "/contact",
  nodes = [],
  orbit = null,
  diagram = null,
}) {
  const orbitData = diagram
    ? {
        center: { t: diagram.center, s: diagram.centerSub },
        nodes: diagram.nodes || [],
      }
    : orbit;

  return (
    <section className="pcta">
      <div className="pcta-inner">
        <div className="pcta-copy">
          <span className="pcta-eyebrow">{eyebrow}</span>
          <h2 className="pcta-title">
            {title} <span className="pcta-accent">{highlight}</span>
          </h2>
          {desc && <p className="pcta-desc">{desc}</p>}
          <div className="pcta-actions">
            <Link to={buttonHref} className="pcta-primary">
              {button}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="pcta-visual" aria-hidden="true">
          {orbitData && orbitData.nodes && orbitData.nodes.length > 0 ? (
            <OrbitDiagram orbit={orbitData} />
          ) : (
            <ChipVisual labels={nodes} />
          )}
        </div>
      </div>
    </section>
  );
}
