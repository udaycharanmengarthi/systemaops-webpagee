import "./AutomationProcess.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../i18n/LanguageContext";

const STEPS = ["01", "02", "03", "04", "05"];

export default function AutomationProcess() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const steps = t("automationPage.steps");
  const benefits = t("automationPage.tags");

  return (
    <section
      className="automation-section"
      aria-labelledby="automation-heading"
    >
      <div className="automation-container">
        <header className="automation-header">
          <span className="automation-badge">{t("automationPage.badge")}</span>

          <h1 id="automation-heading" className="automation-heading">
            {t("automationPage.headingLine1")}
            <br />
            <span>{t("automationPage.headingAccent")}</span>
            {t("automationPage.headingSuffix")}
          </h1>

          <p className="automation-description">
            {t("automationPage.description")}
          </p>

          <div className="automation-tags">
            {benefits.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </header>

        <section className="process-section">
          <div className="process-heading-wrap">
            <span className="process-small-title">
              {t("automationPage.processSmallTitle")}
            </span>

            <h2 className="process-heading">
              {t("automationPage.processHeading")}
            </h2>

            <p className="process-subtitle">
              {t("automationPage.processSubtitle")}
            </p>
          </div>

          <div className="process-grid">
            {STEPS.map((number, index) => (
              <article key={number} className="process-card">
                <span className="bg-number">{number}</span>
                <div className="card-top-line" />
                <span className="card-number">{number}</span>
                <h3 className="card-title">{steps[index].title}</h3>
                <p className="card-description">{steps[index].description}</p>

                <div className="card-footer">
                  <span>{t("automationPage.outcomeLabel")}</span>
                  <strong>{steps[index].outcome}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="automation-cta">
          <div>
            <span className="cta-mini">{t("automationPage.ctaMini")}</span>
            <h2>{t("automationPage.ctaHeading")}</h2>
            <p>{t("automationPage.ctaText")}</p>
          </div>

          <button
            className="automation-btn"
            onClick={() => navigate("/contact")}
          >
            {t("automationPage.ctaButton")}
          </button>
        </section>
      </div>
    </section>
  );
}
