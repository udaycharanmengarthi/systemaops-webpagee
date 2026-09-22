import "./Services.css";

import {
  BotMessageSquare,
  DatabaseZap,
  GitBranchPlus,
  Radar,
  BrainCog,
  Blocks,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { getServiceAccent } from "../../data/serviceAccents";

const SERVICES = [
  {
    icon: (
      <BotMessageSquare
        size={26}
        strokeWidth={1.8}
      />
    ),
    link: "/ai-automation",
  },

  {
    icon: (
      <Blocks
        size={26}
        strokeWidth={1.8}
      />
    ),
    link: "/odoo-customization",
    popular: true,
    featured: true,
  },

  {
    icon: (
      <GitBranchPlus
        size={26}
        strokeWidth={1.8}
      />
    ),
    link: "/workflow-automation",
  },

  {
    icon: (
      <Radar
        size={26}
        strokeWidth={1.8}
      />
    ),
    link: "/odoo-customization",
  },

  {
    icon: (
      <BrainCog
        size={26}
        strokeWidth={1.8}
      />
    ),
    link: "/odoo-customization",
  },

  {
    icon: (
      <DatabaseZap
        size={26}
        strokeWidth={1.8}
      />
    ),
    link: "/system-integrations",
  },
];

export default function Services() {
  const { t } = useLanguage();

  const items = t("services.items");

  return (
    <section className="services-sec">
      <div className="services-inner">

        {/* HEADER */}

        <div className="services-header">

          <span className="sec-eyebrow">
            {t("services.eyebrow")}
          </span>

          <h2 className="sec-heading">
            {t("services.heading")}
            <br />

            <span className="sec-heading--accent">
              {t("services.accent")}
            </span>
          </h2>

          <p className="sec-sub">
            {t("services.sub")}
          </p>

        </div>

        {/* SERVICES GRID */}

        <div className="services-grid">

          {SERVICES.map((s, index) => {

            const accent = getServiceAccent(index);

            return (
              <ServiceCard
                key={items[index]?.title || index}

                /* Translation content */
                {...(items[index] || {})}

                /* Service configuration comes LAST */
                icon={s.icon}
                link={s.link}
                popular={s.popular}
                featured={s.featured}
                accent={accent}

                popularLabel={t("services.popular")}
                exploreLabel={t("services.explore")}
              />
            );
          })}

        </div>

      </div>
    </section>
  );
}

/* =========================================================
   SERVICE CARD
========================================================= */

function ServiceCard({
  icon,
  title,
  desc,
  link,
  popular,
  featured,
  accent,
  popularLabel,
  exploreLabel,
}) {
  return (
    <div
      className={`svc-card ${
        featured ? "svc-card--featured" : ""
      }`}
      style={{
        "--c": accent.solid,
        "--c-rgb": accent.rgb,
        "--c-icon": accent.iconLight,
      }}
    >

      {/* POPULAR LABEL */}

      {popular && (
        <div className="svc-popular">
          {popularLabel}
        </div>
      )}

      {/* ICON */}

      <div className="svc-icon">
        {icon}
      </div>

      {/* TITLE */}

      <h3 className="svc-title">
        {title}
      </h3>

      {/* DESCRIPTION */}

      <p className="svc-desc">
        {desc}
      </p>

      {/* EXPLORE SERVICE */}

      <Link
        to={link}
        className="svc-link"
      >
        {exploreLabel}

        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className="svc-link-arrow"
        >
          <path
            d="M2 7h10M8 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

    </div>
  );
}
