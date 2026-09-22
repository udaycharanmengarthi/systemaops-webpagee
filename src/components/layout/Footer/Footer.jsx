import { useEffect, useRef, useState } from "react";

import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
} from "react-icons/fa6";

import { Mail, MapPin, Sparkles, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../../../i18n/LanguageContext";
import logo from "../../../assets/systemaops-icon-color.svg";

import gdprLogo from "../../../assets/gdpr-badge.svg";
import hipaaLogo from "../../../assets/hipaa-badge.svg";
import soc2Logo from "../../../assets/soc2-badge.svg";
import isoLogo from "../../../assets/iso27001-badge.svg";

import "./Footer.css";

const data = {
  linkedinLink: "https://www.linkedin.com/company/107682944/",
  instaLink:
    "https://www.instagram.com/systemaops?igsh=MXB1b2ExMmJicWZ6eA==",
  facebookLink:
    "https://www.facebook.com/profile.php?id=61580745634197",
  twitterLink: "https://x.com/SystemaOpsTech",
  youtubeLink: "https://www.youtube.com/@SystemaOps-ai",

  contact: {
    email: "info@systemaops.com",
    address: "Remote / Global Operations",
  },

  company: {
    name: "SystemaOps",
    description:
      "AI automation, Odoo ERP, workflow automation and intelligent systems built to help businesses reduce manual work and scale operations faster.",
  },
};

const aboutLinks = [
  { text: "Home", href: "/" },
  { text: "Services", href: "/odoo-customization" },
  { text: "Careers", href: "/careers" },
  { text: "Contact Us", href: "/contact" },
];

const serviceLinks = [
  {
    text: "Odoo Customization",
    href: "/odoo-customization",
  },
  {
    text: "Business Workflow Automations",
    href: "/workflow-automation",
  },
  {
    text: "N8N Development",
    href: "/n8n-development",
  },
];

const helpfulLinks = [
  { text: "FAQs", href: "#" },
  { text: "Privacy Policy", href: "/privacy-policy" },
  {
    text: "Live Support",
    href: "#",
    hasIndicator: true,
  },
];

export default function Footer() {
  const { t } = useLanguage();

  const preferredSourceRef = useRef(null);
  const [preferredSourceReady, setPreferredSourceReady] =
    useState(false);

  /*
   * ============================================================
   * GOOGLE PREFERRED SOURCES
   * ============================================================
   *
   * Google provides a programmatic API for custom buttons.
   *
   * We load the official Google library manually and initialize
   * it when it becomes available.
   */

  useEffect(() => {
    let cancelled = false;

    const initializePreferredSource = () => {
      if (
        cancelled ||
        !preferredSourceRef.current
      ) {
        return;
      }

      if (
        window.PREFERRED_SOURCE &&
        Array.isArray(window.PREFERRED_SOURCE)
      ) {
        window.PREFERRED_SOURCE.push((preferredSource) => {
          if (cancelled) return;

          preferredSource.init({
            theme: "dark",
            lang: "en",
          });

          preferredSourceRef.current = preferredSource;

          setPreferredSourceReady(true);
        });

        return;
      }

      if (window.preferredSource) {
        window.preferredSource.init({
          theme: "dark",
          lang: "en",
        });

        preferredSourceRef.current =
          window.preferredSource;

        setPreferredSourceReady(true);

        return;
      }

      // Retry while Google's async script is loading.
      window.setTimeout(
        initializePreferredSource,
        100,
      );
    };

    const existingScript = document.querySelector(
      'script[src="https://news.google.com/swg/js/v1/publisher.js"]',
    );

    if (!existingScript) {
      const script =
        document.createElement("script");

      script.async = true;

      /*
       * IMPORTANT:
       *
       * "manual" prevents Google from automatically scanning
       * the DOM for the standard button.
       *
       * We are using our own SystemaOps button instead.
       */
      script.setAttribute(
        "preferred-sources-control",
        "manual",
      );

      script.src =
        "https://news.google.com/swg/js/v1/publisher.js";

      document.head.appendChild(script);
    }

    initializePreferredSource();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ============================================================
   * BUTTON CLICK
   * ============================================================
   */

  const handlePreferredSourceClick = () => {
    const preferredSource =
      preferredSourceRef.current;

    if (
      preferredSource &&
      typeof preferredSource.addPreferredSource ===
        "function"
    ) {
      preferredSource.addPreferredSource();
      return;
    }

    /*
     * Fallback:
     *
     * If Google's JS hasn't finished loading yet, open the
     * official Google source-preferences page directly.
     *
     * This means the button still has a useful action even
     * during a slow script load.
     */
    const currentSite =
      window.location.origin;

    const googlePreferencesUrl =
      `https://www.google.com/preferences/source?q=${encodeURIComponent(
        currentSite,
      )}`;

    window.open(
      googlePreferencesUrl,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <footer className="sys-footer">
      <div className="sys-footer-glow" />

      <div className="sys-footer-inner">
        {/* =====================================================
            MAIN FOOTER
        ====================================================== */}

        <div className="sys-footer-main-grid">
          {/* =================================================
              BRAND
          ================================================== */}

          <div className="sys-footer-brand-col">
            <div className="sys-footer-logo-group">
              <div className="sys-footer-logo-placeholder">
                <img
                  src={logo}
                  alt="SystemaOps Logo"
                  className="sys-footer-logo"
                />
              </div>

              <span className="sys-footer-brand-name">
                {data.company.name}
              </span>
            </div>

            <p className="sys-footer-desc">
              {t("footer.description")}
            </p>

            {/* SOCIALS */}

            <ul className="sys-footer-socials">
              <li>
                <a
                  href={data.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sys-social-icon-link linkedin"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className="sys-icon-svg" />
                </a>
              </li>

              <li>
                <a
                  href={data.instaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sys-social-icon-link instagram"
                  aria-label="Instagram"
                >
                  <FaInstagram className="sys-icon-svg" />
                </a>
              </li>

              <li>
                <a
                  href={data.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sys-social-icon-link facebook"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="sys-icon-svg" />
                </a>
              </li>

              <li>
                <a
                  href={data.twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sys-social-icon-link twitter"
                  aria-label="Twitter"
                >
                  <FaXTwitter className="sys-icon-svg" />
                </a>
              </li>
            </ul>
          </div>

          {/* =================================================
              LINKS
          ================================================== */}

          <div className="sys-footer-links-matrix">
            {/* NAVIGATION */}

            <div className="sys-links-column">
              <p className="sys-links-title">
                {t("footer.navigation")}
              </p>

              <ul className="sys-links-list">
                {aboutLinks.map(
                  ({ text, href }) => (
                    <li key={text}>
                      <a
                        href={href}
                        className="sys-footer-link"
                      >
                        {t(
                          `footer.links.${
                            text === "Contact Us"
                              ? "contact"
                              : text.toLowerCase()
                          }`,
                        )}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* SERVICES */}

            <div className="sys-links-column">
              <p className="sys-links-title">
                {t("footer.services")}
              </p>

              <ul className="sys-links-list">
                {serviceLinks.map(
                  ({ text, href }, index) => (
                    <li key={text}>
                      <a
                        href={href}
                        className="sys-footer-link"
                      >
                        {
                          [
                            t("footer.links.odoo"),
                            t(
                              "footer.links.workflow",
                            ),
                            t(
                              "footer.links.n8n",
                            ),
                          ][index]
                        }
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* RESOURCES */}

            <div className="sys-links-column">
              <p className="sys-links-title">
                {t("footer.resources")}
              </p>

              <ul className="sys-links-list">
                {helpfulLinks.map(
                  (
                    {
                      text,
                      href,
                      hasIndicator,
                    },
                    index,
                  ) => (
                    <li key={text}>
                      <a
                        href={href}
                        className="sys-footer-link flex-link"
                      >
                        <span>
                          {
                            [
                              t(
                                "footer.links.faqs",
                              ),
                              t(
                                "footer.links.privacy",
                              ),
                              t(
                                "footer.links.support",
                              ),
                            ][index]
                          }
                        </span>

                        {hasIndicator && (
                          <span className="sys-live-pulse-container">
                            <span className="sys-pulse-ping" />
                            <span className="sys-pulse-dot" />
                          </span>
                        )}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* CONTACT */}

            <div className="sys-links-column">
              <p className="sys-links-title">
                {t("footer.contact")}
              </p>

              <ul className="sys-links-list">
                <li>
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="sys-contact-row"
                  >
                    <Mail className="sys-contact-icon" />

                    <span className="sys-contact-text">
                      {data.contact.email}
                    </span>
                  </a>
                </li>

                <li>
                  <div className="sys-contact-row">
                    <MapPin className="sys-contact-icon" />

                    <address className="sys-footer-address">
                      {t("footer.address")}
                    </address>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* =====================================================
            GOOGLE PREFERRED SOURCE
        ====================================================== */}

        <section
          className="sys-preferred-source"
          aria-labelledby="preferred-source-title"
        >
          <div className="sys-preferred-source-content">
            <div className="sys-preferred-source-copy">
              <div className="sys-preferred-source-icon">
                <Sparkles />
              </div>

              <div>
                <span className="sys-preferred-source-eyebrow">
                  GOOGLE SEARCH
                </span>

                <h3 id="preferred-source-title">
                  Prefer SystemaOps?
                </h3>

                <p>
                  Add SystemaOps as a preferred source
                  on Google and make it easier to find
                  our latest insights and resources.
                </p>
              </div>
            </div>

            <div className="sys-preferred-source-action">
              <button
                ref={preferredSourceRef}
                type="button"
                className="sys-preferred-source-button"
                onClick={
                  handlePreferredSourceClick
                }
                aria-label="Add SystemaOps as a preferred source on Google"
              >
                <span>
                  {preferredSourceReady
                    ? "Add as preferred source"
                    : "Add as preferred source"}
                </span>

                <ArrowUpRight
                  className="sys-preferred-source-button-icon"
                />
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            COMPLIANCE
        ====================================================== */}

        <div className="sys-compliance">
          <h4 className="sys-compliance-title">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 2 L20 5 V11 C20 16 16.5 19.5 12 21 C7.5 19.5 4 16 4 11 V5 Z" />
              <path d="M9 12 l2 2 l4 -4" />
            </svg>

            {t("footer.compliance.title")}
          </h4>

          <div className="sys-compliance-grid">
            <div className="sys-compliance-card">
              <div className="sys-compliance-icon">
                <img
                  src={gdprLogo}
                  alt="GDPR"
                />
              </div>

              <div>
                <span>
                  {t(
                    "footer.compliance.gdpr.label",
                  )}
                </span>

                <small>
                  {t(
                    "footer.compliance.gdpr.sub",
                  )}
                </small>
              </div>
            </div>

            <div className="sys-compliance-card">
              <div className="sys-compliance-icon">
                <img
                  src={hipaaLogo}
                  alt="HIPAA"
                />
              </div>

              <div>
                <span>
                  {t(
                    "footer.compliance.hipaa.label",
                  )}
                </span>

                <small>
                  {t(
                    "footer.compliance.hipaa.sub",
                  )}
                </small>
              </div>
            </div>

            <div className="sys-compliance-card">
              <div className="sys-compliance-icon">
                <img
                  src={soc2Logo}
                  alt="SOC 2"
                />
              </div>

              <div>
                <span>
                  {t(
                    "footer.compliance.soc2.label",
                  )}
                </span>

                <small>
                  {t(
                    "footer.compliance.soc2.sub",
                  )}
                </small>
              </div>
            </div>

            <div className="sys-compliance-card">
              <div className="sys-compliance-icon">
                <img
                  src={isoLogo}
                  alt="ISO 27001"
                />
              </div>

              <div>
                <span>
                  {t(
                    "footer.compliance.iso.label",
                  )}
                </span>

                <small>
                  {t(
                    "footer.compliance.iso.sub",
                  )}
                </small>
              </div>
            </div>
          </div>

          <p className="sys-compliance-text">
            {t(
              "footer.compliance.bodyText",
            )}
          </p>

          <p className="sys-compliance-note">
            {t(
              "footer.compliance.note",
            )}
          </p>
        </div>

        {/* =====================================================
            BASELINE
        ====================================================== */}

        <div className="sys-footer-baseline">
          <p>
            &copy; {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}