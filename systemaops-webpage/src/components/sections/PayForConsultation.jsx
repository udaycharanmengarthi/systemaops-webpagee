/* ================================================================
   PAY FOR CONSULTATION — entry point to the paid consultation flow.

   This is intentionally a NAVIGATION action, not a checkout API call.
   A Checkout Session must belong to a real consultation/order: the
   customer selects the service and submits the enquiry on /book-a-call,
   and only then does the server create the one linked €500 session.

   Keeping this component as a router link prevents the site from
   creating unlinked, synthetic-looking sessions from the home page.
   ================================================================ */

import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../../i18n/LanguageContext";
import "./PayForConsultation.css";

export default function PayForConsultation() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="pay-consult">
      <button
        type="button"
        className="pay-consult-btn"
        onClick={() => navigate("/book-a-call")}
        aria-label={t("payments.button")}
      >
        <CreditCard size={18} aria-hidden="true" />
        <span>{t("payments.button")}</span>
      </button>
    </div>
  );
}
