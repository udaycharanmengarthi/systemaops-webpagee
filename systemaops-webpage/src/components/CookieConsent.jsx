import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "../i18n/useLanguage";
import {
  readConsent,
  acceptAll,
  rejectOptional,
} from "../consent/consent";
import CookiePreferences from "./CookiePreferences";
import "./CookieConsent.css";

export default function CookieConsent() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!readConsent()) {
      const timer = window.setTimeout(() => setVisible(true), 600);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, []);

  useEffect(() => {
    const reopen = () => {
      setShowSettings(true);
      setVisible(true);
    };
    window.addEventListener("open-cookie-settings", reopen);
    return () =>
      window.removeEventListener("open-cookie-settings", reopen);
  }, []);

  const handleAcceptAll = useCallback(() => {
    acceptAll("banner");
    setVisible(false);
    setShowSettings(false);
  }, []);

  const handleReject = useCallback(() => {
    rejectOptional("banner");
    setVisible(false);
    setShowSettings(false);
  }, []);

  const handleSave = useCallback(() => {
    setVisible(false);
    setShowSettings(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="cookie-root"
      role="dialog"
      aria-modal="false"
      aria-label={t("cookie.title")}
    >
      <div className="cookie-card">
        <div className="cookie-copy">
          <p className="cookie-title">{t("cookie.title")}</p>
          <p className="cookie-text">{t("cookie.text")}</p>

          {showSettings && (
            <CookiePreferences onSave={handleSave} />
          )}
        </div>

        {!showSettings && (
          <div className="cookie-actions">
            <button
              type="button"
              className="cookie-btn cookie-btn--secondary"
              onClick={handleReject}
            >
              {t("cookie.rejectOptional")}
            </button>
            <button
              type="button"
              className="cookie-btn cookie-btn--ghost"
              onClick={() => setShowSettings(true)}
            >
              {t("cookie.customize")}
            </button>
            <button
              type="button"
              className="cookie-btn cookie-btn--primary"
              onClick={handleAcceptAll}
            >
              {t("cookie.acceptAll")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
