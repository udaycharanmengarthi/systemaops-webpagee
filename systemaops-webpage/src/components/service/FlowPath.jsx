/**
 * FlowPath.jsx — reusable flowing-light architecture connector.
 *
 * Renders a subtle base path + an animated illuminated segment
 * that travels smoothly from source → destination along the
 * actual curved SVG path. No dots, no particles.
 *
 * Usage:
 *   <FlowPath d="M 40 80 Q 200 10 400 80" duration={3} delay={0.2} />
 *   or
 *   <FlowConnector x1={40} y1={80} x2={400} y2={80} curve={30} duration={3} />
 */

import "./FlowPath.css";

export function FlowPath({ d, duration = 3, delay = 0, color = "var(--brand-primary)", strokeWidth = 2 }) {
  return (
    <g className="flow-group" aria-hidden="true">
      {/* Base — subtle, low opacity, always visible */}
      <path
        d={d}
        fill="none"
        stroke="var(--flow-base, var(--arch-line))"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.28"
        pathLength={100}
      />
      {/* Flowing light — bright segment traveling */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
        className="flow-light"
        style={{
          "--flow-duration": `${duration}s`,
          "--flow-delay": `${delay}s`,
        }}
      />
    </g>
  );
}

/**
 * Convenience: straight or smoothly curved line between two points.
 * curve: vertical offset for Q control point (positive = bend down)
 */
export function FlowConnector({ x1, y1, x2, y2, curve = 0, duration = 3, delay = 0, color = "var(--brand-primary)", strokeWidth = 1.8, showArrow = true }) {
  const d =
    curve === 0
      ? `M ${x1} ${y1} L ${x2} ${y2}`
      : `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + curve} ${x2} ${y2}`;
  // compute arrow polygon at destination (simple, handles straight best)
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 7;
  const ax = x2;
  const ay = y2;
  const p1x = ax - Math.cos(angle - Math.PI / 6) * size;
  const p1y = ay - Math.sin(angle - Math.PI / 6) * size;
  const p2x = ax - Math.cos(angle + Math.PI / 6) * size;
  const p2y = ay - Math.sin(angle + Math.PI / 6) * size;
  const arrow = `${ax},${ay} ${p1x},${p1y} ${p2x},${p2y}`;
  return (
    <g aria-hidden="true">
      <FlowPath d={d} duration={duration} delay={delay} color={color} strokeWidth={strokeWidth} />
      {showArrow && <polygon points={arrow} fill="var(--arch-line)" opacity="0.95" />}
    </g>
  );
}

export default FlowPath;
