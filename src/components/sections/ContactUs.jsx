import "./ContactUs.css";

import { Helmet } from "react-helmet-async";

import { useState, useRef, useEffect } from "react";
import {
  Mail,
  Clock,
  Building2,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Search,
} from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

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
  const [showToast, setShowToast] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
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

  const digits = formData.phone.replace(/\D/g, "");
  if (digits.length !== selectedCountry.digits) {
    alert(
      t("contact.phoneError", {
        country: selectedCountry.country,
        code: selectedCountry.code,
        digits: selectedCountry.digits,
      }),
    );
    return;
  }

  setLoading(true);

  try {
  const response = await fetch("/api/contact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    phone: `${selectedCountry.code}${digits}`,
    company: formData.company,
    message: formData.message,
  }),
});

    console.log("STATUS:", response.status);
    console.log("CONTENT TYPE:", response.headers.get("content-type"));

    const text = await response.text();

    console.log("RESPONSE:", text);

    if (response.ok) {
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 4000);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
    }
  } catch (error) {
    console.error("CONTACT FORM ERROR:", error);
  }

  setLoading(false);
};

return (
  <>
    <Helmet>
      <title>Contact Us | SystemaOps</title>

      <meta
        name="description"
        content="Contact SystemaOps for AI Automation, Odoo ERP, Workflow Automation, n8n Development and Enterprise Software Solutions."
      />

      <meta
        name="keywords"
        content="Contact SystemaOps, AI Automation, Odoo ERP, Workflow Automation"
      />

      <link
        rel="canonical"
        href="https://www.systemaops.com/contact"
      />
    </Helmet>

    <main className="contact-section">
      <div className={`premium-toast ${showToast ? "show-toast" : ""}`}>
        <CheckCircle2 size={22} />
        <div>
          <h4>{t("contact.toastTitle")}</h4>
          <p>{t("contact.toastText")}</p>
        </div>
      </div>

      <div className="contact-bg">
        <div className="grid-overlay" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="contact-container">
        {/* LEFT */}
        <section className="contact-left">
          <span className="contact-eyebrow">{t("contact.eyebrow")}</span>
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
                <p>Availability</p>
                <span>Mon – Fri | 9 AM – 6 PM IST</span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="contact-form-card">
          <h2>{t("contact.formTitle")}</h2>
          <p className="contact-form-sub">
            {t("contact.formSub")}
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  maxLength={selectedCountry.digits}
                  required
                  style={{ flex: 1 }}
                />
              </div>
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

            <button type="submit" className="contact-submit-btn">
              {loading ? t("contact.sending") : t("contact.submit")}
              <ArrowRight size={18} />
            </button>
          </form>
        </section>
      </div>
    </main>
  </>
  );
}