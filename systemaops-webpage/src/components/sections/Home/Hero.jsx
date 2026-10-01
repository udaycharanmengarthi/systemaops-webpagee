import { useEffect, useRef } from "react";
import "./Hero.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageContext";

// N8N-style nodes � real tool names with SVG icons


// Logo-derived node shades: one brand family (deep → light teal),
// plus the logo gold dot as a single highlight. Structure untouched.
const NODES = [
  {
    id: 1, x: 48, y: 35, size: 68,
    label: "AI Engine",
    color: "#00D4AA",
    bg: "#0A1F1A",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28" aria-hidden="true" focusable="false">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#00D4AA" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5" stroke="#00D4AA" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 12l10 5 10-5" stroke="#00D4AA" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 2, x: 26, y: 55, size: 60,
    label: "Data Flow",
    color: "#7B7FFF",
    bg: "#0F0F20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#7B7FFF" strokeWidth="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#7B7FFF" strokeWidth="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#7B7FFF" strokeWidth="1.5"/>
        <path d="M17.5 14v7M14 17.5h7" stroke="#7B7FFF" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 3, x: 72, y: 55, size: 60,
    label: "Automation",
    color: "#F0A500",
    bg: "#1A150A",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden="true" focusable="false">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#F0A500" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 4, x: 16, y: 32, size: 50,
    label: "Webhook",
    color: "#FF6B8A",
    bg: "#1A0A10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true" focusable="false">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#FF6B8A" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#FF6B8A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 5, x: 84, y: 32, size: 50,
    label: "Cloud Sync",
    color: "#38BDF8",
    bg: "#061520",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true" focusable="false">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" stroke="#38BDF8" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 6, x: 20, y: 76, size: 44,
    label: "Notify",
    color: "#A78BFA",
    bg: "#100A1A",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true" focusable="false">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#A78BFA" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M13.73 21a2 2 0 01-3.46 0" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 7, x: 80, y: 76, size: 44,
    label: "Security",
    color: "#34D399",
    bg: "#061510",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true" focusable="false">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#34D399" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 8, x: 90, y: 56, size: 38,
    label: "API",
    color: "#FB923C",
    bg: "#1A0E06",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true" focusable="false">
        <path d="M8 6l-4 6 4 6M16 6l4 6-4 6M12 3l-2 18" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const CONNECTIONS = [
  [1,2],[1,3],[2,4],[2,6],[3,5],[3,7],[3,8]
];

export default function Hero() {
  const statRefs = useRef([]);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const stats = t("hero.stats");

  useEffect(() => {
    stats.forEach(({ target, suffix, decimals }, i) => {
      const el = statRefs.current[i];
      if (!el) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { animateCount(el, target, suffix, decimals); obs.disconnect(); }
      }, { threshold: 0.4 });
      obs.observe(el);
    });
  }, [stats]);

  return (
    <section
      className="hero"
      aria-label={t("hero.aria")}
    >
      {/* Ambient � purely decorative */}
      <div className="hero-bg" aria-hidden="true">
        <div className="glow glow-teal" />
        <div className="glow glow-purple" />
        <div className="hero-grid" />
      </div>

      <div className="hero-inner">
        {/* -- LEFT -- */}
        <div className="hero-left">

          <h1 className="hero-heading">
            {t("hero.line1")}
            <br />
            {t("hero.line2")}
            <br />
            <span className="heading-gradient">
              {t("hero.accent")}
            </span>
          </h1>

          <p className="hero-body">
            {t("hero.body")}
          </p>

          <div className="hero-actions">
           <button
  className="btn-cta"
  aria-label={t("hero.primaryAria")}
  onClick={() => navigate("/contact")}
>
  {t("hero.primary")}

  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>

<button
  className="btn-outline"
  aria-label={t("hero.secondaryAria")}
  onClick={() => {
    document
      .getElementById("services")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }}
>
  {t("hero.secondary")}
</button>
          </div>

          <dl className="hero-stats">
            {stats.map(({ target, suffix, label, decimals }, i) => (
              <div key={label} className="stat-item">
                <dt className="stat-label">{label}</dt>
                <dd
                  className="stat-num"
                  ref={el => statRefs.current[i] = el}
                  aria-label={`${typeof target === 'number' ? (decimals ? target.toFixed(decimals) : target) : target}${suffix} ${label}`}
                >
                  {decimals ? target.toFixed(decimals) : target}{suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* -- RIGHT � N8N style � decorative illustration -- */}
        <div
          className="hero-right desktop-only"
          aria-hidden="true"
          role="presentation"
        >
          <div className="node-scene">
            {/* SVG lines + travel dots */}
            <svg
              className="node-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
            >
              <defs>
                <filter id="glow-line">
                  <feGaussianBlur stdDeviation="0.4" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {CONNECTIONS.map(([a, b], i) => {
                const na = NODES.find(n => n.id === a);
                const nb = NODES.find(n => n.id === b);
                return (
                  <line key={i}
                    x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    className="conn-line"
                    filter="url(#glow-line)"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  />
                );
              })}
              {CONNECTIONS.map(([a, b], i) => {
                const na = NODES.find(n => n.id === a);
                const nb = NODES.find(n => n.id === b);
                return (
                  <g key={`d${i}`}>
                    <circle
                      cx={na.x}
                      cy={na.y}
                      r="0.85"
                      className="conn-dot"
                      style={{
                        fill: na.color,
                        filter: 'drop-shadow(0 0 6px currentColor)',
                        color: na.color,
                      }}
                    >
                      <animate
                        attributeName="cx"
                        from={na.x}
                        to={nb.x}
                        dur={`${1.8 + i * 0.3}s`}
                        repeatCount="indefinite"
                        begin={`${i * 0.3}s`}
                      />
                      <animate
                        attributeName="cy"
                        from={na.y}
                        to={nb.y}
                        dur={`${1.8 + i * 0.3}s`}
                        repeatCount="indefinite"
                        begin={`${i * 0.3}s`}
                      />
                    </circle>
                  </g>
                );
              })}
            </svg>

            {/* Node bubbles */}
            {NODES.map((node, i) => (
              <div
                key={node.id}
                className="n8n-node"
                style={{
                  left: `${node.x}%`, top: `${node.y}%`,
                  width: node.size, height: node.size,
                  "--c": node.color, "--bg": node.bg,
                  animationDelay: `${i * 0.18}s`,
                  animationDuration: `${5.5 + i * 0.4}s`,
                }}
              >
                <div className="n8n-node__glow" />
                <div className="n8n-node__ring" />
                <div className="n8n-node__body">
                  {node.icon}
                </div>
                <div className="n8n-node__label">{node.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function animateCount(el, target, suffix, decimals) {
  if (typeof target !== 'number') {
    el.textContent = target + suffix;
    return;
  }

  const dur = 2200;
  const t0 = performance.now();

  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    const v = (1 - Math.pow(1 - p, 3)) * target;
    el.textContent =
      (decimals ? v.toFixed(decimals) : Math.floor(v)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
