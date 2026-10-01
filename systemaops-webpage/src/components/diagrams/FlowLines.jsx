import { useId } from "react";
import { flowPath } from "./flowPath";
import "./FlowLines.css";

/* ============================================================
   FlowLines — shared fiber-optic flow layer.

   Extremely thin base paths + tiny gold particles looping along
   the exact same paths via SMIL (zero JS timers, infinite loop).
   Negative `begin` offsets distribute particles from first paint;
   matching opacity fades dissolve each particle at destination.

   flows: [{
     id,            // unique key
     d?,             // explicit path (corners, custom curves)
     x1,y1,x2,y2,   // ...or endpoints (+ optional bow)
     bow?,           // perpendicular curve offset (default 0)
     dur?,           // loop seconds (default 4)
     delay?,         // stagger offset seconds (default 0)
     drawDelay?,     // entrance draw delay seconds (default 0)
     dashed?,        // exception/alternate route styling
   }]

   draw: when true, base paths trace in once (viewport-gated by
   the caller, e.g. draw={inView}).
   ============================================================ */

export default function FlowLines({
  flows = [],
  draw = false,
  particleR = 2.2,
  className = "",
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const glowId = `sys-gold-${uid}`;

  return (
    <g
      className={`sys-flow${draw ? " sys-flow--draw" : ""} ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          id={glowId}
          x="-120%"
          y="-120%"
          width="340%"
          height="340%"
        >
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {flows.map((f) => {
        const d =
          f.d || flowPath(f.x1, f.y1, f.x2, f.y2, f.bow || 0);
        const dur = f.dur || 4;
        const begin = `${-(f.delay || 0)}s`;

        return (
          <g key={f.id}>
            <path
              d={d}
              pathLength={1}
              className={
                f.dashed
                  ? "sys-flow-base sys-flow-base--dashed"
                  : "sys-flow-base"
              }
              style={
                draw && !f.dashed
                  ? { "--fd": `${f.drawDelay ?? 0}s` }
                  : undefined
              }
            />
            <circle
              r={f.r || particleR}
              className="sys-flow-particle"
              filter={`url(#${glowId})`}
            >
              <animateMotion
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
                path={d}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.08;0.9;1"
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
    </g>
  );
}
