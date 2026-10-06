import {
  Activity,
  Boxes,
  BrainCircuit,
  Compass,
  PlugZap,
  Workflow,
} from "lucide-react";
import logo from "../assets/systemaops-icon-color.svg";

/* SYSTEMAOPS TECHNOLOGY ENVIRONMENT — one integrated composition, not
   six cards and not a diagram. The central core anchors layered
   architectural planes; the six service capabilities appear as
   typography etched into the environment (no boxes, no arrows, no
   hub-and-spoke). A single slow signal travels the infrastructure and
   each visited capability brightens briefly. Decorative only. */

function ServiceLabel({ x, y, anchor = "start", icon: Icon, name, sub, glowClass, glowDelay }) {
  const textAnchor = anchor === "end" ? "end" : anchor === "middle" ? "middle" : "start";
  const iconX = anchor === "end" ? x - 148 : x;
  return (
    <g className={glowClass} style={{ animationDelay: glowDelay }} aria-hidden="true">
      <g transform={`translate(${iconX},${y - 11})`}>
        <Icon size={12} color="#7fd4d2" strokeWidth={1.7} />
      </g>
      <text
        x={anchor === "end" ? x - 20 : x + 20}
        y={y}
        textAnchor={textAnchor}
        fill="#d7e2ea"
        fontSize={10.5}
        fontWeight={600}
        letterSpacing={0.6}
      >
        {name}
      </text>
      <text
        x={anchor === "end" ? x - 20 : x + 20}
        y={y + 13}
        textAnchor={textAnchor}
        fill="#5f7488"
        fontSize={7.5}
        letterSpacing={1.8}
      >
        {sub}
      </text>
      <circle className="login-svc-dot" cx={anchor === "end" ? x - 8 : x + 8} cy={y - 4} r={1.6} fill="#E8B831" opacity={0} />
    </g>
  );
}

export default function BrandExperience() {
  return (
    <section
      aria-label="SystemaOps technology"
      className="relative hidden overflow-hidden bg-[#050A0D] md:flex md:w-[45%] md:flex-col lg:w-[58%]"
    >
      {/* atmosphere: faint grid + controlled light */}
      <div aria-hidden="true" className="absolute inset-0 login-grid" />
      <div aria-hidden="true" className="absolute -left-32 top-[-10%] h-[24rem] w-[24rem] rounded-full bg-brand-600/[0.06] blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-[-20%] right-[-10%] h-80 w-80 rounded-full bg-white/[0.015] blur-3xl" />

      {/* top branding */}
      <div className="relative z-10 flex items-start justify-between px-8 pt-7 lg:px-11">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="SystemaOps" className="h-7 w-7" />
          <div className="leading-tight">
            <div className="text-[13px] font-bold tracking-[0.18em] text-white">SYSTEMAOPS</div>
            <div className="text-[10px] font-medium tracking-[0.24em] text-slate-400">OPERATIONS CONSOLE</div>
          </div>
        </div>
        <div className="hidden pt-1 text-[10px] font-medium tracking-[0.22em] text-slate-500 lg:block" aria-hidden="true">
          AUTOMATE • INTEGRATE • SCALE
        </div>
      </div>

      {/* environment scene */}
      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-4">
        <svg
          viewBox="0 0 560 620"
          preserveAspectRatio="xMidYMid meet"
          className="h-full max-h-[640px] w-full"
          role="img"
          aria-label="SystemaOps technology environment"
        >
          <defs>
            <radialGradient id="envCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#159a9c" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#159a9c" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="envPlane" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3ba3a1" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#3ba3a1" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* deep architectural planes */}
          <g aria-hidden="true">
            <polygon points="60,470 500,470 440,610 120,610" fill="#0b141c" fillOpacity="0.6" stroke="#3ba3a1" strokeOpacity="0.1" />
            <polygon points="120,120 470,80 450,200 100,240" fill="none" stroke="#3ba3a1" strokeOpacity="0.07" />
            <ellipse cx="280" cy="330" rx="190" ry="150" fill="url(#envCore)" />
          </g>

          {/* faint contour hairlines */}
          <g stroke="#3ba3a1" strokeWidth="1" opacity="0.09" aria-hidden="true">
            <path d="M40 560 H520" />
            <path d="M90 585 H470" />
            <path d="M120 60 V560 M440 90 V560" strokeOpacity="0.6" />
          </g>

          {/* infrastructure spine + short stubs (no arrows, no labels) */}
          <g stroke="#3ba3a1" strokeWidth="1" opacity="0.16" aria-hidden="true">
            <path d="M70 352 H490" />
            <path d="M114 352 V196 M70 352 V452 M446 352 V236 M446 352 V452" strokeOpacity="0.7" />
            <path d="M70 352 h10 M150 352 h10 M230 352 h10 M310 352 h10 M390 352 h10 M470 352 h10" strokeOpacity="0.8" />
          </g>

          {/* central platform + real logo */}
          <g aria-hidden="true">
            <polygon points="196,300 364,300 340,328 172,328" fill="#0d1822" fillOpacity="0.85" stroke="url(#envPlane)" strokeWidth="1" />
            <polygon points="212,284 348,284 328,304 192,304" fill="#0d1822" fillOpacity="0.7" stroke="#3ba3a1" strokeOpacity="0.2" />
            <polygon points="228,270 332,270 316,286 212,286" fill="#101d28" fillOpacity="0.9" stroke="#3ba3a1" strokeOpacity="0.3" />
          </g>
          <image href={logo} x={250} y={278} width={60} height={60} opacity={0.95} />
          <rect x={273} y={348} width={14} height={2.5} rx={1.25} fill="#E8B831" opacity={0.9} aria-hidden="true" />
          <text x={280} y={368} textAnchor="middle" fill="#e6edf2" fontSize={12} fontWeight={700} letterSpacing={3}>
            SYSTEMAOPS
          </text>

          {/* travelling signal: core → intelligence → integration → infrastructure → core */}
          <circle className="login-signal" r="2.4" fill="#E8B831">
            <animateMotion
              dur="26s"
              repeatCount="indefinite"
              rotate="0"
              keyPoints="0;0.22;0.22;0.48;0.48;0.74;0.74;1"
              keyTimes="0;0.2;0.32;0.5;0.6;0.78;0.88;1"
              calcMode="linear"
              path="M280 330 C 280 240, 280 160, 280 96 C 330 100, 400 140, 458 196 C 500 260, 480 380, 452 444 C 410 510, 330 470, 280 330"
            />
          </circle>

          {/* capability labels etched into the scene */}
          <ServiceLabel x={280} y={66} anchor="middle" icon={BrainCircuit} name="AI AUTOMATION & AGENTS" sub="AGENTIC SYSTEMS" glowClass="login-svc login-svc-a" glowDelay="0s" />
          <ServiceLabel x={44} y={176} icon={Boxes} name="ODOO SOLUTIONS" sub="ERP FOUNDATION" glowClass="login-svc login-svc-b" glowDelay="-6.5s" />
          <ServiceLabel x={36} y={430} icon={Workflow} name="WORKFLOW AUTOMATION" sub="SEQUENCED FLOW" glowClass="login-svc login-svc-c" glowDelay="-13s" />
          <ServiceLabel x={516} y={216} anchor="end" icon={PlugZap} name="SYSTEM INTEGRATION & APIS" sub="CONNECTED APIS" glowClass="login-svc login-svc-d" glowDelay="-19.5s" />
          <ServiceLabel x={516} y={448} anchor="end" icon={Activity} name="DEVOPS / AIOPS" sub="TELEMETRY" glowClass="login-svc login-svc-e" glowDelay="-6.5s" />
          <ServiceLabel x={196} y={556} icon={Compass} name="AI CONSULTING" sub="STRATEGY LAYER" glowClass="login-svc login-svc-f" glowDelay="-13s" />
        </svg>
      </div>

      {/* bottom statement */}
      <div className="relative z-10 px-8 pb-9 lg:px-11">
        <div className="text-[11px] font-semibold tracking-[0.3em] text-teal-300/80">
          SYSTEMS • AUTOMATION • INTELLIGENCE
        </div>
        <p className="mt-2.5 max-w-sm text-xl font-semibold leading-snug text-white">
          Technology that moves operations forward.
        </p>
      </div>
    </section>
  );
}
