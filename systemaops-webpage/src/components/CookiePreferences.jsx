import { useState } from "react";
import { useLanguage } from "../i18n/useLanguage";
import {
  readConsent,
  writeConsent,
  acceptAll,
  rejectOptional,
} from "../consent/consent";
import "./CookieConsent.css";

export default function CookiePreferences({ onSave }) {
  const { t } = useLanguage();
  const existing = readConsent();
  const [analytics, setAnalytics] = useState(
    existing ? existing.analytics === true : false,
  );
  const [functional, setFunctional] = useState(
    existing ? existing.functional === true : false,
  );
  const [marketing, setMarketing] = useState(
    existing ? existing.marketing === true : false,
  );

  const handleSave = () => {
    const record = writeConsent(
      { analytics, functional, marketing },
      "settings",
    );
    if (onSave) onSave(record);
  };

  const toggle = (value, setter) => (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      className={`cookie-switch${value ? " on" : ""}`}
      onClick={() => setter((v) => !v)}
    >
      <span className="cookie-knob" aria-hidden="true" />
    </button>
  );

  const categories = [
    {
      key: "necessary",
      title: t("cookie.necessary"),
      desc: t("cookie.necessaryDesc"),
      value: true,
      locked: true,
    },
    {
      key: "analytics",
      title: t("cookie.analytics"),
      desc: t("cookie.analyticsDesc"),
      value: analytics,
      setter: setAnalytics,
    },
    {
      key: "functional",
      title: t("cookie.functional"),
      desc: t("cookie.functionalDesc"),
      value: functional,
      setter: setFunctional,
    },
    {
      key: "marketing",
      title: t("cookie.marketing"),
      desc: t("cookie.marketingDesc"),
      value: marketing,
      setter: setMarketing,
    },
  ];

  return (
    <div className="cookie-options">
      {categories.map((cat) => (
        <div className="cookie-option" key={cat.key}>
          <div>
            <p className="cookie-option-title">{cat.title}</p>
            <p className="cookie-option-desc">{cat.desc}</p>
          </div>
          {cat.locked ? (
            <span className="cookie-pill" aria-hidden="true">
              on
            </span>
          ) : (
            toggle(cat.value, cat.setter)
          )}
        </div>
      ))}
      <p className="cookie-note">{t("cookie.note")}</p>
      <div className="cookie-actions">
        <button
          type="button"
          className="cookie-btn cookie-btn--secondary"
          onClick={() => {
            rejectOptional("settings");
            setAnalytics(false);
            setFunctional(false);
            setMarketing(false);
            if (onSave) onSave(readConsent());
          }}
        >
          {t("cookie.rejectOptional")}
        </button>
        <button
          type="button"
          className="cookie-btn cookie-btn--primary"
          onClick={handleSave}
        >
          {t("cookie.save")}
        </button>
        <button
          type="button"
          className="cookie-btn cookie-btn--ghost"
          onClick={() => {
            acceptAll("settings");
            setAnalytics(true);
            setFunctional(true);
            setMarketing(true);
            if (onSave) onSave(readConsent());
          }}
        >
          {t("cookie.acceptAll")}
        </button>
      </div>
    </div>
  );
}
