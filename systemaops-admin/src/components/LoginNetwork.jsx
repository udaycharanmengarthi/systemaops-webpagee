import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Boxes,
  BrainCircuit,
  Compass,
  PlugZap,
  Workflow,
} from "lucide-react";
import logo from "../assets/systemaops-icon-color.svg";
import "./LoginNetwork.css";

/* ================================================================
   LoginNetwork — living orchestration visual for the login brand
   panel (replaces the static wireframe scene).

   Six service capabilities around the central SystemaOps hub. One
   spoke animates at a time: node activates -> thin light streak
   travels node -> hub -> hub answers -> streak returns hub -> node
   along the SAME geometry -> next spoke.

   The travelling streak is a moving stroke segment (animated
   stroke-dashoffset on the exact spoke path) — a continuous line
   of light, never dots or particles.

   Self-contained: static labels (login is unauthenticated, no
   router links — nodes are buttons that replay their spoke),
   hardcoded dark palette (the panel is always dark), local
   reduced-motion hook. Nothing else in the console is touched.
   ================================================================ */

const NODES = [
  { id: "ai", name: "AI AUTOMATION & AGENTS", sub: "AGENTIC SYSTEMS", Icon: BrainCircuit },
  { id: "odoo", name: "ODOO SOLUTIONS", sub: "ERP FOUNDATION", Icon: Boxes },
  { id: "workflow", name: "WORKFLOW AUTOMATION", sub: "SEQUENCED FLOW", Icon: Workflow },
  { id: "aiops", name: "DEVOPS / AIOPS", sub: "TELEMETRY", Icon: Activity },
  { id: "consulting", name: "AI CONSULTING", sub: "STRATEGY LAYER", Icon: Compass },
  { id: "integration", name: "SYSTEM INTEGRATION & APIS", sub: "CONNECTED APIS", Icon: PlugZap },
];

/* Shared timing (single source for the whole sequence). */
const CYCLE_MS = 3600;
const IN_MS = 1.5;
const IN_BEGIN = 0.15;
const OUT_MS = 1.3;
const OUT_BEGIN = 2.15;

/* Geometry in % coordinates shared by the HTML nodes and the SVG
   underlay (viewBox 0 0 100 100). Radial order: top, upper right,
   lower right, bottom, lower left, upper left. */
const RADIAL = [
  { x: 50, y: 9 },
  { x: 84, y: 28 },
  { x: 84, y: 66 },
  { x: 50, y: 87 },
  { x: 16, y: 66 },
  { x: 16, y: 28 },
];

const GRID_2X3 = [
  { x: 26, y: 33 },
  { x: 74, y: 33 },
  { x: 26, y: 56 },
  { x: 74, y: 56 },
  { x: 26, y: 80 },
  { x: 74, y: 80 },
];

const HUB_DESKTOP = { x: 50, y: 47 };
const HUB_COMPACT = { x: 50, y: 12 };

/* Quadratic node -> hub path with a gentle alternating bow so
   neighbouring spokes never sit exactly on top of each other. */
function spokeD(node, hub, i) {
  const mx = (node.x + hub.x) / 2;
  const my = (node.y + hub.y) / 2;
  const dx = hub.x - node.x;
  const dy = hub.y - node.y;
  const len = Math.hypot(dx, dy) || 1;
  const bow = i % 2 === 0 ? 4 : -4;
  const qx = mx + ((-dy / len) * bow);
  const qy = my + ((dx / len) * bow);
  return `M${node.x} ${node.y} Q${qx.toFixed(2)} ${qy.toFixed(2)} ${hub.x} ${hub.y}`;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event) => setReduced(event.matches);
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    return undefined;
  }, []);
  return reduced;
}

/* Container-measured density: the login panel is tall and narrow,
   so geometry follows the stage width, not the viewport. */
function useDensity(stageRef) {
  const [density, setDensity] = useState("desktop");
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver !== "function") return undefined;
    const obs = new ResizeObserver((entries) => {
      const w = entries[0] ? entries[0].contentRect.width : 0;
      if (w < 430) setDensity("compact");
      else if (w < 640) setDensity("tablet");
      else setDensity("desktop");
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [stageRef]);
  return density;
}

export default function LoginNetwork() {
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const density = useDensity(stageRef);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [inView, setInView] = useState(true);

  const compact = density === "compact";
  const hub = compact ? HUB_COMPACT : HUB_DESKTOP;
  const positions = compact ? GRID_2X3 : RADIAL;
  const count = NODES.length;
  const current = ((active % count) + count) % count;
  const running = inView && !reduced;

  /* Coordinated cycle: exactly one timer; advances only while the
     panel is visible and motion is allowed. Selecting a node
     replays its spoke and restarts the pause. */
  useEffect(() => {
    if (!running) return undefined;
    const id = window.setTimeout(
      () => setActive((a) => (a + 1) % count),
      CYCLE_MS
    );
    return () => window.clearTimeout(id);
  }, [active, count, running]);

  /* Visibility gating for the cycle timer. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver !== "function") return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const focusIdx = hovered ?? (running ? current : null);
  const activePos = positions[current];
  const activeD = activePos ? spokeD(activePos, hub, current) : "";

  const onNodeKey = (e, i) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActive(i);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`ln-root${compact ? " ln-compact" : ""}${reduced ? " ln-reduced" : ""}`}
      role="img"
      aria-label="SystemaOps orchestration network: six service capabilities connected to the central SystemaOps hub"
    >
      <div
        ref={stageRef}
        className="ln-stage"
        style={compact ? { aspectRatio: "3 / 4" } : { aspectRatio: "16 / 10" }}
      >
        {/* Underlay: spokes, hub rings, streaks (decorative). */}
        <svg
          className="ln-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <radialGradient id="ln-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(45, 190, 188, 0.20)" />
              <stop offset="55%" stopColor="rgba(45, 190, 188, 0.06)" />
              <stop offset="100%" stopColor="rgba(45, 190, 188, 0)" />
            </radialGradient>
          </defs>

          <circle cx={hub.x} cy={hub.y} r="16" fill="url(#ln-halo)" />
          <circle cx={hub.x} cy={hub.y} r="10.5" fill="none" className="ln-ring" />
          <circle cx={hub.x} cy={hub.y} r="7.4" fill="none" className="ln-ring ln-ring--inner" />

          {positions.map((p, i) => (
            <path
              key={NODES[i].id}
              d={spokeD(p, hub, i)}
              fill="none"
              vectorEffect="non-scaling-stroke"
              className={`ln-spoke${focusIdx === i ? " ln-spoke--focus" : ""}${focusIdx !== null && focusIdx !== i ? " ln-spoke--dim" : ""}`}
            />
          ))}

          {positions.map((p, i) => (
            <circle
              key={`pt-${NODES[i].id}`}
              cx={p.x}
              cy={p.y}
              r="0.9"
              className={`ln-point${focusIdx === i ? " ln-point--focus" : ""}`}
            />
          ))}

          {/* Signature sequence on the active spoke only. Remounting
              by key restarts the CSS dash animation on every cycle.
              pathLength=1 keeps the segment identical on all spokes;
              the return leg reuses the SAME d with reversed offset. */}
          {running && activePos ? (
            <g key={`seq-${density}-${current}`}>
              <g opacity={0.3}>
                <path
                  d={activeD}
                  pathLength={1}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  className="ln-streak ln-streak--halo ln-streak--in"
                  style={{ animationDuration: `${IN_MS}s`, animationDelay: `${IN_BEGIN}s` }}
                />
              </g>
              <path
                d={activeD}
                pathLength={1}
                fill="none"
                vectorEffect="non-scaling-stroke"
                className="ln-streak ln-streak--in"
                style={{ animationDuration: `${IN_MS}s`, animationDelay: `${IN_BEGIN}s` }}
              />
              <g opacity={0.3}>
                <path
                  d={activeD}
                  pathLength={1}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  className="ln-streak ln-streak--halo ln-streak--return"
                  style={{ animationDuration: `${OUT_MS}s`, animationDelay: `${OUT_BEGIN}s` }}
                />
              </g>
              <path
                d={activeD}
                pathLength={1}
                fill="none"
                vectorEffect="non-scaling-stroke"
                className="ln-streak ln-streak--return"
                style={{ animationDuration: `${OUT_MS}s`, animationDelay: `${OUT_BEGIN}s` }}
              />
            </g>
          ) : null}
        </svg>

        {/* Central hub — the real brand logo, never altered. */}
        <div className="ln-hub" style={{ left: `${hub.x}%`, top: `${hub.y}%` }}>
          {running ? (
            <span key={`pulse-${density}-${current}`} className="ln-hub-pulse" aria-hidden="true" />
          ) : null}
          <span className="ln-hub-core" aria-hidden="true">
            <img src={logo} alt="" className="ln-hub-logo" />
          </span>
          <span className="ln-hub-label">SystemaOps</span>
        </div>

        {/* Capability nodes — replay buttons, not links (login is
            unauthenticated; nothing to navigate to from here). */}
        {NODES.map((n, i) => (
          <div
            key={n.id}
            role="button"
            tabIndex={0}
            aria-label={`${n.name} — ${n.sub}. Activate to replay its signal.`}
            style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%` }}
            className={`ln-node${focusIdx === i ? " ln-node--focus" : ""}${focusIdx !== null && focusIdx !== i ? " ln-node--dim" : ""}${running && current === i ? " ln-node--active" : ""}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onNodeKey(e, i)}
          >
            <span className="ln-node-icon" aria-hidden="true">
              <n.Icon size={15} strokeWidth={1.8} />
            </span>
            <span className="ln-node-text">
              <span className="ln-node-name">{n.name}</span>
              <span className="ln-node-sub">{n.sub}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
