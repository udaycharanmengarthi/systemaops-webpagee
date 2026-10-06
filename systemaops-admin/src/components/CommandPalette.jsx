import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Search } from "lucide-react";

const COMMANDS = [
  { id: "dashboard", label: "Open dashboard", to: "/" },
  { id: "contacts", label: "Open contacts", to: "/contacts" },
  { id: "careers", label: "Open careers", to: "/careers" },
  { id: "activity", label: "View activity", to: "/activity" },
  { id: "notifications", label: "Open notifications", to: "/notifications" },
  { id: "profile", label: "View profile", to: "/settings/profile" },
  { id: "security", label: "Change password", to: "/settings/security" },
  { id: "settings", label: "Go to settings", to: "/settings/profile" },
];

export default function CommandPalette({ onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useCallback((node) => {
    if (node) node.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
    const searchActions = q
      ? [
          { id: "search-contacts", label: `Search contacts for “${query.trim()}”`, to: `/contacts?q=${encodeURIComponent(query.trim())}` },
          { id: "search-careers", label: `Search candidates for “${query.trim()}”`, to: `/careers?q=${encodeURIComponent(query.trim())}` },
        ]
      : [];
    return [...searchActions, ...filtered];
  }, [query]);

  const run = (command) => {
    onClose();
    navigate(command.to);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && results[index]) run(results[index]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [results, index, onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center bg-ink-900/40 p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-ink-200 px-4">
          <Search size={16} className="text-ink-500" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Search contacts, candidates or jump to a page…"
            className="w-full bg-transparent py-3.5 text-sm focus:outline-none"
            aria-label="Command palette search"
          />
          <kbd className="rounded border border-ink-200 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500">ESC</kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto p-1.5" role="listbox">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-ink-500">No matching actions.</li>
          ) : (
            results.map((command, i) => (
              <li key={command.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === index}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => run(command)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${
                    i === index ? "bg-ink-100 text-ink-900" : "text-ink-700"
                  }`}
                >
                  <LayoutDashboard size={15} className="text-ink-500" aria-hidden="true" />
                  {command.label}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
