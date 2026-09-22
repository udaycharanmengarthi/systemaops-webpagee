import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import {
  servicesMenu,
  servicesOverviewHref,
} from "../../data/services";
import ServicePreviewArt from "./ServicePreviewArt";
import "./ServicesMegaMenu.css";

function useServiceNavigation() {
  const navigate = useNavigate();
  return useCallback(
    (href) => {
      navigate(href);
    },
    [navigate]
  );
}

export default function ServicesMegaMenu({
  label,
  bookCallLabel,
  open,
  onOpenChange,
}) {
  const [activeId, setActiveId] = useState(
    servicesMenu[0].id
  );

  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const listRef = useRef(null);

  const location = useLocation();
  const goTo = useServiceNavigation();

  const activeIndex = Math.max(
    0,
    servicesMenu.findIndex((s) => s.id === activeId)
  );
  const activeService =
    servicesMenu[activeIndex] || servicesMenu[0];

  /* Close on route change */
  const [prevPathname, setPrevPathname] = useState(
    location.pathname
  );
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    onOpenChange(false);
  }

  const returnFocus = useCallback(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);

  /* Outside click — close when clicking outside both button and menu */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      const button = buttonRef.current;
      const menu = menuRef.current;
      if (
        button &&
        menu &&
        !button.contains(e.target) &&
        !menu.contains(e.target)
      ) {
        onOpenChange(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onOpenChange]);

  /* Escape key — close and return focus */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        returnFocus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () =>
      window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange, returnFocus]);

  const toggleMenu = useCallback(() => {
    onOpenChange(!open);
  }, [open, onOpenChange]);

  const focusItem = (index) => {
    const items = listRef.current
      ? listRef.current.querySelectorAll('[role="menuitem"]')
      : [];
    const target = items[
      (index + items.length) % items.length
    ];
    if (target) target.focus();
  };

  const onListKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveId(
          servicesMenu[(activeIndex + 1) % servicesMenu.length].id
        );
        focusItem(activeIndex + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveId(
          servicesMenu[
            (activeIndex - 1 + servicesMenu.length) %
              servicesMenu.length
          ].id
        );
        focusItem(activeIndex - 1);
        break;
      case "Home":
        e.preventDefault();
        setActiveId(servicesMenu[0].id);
        focusItem(0);
        break;
      case "End":
        e.preventDefault();
        setActiveId(
          servicesMenu[servicesMenu.length - 1].id
        );
        focusItem(servicesMenu.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`smm-root nb-drop ${
        open ? "nb-drop-open" : ""
      }`}
      ref={menuRef}
    >
      <button
        ref={buttonRef}
        type="button"
        className="nb-drop-btn"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="services-mega-menu"
        aria-label={label}
        onClick={toggleMenu}
      >
        {label}
        <ChevronDown
          size={16}
          className={`nb-drop-icon ${
            open ? "nb-drop-icon--open" : ""
          }`}
        />
      </button>

      <div
        id="services-mega-menu"
        className={`smm-panel ${
          open ? "smm-panel--open" : ""
        }`}
        role="navigation"
        aria-label={`${label} menu`}
        style={{
          "--c": activeService.accent,
          "--c-rgb": activeService.accentRgb,
          "--c-sec": activeService.accentSecondary,
          "--c-text": activeService.accentText,
        }}
      >
        <div className="smm-inner">
          <div className="smm-cols">
            <div className="smm-list-col">
              <div
                ref={listRef}
                className="smm-list"
                role="menu"
                onKeyDown={onListKeyDown}
              >
                {servicesMenu.map((service) => {
                  const isActive =
                    service.id === activeId;
                  return (
                    <a
                      key={service.id}
                      href={service.href}
                      role="menuitem"
                      tabIndex={isActive ? 0 : -1}
                      className={`smm-item ${
                        isActive
                          ? "smm-item--active"
                          : ""
                      }`}
                      style={{
                        "--c-rgb": service.accentRgb,
                        "--c": service.accent,
                        "--c-text": service.accentText,
                      }}
                      onMouseEnter={() =>
                        setActiveId(service.id)
                      }
                      onFocus={() =>
                        setActiveId(service.id)
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        goTo(service.href);
                        onOpenChange(false);
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" ||
                          e.key === " "
                        ) {
                          e.preventDefault();
                          goTo(service.href);
                          onOpenChange(false);
                        }
                      }}
                    >
                      <span
                        className="smm-item-bar"
                        aria-hidden="true"
                      />
                      <span className="smm-item-title">
                        {service.title}
                      </span>
                      <ArrowRight
                        size={15}
                        className="smm-item-arrow"
                        aria-hidden="true"
                      />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="smm-preview">
              <div
                className="smm-preview-art"
                key={activeService.id}
              >
                <ServicePreviewArt
                  id={activeService.visual}
                  accent={activeService.accent}
                />
              </div>
              <div
                className="smm-preview-meta"
                key={`meta-${activeService.id}`}
              >
                <div>
                  <p className="smm-preview-eyebrow">
                    {activeService.title}
                  </p>
                  <p className="smm-preview-title">
                    {activeService.title}
                  </p>
                  <p className="smm-preview-tagline">
                    {activeService.tagline}
                  </p>
                </div>
                <a
                  href={activeService.href}
                  className="smm-preview-cta"
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(activeService.href);
                    onOpenChange(false);
                  }}
                >
                  View service
                  <ArrowRight
                    size={14}
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="smm-footer">
            <a
              href={servicesOverviewHref}
              className="smm-explore"
              onClick={(e) => {
                e.preventDefault();
                goTo(servicesOverviewHref);
                onOpenChange(false);
              }}
            >
              Explore all services
              <ArrowRight
                size={14}
                aria-hidden="true"
              />
            </a>
            <a
              href="/contact"
              className="smm-book"
              onClick={(e) => {
                e.preventDefault();
                goTo("/contact");
                onOpenChange(false);
              }}
            >
              {bookCallLabel || "Book a Free Call"}
              <ArrowRight
                size={14}
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
