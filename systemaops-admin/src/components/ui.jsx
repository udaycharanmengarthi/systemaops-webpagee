import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowUpRight, Inbox } from "lucide-react";

/* ---------- Badges ---------- */

const STATUS_TONE = {
  NEW: "bg-blue-50 text-blue-700 border-blue-200",
  IN_REVIEW: "bg-indigo-50 text-indigo-700 border-indigo-200",
  REVIEWING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  CONTACTED: "bg-teal-50 text-teal-700 border-teal-200",
  QUALIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SHORTLISTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INTERVIEW: "bg-violet-50 text-violet-700 border-violet-200",
  CONVERTED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  OFFER: "bg-emerald-100 text-emerald-800 border-emerald-300",
  HIRED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  CLOSED: "bg-ink-100 text-ink-500 border-ink-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

export function StatusBadge({ value }) {
  const tone = STATUS_TONE[value] || "bg-ink-100 text-ink-700 border-ink-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide ${tone}`}>
      {String(value || "").replace(/_/g, " ")}
    </span>
  );
}

const PRIORITY_TONE = {
  LOW: "bg-ink-100 text-ink-500 border-ink-200",
  MEDIUM: "bg-sky-50 text-sky-700 border-sky-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  URGENT: "bg-red-50 text-red-700 border-red-200",
};

export function PriorityBadge({ value }) {
  const tone = PRIORITY_TONE[value] || PRIORITY_TONE.MEDIUM;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tone}`}>
      {value}
    </span>
  );
}

export function TagChip({ label }) {
  return (
    <span className="inline-flex items-center rounded-md bg-ink-100 px-1.5 py-0.5 text-[11px] font-medium text-ink-700">
      {label}
    </span>
  );
}

/* ---------- Icon container ---------- */

export function IconBox({ icon: Icon, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    violet: "bg-violet-50 text-violet-700",
    neutral: "bg-ink-100 text-ink-700",
  };
  return (
    <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone] || tones.brand}`}>
      <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
    </span>
  );
}

/* ---------- Time helpers ---------- */

export function timeAgo(value) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function clockTime(value) {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ---------- KPI metric ---------- */

/* Contract: `to` -> navigates (React Router Link); only `onClick` ->
   real button; neither -> informational card that must NOT look
   clickable. This was the source of the dead-card regression (a
   previous version rendered <button onClick={onClick}> even when only
   `to` was passed, silently dropping navigation). */
export function Metric({ icon, label, value, context, to, onClick, tone }) {
  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <IconBox icon={icon} tone={tone} />
          <span className="section-label">{label}</span>
        </div>
        {to || onClick ? (
          <ArrowUpRight
            size={14}
            className="text-ink-300 transition group-hover:text-brand-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        ) : null}
      </div>
      <div className="mt-3 text-[26px] font-bold leading-none tracking-tight text-ink-900">{value}</div>
      {context ? <div className="mt-1.5 text-xs text-ink-500">{context}</div> : null}
    </>
  );
  if (to) {
    return (
      <Link
        to={to}
        className="group card block p-4 text-left transition hover:border-brand-200 hover:shadow-[0_8px_30px_rgba(11,23,32,0.06)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
        aria-label={`${label}: ${value}`}
      >
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group card block w-full p-4 text-left transition hover:border-brand-200 hover:shadow-[0_8px_30px_rgba(11,23,32,0.06)]"
        aria-label={`${label}: ${value}`}
      >
        {inner}
      </button>
    );
  }
  return <div className="card p-4">{inner}</div>;
}

/* ---------- Avatar ---------- */

export function Avatar({ name, src, size = 32 }) {
  const [broken, setBroken] = useState(false);
  if (src && !broken) {
    return (
      <img
        src={src}
        alt={name || ""}
        onError={() => setBroken(true)}
        className="shrink-0 rounded-full border border-ink-200 bg-ink-100 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-600 font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

/* ---------- Role badge (enterprise-styled, not a trophy) ---------- */

const ROLE_TONE = {
  VIEWER: "bg-ink-100 text-ink-600 border-ink-200",
  MANAGER: "bg-sky-50 text-sky-700 border-sky-200",
  ADMIN: "bg-brand-50 text-brand-800 border-brand-200",
  SUPER_ADMIN: "bg-ink-900 text-white border-ink-900",
};

export function RoleBadge({ value }) {
  const tone = ROLE_TONE[value] || ROLE_TONE.VIEWER;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${tone}`}>
      {String(value || "").replace(/_/g, " ")}
    </span>
  );
}

/* ---------- States ---------- */

export function EmptyState({ title, hint, action, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-300 bg-white px-6 py-12 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 text-ink-500">
        <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div className="mt-3 text-sm font-semibold text-ink-900">{title}</div>
      {hint ? <div className="mt-1 max-w-sm text-sm text-ink-500">{hint}</div> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 px-6 py-12 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
        <AlertTriangle size={18} aria-hidden="true" />
      </span>
      <div className="mt-3 text-sm font-semibold text-ink-900">Unable to load data</div>
      <div className="mt-1 max-w-sm text-sm text-ink-500">{message}</div>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="btn-ghost mt-4">
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function SkeletonRows({ count = 5 }) {
  return (
    <div className="flex flex-col gap-2" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-xl bg-ink-100" />
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-ink-100" />
      ))}
    </div>
  );
}

/* ---------- Pagination ---------- */

export function Pagination({ meta, onPage }) {
  if (!meta || meta.pages <= 1) return null;
  const { page, pages, total } = meta;
  return (
    <nav className="mt-4 flex items-center justify-between text-sm" aria-label="Pagination">
      <div className="text-ink-500">
        Page {page} of {pages} · {total} records
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="btn-ghost px-3 py-1.5"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          className="btn-ghost px-3 py-1.5"
        >
          Next
        </button>
      </div>
    </nav>
  );
}

/* ---------- Confirm dialog ---------- */

export function ConfirmDialog({ open, title, body, confirmLabel = "Confirm", onCancel, onConfirm, danger = false }) {
  const [busy, setBusy] = useState(false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-900/40 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-base font-bold text-ink-900">{title}</h2>
        {body ? <p className="mt-2 text-sm text-ink-500">{body}</p> : null}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={busy} className="btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onConfirm();
              } finally {
                setBusy(false);
              }
            }}
            className={danger ? "inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700" : "btn-brand"}
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Timeline ---------- */

function dayBucket(value) {
  const date = new Date(value);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  if (date >= startOfToday) return "Today";
  if (date >= startOfYesterday) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric" });
}

function describeAction(item) {
  const from = item.fromValue ? ` ${item.fromValue} →` : "";
  const to = item.toValue ? ` ${item.toValue}` : "";
  switch (item.action) {
    case "CONTACT_CREATED":
    case "CAREER_CREATED":
      return "created this record";
    case "CONTACT_STATUS_CHANGED":
    case "CAREER_STATUS_CHANGED":
      return `changed status${from}${to}`;
    case "CONTACT_ASSIGNED":
    case "CAREER_ASSIGNED":
      return `assigned to${to}`;
    case "CONTACT_UNASSIGNED":
    case "CAREER_UNASSIGNED":
      return "removed the assignee";
    case "CONTACT_PRIORITY_CHANGED":
    case "CAREER_PRIORITY_CHANGED":
      return `changed priority${from}${to}`;
    case "CONTACT_NOTE_ADDED":
    case "CAREER_NOTE_ADDED":
      return "added a note";
    case "CONTACT_FOLLOWUP_CHANGED":
    case "CAREER_FOLLOWUP_CHANGED":
      return "updated the follow-up";
    case "CONTACT_TAGS_CHANGED":
    case "CAREER_TAGS_CHANGED":
      return `updated tags${to}`;
    case "ADMIN_LOGIN":
      return "logged in";
    case "ADMIN_LOGOUT":
      return "logged out";
    default:
      return `${(item.action || "").toLowerCase().replace(/_/g, " ")}${from}${to}`;
  }
}

/* Timeline grouped by Today / Yesterday / <date>. Read-only audit data. */
export function Timeline({ items }) {
  if (!items || items.length === 0) {
    return <div className="text-sm text-ink-500">No activity recorded yet.</div>;
  }
  const groups = [];
  let current = null;
  for (const item of items) {
    const bucket = dayBucket(item.createdAt);
    if (!current || current.label !== bucket) {
      current = { label: bucket, items: [] };
      groups.push(current);
    }
    current.items.push(item);
  }
  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="section-label mb-2">{group.label}</div>
          <ol className="flex flex-col">
            {group.items.map((item) => (
              <li key={item._id || `${item.action}-${item.createdAt}`} className="relative flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
                  <span className="w-px flex-1 bg-ink-200" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 pb-2">
                  <div className="text-sm text-ink-900">
                    <span className="font-semibold">{item.actorName || "System"}</span>{" "}
                    <span className="text-ink-500">{describeAction(item)}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-ink-500">{clockTime(item.createdAt)}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
