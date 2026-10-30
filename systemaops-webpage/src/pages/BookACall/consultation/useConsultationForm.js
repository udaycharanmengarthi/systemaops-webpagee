/* ================================================================
   useConsultationForm — form state, validation and submission.
   All of the page's step state lives here so the components stay
   presentational and the logic stays testable.

   Step machine:
     details -> review -> [payment] -> confirmation
   `payment` only exists when the offer is paid AND a payment adapter
   is available in this build.
   ================================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  EMPTY_VALUES,
  FIELD_ORDER,
  toPayload,
  validateField,
  validateValues,
} from "./validation";
import { consultationService } from "./consultationService";
import {
  PAYMENT_OUTCOME,
  getPaymentAdapter,
} from "./paymentService";
import { consultationOffer } from "./offerConfig";
import { fetchPaymentOffer } from "./paymentOfferService";

export const STEPS = {
  DETAILS: "details",
  REVIEW: "review",
  PAYMENT: "payment",
  CONFIRMATION: "confirmation",
};

export function useConsultationForm({ areas, t }) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState(STEPS.DETAILS);
  const [status, setStatus] = useState("idle"); // idle | submitting | submitted
  const [submitError, setSubmitError] = useState(null);
  const [reference, setReference] = useState(null);
  const [payment, setPayment] = useState(null); // { outcome, reference, simulated }
  const [paymentError, setPaymentError] = useState(null);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentOffer, setPaymentOffer] = useState(null);
  const [paymentOfferError, setPaymentOfferError] = useState(null);
  const [offerRetry, setOfferRetry] = useState(0);

  /* Refs mirror state so the guards below can see the latest value
     within the same tick (double click / double Enter). */
  const statusRef = useRef(status);
  const paymentBusyRef = useRef(false);
  /* Server-generated enquiry id from POST /api/consultations. Mirrored in a
   * ref so the payment adapter always sees the latest value without the
   * step machine having to be rebuilt around it. */
  const consultationIdRef = useRef(null);

  const areaKeys = useMemo(() => areas.map((a) => a.value), [areas]);

  const adapter = useMemo(() => getPaymentAdapter(), []);
  const paymentAvailable =
    consultationOffer.isPaid && adapter.isAvailable();

  useEffect(() => {
    if (!paymentAvailable || adapter.name !== "stripe") return undefined;
    const controller = new AbortController();
    fetchPaymentOffer({ signal: controller.signal })
      .then((offer) => {
        if (!controller.signal.aborted) setPaymentOffer(offer);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setPaymentOffer(null);
          setPaymentOfferError(error?.message || "payments.errorGeneric");
        }
      });
    return () => controller.abort();
  }, [adapter, offerRetry, paymentAvailable]);

  const retryPaymentOffer = useCallback(() => {
    setPaymentOfferError(null);
    setOfferRetry((count) => count + 1);
  }, []);

  /* Which steps exist in this build. */
  const visibleSteps = useMemo(() => {
    const list = [
      { id: STEPS.DETAILS, labelKey: "consultation.steps.details" },
      { id: STEPS.REVIEW, labelKey: "consultation.steps.review" },
    ];

    if (paymentAvailable) {
      list.push({ id: STEPS.PAYMENT, labelKey: "consultation.steps.payment" });
    }

    list.push({
      id: STEPS.CONFIRMATION,
      labelKey: "consultation.steps.confirmation",
    });

    return list;
  }, [paymentAvailable]);

  const setField = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const blurField = useCallback(
    (field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const message = validateField(field, values, { areas: areaKeys });
      setErrors((prev) => {
        const next = { ...prev };
        if (message) next[field] = message;
        else delete next[field];
        return next;
      });
    },
    [values, areaKeys]
  );

  const validateAll = useCallback(() => {
    const found = validateValues(values, { areas: areaKeys });
    setErrors(found);
    setTouched(
      FIELD_ORDER.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );
    return found;
  }, [values, areaKeys]);

  const editDetails = useCallback(() => {
    setStep(STEPS.DETAILS);
  }, []);

  /* Submit the enquiry. Guards against duplicate submissions. */
  const submitEnquiry = useCallback(async () => {
    if (statusRef.current === "submitting") return null;
    statusRef.current = "submitting";
    setStatus("submitting");
    setSubmitError(null);
    setPaymentError(null);

    try {
      const result = await consultationService.submit(
        toPayload(values)
      );

      setStatus("submitted");
      statusRef.current = "submitted";
      /* The backend's own id, used to link a payment session to this
         enquiry. Never a client-generated value. */
      consultationIdRef.current = result?.id || null;

      /* Paid Stripe submissions continue directly to hosted Checkout.
         If checkout fails, the saved enquiry remains on the payment step
         so the visitor can retry without creating another consultation. */
      setStep(paymentAvailable ? STEPS.PAYMENT : STEPS.CONFIRMATION);

      if (paymentAvailable && adapter.name === "stripe") {
        let offer = paymentOffer;

        if (!offer) {
          try {
            offer = await fetchPaymentOffer();
            setPaymentOffer(offer);
            setPaymentOfferError(null);
          } catch (error) {
            setPaymentOfferError(
              error?.message?.startsWith("payments.")
                ? error.message
                : "payments.errorNetwork"
            );
            return result;
          }
        }

        paymentBusyRef.current = true;
        setPaymentBusy(true);
        try {
          await adapter.create({
            name: values.name,
            email: values.email,
            consultationId: consultationIdRef.current,
          });
        } catch (error) {
          setPaymentError(
            error?.message === "payments_not_configured"
              ? "payments.notConfigured"
              : error?.message === "checkout_failed"
                ? "payments.errorGeneric"
                : "payments.errorNetwork"
          );
        } finally {
          paymentBusyRef.current = false;
          setPaymentBusy(false);
        }
      }

      return result;
    } catch (error) {
      statusRef.current = "idle";
      setStatus("idle");
      setSubmitError(error?.reason || "server");
      return null;
    }
  }, [values, paymentAvailable, adapter, paymentOffer]);

  /* Simulated checkout result (Phase 1 mock adapter). */
  const resolvePayment = useCallback(
    async (outcome) => {
      if (paymentBusyRef.current) return;
      paymentBusyRef.current = true;
      setPaymentBusy(true);
      setPaymentError(null);

      try {
        if (outcome === PAYMENT_OUTCOME.SUCCESS) {
          const result = await adapter.create({
            /* Prefill only — never an amount, price or currency. */
            name: values.name,
            email: values.email,
            /* Server-generated enquiry id so the session is linked to this
               consultation and a repeat click reuses the open session. */
            consultationId: consultationIdRef.current,
          });
          if (adapter.name === "stripe") return result;
          setPayment(result);
          setReference(result?.reference);
        } else {
          setPayment({
            outcome,
            reference: null,
            simulated: true,
          });
        }
        setStep(STEPS.CONFIRMATION);
      } catch (error) {
        if (adapter.name === "stripe") {
          setPaymentError(
            error?.message === "payments_not_configured"
              ? "payments.notConfigured"
              : error?.message === "checkout_failed"
                ? "payments.errorGeneric"
                : "payments.errorNetwork"
          );
          return;
        }
        setPayment({ outcome: PAYMENT_OUTCOME.FAILED, reference: null, simulated: true });
        setStep(STEPS.CONFIRMATION);
      } finally {
        paymentBusyRef.current = false;
        setPaymentBusy(false);
      }
    },
    [adapter, values]
  );

  const startOver = useCallback(() => {
    setValues(EMPTY_VALUES);
    setErrors({});
    setTouched({});
    setPayment(null);
    setPaymentError(null);
    setPaymentOffer(null);
    setPaymentOfferError(null);
    setReference(null);
    setSubmitError(null);
    statusRef.current = "idle";
    setStatus("idle");
    consultationIdRef.current = null;
    setStep(STEPS.DETAILS);
  }, []);

  const errorList = useMemo(
    () =>
      FIELD_ORDER.filter((field) => errors[field]).map((field) => ({
        field,
        key: errors[field],
      })),
    [errors]
  );

  return {
    /* values */
    values,
    setField,
    blurField,
    areas,
    areaKeys,
    /* validation */
    errors,
    errorList,
    touched,
    validateAll,
    isValid: errorList.length === 0,
    /* step machine */
    step,
    setStep,
    visibleSteps,
    paymentAvailable,
    adapterName: adapter.name,
    paymentOffer,
    paymentError,
    paymentBusy,
    paymentOfferError,
    retryPaymentOffer,
    /* submission */
    status,
    submitError,
    submitEnquiry,
    editDetails,
    /* payment (Phase 1 mock) */
    payment,
    reference,
    resolvePayment,
    startOver,
    t,
  };
}

export default useConsultationForm;
