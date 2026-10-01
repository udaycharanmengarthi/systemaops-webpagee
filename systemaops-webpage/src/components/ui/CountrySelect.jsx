import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { COUNTRY_CODES } from "../../data/countries";

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

export default function CountrySelect({ selected, onChange, prefix = "cd" }) {
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
        .${prefix}-wrap { position: relative; flex-shrink: 0; width: 116px; }
        .${prefix}-trigger {
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
        }
        .${prefix}-trigger:hover, .${prefix}-trigger.${prefix}-open {
          border-color: rgba(var(--accent-rgb), .42);
          background: var(--bg-surface-hover);
          box-shadow: 0 0 0 4px rgba(var(--accent-rgb), .08);
        }
        .${prefix}-trigger:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 2px; }
        .${prefix}-trigger-inner { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .${prefix}-code { font-size: 13px; font-weight: 700; color: var(--text-primary); white-space: nowrap; }
        .${prefix}-chevron { color: var(--text-muted); flex-shrink: 0; transition: transform .25s ease; }
        .${prefix}-chevron.${prefix}-open { transform: rotate(180deg); }
        .${prefix}-panel {
          position: absolute; top: calc(100% + 8px); left: 0;
          width: 300px; z-index: 9999;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--menu-bg);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          animation: ${prefix}-in .18s ease;
        }
        @keyframes ${prefix}-in {
          from { opacity: 0; transform: translateY(-8px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .${prefix}-search-wrap {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px;
          border-bottom: 1px solid var(--border-soft);
          background: var(--menu-bg);
        }
        .${prefix}-search-icon { color: var(--text-muted); flex-shrink: 0; }
        .${prefix}-search {
          flex: 1; background: transparent; border: none; outline: none;
          color: var(--text-primary); font-size: 13px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .${prefix}-list {
          max-height: 256px; overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(var(--accent-rgb), .35) transparent;
          padding: 6px 0;
        }
        .${prefix}-item {
          display: flex; align-items: center; gap: 12px;
          padding: 9px 16px; cursor: pointer;
          transition: background .15s ease;
        }
        .${prefix}-item:hover { background: var(--menu-hover); }
        .${prefix}-item.${prefix}-active { background: var(--menu-active); }
        .${prefix}-item-name {
          flex: 1; font-size: 13px; font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .${prefix}-item-code { font-size: 12px; font-weight: 700; color: var(--accent-primary); flex-shrink: 0; letter-spacing: .02em; }
        .${prefix}-empty { padding: 28px 16px; text-align: center; color: var(--text-muted); font-size: 13px; }
        .${prefix}-section-label { padding: 8px 16px 4px; font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--text-muted); }
      `}</style>

      <div className={`${prefix}-wrap`} ref={wrapRef}>
        <button
          type="button"
          className={`${prefix}-trigger${open ? ` ${prefix}-open` : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={`${prefix}-trigger-inner`}>
            <FlagImg iso2={selected.iso2} size={26} />
            <span className={`${prefix}-code`}>{selected.code}</span>
          </span>
          <ChevronDown size={14} className={`${prefix}-chevron${open ? ` ${prefix}-open` : ""}`} />
        </button>

        {open && (
          <div className={`${prefix}-panel`}>
            <div className={`${prefix}-search-wrap`}>
              <Search size={14} className={`${prefix}-search-icon`} />
              <input
                ref={searchRef}
                className={`${prefix}-search`}
                placeholder="Search country or dial code…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={`${prefix}-list`} role="listbox" aria-label="Select country">
              {filtered.length === 0 ? (
                <div className={`${prefix}-empty`}>No results found</div>
              ) : (
                <>
                  {!search && <div className={`${prefix}-section-label`}>All Countries</div>}
                  {filtered.map((c) => (
                    <div
                      key={`${c.country}-${c.code}`}
                      className={`${prefix}-item${selected.country === c.country ? ` ${prefix}-active` : ""}`}
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
                      <span className={`${prefix}-item-name`}>{c.country}</span>
                      <span className={`${prefix}-item-code`}>{c.code}</span>
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
