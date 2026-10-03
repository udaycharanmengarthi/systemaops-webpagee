import "./ContactUs.css";

import { Helmet } from "react-helmet-async";

import { useState, useRef, useEffect } from "react";
import {
  Mail,
  Clock,
  Building2,
  ArrowRight,
  ChevronDown,
  Search,
  Send,
} from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

/* ── SEND SOUND (Web Audio, no assets) ──
   One ~180ms soft blip on submit click only (user gesture,
   so autoplay policies are satisfied). Extremely quiet.
   Skipped when reduced motion is preferred. Failures are
   silent — sound is purely decorative. */
const playSendSound = () => {
  try {
    if (typeof window === "undefined") return;
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const Ctx =
      window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, t0);
    osc.frequency.exponentialRampToValueAtTime(880, t0 + 0.12);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.05, t0 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.2);
    osc.onended = () => {
      try {
        ctx.close();
      } catch {
        /* ignore */
      }
    };
  } catch {
    /* silent: sound is optional */
  }
};

/* ── COUNTRY DATA ── */
const COUNTRY_CODES = [
  { code: "+91", country: "India", iso2: "in", digits: 10 },
  { code: "+1", country: "USA", iso2: "us", digits: 10 },
  { code: "+1", country: "Canada", iso2: "ca", digits: 10 },
  { code: "+44", country: "UK", iso2: "gb", digits: 10 },
  { code: "+61", country: "Australia", iso2: "au", digits: 9 },
  { code: "+49", country: "Germany", iso2: "de", digits: 11 },
  { code: "+33", country: "France", iso2: "fr", digits: 9 },
  { code: "+81", country: "Japan", iso2: "jp", digits: 10 },
  { code: "+86", country: "China", iso2: "cn", digits: 11 },
  { code: "+971", country: "UAE", iso2: "ae", digits: 9 },
  { code: "+65", country: "Singapore", iso2: "sg", digits: 8 },
  { code: "+60", country: "Malaysia", iso2: "my", digits: 9 },
  { code: "+92", country: "Pakistan", iso2: "pk", digits: 10 },
  { code: "+880", country: "Bangladesh", iso2: "bd", digits: 10 },
  { code: "+94", country: "Sri Lanka", iso2: "lk", digits: 9 },
  { code: "+977", country: "Nepal", iso2: "np", digits: 10 },
  { code: "+55", country: "Brazil", iso2: "br", digits: 11 },
  { code: "+52", country: "Mexico", iso2: "mx", digits: 10 },
  { code: "+27", country: "South Africa", iso2: "za", digits: 9 },
  { code: "+234", country: "Nigeria", iso2: "ng", digits: 10 },
  { code: "+39", country: "Italy", iso2: "it", digits: 10 },
  { code: "+34", country: "Spain", iso2: "es", digits: 9 },
  { code: "+7", country: "Russia", iso2: "ru", digits: 10 },
  { code: "+82", country: "South Korea", iso2: "kr", digits: 10 },
  { code: "+62", country: "Indonesia", iso2: "id", digits: 11 },
  { code: "+66", country: "Thailand", iso2: "th", digits: 9 },
  { code: "+84", country: "Vietnam", iso2: "vn", digits: 9 },
  { code: "+63", country: "Philippines", iso2: "ph", digits: 10 },
  { code: "+20", country: "Egypt", iso2: "eg", digits: 10 },
  { code: "+254", country: "Kenya", iso2: "ke", digits: 9 },
];

const FlagImg = ({ iso2, size = 24 }) => (
  <img
    src={`https://flagcdn.com/w40/${iso2}.png`}
    srcSet={`https://flagcdn.com/w80/${iso2}.png 2x`}
    width={size}
    height={size * 0.67}
    alt={iso2}
    style={{
      borderRadius: 3,
      objectFit: "cover",
      display: "block",
      boxShadow: "0 1px 4px rgba(0,0,0,.45)",
      flexShrink: 0,
    }}
  />
);

function CountryDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  const filtered = COUNTRY_CODES.filter(
    (c) =>
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search),
  );

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const select = (c) => {
    onChange(c);
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      <style>{`
        .cd-wrap { position: relative; flex-shrink: 0; width: 116px; }
        .cd-trigger {
          width: 100%; min-height: 54px;
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          padding: 0 12px;
          border: 1px solid var(--input-border);
          border-radius: 18px;
          background: var(--input-bg);
          color: var(--text-primary);
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all .25s ease;
          user-select: none;
        }
        .cd-trigger:hover, .cd-trigger.cd-open {
          border-color: rgba(var(--accent-rgb), .42);
          background: var(--bg-surface-hover);
          box-shadow: 0 0 0 4px rgba(var(--accent-rgb), .08);
        }
        .cd-trigger:focus-visible, .cd-item:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }
        .cd-trigger-inner { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .cd-code { font-size: 13px; font-weight: 700; color: var(--text-primary); white-space: nowrap; }
        .cd-chevron { color: var(--text-muted); flex-shrink: 0; transition: transform .25s ease; }
        .cd-chevron.cd-open { transform: rotate(180deg); }
        .cd-panel {
          position: absolute; top: calc(100% + 8px); left: 0;
          width: 300px; z-index: 9999;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--menu-bg);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          animation: cd-in .18s ease;
        }
        @keyframes cd-in {
          from { opacity: 0; transform: translateY(-8px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cd-search-wrap {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px;
          border-bottom: 1px solid var(--border-soft);
          background: var(--menu-bg);
        }
        .cd-search-icon { color: var(--text-muted); flex-shrink: 0; }
        .cd-search {
          flex: 1; background: transparent; border: none; outline: none;
          color: var(--text-primary); font-size: 13px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .cd-search::placeholder { color: var(--input-placeholder); }
        .cd-list {
          max-height: 256px; overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(var(--accent-rgb), .35) transparent;
          padding: 6px 0;
        }
        .cd-list::-webkit-scrollbar { width: 4px; }
        .cd-list::-webkit-scrollbar-thumb { background: rgba(var(--accent-rgb), .35); border-radius: 4px; }
        .cd-item {
          display: flex; align-items: center; gap: 12px;
          padding: 9px 16px; cursor: pointer;
          transition: background .15s ease;
        }
        .cd-item:hover { background: var(--menu-hover); }
        .cd-item.cd-active { background: var(--menu-active); }
        .cd-item-name {
          flex: 1; font-size: 13px; font-weight: 500;
          color: var(--text-primary);
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cd-item.cd-active .cd-item-name { color: var(--text-primary); }
        .cd-item-code { font-size: 12px; font-weight: 700; color: var(--accent-primary); flex-shrink: 0; letter-spacing: .02em; }
        .cd-empty { padding: 28px 16px; text-align: center; color: var(--text-muted); font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .cd-section-label { padding: 8px 16px 4px; font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--text-muted); font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="cd-wrap" ref={wrapRef}>
        <button
          type="button"
          className={`cd-trigger${open ? " cd-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="cd-trigger-inner">
            <FlagImg iso2={selected.iso2} size={26} />
            <span className="cd-code">{selected.code}</span>
          </span>
          <ChevronDown
            size={14}
            className={`cd-chevron${open ? " cd-open" : ""}`}
          />
        </button>

        {open && (
          <div className="cd-panel">
            <div className="cd-search-wrap">
              <Search size={14} className="cd-search-icon" />
              <input
                ref={searchRef}
                className="cd-search"
                placeholder="Search country or dial code…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="cd-list" role="listbox" aria-label="Select country">
              {filtered.length === 0 ? (
                <div className="cd-empty">No results found</div>
              ) : (
                <>
                  {!search && (
                    <div className="cd-section-label">All Countries</div>
                  )}
                  {filtered.map((c) => (
                    <div
                      key={`${c.country}-${c.code}`}
                      className={`cd-item${selected.country === c.country ? " cd-active" : ""}`}
                      role="option"
                      aria-selected={selected.country === c.country}
                      tabIndex={0}
                      onClick={() => select(c)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          select(c);
                        }
                      }}
                    >
                      <FlagImg iso2={c.iso2} size={28} />
                      <span className="cd-item-name">{c.country}</span>
                      <span className="cd-item-code">{c.code}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function ContactUs() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyError, setPrivacyError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [flight, setFlight] = useState("idle");
  const flightTimers = useRef([]);

  useEffect(
    () => () => {
      flightTimers.current.forEach(clearTimeout);
      flightTimers.current = [];
    },
    []
  );

  const wait = (ms) =>
    new Promise((resolve) => {
      const id = setTimeout(resolve, ms);
      flightTimers.current.push(id);
    });

  const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;
  setFormError("");
  setPhoneError("");
  setPrivacyError("");

  if (!privacyAccepted) {
    setPrivacyError(t("privacy.required"));
    return;
  }

  const digits = formData.phone.replace(/\D/g, "");
  if (digits.length !== selectedCountry.digits) {
    setPhoneError(
      t("contact.phoneError", {
        country: selectedCountry.country,
        code: selectedCountry.code,
        digits: selectedCountry.digits,
      }),
    );
    return;
  }

  setLoading(true);
  setFlight("flying");
  playSendSound();
  const flightStartedAt = Date.now();

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email.trim(),
        phone: `${selectedCountry.code}${digits}`,
        company: formData.company.trim(),
        message: formData.message.trim(),
        privacyAccepted: true,
        privacyVersion: t("privacy.version"),
      }),
    });

    if (response.ok) {
      /* Sync with the flight (~1s): if the API is faster, hold
         the sending state for the remainder; if slower, the
         plane waits parked at the mailbox. */
      if (!prefersReducedMotion()) {
        const elapsed = Date.now() - flightStartedAt;
        if (elapsed < 950) await wait(950 - elapsed);
        setFlight("landed");
        await wait(250);
      }
      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
      setPrivacyAccepted(false);
    } else {
      setFlight("idle");
      setFormError(t("careers.errors.generic"));
    }
  } catch {
    setFlight("idle");
    setFormError(t("careers.errors.server"));
  } finally {
    setLoading(false);
  }
};

const handleSendAnother = () => {
  setSubmitted(false);
  setFlight("idle");
  setFormError("");
  setPhoneError("");
  setPrivacyError("");
};

return (
  <>
    <Helmet>
      <title>{t("contact.metaTitle")}</title>

      <meta
        name="description"
        content={t("contact.metaDesc")}
      />

      <link
        rel="canonical"
        href="https://www.systemaops.com/contact"
      />
    </Helmet>

    <main className="contact-section">
      <div className="contact-bg">
        <div className="grid-overlay" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="contact-container">
        {/* LEFT */}
        <section className="contact-left">
          <h1 className="contact-heading">
            {t("contact.heading")[0]}
            <br />
            <span>{t("contact.heading")[1]}</span>
            <br />
            {t("contact.heading")[2]}
            <br />
            {t("contact.heading")[3]}
          </h1>
          <p className="contact-description">
            {t("contact.desc")}
          </p>
          <div className="contact-info-wrapper">
            <div className="contact-info-card">
              <div className="contact-icon">
                <Mail size={22} />
              </div>
              <div className="contact-inline">
                <p>{t("contact.email")}</p>
                <a
                  href="mailto:info@systemaops.com"
                  className="cu-contact-link"
                >
                  info@systemaops.com
                </a>
              </div>
            </div>
            <div className="contact-info-card">
              <div className="contact-icon">
                <Clock size={22} />
              </div>
              <div className="contact-inline">
                <p>{t("contact.responseTime")}</p>
                <span>{t("contact.responseValue")}</span>
              </div>
            </div>
            <div className="contact-info-card">
              <div className="contact-icon">
                <Building2 size={22} />
              </div>
              <div className="contact-inline">
                <p>{t("contact.hoursTitle")}</p>
                <span>{t("contact.hoursValue")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="contact-form-card" aria-live="polite">
          <h2>{submitted ? t("contact.successTitle") : t("contact.formTitle")}</h2>
          <p className="contact-form-sub">
            {submitted ? t("contact.successText") : t("contact.formSub")}
          </p>

          {submitted ? (
            <div className="contact-success" role="status">
              <span className="contact-success-check" aria-hidden="true">
                <svg viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="24" />
                  <path d="M15 27l7 7 15-16" />
                </svg>
              </span>
              <button
                type="button"
                className="contact-again-btn"
                onClick={handleSendAnother}
              >
                {t("contact.sendAnother")}
              </button>
            </div>
          ) : (
          <form className="contact-form" onSubmit={handleSubmit} aria-busy={loading}>
            <div className="contact-row">
              <div className="contact-input-group">
                <label>{t("contact.firstName")}</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder={t("contact.placeholders.firstName")}
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-input-group">
                <label>{t("contact.lastName")}</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder={t("contact.placeholders.lastName")}
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="contact-input-group">
              <label>{t("contact.workEmail")}</label>
              <input
                type="email"
                name="email"
                placeholder={t("contact.placeholders.email")}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* ── PHONE WITH COUNTRY DROPDOWN ── */}
            <div className="contact-input-group">
              <label>{t("contact.phone")}</label>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "stretch" }}
              >
                <CountryDropdown
                  selected={selectedCountry}
                  onChange={(c) => {
                    setSelectedCountry(c);
                    setFormData((prev) => ({ ...prev, phone: "" }));
                  }}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder={`${selectedCountry.digits}-${t("contact.placeholders.phoneDigits")}`}
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, ""),
                    }));
                    if (phoneError) setPhoneError("");
                  }}
                  maxLength={selectedCountry.digits}
                  required
                  style={{ flex: 1 }}
                  aria-invalid={Boolean(phoneError)}
                  aria-describedby={phoneError ? "contact-phone-error" : undefined}
                />
              </div>
              {phoneError && (
                <p className="contact-error" role="alert" id="contact-phone-error">
                  {phoneError}
                </p>
              )}
            </div>

            <div className="contact-input-group">
              <label>{t("contact.company")}</label>
              <input
                type="text"
                name="company"
                placeholder={t("contact.placeholders.company")}
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-input-group">
              <label>{t("contact.details")}</label>
              <textarea
                rows="6"
                name="message"
                placeholder={t("contact.placeholders.details")}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <label className="contact-privacy">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => {
                  setPrivacyAccepted(e.target.checked);
                  if (e.target.checked) setPrivacyError("");
                }}
                aria-required="true"
              />
              <span>
                {t("privacy.consentNote")}{" "}
                <a href="/privacy-policy">{t("privacy.policyLink")}</a>
              </span>
            </label>
            {privacyError && (
              <p className="contact-error" role="alert">
                {privacyError}
              </p>
            )}
            {formError && (
              <p className="contact-error" role="alert">
                {formError}
              </p>
            )}

            <button
              type="submit"
              className={`contact-submit-btn${loading ? " is-loading" : ""}`}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="cu-spinner" aria-hidden="true" />
                  {t("contact.sending")}
                </>
              ) : (
                <>
                  {t("contact.submit")}
                  <ArrowRight size={18} aria-hidden="true" />
                </>
              )}
            </button>
          </form>
          )}
          {!submitted && flight !== "idle" && (
            <div
              className={`cu-flight${flight === "landed" ? " is-landed" : " is-flying"}`}
              aria-hidden="true"
            >
              <span className="cu-mailbox">
                <svg viewBox="0 0 64 56">
                  <rect x="8" y="22" width="48" height="26" rx="7" className="cu-mailbox-body" />
                  <rect x="25" y="30" width="14" height="4" rx="2" className="cu-mailbox-slot" />
                  <line x1="47" y1="22" x2="47" y2="10" className="cu-mailbox-pole" />
                  <rect x="47" y="4" width="12" height="8" rx="2" className="cu-mailbox-flag" />
                </svg>
              </span>
              <span className="cu-plane">
                <Send size={22} strokeWidth={2} />
              </span>
            </div>
          )}
        </section>
      </div>
    </main>
  </>
  );
}