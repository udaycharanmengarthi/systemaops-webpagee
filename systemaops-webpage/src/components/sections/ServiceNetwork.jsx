import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BotMessageSquare,
  Blocks,
  DatabaseZap,
  GitBranchPlus,
  Radar,
  BrainCog,
} from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { servicesMenu } from "../../data/services";
import { useReducedMotion } from "../service/useReducedMotion";
import logo from "../../assets/systemaops-icon-color.svg";
import "./ServiceNetwork.css";

/* ================================================================
   ServiceNetwork — living orchestration visual for the home
   Services section.

   Six business capabilities (single source: servicesMenu) connect
   to the central SystemaOps hub. One spoke animates at a time:
   node activates -> thin light streak travels node -> hub ->
   hub answers -> streak returns hub -> node along the SAME
   geometry -> next node.

   The travelling streak is a moving stroke segment (animated
   stroke-dashoffset on the exact spoke path) — a continuous line
   of light, never dots or particles.

   Conventions reused from the codebase:
   - HTML nodes over an SVG underlay (Hero node-scene pattern).
   - One-at-a-time cycle with remount-by-key (IntegrationNetwork).
   - Shared useReducedMotion hook for the static fallback.
   ================================================================ */

const SERVICE_ICONS = {
  ai: BotMessageSquare,
  odoo: Blocks,
  integration: DatabaseZap,
  workflow: GitBranchPlus,
  aiops: Radar,
  consulting: BrainCog,
};

/* Subtitles for the six capabilities (editorial labels for this
   visual; service names + hrefs stay canonical in servicesMenu). */
const SERVICE_SUBS = {
  ai: "Agentic Systems",
  odoo: "ERP Foundation",
  integration: "Connected APIs",
  workflow: "Sequenced Flow",
  aiops: "Telemetry",
  consulting: "Strategy Layer",
};

/* Shared timing (single source for the whole sequence). */
const CYCLE_MS = 3600;
const IN_MS = 1.5;
const IN_BEGIN = 0.15;
const OUT_MS = 1.3;
const OUT_BEGIN = 2.15;

/* Geometry per breakpoint, in % coordinates shared by the HTML
   nodes and the SVG underlay (viewBox 0 0 100 100). */
const LAYOUTS = {
  desktop: {
    hub: { x: 50, y: 47 },
    nodes: [
      { x: 50, y: 9 }, // ai — top
      { x: 84, y: 28 }, // odoo — upper right
      { x: 84, y: 66 }, // workflow — lower right
      { x: 50, y: 87 }, // aiops — bottom
      { x: 16, y: 66 }, // consulting — lower left
      { x: 16, y: 28 }, // integration — upper left
    ],
  },
  tablet: {
    hub: { x: 50, y: 46 },
    nodes: [
      { x: 50, y: 8 },
      { x: 86, y: 27 },
      { x: 86, y: 65 },
      { x: 50, y: 88 },
      { x: 14, y: 65 },
      { x: 14, y: 27 },
    ],
  },
  mobile: {
    hub: { x: 50, y: 11 },
    nodes: [
      { x: 26, y: 32 },
      { x: 74, y: 32 },
      { x: 26, y: 54 },
      { x: 74, y: 54 },
      { x: 26, y: 78 },
      { x: 74, y: 78 },
    ],
  },
};

const ORDER = ["ai", "odoo", "workflow", "aiops", "consulting", "integration"];

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

function useBreakpoint() {
  const [bp, setBp] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 640
      ? "mobile"
      : typeof window !== "undefined" && window.innerWidth < 1024
        ? "tablet"
        : "desktop"
  );
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const mqMobile = window.matchMedia("(max-width: 639px)");
    const mqTablet = window.matchMedia("(max-width: 1023px)");
    const update = () => {
      if (mqMobile.matches) setBp("mobile");
      else if (mqTablet.matches) setBp("tablet");
      else setBp("desktop");
    };
    update();
    mqMobile.addEventListener("change", update);
    mqTablet.addEventListener("change", update);
    return () => {
      mqMobile.removeEventListener("change", update);
      mqTablet.removeEventListener("change", update);
    };
  }, []);
  return bp;
}

export default function ServiceNetwork() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const bp = useBreakpoint();
  const rootRef = useRef(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [inView, setInView] = useState(true);

  const layout = LAYOUTS[bp];
  const { hub } = layout;

  let translated = [];
  try {
    const items = t("services.items");
    if (Array.isArray(items)) translated = items;
  } catch {
    translated = [];
  }

  const nodes = ORDER.map((id, orderIdx) => {
    const menuIdx = servicesMenu.findIndex((s) => s.id === id);
    const menu = servicesMenu[menuIdx] || {};
    const Icon = SERVICE_ICONS[id] || Blocks;
    return {
      id,
      order: orderIdx,
      name: translated[menuIdx]?.title || menu.title || menu.name || id,
      sub: SERVICE_SUBS[id] || "",
      href: menu.href || "/#services",
      pos: layout.nodes[orderIdx],
      Icon,
    };
  });

  const count = nodes.length;
  const current = ((active % count) + count) % count;
  const running = inView && !reduced;

  /* Coordinated cycle: exactly one timer; advances only while the
     section is visible and motion is allowed. Selecting a node
     restarts the pause so reading never races the motion. */
  useEffect(() => {
    if (!running) return undefined;
    const id = window.setTimeout(
      () => setActive((a) => (a + 1) % count),
      CYCLE_MS
    );
    return () => window.clearTimeout(id);
  }, [active, count, running]);

  /* Visibility gating for the cycle timer. No new cycles start
     off-screen; the in-flight CSS segment simply finishes. */
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
  const activeNode = nodes[current];
  const activeD = activeNode
    ? spokeD(activeNode.pos, hub, activeNode.order)
    : "";

  return (
    <div
      ref={rootRef}
      className={`sn-root${focusIdx !== null ? " sn-has-focus" : ""}${reduced ? " sn-reduced" : ""}`}
      role="figure"
      aria-label="SystemaOps orchestration network: six service capabilities connected to the central SystemaOps hub"
    >
      <div className="sn-stage">
        {/* Underlay: grid, spokes, hub rings, particles (decorative;
            the HTML nodes below carry names, links and meaning). */}
        <svg
          className="sn-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <pattern
              id="sn-grid"
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M5 0H0V5"
                fill="none"
                stroke="rgba(94, 200, 198, 0.07)"
                strokeWidth="0.12"
              />
            </pattern>
            <radialGradient id="sn-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(45, 190, 188, 0.20)" />
              <stop offset="55%" stopColor="rgba(45, 190, 188, 0.06)" />
              <stop offset="100%" stopColor="rgba(45, 190, 188, 0)" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="100" height="100" fill="url(#sn-grid)" />
          <circle
            cx={hub.x}
            cy={hub.y}
            r="16"
            fill="url(#sn-halo)"
            className="sn-halo"
          />
          <circle
            cx={hub.x}
            cy={hub.y}
            r="10.5"
            fill="none"
            className="sn-ring sn-ring--outer"
          />
          <circle
            cx={hub.x}
            cy={hub.y}
            r="7.4"
            fill="none"
            className="sn-ring sn-ring--inner"
          />

          {/* Base spokes — always visible, deliberately quiet. */}
          {nodes.map((n, i) => (
            <path
              key={n.id}
              d={spokeD(n.pos, hub, i)}
              fill="none"
              vectorEffect="non-scaling-stroke"
              className={`sn-spoke${focusIdx === i ? " sn-spoke--focus" : ""}${focusIdx !== null && focusIdx !== i ? " sn-spoke--dim" : ""}`}
            />
          ))}

          {/* Connection points at each node anchor. */}
          {nodes.map((n, i) => (
            <circle
              key={`pt-${n.id}`}
              cx={n.pos.x}
              cy={n.pos.y}
              r="0.9"
              className={`sn-point${focusIdx === i ? " sn-point--focus" : ""}`}
            />
          ))}

          {/* Signature sequence on the active spoke only: thin light
              streaks travelling the exact spoke geometry. Remounting
              by key restarts the CSS dash animation on every cycle.
              pathLength=1 makes the segment a fixed fraction of any
              spoke, so the streak reads identical on all six. */}
          {running && activeNode ? (
            <g key={`seq-${bp}-${current}`}>
              {/* Inbound streak: a short illuminated segment of the
                  spoke travelling node -> hub (dashoffset 0 -> -0.89
                  slides the 0.11-long segment along pathLength 1). */}
              <g opacity={0.3} aria-hidden="true">
                <path
                  d={activeD}
                  pathLength={1}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  className="sn-streak sn-streak--halo sn-streak--in"
                  style={{
                    animationDuration: `${IN_MS}s`,
                    animationDelay: `${IN_BEGIN}s`,
                  }}
                />
              </g>
              <path
                d={activeD}
                pathLength={1}
                fill="none"
                vectorEffect="non-scaling-stroke"
                className="sn-streak sn-streak--in"
                style={{
                  animationDuration: `${IN_MS}s`,
                  animationDelay: `${IN_BEGIN}s`,
                }}
              />
              {/* Return streak: hub -> node on the SAME path, dash
                  travelling back (dashoffset -0.89 -> 0). */}
              <g opacity={0.3} aria-hidden="true">
                <path
                  d={activeD}
                  pathLength={1}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  className="sn-streak sn-streak--halo sn-streak--return"
                  style={{
                    animationDuration: `${OUT_MS}s`,
                    animationDelay: `${OUT_BEGIN}s`,
                  }}
                />
              </g>
              <path
                d={activeD}
                pathLength={1}
                fill="none"
                vectorEffect="non-scaling-stroke"
                className="sn-streak sn-streak--return"
                style={{
                  animationDuration: `${OUT_MS}s`,
                  animationDelay: `${OUT_BEGIN}s`,
                }}
              />
            </g>
          ) : null}
        </svg>

        {/* Central hub — the real brand logo, never altered. */}
        <div
          className="sn-hub"
          style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
        >
          {running ? (
            <span
              key={`pulse-${bp}-${current}`}
              className="sn-hub-pulse"
              aria-hidden="true"
            />
          ) : null}
          <span className="sn-hub-core" aria-hidden="true">
            <img src={logo} alt="" className="sn-hub-logo" />
          </span>
          <span className="sn-hub-label">SystemaOps</span>
        </div>

        {/* Service nodes — real links to the existing service pages. */}
        {nodes.map((n, i) => (
          <Link
            key={n.id}
            to={n.href}
            style={{ left: `${n.pos.x}%`, top: `${n.pos.y}%` }}
            className={`sn-node${focusIdx === i ? " sn-node--focus" : ""}${focusIdx !== null && focusIdx !== i ? " sn-node--dim" : ""}${running && current === i ? " sn-node--active" : ""}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            onClick={() => setActive(i)}
            aria-label={`${n.name} — ${n.sub}`}
          >
            <span className="sn-node-icon" aria-hidden="true">
              <n.Icon size={17} strokeWidth={1.8} />
            </span>
            <span className="sn-node-text">
              <span className="sn-node-name">{n.name}</span>
              <span className="sn-node-sub">{n.sub}</span>
            </span>
          </Link>
        ))}
      </div>

      <p className="sn-caption">
        Six capabilities, one orchestration hub — signals travel in,
        intelligence returns.
      </p>
    </div>
  );
}
