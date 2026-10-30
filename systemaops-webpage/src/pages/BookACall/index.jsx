import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { useLanguage } from "../../i18n/LanguageContext";
import { servicesMenu } from "../../data/services";

import ConsultationForm from "./components/ConsultationForm";
import MockCheckout, { MockResult } from "./components/MockCheckout";
import StripeCheckout from "./components/StripeCheckout";
import useConsultationForm, { STEPS } from "./consultation/useConsultationForm";
import { consultationOffer } from "./consultation/offerConfig";
import { PAYMENT_OUTCOME } from "./consultation/paymentService";

import "./BookACall.css";

const buildAreas = (t) => [
  ...servicesMenu.map((service) => ({
    value: service.id,
    label: service.title,
    desc: service.tagline,
  })),
  {
    value: "other",
    label: t("consultation.areas.other"),
    desc: t("consultation.areas.otherDesc"),
  },
];

export default function BookACall() {
  const { t, language } = useLanguage();
  const areas = useMemo(() => buildAreas(t), [t]);

  const form = useConsultationForm({ areas, t });
  const {
    values,
    setField,
    blurField,
    errors,
    errorList,
    touched,
    validateAll,
    submitError,
    status,
    step,
    paymentAvailable,
    adapterName,
    paymentOffer,
    paymentError,
    paymentBusy: checkoutStarting,
    paymentOfferError,
    retryPaymentOffer,
    submitEnquiry,
    editDetails,
    payment,
    resolvePayment,
    startOver,
  } = form;

  const [paymentBusy, setPaymentBusy] = useState(false);
  const isPaymentBusy = paymentBusy || checkoutStarting;
  const stepHeadingRef = useRef(null);
  const formRef = useRef(null);

  const areaLabel = useMemo(() => {
    const found = areas.find((a) => a.value === values.areaOfInterest);
    return found ? found.label : t("consultation.areas.other");
  }, [areas, values.areaOfInterest, t]);

  const errorMessages = useMemo(() => {
    const map = {};
    for (const item of errorList) {
      map[item.key] = t(item.key);
    }
    return map;
  }, [errorList, t]);

  useEffect(() => {
    if (stepHeadingRef.current) stepHeadingRef.current.focus();
  }, [step]);

  const scrollToForm = useCallback(() => {
    const node = formRef.current;
    if (!node) return;

    node.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });

    window.setTimeout(() => {
      const first = document.getElementById("cs-name");
      if (first) first.focus({ preventScroll: true });
    }, 320);
  }, []);

  const handleSubmit = useCallback(() => {
    const found = validateAll();
    if (Object.keys(found).length > 0) return;
    submitEnquiry();
  }, [validateAll, submitEnquiry]);

  const handleSimulate = useCallback(
    async (outcome) => {
      setPaymentBusy(true);
      try {
        await resolvePayment(outcome);
      } finally {
        setPaymentBusy(false);
      }
    },
    [resolvePayment]
  );

  const handleTryAgain = useCallback(() => {
    form.setStep(STEPS.PAYMENT);
  }, [form]);

  const priceLabel = useMemo(() => {
    if (!paymentOffer) return null;

    return new Intl.NumberFormat(language, {
      style: "currency",
      currency: paymentOffer.currency,
    }).format(paymentOffer.amountMinor / 100);
  }, [language, paymentOffer]);

  const isPaidFlow = consultationOffer.isPaid && paymentAvailable;

  const onConfirmation =
    step === STEPS.CONFIRMATION &&
    (isPaidFlow ? payment?.outcome !== undefined : status === "submitted");

  return (
    <>
      <Helmet>
        <title>{t("consultation.meta.title")}</title>

        <meta
          name="description"
          content={t("consultation.meta.description")}
        />

        <link
          rel="canonical"
          href="https://www.systemaops.com/book-a-call"
        />
      </Helmet>

      <p className="cs-sr-only" aria-live="polite">
        {t(`consultation.steps.${step}Announced`)}
      </p>

      <div className="cs-page">
        <section
          className="cs-container cs-layout"
          aria-labelledby="cs-page-heading"
        >
          <div className="cs-intro">
            <span className="cs-eyebrow">
              {t("consultation.hero.eyebrow")}
            </span>

            <h1 id="cs-page-heading" className="cs-h1">
              {t("consultation.hero.heading")}
            </h1>

            <p className="cs-lede">{t("consultation.hero.sub")}</p>

            <div className="cs-hero-actions">
              <button
                type="button"
                className="cs-btn cs-btn--primary"
                onClick={scrollToForm}
              >
                {t("consultation.hero.primary")}
                <ArrowRight size={17} aria-hidden="true" />
              </button>

              <Link to="/contact" className="cs-text-link">
                {t("consultation.hero.secondary")}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className="cs-expect">
              <p className="cs-expect-title">
                {t("consultation.hero.expectTitle")}
              </p>

              <ol className="cs-expect-list">
                {["one", "two", "three"].map((key, index) => (
                  <li key={key} className="cs-expect-item">
                    <span className="cs-expect-num" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span>{t(`consultation.hero.expect.${key}`)}</span>
                  </li>
                ))}
              </ol>

              <p className="cs-intro-note">
                {t("consultation.panel.footnote")}
              </p>
            </div>
          </div>

          <div
            ref={formRef}
            id="consultation-form"
            className="cs-form-column"
          >
            {step === STEPS.DETAILS && (
              <ConsultationForm
                areas={areas}
                values={values}
                errors={errors}
                errorList={errorList}
                touched={touched}
                submitError={submitError}
                status={status}
                paymentRequired={isPaidFlow}
                priceLabel={priceLabel}
                paymentOfferError={paymentOfferError}
                onRetryOffer={retryPaymentOffer}
                onChange={setField}
                onBlur={blurField}
                onSubmit={handleSubmit}
                errorMessages={errorMessages}
                t={t}
              />
            )}

            {step === STEPS.PAYMENT && paymentAvailable && (
              adapterName === "mock" ? (
                <MockCheckout
                  summary={{ areaLabel, email: values.email }}
                  busy={isPaymentBusy}
                  onSimulate={handleSimulate}
                  onBack={editDetails}
                  t={t}
                />
              ) : (
                <StripeCheckout
                  busy={isPaymentBusy}
                  offer={paymentOffer}
                  offerError={paymentOfferError}
                  paymentError={paymentError}
                  onRetryOffer={retryPaymentOffer}
                  onStart={() => handleSimulate(PAYMENT_OUTCOME.SUCCESS)}
                  t={t}
                />
              )
            )}

            {onConfirmation && (
              isPaidFlow ? (
                <MockResult
                  payment={payment}
                  onTryAgain={handleTryAgain}
                  onBack={editDetails}
                  t={t}
                />
              ) : (
                <section
                  className="cs-result"
                  aria-labelledby="cs-confirm-heading"
                >
                  <span
                    className="cs-result-icon cs-result-icon--ok"
                    aria-hidden="true"
                  >
                    <CheckCircle2 size={26} />
                  </span>

                  <h2
                    id="cs-confirm-heading"
                    ref={stepHeadingRef}
                    tabIndex={-1}
                    className="cs-step-heading"
                  >
                    {t("consultation.confirm.heading")}
                  </h2>

                  <p className="cs-step-text">
                    {t("consultation.confirm.text")}
                  </p>

                  <p className="cs-step-text cs-muted">
                    {t(
                      `consultation.confirm.next.${consultationOffer.mode}`
                    )}
                  </p>

                  <div className="cs-actions">
                    <Link to="/" className="cs-btn cs-btn--ghost">
                      {t("consultation.confirm.home")}
                    </Link>

                    <button
                      type="button"
                      className="cs-btn cs-btn--primary"
                      onClick={startOver}
                    >
                      {t("consultation.confirm.startOver")}
                    </button>
                  </div>
                </section>
              )
            )}
          </div>
        </section>
      </div>

      {consultationOffer.isDevScenario && (
        <div className="cs-devbar" role="note">
          {t("consultation.mock.devNotice")}
        </div>
      )}
    </>
  );
}
