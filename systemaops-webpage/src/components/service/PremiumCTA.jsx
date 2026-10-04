/**
 * components/service/PremiumCTA.jsx
 *
 * One reusable CTA system for every service page.
 * Large curved dark-navy surface with restrained teal/blue
 * glows, and a service-specific visual on the right rendered
 * by ServiceVisual (one composition per service — pipeline /
 * hub / graph / dashboard / roadmap / mesh).
 *
 * Pass `diagram = buildCTADiagram(t, serviceId)`; the visual
 * variant travels inside the diagram object.
 */

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ServiceVisual from "./ServiceVisual";
import "./PremiumCTA.css";

/* ── PREMIUM CTA ── */

export default function PremiumCTA({
  eyebrow,
  title,
  highlight,
  desc,
  button,
  buttonHref = "/contact",
  diagram = null,
}) {
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
          <ServiceVisual
            variant={diagram?.variant}
            diagram={diagram}
          />
        </div>
      </div>
    </section>
  );
}
