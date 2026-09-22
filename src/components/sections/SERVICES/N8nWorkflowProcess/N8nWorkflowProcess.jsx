import "./N8nWorkflowProcess.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../i18n/LanguageContext";

const STEPS = ["01", "02", "03", "04", "05"];

export default function N8nWorkflowProcess() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const steps = t("n8nPage.steps");
  const benefits = t("n8nPage.tags");

  return (
    <section className="n8n-section" aria-labelledby="n8n-heading">
      <div className="n8n-container">
        <header className="n8n-header">
          <span className="n8n-badge">{t("n8nPage.badge")}</span>

          <h1 id="n8n-heading" className="n8n-heading">
            {t("n8nPage.headingLine1")}
            <br />
            <span>{t("n8nPage.headingAccent")}</span>
            <br />
            {t("n8nPage.headingLine3")}
          </h1>

          <p className="n8n-description">{t("n8nPage.description")}</p>

          <div className="n8n-tags">
            {benefits.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </header>

        <section className="n8n-process-section">
          <div className="n8n-process-heading-wrap">
            <span className="n8n-process-small-title">
              {t("n8nPage.processSmallTitle")}
            </span>

            <h2 className="n8n-process-heading">
              {t("n8nPage.processHeading")}
            </h2>

            <p className="n8n-process-subtitle">
              {t("n8nPage.processSubtitle")}
            </p>
          </div>

          <div className="n8n-process-grid">
            {STEPS.map((number, index) => (
              <article key={number} className="n8n-process-card">
                <span className="n8n-bg-number">{number}</span>
                <div className="n8n-card-top-line" />
                <span className="n8n-card-number">{number}</span>
                <h3 className="n8n-card-title">{steps[index].title}</h3>
                <p className="n8n-card-description">
                  {steps[index].description}
                </p>

                <div className="n8n-card-footer">
                  <span>{t("n8nPage.outcomeLabel")}</span>
                  <strong>{steps[index].outcome}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="n8n-cta">
          <div>
            <span className="n8n-cta-mini">{t("n8nPage.ctaMini")}</span>
            <h2>{t("n8nPage.ctaHeading")}</h2>
            <p>{t("n8nPage.ctaText")}</p>
          </div>

          <button
            className="automation-btn"
            onClick={() => navigate("/contact")}
          >
            {t("n8nPage.ctaButton")}
          </button>
        </section>
      </div>
    </section>
  );
}
