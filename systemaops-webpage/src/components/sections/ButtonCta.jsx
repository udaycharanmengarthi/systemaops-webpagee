import {
  ArrowRight,
  CalendarDays,
} from 'lucide-react'

import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import './ButtonCta.css'

export default function ButtonCta() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <section className="bottom-cta">
      <div className="bottom-cta-inner">
        {/* LEFT */}

        <div className="bottom-cta-left">
          <span className="bottom-cta-pill">
            {t("bottomCta.pill")}
          </span>

          <h2 className="bottom-cta-heading">
            {t("bottomCta.heading")}
            <span>
              {t("bottomCta.accent")}
            </span>
          </h2>

          <p className="bottom-cta-text">
            {t("bottomCta.text")}
          </p>
        </div>

        {/* RIGHT */}

        <div className="bottom-cta-right">
  <button
    className="bottom-cta-primary"
    onClick={() => navigate("/contact")}
    aria-label={t("bottomCta.aria")}
  >
    <CalendarDays size={18} />

    {t("bottomCta.button")}

    <ArrowRight size={18} />
  </button>

  <p className="bottom-cta-mini">
    {t("bottomCta.mini")}
  </p>
</div>
      </div>
    </section>
  )
}
