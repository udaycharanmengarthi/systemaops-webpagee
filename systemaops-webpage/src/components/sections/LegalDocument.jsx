import "./PrivacyPolicy.css";
import { Link } from "react-router-dom";
import Meta from "../../seo/Meta";
import { useLanguage } from "../../i18n/useLanguage";

export default function LegalDocument({ namespace, canonical }) {
  const { t } = useLanguage();
  const doc = t(namespace) || {};
  const sections = doc.sections || [];

  return (
    <>
      <Meta
        title={doc.title || namespace}
        description={doc.intro || ""}
        canonical={canonical}
      />
      <section className="privacy-page">
        <div className="privacy-container">
          <span className="privacy-tag">{doc.tag || "LEGAL"}</span>
          <h1 className="privacy-title">{doc.title}</h1>
          <p className="privacy-date">{doc.updated}</p>
          <div className="privacy-content">
            {doc.intro && (
              <div className="privacy-block">
                <p>{doc.intro}</p>
              </div>
            )}
            {sections.map((section, idx) => (
              <div className="privacy-block" key={idx}>
                {section.heading && <h2>{section.heading}</h2>}
                {(section.paragraphs || []).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {(section.bullets || []).length > 0 && (
                  <ul>
                    {section.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <div className="privacy-block">
              <p>
                <Link to="/contact" className="privacy-email-link">
                  {doc.contactCta || "Questions? Contact us."}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
