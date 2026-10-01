/**
 * pages/Faqs/index.jsx
 *
 * SystemaOps FAQ page — grouped answers for every service area.
 * Reuses the canonical faqCategories data and the shared FAQPage
 * schema. Copy comes from t("faq.*").
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import Meta from "../../seo/Meta";
import FAQSchema from "../../seo/schema/FAQSchema";
import BreadcrumbSchema from "../../seo/schema/BreadcrumbSchema";
import Reveal from "../../components/ui/Reveal";
import { useLanguage } from "../../i18n/useLanguage";
import { faqCategories, getAllFaqs } from "../../data/faqs";

import "./Faqs.css";

function Category({ category, openIndex, onToggle }) {
  const idxLabel = String(openIndex).padStart(2, "0");

  return (
    <section className="faqs-cat">
      <h2 className="faqs-cat-title">{category.label}</h2>
      <div className="faqs-list">
        {category.items.map((item, i) => {
          const isOpen = openIndex === i;
          const id = `${category.id}-${item.id}`;
          return (
            <div
              key={item.id}
              className={`faqs-item${isOpen ? " faqs-item--open" : ""}`}
            >
              <button
                type="button"
                className="faqs-q"
                aria-expanded={isOpen}
                aria-controls={`${id}-panel`}
                onClick={() => onToggle(isOpen ? -1 : i)}
              >
                <span>
                  {idxLabel}.{String(i + 1).padStart(2, "0")}
                </span>
                <strong>{item.question}</strong>
                <ChevronDown
                  size={18}
                  className="faqs-chevron"
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div
                  id={`${id}-panel`}
                  role="region"
                  className="faqs-a"
                >
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function FaqsPage() {
  const { t } = useLanguage();
  const faq = t("faq") || {};
  const [open, setOpen] = useState({});

  const toggle = (categoryId, index) => {
    setOpen((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] === index ? -1 : index,
    }));
  };

  return (
    <div className="faqs-page">
      <Meta
        title={faq.metaTitle}
        description={faq.metaDesc}
        canonical="/faqs"
      />

      <FAQSchema faqs={getAllFaqs()} />

      <BreadcrumbSchema
        items={[
          { name: t("nav.home"), href: "/" },
          { name: t("breadcrumbs.faq"), href: "/faqs" },
        ]}
      />

      <Reveal>
        <section className="faqs-hero">
          <div className="faqs-container">
            <span className="faqs-eyebrow">{faq.eyebrow}</span>
            <h1 className="faqs-title">
              {faq.title1} <span>{faq.titleAccent}</span>
            </h1>
            <p className="faqs-desc">{faq.desc}</p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.06}>
        <section className="faqs-body">
          <div className="faqs-container">
            {faqCategories.map((category) => (
              <Category
                key={category.id}
                category={category}
                openIndex={
                  open[category.id] !== undefined ? open[category.id] : -1
                }
                onToggle={(index) => toggle(category.id, index)}
              />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.08}>
        <section className="faqs-cta">
          <div className="faqs-container">
            <div className="faqs-cta-copy">
              <h2>{faq.stillHaveQuestions}</h2>
              <Link to="/privacy-policy" className="faqs-privacy-link">
                {faq.privacyPolicy}
              </Link>
            </div>
            <Link to="/contact" className="faqs-cta-btn">
              {faq.contactUs}
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
