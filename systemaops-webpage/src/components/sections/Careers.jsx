import "./Careers.css";

import { Helmet } from "react-helmet-async";

import {
  Heart,
  Users,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  X,
  FileText,
  Link2,
  ChevronDown,
  ExternalLink,
  Search,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";


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

const ROLES = [
  "General Application",
  "Frontend Developer",
  "Automation Engineer",
  "UI/UX Designer",
  "Backend Developer",
  "AI / ML Engineer",
  "DevOps Engineer",
  "Business Development",
];


/* =========================================================
   EXTRA STYLES
   These styles are used by the application modal and
   How We Care section.
   ========================================================= */

const EXTRA = `
  /* =======================================================
     APPLICATION OVERLAY
  ======================================================= */

  .apply-overlay {
    position: fixed;
    inset: 0;
    z-index: 9000;

    background: rgba(var(--shadow-rgb), 0.35);

    backdrop-filter: blur(12px);

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 20px;
  }


  /* =======================================================
     APPLICATION MODAL
  ======================================================= */

  .apply-modal {
    width: 100%;
    max-width: 680px;

    max-height: 92vh;
    overflow-y: auto;

    border-radius: 28px;

    background: var(--bg-surface);

    border: 1px solid var(--border);

    padding: 44px 48px;

    position: relative;

    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;

    box-shadow:
      0 32px 80px rgba(var(--shadow-rgb), 0.16);
  }


  .apply-modal-close {
    position: absolute;

    top: 20px;
    right: 20px;

    width: 36px;
    height: 36px;

    border-radius: 50%;

    background: var(--bg-secondary);

    border: 1px solid var(--border);

    color: var(--text-muted);

    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    transition:
      background .2s ease,
      color .2s ease;
  }


  .apply-modal-close:hover {
    background: var(--accent-soft);
    color: var(--accent-primary);
  }


  .apply-modal h2 {
    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    font-size: 1.9rem;

    font-weight: 700;

    color: var(--text-primary);

    letter-spacing: -.055em;

    line-height: 1.05;

    margin: 0 0 6px;
  }


  .apply-modal-sub {
    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    font-size: 14px;

    font-weight: 400;

    color: var(--text-muted);

    letter-spacing: -.015em;

    line-height: 1.7;

    margin: 0 0 32px;
  }


  /* =======================================================
     FORM
  ======================================================= */

  .af-row {
    display: grid;

    grid-template-columns:
      1fr 1fr;

    gap: 14px;
  }


  .af-group {
    display: flex;

    flex-direction: column;

    gap: 7px;

    margin-bottom: 14px;
  }


  .af-label {
    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    font-size: 11px;

    font-weight: 700;

    letter-spacing: .16em;

    text-transform: uppercase;

    color: var(--text-muted);
  }


  .af-input,
  .af-select,
  .af-textarea {
    width: 100%;

    border: 1px solid var(--border);

    background: var(--bg-surface-soft);

    border-radius: 14px;

    padding: 13px 16px;

    color: var(--text-primary);

    font-size: 14px;

    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    outline: none;

    letter-spacing: -.015em;

    transition:
      border-color .2s ease,
      background .2s ease,
      box-shadow .2s ease;
  }


  .af-input:focus,
  .af-select:focus,
  .af-textarea:focus {
    border-color: rgba(var(--accent-rgb), .45);

    background: var(--bg-surface);

    box-shadow:
      0 0 0 4px rgba(var(--accent-rgb), .08);
  }


  .af-input::placeholder,
  .af-textarea::placeholder {
    color: var(--input-placeholder);
  }


  .af-select {
    appearance: none;

    cursor: pointer;
  }


  .af-select option {
    background: var(--bg-surface);

    color: var(--text-primary);
  }


  .af-select-wrap {
    position: relative;
  }


  .af-select-wrap > svg {
    position: absolute;

    right: 14px;
    top: 50%;

    transform:
      translateY(-50%);

    color: var(--text-muted);

    pointer-events: none;
  }


  .af-textarea {
    resize: vertical;

    min-height: 100px;
  }


  /* =======================================================
     PHONE
  ======================================================= */

  .af-phone-row {
    display: flex;

    gap: 10px;

    align-items: stretch;
  }


  .af-phone-row .af-input {
    flex: 1;
  }


  .acd-wrap {
    position: relative;

    flex-shrink: 0;

    width: 118px;
  }


  .acd-trigger {
    width: 100%;

    min-height: 50px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 6px;

    padding: 0 11px;

    border: 1px solid var(--border);

    border-radius: 14px;

    background: var(--bg-surface-soft);

    color: var(--text-primary);

    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    cursor: pointer;
  }


  .acd-trigger-inner {
    display: flex;

    align-items: center;

    gap: 7px;

    min-width: 0;
  }


  .acd-code {
    font-size: 13px;

    font-weight: 700;

    color: var(--text-primary);

    white-space: nowrap;
  }


  .acd-chevron {
    color: var(--text-muted);

    flex-shrink: 0;
  }


  .acd-chevron.acd-open {
    transform: rotate(180deg);
  }


  .acd-panel {
    position: absolute;

    top: calc(100% + 8px);

    left: 0;

    width: 300px;

    z-index: 9999;

    border-radius: 20px;

    border: 1px solid var(--border);

    background: var(--bg-surface);

    box-shadow:
      0 24px 60px rgba(var(--shadow-rgb), .14);

    overflow: hidden;
  }


  .acd-search-wrap {
    display: flex;

    align-items: center;

    gap: 10px;

    padding: 12px 14px;

    border-bottom: 1px solid var(--border-soft);
  }


  .acd-search-icon {
    color: var(--text-muted);

    flex-shrink: 0;
  }


  .acd-search {
    flex: 1;

    background: transparent;

    border: none;

    outline: none;

    color: var(--text-primary);

    font-size: 13px;

    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;
  }


  .acd-search::placeholder {
    color: var(--input-placeholder);
  }


  .acd-list {
    max-height: 240px;

    overflow-y: auto;

    padding: 6px 0;
  }


  .acd-item {
    display: flex;

    align-items: center;

    gap: 12px;

    padding: 9px 16px;

    cursor: pointer;

    transition:
      background .2s ease;
  }


  .acd-item:hover,
  .acd-item.acd-active {
    background: var(--accent-soft);
  }


  .acd-item-name {
    flex: 1;

    font-size: 13px;

    font-weight: 500;

    color: var(--text-secondary);

    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;
  }


  .acd-item-code {
    font-size: 12px;

    font-weight: 700;

    color: var(--accent-primary);
  }


  .acd-empty {
    padding: 28px 16px;

    text-align: center;

    color: var(--text-muted);

    font-size: 13px;
  }


  .acd-section-label {
    padding: 8px 16px 4px;

    font-size: 10px;

    font-weight: 700;

    letter-spacing: .14em;

    text-transform: uppercase;

    color: var(--input-placeholder);
  }


  .af-counter {
    text-align: right;

    font-size: 11px;

    color: var(--input-placeholder);

    margin-top: 4px;
  }


  /* =======================================================
     SUBMIT
  ======================================================= */

  .af-submit-row {
    display: flex;

    align-items: center;

    gap: 14px;

    margin-top: 8px;
  }


  .af-hint {
    font-size: 12px;

    color: var(--text-muted);

    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;
  }


  .af-error {
    font-size: 13px;

    color: var(--error);

    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    margin-top: 6px;
  }


  .af-privacy {
    display: flex;

    gap: 10px;

    align-items: flex-start;

    font-size: 13px;

    line-height: 1.6;

    color: var(--text-secondary);

    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    margin-top: 4px;

    cursor: pointer;
  }


  .af-privacy input {
    margin-top: 3px;

    width: 16px;

    height: 16px;

    flex-shrink: 0;

    accent-color: var(--brand-primary);
  }


  .af-privacy a {
    color: var(--brand-deep);

    font-weight: 600;
  }


  [data-theme="dark"] .af-privacy a {
    color: var(--brand-secondary);
  }


  /* =======================================================
     SUCCESS
  ======================================================= */

  .af-success {
    text-align: center;

    padding: 20px 0 8px;
  }


  .af-success-icon {
    width: 72px;
    height: 72px;

    border-radius: 50%;

    background: var(--accent-soft);

    border: 1px solid var(--border);

    display: flex;

    align-items: center;

    justify-content: center;

    margin: 0 auto 24px;

    color: var(--accent-primary);
  }


  .af-success h3 {
    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    font-size: 1.6rem;

    font-weight: 700;

    color: var(--text-primary);

    letter-spacing: -.055em;

    margin: 0 0 10px;
  }


  .af-success p {
    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    font-size: 14px;

    color: var(--text-secondary);

    line-height: 1.7;

    letter-spacing: -.015em;

    margin: 0;
  }


  /* =======================================================
     NO OPENINGS
  ======================================================= */

  .no-openings-card {
    max-width: 620px;

    margin: 0 auto 100px;

    background: var(--bg-surface);

    border: 1px solid var(--border);

    border-radius: 32px;

    padding: 64px 56px;

    text-align: center;

    display: flex;

    flex-direction: column;

    align-items: center;

    box-shadow:
      0 10px 30px rgba(var(--shadow-rgb), .04);
  }


  .no-openings-icon {
    width: 72px;
    height: 72px;

    border-radius: 50%;

    background: var(--accent-soft);

    border: 1px solid var(--border);

    display: flex;

    align-items: center;

    justify-content: center;

    color: var(--accent-primary);

    margin-bottom: 28px;
  }


  .no-openings-card h2 {
    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    font-size:
      clamp(1.8rem, 4vw, 2.4rem);

    font-weight: 700;

    color: var(--text-primary);

    letter-spacing: -.055em;

    line-height: 1.05;

    margin: 0 0 16px;
  }


  .no-openings-card p {
    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    font-size: 15px;

    font-weight: 400;

    color: var(--text-secondary);

    letter-spacing: -.015em;

    line-height: 1.7;

    margin: 0 0 40px;

    max-width: 440px;
  }


  .no-openings-actions {
    display: flex;

    flex-direction: column;

    align-items: center;

    gap: 16px;

    width: 100%;
  }


  .linkedin-link {
    display: inline-flex;

    align-items: center;

    gap: 8px;

    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    font-size: 13px;

    font-weight: 600;

    color: var(--text-muted);

    text-decoration: none;

    letter-spacing: .04em;

    padding: 6px 0;

    transition:
      color .2s ease;
  }


  .linkedin-link:hover {
    color: var(--accent-primary);
  }


  /* =======================================================
     HOW WE CARE
     THIS WAS THE MAIN VISIBILITY PROBLEM
  ======================================================= */

  .how-we-care {
    max-width: 720px;

    margin: 0 auto 0;

    background: var(--bg-surface);

    border: 1px solid var(--border);

    border-radius: 32px;

    padding: 64px 56px;

    text-align: center;

    box-shadow:
      0 10px 30px rgba(var(--shadow-rgb), .04);
  }


  .hwc-icon {
    width: 56px;
    height: 56px;

    border-radius: 16px;

    background: var(--accent-soft);

    border: 1px solid var(--border);

    display: flex;

    align-items: center;

    justify-content: center;

    color: var(--accent-primary);

    margin: 0 auto 24px;
  }


  .how-we-care h2 {
    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    font-size:
      clamp(1.6rem, 3.5vw, 2.2rem);

    font-weight: 700;

    color: var(--text-primary) !important;

    -webkit-text-fill-color: var(--text-primary) !important;

    background: none !important;

    letter-spacing: -.055em;

    line-height: 1.05;

    margin: 0 0 16px;
  }


  .how-we-care > p {
    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    font-size: 15px;

    font-weight: 400;

    color: var(--text-secondary) !important;

    letter-spacing: -.015em;

    line-height: 1.7;

    margin: 0 auto 36px;

    max-width: 480px;
  }


  .hwc-tags {
    display: flex;

    justify-content: center;

    flex-wrap: wrap;

    gap: 12px;
  }


  .hwc-tag {
    display: flex;

    align-items: center;

    gap: 8px;

    background: var(--bg-secondary);

    border: 1px solid var(--border);

    padding: 10px 20px;

    border-radius: 999px;

    font-family:
      'Space Grotesk',
      'Plus Jakarta Sans',
      sans-serif;

    font-size: 14px;

    font-weight: 600;

    color: var(--accent-primary) !important;

    letter-spacing: -.015em;

    line-height: 1.7;
  }


  .hwc-tag svg {
    color: var(--accent-primary) !important;

    stroke: var(--accent-primary) !important;
  }


  /* =======================================================
     DIVIDER
  ======================================================= */

  .careers-divider {
    display: none !important;
  }


  /* =======================================================
     MOBILE MODAL
  ======================================================= */

  @media(max-width: 600px) {

    .af-row {
      grid-template-columns: 1fr;
    }

    .apply-modal {
      padding: 32px 22px;
    }

    .no-openings-card,
    .how-we-care {
      padding: 44px 28px;
    }

  }
`;


/* =========================================================
   FLAG IMAGE
========================================================= */

const FlagImg = ({
  iso2,
  size = 24,
  style = {},
}) => (
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
      boxShadow: "0 1px 4px rgba(var(--shadow-rgb),.12)",
      flexShrink: 0,
      ...style,
    }}
  />
);


/* =========================================================
   COUNTRY DROPDOWN
========================================================= */

function CountryDropdown({
  selected,
  onChange,
}) {
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  const filtered = COUNTRY_CODES.filter(
    (country) =>
      country.country
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      country.code.includes(search),
  );


  useEffect(() => {
    const handler = (event) => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(event.target)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener(
      "mousedown",
      handler,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handler,
      );
  }, []);


  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);


  const select = (country) => {
    onChange(country);

    setOpen(false);
    setSearch("");
  };


  return (
    <div
      className="acd-wrap"
      ref={wrapRef}
    >
      <button
        type="button"
        className={`acd-trigger${
          open ? " acd-open" : ""
        }`}
        onClick={() =>
          setOpen((value) => !value)
        }
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="acd-trigger-inner">
          <FlagImg
            iso2={selected.iso2}
            size={22}
          />

          <span className="acd-code">
            {selected.code}
          </span>
        </span>

        <ChevronDown
          size={13}
          className={`acd-chevron${
            open ? " acd-open" : ""
          }`}
        />
      </button>


      {open && (
        <div
          className="acd-panel"
          role="listbox"
        >
          <div className="acd-search-wrap">

            <Search
              size={13}
              className="acd-search-icon"
            />

            <input
              ref={searchRef}
              className="acd-search"
              placeholder={t(
                "careers.placeholders.search",
              )}
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>


          <div className="acd-list">

            {filtered.length === 0 ? (
              <div className="acd-empty">
                {t("careers.noResults")}
              </div>
            ) : (
              <>
                {!search && (
                  <div className="acd-section-label">
                    {t(
                      "careers.allCountries",
                    )}
                  </div>
                )}

                {filtered.map((country) => (
                  <div
                    key={`${country.country}-${country.code}`}
                    className={`acd-item${
                      selected.country ===
                      country.country
                        ? " acd-active"
                        : ""
                    }`}
                    role="option"
                    aria-selected={
                      selected.country ===
                      country.country
                    }
                    onClick={() =>
                      select(country)
                    }
                  >

                    <FlagImg
                      iso2={country.iso2}
                      size={26}
                    />

                    <span className="acd-item-name">
                      {country.country}
                    </span>

                    <span className="acd-item-code">
                      {country.code}
                    </span>

                  </div>
                ))}
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}


/* =========================================================
   APPLICATION MODAL
========================================================= */

function ApplyModal({
  onClose,
}) {
  const { t } = useLanguage();

  const [loading, setLoading] =
    useState(false);

  const [done, setDone] =
    useState(false);

  const [error, setError] =
    useState("");

  const [privacyAccepted, setPrivacyAccepted] =
    useState(false);

  const [privacyError, setPrivacyError] =
    useState("");

  const [why, setWhy] =
    useState("");

  const [selectedCountry, setSelectedCountry] =
    useState(COUNTRY_CODES[0]);

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [form, setForm] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      role: ROLES[0],
      linkedin: "",
      portfolio: "",
      resumeUrl: "",
    });


  const set = (key) => (event) =>
    setForm((previous) => ({
      ...previous,
      [key]: event.target.value,
    }));


  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault();

    setError("");
    setPrivacyError("");

    if (!privacyAccepted) {
      setPrivacyError(
        t("privacy.required"),
      );

      return;
    }


    if (!phoneNumber.trim()) {
      setError(
        t("careers.errors.phoneRequired"),
      );

      return;
    }


    const digits =
      phoneNumber.replace(/\D/g, "");


    if (
      digits.length !==
      selectedCountry.digits
    ) {
      setError(
        t(
          "careers.errors.phoneDigits",
          {
            country:
              selectedCountry.country,
            digits:
              selectedCountry.digits,
          },
        ),
      );

      return;
    }


    if (!form.linkedin.trim()) {
      setError(
        t("careers.errors.linkedin"),
      );

      return;
    }


    if (!form.resumeUrl.trim()) {
      setError(
        t("careers.errors.resume"),
      );

      return;
    }


    setLoading(true);


    try {
      const response =
        await fetch(
          "/api/careers/apply",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ...form,

              phone:
                `${selectedCountry.code}${digits}`,

              whyUs: why,
              privacyAccepted: true,
              privacyVersion: t("privacy.version"),
            }),
          },
        );


      const data =
        await response.json();


      if (data.success) {
        setDone(true);
      } else {
        setError(
          data.message ||
            t(
              "careers.errors.generic",
            ),
        );
      }

    } catch {
      setError(
        t("careers.errors.server"),
      );
    }


    setLoading(false);
  };


  return (
    <div
      className="apply-overlay"
      onClick={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="apply-modal">

        <button
          className="apply-modal-close"
          onClick={onClose}
        >
          <X size={16} />
        </button>


        {done ? (
          <div className="af-success">

            <div className="af-success-icon">
              <CheckCircle2 size={32} />
            </div>

            <h3>
              {t(
                "careers.successTitle",
              )}
            </h3>

            <p>
              {t(
                "careers.successText",
              )}
            </p>

          </div>
        ) : (
          <>

            <h2>
              {t(
                "careers.modalTitle",
              )}
            </h2>

            <p className="apply-modal-sub">
              {t(
                "careers.modalSub",
              )}
            </p>


            <form
              onSubmit={handleSubmit}
            >

              <div className="af-row">

                <div className="af-group">

                  <label className="af-label">
                    {t(
                      "careers.labels.firstName",
                    )}
                  </label>

                  <input
                    className="af-input"
                    placeholder={t(
                      "careers.placeholders.firstName",
                    )}
                    value={
                      form.firstName
                    }
                    onChange={set(
                      "firstName",
                    )}
                    required
                  />

                </div>


                <div className="af-group">

                  <label className="af-label">
                    {t(
                      "careers.labels.lastName",
                    )}
                  </label>

                  <input
                    className="af-input"
                    placeholder={t(
                      "careers.placeholders.lastName",
                    )}
                    value={
                      form.lastName
                    }
                    onChange={set(
                      "lastName",
                    )}
                    required
                  />

                </div>

              </div>


              <div className="af-group">

                <label className="af-label">
                  {t(
                    "careers.labels.email",
                  )}
                </label>

                <input
                  className="af-input"
                  type="email"
                  placeholder={t(
                    "careers.placeholders.email",
                  )}
                  value={form.email}
                  onChange={set("email")}
                  required
                />

              </div>


              <div className="af-group">

                <label className="af-label">
                  {t(
                    "careers.labels.phone",
                  )}
                </label>

                <div className="af-phone-row">

                  <CountryDropdown
                    selected={
                      selectedCountry
                    }
                    onChange={(
                      country,
                    ) => {
                      setSelectedCountry(
                        country,
                      );

                      setPhoneNumber(
                        "",
                      );
                    }}
                  />

                  <input
                    className="af-input"
                    type="tel"
                    placeholder={`${
                      selectedCountry.digits
                    }-${t(
                      "careers.placeholders.phoneDigits",
                    )}`}
                    value={
                      phoneNumber
                    }
                    onChange={(event) =>
                      setPhoneNumber(
                        event.target.value.replace(
                          /\D/g,
                          "",
                        ),
                      )
                    }
                    maxLength={
                      selectedCountry.digits
                    }
                    required
                  />

                </div>

              </div>


              <div className="af-group">

                <label className="af-label">
                  {t(
                    "careers.labels.role",
                  )}
                </label>

                <div className="af-select-wrap">

                  <select
                    className="af-select"
                    value={form.role}
                    onChange={set("role")}
                  >

                    {ROLES.map(
                      (
                        role,
                        index,
                      ) => (
                        <option
                          key={role}
                          value={role}
                        >
                          {t(
                            "careers.roles",
                          )[index]}
                        </option>
                      ),
                    )}

                  </select>

                  <ChevronDown
                    size={15}
                  />

                </div>

              </div>


              <div className="af-row">

                <div className="af-group">

                  <label className="af-label">
                    {t(
                      "careers.labels.linkedin",
                    )}
                  </label>

                  <div
                    style={{
                      position:
                        "relative",
                    }}
                  >

                    <Link2
                      size={14}
                      style={{
                        position:
                          "absolute",

                        left: 14,

                        top: "50%",

                        transform:
                          "translateY(-50%)",

                        color:
                          "var(--text-muted)",
                      }}
                    />

                    <input
                      className="af-input"
                      style={{
                        paddingLeft: 36,
                      }}
                      placeholder={t(
                        "careers.placeholders.linkedin",
                      )}
                      value={
                        form.linkedin
                      }
                      onChange={set(
                        "linkedin",
                      )}
                      required
                    />

                  </div>

                </div>


                <div className="af-group">

                  <label className="af-label">
                    {t(
                      "careers.labels.portfolio",
                    )}
                  </label>

                  <div
                    style={{
                      position:
                        "relative",
                    }}
                  >

                    <Link2
                      size={14}
                      style={{
                        position:
                          "absolute",

                        left: 14,

                        top: "50%",

                        transform:
                          "translateY(-50%)",

                        color:
                          "var(--text-muted)",
                      }}
                    />

                    <input
                      className="af-input"
                      style={{
                        paddingLeft: 36,
                      }}
                      placeholder={t(
                        "careers.placeholders.portfolio",
                      )}
                      value={
                        form.portfolio
                      }
                      onChange={set(
                        "portfolio",
                      )}
                    />

                  </div>

                </div>

              </div>


              <div className="af-group">

                <label className="af-label">

                  {t(
                    "careers.labels.why",
                  )}{" "}

                  <span
                    style={{
                      color:
                        "var(--input-placeholder)",

                      fontWeight: 400,

                      textTransform:
                        "none",

                      letterSpacing: 0,
                    }}
                  >
                    {t(
                      "careers.labels.whyHint",
                    )}
                  </span>

                </label>


                <textarea
                  className="af-textarea"
                  placeholder={t(
                    "careers.placeholders.why",
                  )}
                  maxLength={400}
                  value={why}
                  onChange={(event) =>
                    setWhy(
                      event.target.value,
                    )
                  }
                />


                <div className="af-counter">
                  {why.length} / 400
                </div>

              </div>


              <div className="af-group">

                <label className="af-label">
                  {t(
                    "careers.labels.resume",
                  )}
                </label>

                <div
                  style={{
                    position:
                      "relative",
                  }}
                >

                  <Link2
                    size={14}
                    style={{
                      position:
                        "absolute",

                      left: 14,

                      top: "50%",

                      transform:
                        "translateY(-50%)",

                      color:
                        "var(--text-muted)",
                    }}
                  />

                  <input
                    className="af-input"
                    style={{
                      paddingLeft: 36,
                    }}
                    placeholder={t(
                      "careers.placeholders.resume",
                    )}
                    value={
                      form.resumeUrl
                    }
                    onChange={set(
                      "resumeUrl",
                    )}
                    required
                  />

                </div>

              </div>


              <label className="af-privacy">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(event) => {
                    setPrivacyAccepted(
                      event.target.checked,
                    );
                    if (event.target.checked) {
                      setPrivacyError("");
                    }
                  }}
                  aria-required="true"
                />
                <span>
                  {t("privacy.consentNote")}{" "}
                  <a href="/privacy-policy">
                    {t("privacy.policyLink")}
                  </a>
                </span>
              </label>

              {privacyError && (
                <div className="af-error" role="alert">
                  {privacyError}
                </div>
              )}

              {error && (
                <div className="af-error">
                  {error}
                </div>
              )}


              <div className="af-submit-row">

                <button
                  className="applyBtn"
                  type="submit"
                  disabled={loading}
                  style={{
                    borderRadius: 14,

                    padding:
                      "0 28px",

                    height: 52,

                    opacity:
                      loading
                        ? 0.7
                        : 1,
                  }}
                >

                  {loading
                    ? t(
                        "careers.submitting",
                      )
                    : t(
                        "careers.submit",
                      )}

                  <ArrowRight
                    size={16}
                  />

                </button>


                <p className="af-hint">
                  {t(
                    "careers.hint",
                  )}
                </p>

              </div>

            </form>

          </>
        )}

      </div>

    </div>
  );
}


/* =========================================================
   CAREERS PAGE
========================================================= */

export default function Careers() {
  const { t } = useLanguage();

  const [showModal, setModal] =
    useState(false);


  return (
    <>

      <Helmet>

        <title>
          Careers | SystemaOps
        </title>

        <meta
          name="description"
          content="Explore career opportunities at SystemaOps. Join our team building AI Automation, Odoo ERP and Enterprise Software."
        />

        <link
          rel="canonical"
          href="https://www.systemaops.com/careers"
        />

      </Helmet>


      <main className="section">

        {/* Dynamic styles for modal + How We Care */}
        <style>{EXTRA}</style>


        {showModal && (
          <ApplyModal
            onClose={() =>
              setModal(false)
            }
          />
        )}


        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div
          className="aiBackground"
          aria-hidden="true"
        >

          <div className="orb1" />
          <div className="orb2" />
          <div className="orb3" />
          <div className="gridOverlay" />

        </div>


        <div className="container">


          {/* =================================================
              HERO
          ================================================= */}

          <header className="hero">



            <h1 className="heading">

              {t(
                "careers.heading",
              )}

              <br />

              <span>
                {t(
                  "careers.headingAccent",
                )}
              </span>

            </h1>


            <p className="description">
              {t(
                "careers.desc",
              )}
            </p>

          </header>


          {/* =================================================
              NO OPENINGS
          ================================================= */}

          <div className="no-openings-card">

            <div className="no-openings-icon">

              <FileText
                size={30}
              />

            </div>


            <h2>
              {t(
                "careers.noOpenings",
              )}
            </h2>


            <p>
              {t(
                "careers.noOpeningsText",
              )}
            </p>


            <div className="no-openings-actions">

              <button
                className="applyBtn"
                style={{
                  fontSize: "1rem",
                  padding: "14px 36px",
                  borderRadius: 999,
                }}
                onClick={() =>
                  setModal(true)
                }
              >

                {t(
                  "careers.applyGeneral",
                )}

                <ArrowRight
                  size={16}
                />

              </button>


              <a
                href="https://www.linkedin.com/company/systemaops/jobs/"
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin-link"
              >

                <ExternalLink
                  size={13}
                />

                {t(
                  "careers.linkedin",
                )}

              </a>

            </div>

          </div>


          {/* Divider removed by CSS */}
          <div className="careers-divider" />


          {/* =================================================
              HOW WE CARE
          ================================================= */}

          <section
            className="how-we-care"
            style={{
              marginTop: 48,
            }}
          >

            <div className="hwc-icon">

              <Heart
                size={24}
              />

            </div>


            <h2>
              {t(
                "careers.careTitle",
              )}
            </h2>


            <p>
              {t(
                "careers.careText",
              )}
            </p>


            <div className="hwc-tags">

              <div className="hwc-tag">

                <Users
                  size={15}
                />

                {t(
                  "careers.tags",
                )[0]}

              </div>


              <div className="hwc-tag">

                <Lightbulb
                  size={15}
                />

                {t(
                  "careers.tags",
                )[1]}

              </div>


              <div className="hwc-tag">

                <TrendingUp
                  size={15}
                />

                {t(
                  "careers.tags",
                )[2]}

              </div>

            </div>

          </section>

        </div>

      </main>

    </>
  );
}