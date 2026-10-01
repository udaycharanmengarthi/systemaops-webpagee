import "./PrivacyPolicy.css";
import { Link } from "react-router-dom";
import Meta from "../../seo/Meta";
import { useLanguage } from "../../i18n/useLanguage";

export default function PrivacyPolicy() {
  const { t } = useLanguage();
  const legal = t("legal");

  return (
    <>
      <Meta
        title={legal.title}
        description={legal.intro}
        canonical="/privacy-policy"
      />
      <section className="privacy-page">
        <div className="privacy-container">
          <span className="privacy-tag">{legal.tag}</span>

          <h1 className="privacy-title">{legal.title}</h1>

          <p className="privacy-date">{legal.updated}</p>

          <div className="privacy-content">
            <div className="privacy-block">
              <p>{legal.intro}</p>
            </div>

            <div className="privacy-block">
              <h2>{legal.collectTitle}</h2>

              <ul>
                {(legal.collectItems || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="privacy-block">
              <h2>{legal.useTitle}</h2>

              <ul>
                {(legal.useItems || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="privacy-block">
              <h2>{legal.retentionTitle}</h2>

              <p>{legal.retentionText}</p>
            </div>

            <div className="privacy-block">
              <h2>{legal.rightsTitle}</h2>

              <p>{legal.rightsText}</p>
            </div>

            <div className="privacy-block">
              <h2>{legal.cookieTitle}</h2>

              <p>{legal.cookieText}</p>

              <p>
                <button
                  type="button"
                  className="privacy-cookie-btn"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("open-cookie-settings"),
                    )
                  }
                >
                  {t("cookie.settings")}
                </button>
              </p>
            </div>

            <div className="privacy-block">
              <p>
                <Link to="/contact" className="privacy-email-link">
                  {legal.contactCta}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
