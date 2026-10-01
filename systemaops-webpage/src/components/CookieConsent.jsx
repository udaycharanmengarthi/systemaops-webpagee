import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "../i18n/useLanguage";
import "./CookieConsent.css";

const STORAGE_KEY = "systemaops-cookie-consent";
const VERSION = "2026-01-01";

function readConsent() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [statsOn, setStatsOn] = useState(false);

  useEffect(() => {
    if (!readConsent()) {
      const timer = window.setTimeout(() => setVisible(true), 600);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, []);

  useEffect(() => {
    const reopen = () => {
      const existing = readConsent();
      setStatsOn(existing ? existing.stats === true : false);
      setShowSettings(true);
      setVisible(true);
    };
    window.addEventListener("open-cookie-settings", reopen);
    return () =>
      window.removeEventListener("open-cookie-settings", reopen);
  }, []);

  const persist = useCallback((stats) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          necessary: true,
          stats,
          version: VERSION,
          updatedAt: new Date().toISOString(),
        }),
      );
    } catch {
      /* storage unavailable: banner simply hides for this session */
    }
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
            <div className="cookie-options">
              <div className="cookie-option">
                <div>
                  <p className="cookie-option-title">
                    {t("cookie.necessary")}
                  </p>
                  <p className="cookie-option-desc">
                    {t("cookie.necessaryDesc")}
                  </p>
                </div>
                <span
                  className="cookie-pill"
                  aria-hidden="true"
                >
                  on
                </span>
              </div>

              <div className="cookie-option">
                <div>
                  <p className="cookie-option-title">
                    {t("cookie.stats")}
                  </p>
                  <p className="cookie-option-desc">
                    {t("cookie.statsDesc")}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={statsOn}
                  aria-label={t("cookie.stats")}
                  className={`cookie-switch${statsOn ? " on" : ""}`}
                  onClick={() => setStatsOn((v) => !v)}
                >
                  <span className="cookie-knob" aria-hidden="true" />
                </button>
              </div>

              <p className="cookie-note">{t("cookie.note")}</p>
            </div>
          )}
        </div>

        <div className="cookie-actions">
          {!showSettings ? (
            <>
              <button
                type="button"
                className="cookie-btn cookie-btn--ghost"
                onClick={() => setShowSettings(true)}
              >
                {t("cookie.settings")}
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn--secondary"
                onClick={() => persist(false)}
              >
                {t("cookie.decline")}
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn--primary"
                onClick={() => persist(true)}
              >
                {t("cookie.accept")}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="cookie-btn cookie-btn--secondary"
                onClick={() => persist(false)}
              >
                {t("cookie.decline")}
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn--primary"
                onClick={() => persist(statsOn)}
              >
                {t("cookie.save")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
