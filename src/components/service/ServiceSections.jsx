/**
 * components/service/ServiceSections.jsx
 *
 * Shared primitives for the six SystemaOps service pages.
 * Styling hooks off --svc / --svc-rgb / --svc-text set by each
 * page root, so every service keeps its own identity.
 *
 * Sections: ServiceTech, RealWork, ServiceFaq, RelatedServices.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";

import Reveal from "../ui/Reveal";

/* ── TECHNOLOGY: grouped by role, never a logo wall ── */

export function ServiceTech({ eyebrow, title, desc, groups }) {
  return (
    <Reveal delay={0.06}>
      <section className="svc-section">
        <div className="svc-container">
          <span className="svc-eyebrow">{eyebrow}</span>
          <h2 className="svc-title">{title}</h2>
          {desc && <p className="svc-desc">{desc}</p>}
          <div className="svc-tech-grid">
            {groups.map((g) => (
              <div key={g.role} className="svc-tech-group">
                <span className="svc-tech-role">{g.role}</span>
                <div className="svc-tech-pills">
                  {g.items.map((item) => (
                    <span key={item} className="svc-tech-pill">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

/* ── SELECTED REAL WORK: real repo build areas, no invented proof ── */

export function RealWork({ eyebrow, title, desc, items }) {
  return (
    <Reveal delay={0.06}>
      <section className="svc-section svc-section--tight">
        <div className="svc-container">
          <span className="svc-eyebrow">{eyebrow}</span>
          <h2 className="svc-title">{title}</h2>
          {desc && <p className="svc-desc">{desc}</p>}
          <div className="svc-work-grid">
            {items.map((w) => (
              <Link
                key={w.id}
                to={w.href}
                className="svc-work-card"
                style={{
                  "--w": w.accent,
                  "--w-rgb": w.accentRgb,
                  "--w-text": w.accentText,
                }}
              >
                <span className="svc-work-category">{w.category}</span>
                <h3>{w.title}</h3>
                <p>{w.description}</p>
                <div className="svc-work-tags">
                  {w.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <span className="svc-work-link">
                  {w.linkLabel}
                  <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

/* ── FAQ: keyboard-accessible accordion ── */

export function ServiceFaq({ eyebrow, title, items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Reveal delay={0.06}>
      <section className="svc-section svc-section--tight">
        <div className="svc-container svc-container--narrow">
          <span className="svc-eyebrow">{eyebrow}</span>
          <h2 className="svc-title">{title}</h2>
          <div className="svc-faq">
            {items.map((item, i) => {
              const isOpen = i === openIndex;
              return (
                <div
                  key={item.q}
                  className={`svc-faq-item ${isOpen ? "svc-faq-item--open" : ""}`}
                >
                  <button
                    type="button"
                    className="svc-faq-button"
                    aria-expanded={isOpen}
                    aria-controls={`svc-faq-panel-${i}`}
                    onClick={() =>
                      setOpenIndex(isOpen ? -1 : i)
                    }
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className="svc-faq-chevron"
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={`svc-faq-panel-${i}`}
                      role="region"
                      className="svc-faq-answer"
                    >
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

/* ── RELATED SERVICES ── */

export function RelatedServices({ eyebrow, title, items }) {
  return (
    <Reveal delay={0.06}>
      <section className="svc-section svc-section--tight">
        <div className="svc-container">
          <span className="svc-eyebrow">{eyebrow}</span>
          <h2 className="svc-title">{title}</h2>
          <div className="svc-rel-grid">
            {items.map((r) => (
              <Link
                key={r.href}
                to={r.href}
                className="svc-rel-card"
                style={{ "--r": r.accent }}
              >
                <span className="svc-rel-dot" aria-hidden="true" />
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
                <span className="svc-rel-link">
                  Explore
                  <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
