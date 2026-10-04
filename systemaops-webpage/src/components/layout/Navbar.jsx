import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import { useLanguage } from "../../i18n/LanguageContext";
import ServicesMegaMenu from "../navigation/ServicesMegaMenu";
import ThemeToggle from "../navigation/ThemeToggle";
import { servicesMenu } from "../../data/services";

import logo from "../../assets/systemaops-icon-color.svg";
import "./Navbar.css";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { t } = useLanguage();

  const location = useLocation();
  const navigate = useNavigate();
 
  // Keep navigation state in sync after route changes.
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close on Escape + reset mobile state when leaving mobile widths
  useEffect(() => {
    if (!mobileOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setServicesOpen(false);
      }
    };

    const mq = window.matchMedia("(min-width: 769px)");
    const onViewportChange = (e) => {
      if (e.matches) {
        setMobileOpen(false);
        setServicesOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onViewportChange);
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", onViewportChange);
      }
    };
  }, [mobileOpen]);

  /* Escape closes the drawer; crossing into desktop viewport
     resets mobile navigation state entirely. */
  useEffect(() => {
    if (!mobileOpen) return undefined;

    const closeMobileNav = () => {
      setMobileOpen(false);
      setServicesOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMobileNav();
    };

    const viewport = window.matchMedia("(min-width: 769px)");
    const onViewportChange = (e) => {
      if (e.matches) closeMobileNav();
    };

    document.addEventListener("keydown", onKeyDown);
    if (typeof viewport.addEventListener === "function") {
      viewport.addEventListener("change", onViewportChange);
    } else if (typeof viewport.addListener === "function") {
      viewport.addListener(onViewportChange);
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (typeof viewport.removeEventListener === "function") {
        viewport.removeEventListener("change", onViewportChange);
      } else if (typeof viewport.removeListener === "function") {
        viewport.removeListener(onViewportChange);
      }
    };
  }, [mobileOpen]);

  // Navbar scroll animation
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;

        requestAnimationFrame(() => {
          setScrollProgress(Math.min(window.scrollY / 220, 1));
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  const p = scrollProgress;

  /* Navigate to a service entry. Hash links ("/#services") are
     handled by ScrollToTop, which scrolls to the target section
     after landing on the home page. */
  const handleServiceNav = (href) => {
    setMobileOpen(false);
    setServicesOpen(false);

    navigate(href);
  };

  return (
    <>
      <div className="nb-wrapper">
        <header
          className="nb-bar"
          style={{
            width: `min(${92 - p * 14}%, ${
              1360 - p * 280
            }px)`,

            height: `${78 - p * 10}px`,

            transform: `translateY(${p * -3}px)`,
          }}
        >
          {/* ================================================= */}
          {/* LOGO */}
          {/* ================================================= */}

          <Link
            className="nb-logo"
            to="/"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img
              src={logo}
              alt="SystemaOps"
              className="nb-logo-img"
            />

            <span>SystemaOps</span>
          </Link>

          {/* ================================================= */}
          {/* DESKTOP NAVIGATION */}
          {/* ================================================= */}

          <nav className="nb-links">

            {/* HOME */}
            <Link
              to="/"
              className="nb-link"
            >
              {t("nav.home")}
            </Link>

            {/* ABOUT */}
            <Link
              className="nb-link"
              to="/about"
            >
              {t("nav.about")}
            </Link>

            {/* SERVICES MEGA MENU */}
            <ServicesMegaMenu
              label={t("nav.services")}
              open={servicesOpen}
              onOpenChange={setServicesOpen}
            />

            {/* CAREERS */}
            <Link
              to="/careers"
              className="nb-link"
            >
              {t("nav.careers")}
            </Link>

            {/* BLOGS */}
            <Link
              className="nb-link"
              to="/blogs"
            >
              {t("nav.blogs")}
            </Link>

          </nav>

          {/* ================================================= */}
          {/* LANGUAGE */}
          {/* ================================================= */}

          <LanguageSwitcher />

          {/* ================================================= */}
          {/* THEME TOGGLE */}
          {/* ================================================= */}

          <ThemeToggle />

          {/* ================================================= */}
          {/* CONTACT US CTA */}
          {/* ================================================= */}

          <button
            className="nb-cta"
            onClick={() => navigate("/contact")}
          >
            <span className="nb-cta-label">
              {t("nav.contact")}
            </span>
          </button>

          {/* ================================================= */}
          {/* MOBILE MENU BUTTON */}
          {/* ================================================= */}

          <button
            className="nb-hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label={t("nav.openMenu")}
            aria-expanded={mobileOpen}
            aria-controls="nb-mobile-drawer"
          >
            <Menu size={24} />
          </button>
        </header>
      </div>

      {/* ===================================================== */}
      {/* MOBILE BACKDROP */}
      {/* ===================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nb-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setMobileOpen(false);
              setServicesOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* ===================================================== */}
      {/* MOBILE PANEL */}
      {/* ===================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nb-mobile"
            id="nb-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.openMenu")}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* MOBILE HEADER */}

            <div className="nb-mobile-top">
              <Link
                className="nb-mobile-logo"
                to="/"
                onClick={() => {
                  setMobileOpen(false);
                  setServicesOpen(false);
                }}
              >
                <img
                  src={logo}
                  alt=""
                  width={28}
                />

                <span>SystemaOps</span>
              </Link>

              <button
                className="nb-mobile-close"
                onClick={() => {
                  setMobileOpen(false);
                  setServicesOpen(false);
                }}
                aria-label={t("nav.closeMenu")}
              >
                <X size={20} />
              </button>
            </div>

            {/* ================================================= */}
            {/* MOBILE LINKS */}
            {/* ================================================= */}

            <div className="nb-mobile-links">

              {/* HOME */}

              <Link
                className="nb-mobile-link"
                to="/"
                onClick={() => {
                  setMobileOpen(false);
                  setServicesOpen(false);
                }}
              >
                {t("nav.home")}
              </Link>

              {/* ABOUT */}

              <Link
                className="nb-mobile-link"
                to="/about"
                onClick={() => {
                  setMobileOpen(false);
                  setServicesOpen(false);
                }}
              >
                {t("nav.about")}
              </Link>

              {/* SERVICES */}

              <div className="nb-acc">
                <button
                  className="nb-acc-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setServicesOpen((v) => !v);
                  }}
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-controls="nb-services-submenu"
                >
                  <span>
                    {t("nav.services")}
                  </span>

                  <ChevronDown
                    size={16}
                    style={{
                      transform: servicesOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",

                      transition:
                        "transform 0.22s ease",

                      flexShrink: 0,
                    }}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {servicesOpen && (
                    <motion.div
                      key="services-body"
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.22,
                        ease: "easeInOut",
                      }}
                      className="nb-acc-body"
                      id="nb-services-submenu"
                    >
                      {servicesMenu.map((service) => (
                        <Link
                          key={service.id}
                          className="nb-sub"
                          to={service.href}
                          style={{
                            boxShadow: `inset 3px 0 0 ${service.accent}`,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleServiceNav(service.href);
                          }}
                        >
                          {t(`megaMenu.services.${service.id}.title`) || service.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CAREERS */}

              <Link
                className="nb-mobile-link"
                to="/careers"
                onClick={() => {
                  setMobileOpen(false);
                  setServicesOpen(false);
                }}
              >
                {t("nav.careers")}
              </Link>

              {/* BLOGS */}

              <Link
                className="nb-mobile-link"
                to="/blogs"
                onClick={() => {
                  setMobileOpen(false);
                  setServicesOpen(false);
                }}
              >
                {t("nav.blogs")}
              </Link>

            </div>

            {/* ================================================= */}
            {/* MOBILE LANGUAGE + THEME */}
            {/* ================================================= */}

            <LanguageSwitcher className="language-switcher--mobile" />

            <div className="nb-mobile-theme-row">
              <ThemeToggle className="theme-toggle--mobile" />
            </div>

            {/* ================================================= */}
            {/* MOBILE CONTACT US */}
            {/* ================================================= */}

            <button
              className="nb-mobile-cta"
              onClick={() => {
                setMobileOpen(false);
                setServicesOpen(false);
                navigate("/contact");
              }}
            >
              {t("nav.contact")}
            </button>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
