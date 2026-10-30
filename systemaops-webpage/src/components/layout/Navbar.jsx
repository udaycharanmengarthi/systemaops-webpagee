import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import { useLanguage } from "../../i18n/LanguageContext";
import ServicesMegaMenu from "../navigation/ServicesMegaMenu";
import ThemeToggle from "../navigation/ThemeToggle";
import { servicesMenu } from "../../data/services";
import { useTheme } from "../../theme/theme-context";

import logo from "../../assets/systemaops-icon-color.svg";
import AstroidMark from "./AstroidMark";
import SpecularButton from "../ui/SpecularButton";
import "./Navbar.css";

/* Marks the current top-level route with the active underline. */
const navLinkClass = ({ isActive }) =>
  `nb-link${isActive ? " nb-link--active" : ""}`;

const Navbar = () => {
  /* State model:
     - mobileMenuOpen: the mobile drawer (hamburger) */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  /* Services submenu open/closed within the mobile drawer */
  const [servicesOpen, setServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] =
    useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  const location = useLocation();
  const navigate = useNavigate();

  // Keep navigation state in sync after route changes.
  // Deferred to a timeout so we sync with the router (external system)
  // in a callback instead of cascading renders synchronously in the effect body.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setMobileMenuOpen(false);
      setServicesOpen(false);
      setDesktopServicesOpen(false);
    }, 0);
    return () => window.clearTimeout(id);
  }, [location.pathname]);

  // Close mobile menu and services submenu.
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const root = document.documentElement;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [mobileMenuOpen]);

  // Close on Escape + reset mobile state when leaving mobile widths.
  // The desktop mega-menu owns its own Escape handling, so this
  // listener only touches mobile state.
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        closeMobileMenu();
      }
    };

    /* The drawer is used on mobile AND on tablet (up to 1199px), so it
       must close as soon as the viewport reaches the full-nav range. */
    const mq = window.matchMedia("(min-width: 1200px)");
    const onViewportChange = (e) => {
      if (e.matches) {
        closeMobileMenu();
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
  }, [mobileMenuOpen]);

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

  /* The Book a Call pill uses the shared SpecularButton renderer. A dark
     glass body keeps the edge and label legible in both themes. In light
     mode the edge light becomes champagne gold to match the metallic gold
     astroid mark; dark mode keeps the original white specular treatment. */
  const bookCallSpecular = {
    size: "md",
    radius: 24,
    tint: isLightTheme ? "#0b1720" : "#ffffff",
    tintOpacity: isLightTheme ? 0.78 : 0.06,
    textColor: "#ffffff",
    lineColor: isLightTheme ? "#E8B95E" : "#ffffff",
    baseColor: isLightTheme ? "#C99A42" : "#525252",
    intensity: 1,
    idleIntensity: isLightTheme ? 0.25 : 0.35,
    shineSize: 10,
    shineFade: 34,
    thickness: 1.2,
    glow: isLightTheme ? 0.7 : 1,
    followMouse: true,
    proximity: 250,
  };

  /* Service entries use native <Link> navigation below.
     Hash links ("/#services") are handled by ScrollToTop, which
     scrolls to the target section after landing on the home page. */

  return (
    <>
      <div className="nb-wrapper">
        <header
          className="nb-bar"
          style={{
            /* The pill narrows slightly as the page scrolls. The floor is
               deliberately high: the full nav row needs ~970px of
               content, so the narrowest (scrolled) state must still clear
               it, otherwise the logo and the CTAs collide. Below 1200px
               the row does not fit at all and the drawer takes over
               (see Navbar.css). */
            width: `min(${92 - p * 2}%, ${
              1360 - p * 80
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
            <NavLink
              to="/"
              end
              className={navLinkClass}
            >
              {t("nav.home")}
            </NavLink>

            {/* ABOUT */}
            <NavLink
              className={navLinkClass}
              to="/about"
            >
              {t("nav.about")}
            </NavLink>

            {/* SERVICES MEGA MENU (desktop only; own state) */}
            <ServicesMegaMenu
              label={t("nav.services")}
              open={desktopServicesOpen}
              onOpenChange={setDesktopServicesOpen}
            />

            {/* CAREERS */}
            <NavLink
              to="/careers"
              className={navLinkClass}
            >
              {t("nav.careers")}
            </NavLink>

            {/* BLOGS */}
            <NavLink
              className={navLinkClass}
              to="/blogs"
            >
              {t("nav.blogs")}
            </NavLink>

            {/* CONTACT US (regular nav link, not a CTA) */}
            <NavLink
              className={navLinkClass}
              to="/contact"
            >
              {t("nav.contact")}
            </NavLink>

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
          {/* BOOK A CALL CTA — consultation page */}
          {/* Separate from Contact Us on purpose: the contact
              form stays untouched, this opens /book-a-call. */}
          {/* ================================================= */}

          <div className="nb-cta-group">
            <SpecularButton
              {...bookCallSpecular}
              className="nb-book-cta navbar-book-call"
              type="button"
              onClick={() => navigate("/book-a-call")}
            >
              <span className="nb-cta-mark-shell" aria-hidden="true">
                <AstroidMark
                  className="nb-cta-mark"
                />
              </span>
              <span className="nb-cta-label">
                {t("nav.bookCall")}
              </span>
              <ArrowRight className="nb-cta-arrow" size={16} aria-hidden="true" />
            </SpecularButton>
          </div>

          {/* ================================================= */}
          {/* MOBILE MENU BUTTON */}
          {/* ================================================= */}

          <button
            className="nb-hamburger"
            onClick={() => setMobileMenuOpen(true)}
            aria-label={t("nav.openMenu")}
            aria-expanded={mobileMenuOpen}
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
        {mobileMenuOpen && (
          <motion.div
            className="nb-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* ===================================================== */}
      {/* MOBILE PANEL */}
      {/* ===================================================== */}

      <AnimatePresence>
        {mobileMenuOpen && (
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
                onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
                aria-label={t("nav.closeMenu")}
              >
                <X size={20} />
              </button>
            </div>

            {/* ================================================= */}
            {/* MOBILE LINKS */}
            {/* ================================================= */}

            <nav className="nb-mobile-links" aria-label={t("nav.openMenu")}>

              {/* HOME */}

              <Link
                className="nb-mobile-link"
                to="/"
                onClick={closeMobileMenu}
              >
                {t("nav.home")}
              </Link>

              {/* ABOUT */}

              <Link
                className="nb-mobile-link"
                to="/about"
                onClick={closeMobileMenu}
              >
                {t("nav.about")}
              </Link>

              {/* SERVICES (accordion toggle only — never navigates) */}

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
                          onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
              >
                {t("nav.careers")}
              </Link>

              {/* BLOGS */}

              <Link
                className="nb-mobile-link"
                to="/blogs"
                onClick={closeMobileMenu}
              >
                {t("nav.blogs")}
              </Link>

              {/* CONTACT US */}

              <Link
                className="nb-mobile-link"
                to="/contact"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/contact");
                }}
              >
                {t("nav.contact")}
              </Link>

            </nav>

            {/* ================================================= */}
            {/* MOBILE LANGUAGE + THEME */}
            {/* ================================================= */}

            <div className="nb-mobile-utilities">
              <LanguageSwitcher className="language-switcher--mobile" />
              <ThemeToggle className="theme-toggle--mobile" />
            </div>

            {/* ================================================= */}
            {/* MOBILE BOOK A CALL */}
            {/* ================================================= */}

            <div className="nb-mobile-cta-group">
              <SpecularButton
                {...bookCallSpecular}
                className="nb-book-cta nb-book-cta--mobile"
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/book-a-call");
                }}
              >
                <span className="nb-cta-mark-shell" aria-hidden="true">
                  <AstroidMark
                    className="nb-cta-mark"
                  />
                </span>
                <span className="nb-cta-label">
                  {t("nav.bookCall")}
                </span>
                <ArrowRight className="nb-cta-arrow" size={16} aria-hidden="true" />
              </SpecularButton>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

