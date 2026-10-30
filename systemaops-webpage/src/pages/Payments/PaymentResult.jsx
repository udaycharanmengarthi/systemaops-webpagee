/* ================================================================
   PAYMENT RESULT PAGES — informational only.

   Reaching /payment/success proves NOTHING about payment state: the
   browser can be redirected there manually. The only source of truth is
   server-side status endpoint (which queries Stripe where needed) and the
   signature-verified webhook are authoritative. Only the webhook persists
   payment state and starts email delivery; never claim a payment is
   confirmed based only on the browser redirect.
   ================================================================ */

import { Helmet } from "react-helmet-async";
import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Info, LoaderCircle, XCircle } from "lucide-react";

import { useLanguage } from "../../i18n/LanguageContext";
import { fetchPaymentStatus } from "../BookACall/consultation/paymentStatusService";
import { getPaymentAdapter } from "../BookACall/consultation/paymentService";
import "./PaymentPages.css";

/* Server-generated MongoDB ObjectId carried on the cancel URL for a linked
   consultation. It is opaque and contains no personal data. */
const CONSULTATION_ID_PATTERN = /^[a-f0-9]{24}$/i;

export function PaymentSuccess() {
  const { t } = useLanguage();
  const [params] = useSearchParams();

  /* Informational only. A missing/odd session_id changes nothing about
     payment state — we simply soften the wording instead of implying
     anything is confirmed. Stripe session ids start with "cs_". */
  const sessionId = params.get("session_id");
  const hasSession =
    typeof sessionId === "string" && sessionId.startsWith("cs_");
  const [verification, setVerification] = useState({ state: hasSession ? "checking" : "idle", attempt: 0 });
  const retry = useCallback(() => setVerification((current) => ({ state: "checking", attempt: current.attempt + 1 })), []);

  useEffect(() => {
    if (!hasSession) return undefined;
    const controller = new AbortController();
    let timer;
    fetchPaymentStatus(sessionId, { signal: controller.signal })
      .then((status) => {
        if (controller.signal.aborted) return;
        setVerification((current) => ({ ...current, state: status }));
        if (status === "pending" && verification.attempt < 4) {
          timer = window.setTimeout(() => {
            setVerification((current) => ({ state: "checking", attempt: current.attempt + 1 }));
          }, 2500);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setVerification((current) => ({ ...current, state: "unavailable" }));
      });
    return () => {
      controller.abort();
      if (timer) window.clearTimeout(timer);
    };
  }, [hasSession, sessionId, verification.attempt]);

  /* Direct visit / unknown state: we must not imply a payment exists. */
  const neutral = !hasSession;

  return (
    <>
      <Helmet>
        <title>{t("payments.success.title")}</title>

        <meta
          name="description"
          content={t(
            neutral
              ? "payments.success.neutralBody"
              : verification.state === "paid"
                ? "payments.success.verifiedBody"
                : verification.state === "failed"
                  ? "payments.success.failedBody"
                  : verification.state === "expired"
                    ? "payments.success.expiredBody"
                    : verification.state === "unavailable"
                      ? "payments.success.unavailableBody"
                      : "payments.success.body"
          )}
        />

        <meta
          name="robots"
          content="noindex"
        />
      </Helmet>

      <section className="pay-page">
        <div className="pay-page-card">
          {neutral ? (
            <Info
              size={34}
              className="pay-page-icon pay-page-icon--muted"
              aria-hidden="true"
            />
          ) : verification.state === "checking" ? (
            <LoaderCircle size={34} className="pay-page-icon pay-page-spin" aria-hidden="true" />
          ) : verification.state === "failed" || verification.state === "expired" || verification.state === "unavailable" ? (
            <Info size={34} className="pay-page-icon pay-page-icon--muted" aria-hidden="true" />
          ) : (
            <CheckCircle2
              size={34}
              className="pay-page-icon"
              aria-hidden="true"
            />
          )}

          <h1 className="pay-page-heading">
            {t(
              neutral
                ? "payments.success.neutralHeading"
                : verification.state === "paid"
                  ? "payments.success.verifiedHeading"
                  : verification.state === "failed"
                    ? "payments.success.failedHeading"
                    : verification.state === "expired"
                      ? "payments.success.expiredHeading"
                      : verification.state === "unavailable"
                        ? "payments.success.unavailableHeading"
                        : "payments.success.heading"
            )}
          </h1>

          <p className="pay-page-text" role="status" aria-live="polite">
            {t(
              neutral
                ? "payments.success.neutralBody"
                : verification.state === "paid"
                  ? "payments.success.verifiedBody"
                  : verification.state === "failed"
                    ? "payments.success.failedBody"
                    : verification.state === "expired"
                      ? "payments.success.expiredBody"
                      : verification.state === "unavailable"
                        ? "payments.success.unavailableBody"
                        : "payments.success.body"
            )}
          </p>

          <p className="pay-page-note">
            {t(
              neutral
                ? "payments.success.neutralNote"
                : verification.state === "paid"
                  ? "payments.success.verifiedNote"
                  : verification.state === "failed"
                    ? "payments.success.failedNote"
                    : verification.state === "expired"
                      ? "payments.success.expiredNote"
                      : verification.state === "unavailable"
                        ? "payments.success.unavailableNote"
                        : verification.state === "pending" || verification.state === "checking"
                          ? "payments.success.note"
                          : hasSession
                  ? "payments.success.note"
                  : "payments.success.missingSession"
            )}
          </p>

          <div className="pay-page-actions">
            {!neutral && ["pending", "failed", "expired", "unavailable"].includes(verification.state) && (
              <button type="button" className="pay-page-secondary" onClick={retry}>
                {t("payments.success.retryVerification")}
              </button>
            )}
            <Link
              to="/book-a-call"
              className="pay-page-primary"
            >
              {t("payments.success.contactCta")}
            </Link>

            <Link
              to="/"
              className="pay-page-secondary"
            >
              {t("payments.success.homeCta")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function PaymentCancel() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState("");

  /* The backend appends the server-generated enquiry id to the cancel URL
     for linked checkouts. Retrying with it reuses the same consultation
     instead of creating a duplicate. */
  const rawConsultationId = params.get("consultation_id");
  const consultationId =
    typeof rawConsultationId === "string" &&
    CONSULTATION_ID_PATTERN.test(rawConsultationId)
      ? rawConsultationId
      : null;

  const adapter = getPaymentAdapter();
  const canRetry = Boolean(consultationId) && adapter.name === "stripe";

  const retryPayment = useCallback(async () => {
    if (!canRetry || retrying) return;

    setRetrying(true);
    setRetryError("");

    try {
      await adapter.create({ consultationId });
    } catch (error) {
      setRetryError(
        t(
          error?.message === "payments_not_configured"
            ? "payments.notConfigured"
            : error?.message === "checkout_failed"
              ? "payments.errorGeneric"
              : "payments.errorNetwork"
        )
      );
    } finally {
      /* Reached only if the redirect did not happen. */
      setRetrying(false);
    }
  }, [adapter, canRetry, consultationId, retrying, t]);

  return (
    <>
      <Helmet>
        <title>{t("payments.cancel.title")}</title>

        <meta
          name="description"
          content={t("payments.cancel.body")}
        />

        <meta
          name="robots"
          content="noindex"
        />
      </Helmet>

      <section className="pay-page">
        <div className="pay-page-card">
          <XCircle
            size={34}
            className="pay-page-icon pay-page-icon--muted"
            aria-hidden="true"
          />

          <h1 className="pay-page-heading">
            {t("payments.cancel.heading")}
          </h1>

          <p className="pay-page-text">
            {t("payments.cancel.body")}
          </p>

          {retryError && (
            <p className="pay-page-text" role="alert">
              {retryError}
            </p>
          )}

          <div className="pay-page-actions">
            {canRetry ? (
              <button
                type="button"
                className="pay-page-primary"
                onClick={retryPayment}
                disabled={retrying}
                aria-busy={retrying}
              >
                {t(
                  retrying
                    ? "payments.loading"
                    : "payments.cancel.retryCta"
                )}
              </button>
            ) : (
              <Link
                to="/book-a-call"
                className="pay-page-primary"
              >
                {t("payments.cancel.retryCta")}
              </Link>
            )}

            <Link
              to="/contact"
              className="pay-page-secondary"
            >
              {t("payments.cancel.contactCta")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default PaymentSuccess;
