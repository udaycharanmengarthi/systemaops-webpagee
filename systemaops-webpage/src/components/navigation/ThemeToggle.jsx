import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "../../theme/theme-context";
import "./ThemeToggle.css";

/* Sun rays in the traveler's local coordinates (origin = body center).
   Cardinal rays are shorter, diagonals longer — a classic refined sun. */
const RAYS = [
  // cardinal (12.6 -> 13.8)
  { x1: 12.6, y1: 0, x2: 13.8, y2: 0 },
  { x1: 0, y1: 12.6, x2: 0, y2: 13.8 },
  { x1: -12.6, y1: 0, x2: -13.8, y2: 0 },
  { x1: 0, y1: -12.6, x2: 0, y2: -13.8 },
  // diagonal (9.05 -> 10.61)
  { x1: 9.05, y1: 9.05, x2: 10.61, y2: 10.61 },
  { x1: -9.05, y1: 9.05, x2: -10.61, y2: 10.61 },
  { x1: -9.05, y1: -9.05, x2: -10.61, y2: -10.61 },
  { x1: 9.05, y1: -9.05, x2: 10.61, y2: -10.61 },
];

/* Morph duration (ms) — must match the CSS transition/animation lengths. */
const MORPH_MS = 640;

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [animating, setAnimating] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const isLight = theme === "light";

  /* The scene depicts the TARGET theme (the action the button performs),
     matching the original Moon/Sun swap: dark page -> sunlit scene
     ("switch to light"), light page -> moonlit scene ("switch to dark").
     The liquid morph still plays fully between the two scenes. */
  const shown = isLight ? "dark" : "light";

  const handleClick = () => {
    /* Theme flips immediately (existing provider persists it); the
       liquid morph is a pure CSS layer keyed off data-state. Re-clicks
       mid-flight simply reverse the transitions and restart the
       direction-specific keyframes — no overlapping timelines possible. */
    if (timer.current) window.clearTimeout(timer.current);
    setAnimating(true);
    toggleTheme();
    timer.current = window.setTimeout(() => setAnimating(false), MORPH_MS + 60);
  };

  const gooId = `lt-goo-${uid}`;
  const maskId = `lt-moon-${uid}`;
  const clipId = `lt-clip-${uid}`;
  const navyId = `lt-navy-${uid}`;
  const warmId = `lt-warm-${uid}`;
  const haloId = `lt-halo-${uid}`;

  return (
    <button
      type="button"
      className={`theme-toggle liquid-toggle ${className}`}
      data-state={shown}
      data-animating={animating ? "true" : "false"}
      onClick={handleClick}
      aria-label={
        isLight
          ? "Switch to dark theme"
          : "Switch to light theme"
      }
      aria-pressed={!isLight}
      title={
        isLight
          ? "Switch to dark theme"
          : "Switch to light theme"
      }
    >
      <svg
        className="lt-scene"
        viewBox="0 0 48 48"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id={navyId} cx="35%" cy="28%" r="85%">
            <stop offset="0%" stopColor="#123239" />
            <stop offset="55%" stopColor="#0A1A1D" />
            <stop offset="100%" stopColor="#040E0F" />
          </radialGradient>
          <linearGradient id={warmId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="60%" stopColor="#FBF3DF" />
            <stop offset="100%" stopColor="#F2E3BE" />
          </linearGradient>
          <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFDF8A" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#E8B831" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E8B831" stopOpacity="0" />
          </radialGradient>
          {/* Goo: blurred alpha re-quantized so the traveling body and
              its trailing droplet merge into one organic liquid mass. */}
          <filter id={gooId} x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
          {/* True crescent: color-independent, always crisp. */}
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-12" y="-12" width="24" height="24">
            <circle cx="0" cy="0" r="10" fill="#fff" />
            <circle cx="4.6" cy="-3.4" r="7.8" fill="#000" />
          </mask>
          <clipPath id={clipId}>
            <circle cx="24" cy="24" r="22" />
          </clipPath>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          {/* Backdrop discs crossfade with the page theme. */}
          <circle cx="24" cy="24" r="22" fill={`url(#${navyId})`} className="lt-bg-dark" />
          <circle cx="24" cy="24" r="22" fill={`url(#${warmId})`} className="lt-bg-light" />

          {/* Stars (dark resting state only). */}
          <g className="lt-stars" fill="#CDE9E8">
            <path className="lt-tw1" d="M36 11.2 L36.9 13 L38.7 13.9 L36.9 14.8 L36 16.6 L35.1 14.8 L33.3 13.9 L35.1 13 Z" />
            <circle className="lt-tw2" cx="40.5" cy="22" r="1.3" />
            <circle cx="35" cy="30.5" r="1.5" />
            <circle cx="39" cy="28" r="0.8" />
          </g>

          {/* Traveler: wrapper glides, inner comet stretches. */}
          <g className="lt-travel">
            <g className="lt-comet" filter={`url(#${gooId})`}>
              <circle className="lt-moon" cx="0" cy="0" r="10" fill="#F2ECDA" mask={`url(#${maskId})`} />
              <circle className="lt-sun" cx="0" cy="0" r="10" fill="#E8B831" />
              <circle className="lt-drop" cx="0" cy="0" r="4.4" />
            </g>
            <circle className="lt-halo" cx="0" cy="0" r="15" fill={`url(#${haloId})`} />
            <g
              className="lt-rays"
              stroke="#B97F1F"
              strokeWidth="1.7"
              strokeLinecap="round"
            >
              {RAYS.map((r, i) => (
                <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
              ))}
            </g>
          </g>

          {/* Glass top-light + restrained edge glow. */}
          <ellipse className="lt-glass" cx="24" cy="12" rx="12" ry="6" fill="#ffffff" />
          <circle className="lt-ring" cx="24" cy="24" r="20.4" fill="none" strokeWidth="1.6" />
        </g>
      </svg>
    </button>
  );
}
