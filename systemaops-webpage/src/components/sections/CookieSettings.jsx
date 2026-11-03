import "./PrivacyPolicy.css";
import Meta from "../../seo/Meta";
import { useLanguage } from "../../i18n/useLanguage";
import CookiePreferences from "../CookiePreferences";
import { withdrawConsent, readConsent } from "../../consent/consent";

export default function CookieSettings() {
  const { t } = useLanguage();
  const legal = t("legal");

  return (
    <>
      <Meta
        title={t("cookie.settings")}
        description={t("cookie.text")}
        canonical="/cookie-settings"
      />
      <section className="privacy-page">
        <div className="privacy-container">
          <span className="privacy-tag">{legal.tag}</span>
          <h1 className="privacy-title">{t("cookie.settings")}</h1>
          <p className="privacy-date">
            {readConsent()
              ? `${t("cookie.updated")}: ${readConsent().updatedAt}`
              : t("cookie.note")}
          </p>
          <div className="privacy-content">
            <div className="privacy-block">
              <p>{t("cookie.text")}</p>
            </div>
            <CookiePreferences />
            <div className="privacy-block">
              <button
                type="button"
                className="privacy-cookie-btn"
                onClick={() => {
                  withdrawConsent();
                  window.location.reload();
                }}
              >
                {t("cookie.withdraw")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
