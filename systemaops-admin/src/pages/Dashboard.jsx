import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Clock,
  RefreshCw,
  Users,
  UserPlus,
  UserX,
  Zap,
} from "lucide-react";
import { careersApi, contactsApi, dashboardApi } from "../api/resources.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import { canViewActivity } from "../auth/permissions.js";
import { useFetch } from "../hooks/useFetch.js";
import { useToast } from "../components/Toast.jsx";
import {
  EmptyState,
  ErrorState,
  Metric,
  SkeletonCards,
  Timeline,
  timeAgo,
} from "../components/ui.jsx";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const ATTENTION_TABS = [
  { id: "all", label: "All" },
  { id: "contacts", label: "Contacts" },
  { id: "careers", label: "Careers" },
  { id: "overdue", label: "Overdue" },
  { id: "unassigned", label: "Unassigned" },
];

const EMPTY_COPY = {
  all: { title: "All clear.", hint: "Nothing is overdue or waiting for an owner. New inbound will appear here." },
  contacts: { title: "No contact items.", hint: "No contacts need attention right now." },
  careers: { title: "No application items.", hint: "No applications need attention right now." },
  overdue: { title: "No overdue items.", hint: "All follow-ups are currently on track." },
  unassigned: { title: "Nothing unassigned.", hint: "Every record currently has an owner." },
};

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const [updatedAt, setUpdatedAt] = useState(() => Date.now());
  // Audit/activity surface is restricted to operational roles.
  const showActivity = canViewActivity(user?.role);

  const summary = useFetch(() => dashboardApi.summary());
  /* Attention queue is composed from the existing filtered list
     endpoints (backend-filtered, bounded) — never computed client-side
     from unfiltered fetches. Four parallel bounded requests. */
  const attention = useFetch(
    () =>
      Promise.all([
        contactsApi.list({ limit: 10, followup: "overdue" }),
        contactsApi.list({ limit: 10, assignee: "unassigned" }),
        careersApi.list({ limit: 10, followup: "overdue" }),
        careersApi.list({ limit: 10, assignee: "unassigned" }),
      ]),
    "attention"
  );

  const refresh = () => {
    summary.refresh();
    attention.refresh();
    setUpdatedAt(Date.now());
    toast.notify("Refreshed.");
  };

  const data = summary.data;

  const queue = useMemo(() => {
    if (!attention.data) return [];
    const [co, cu, jo, ju] = attention.data;
    const seen = new Set();
    const acc = [];
    const push = (item, kind) => {
      if (!item || seen.has(item._id)) return;
      seen.add(item._id);
      acc.push({ ...item, kind });
    };
    for (const c of co?.items || []) push(c, "contact-overdue");
    for (const c of cu?.items || []) push(c, "contact-unassigned");
    for (const c of jo?.items || []) push(c, "career-overdue");
    for (const c of ju?.items || []) push(c, "career-unassigned");
    const rank = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    acc.sort((a, b) => (rank[a.priority] ?? 2) - (rank[b.priority] ?? 2));
    return acc;
  }, [attention.data]);

  if (summary.loading) {
    return (
      <div className="flex flex-col gap-6">
        <SkeletonCards count={4} />
        <SkeletonCards count={4} />
      </div>
    );
  }
  if (summary.error || !data) {
    return <ErrorState message={summary.error?.message} onRetry={refresh} />;
  }

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const visibleQueue = queue.filter((item) => {
    if (tab === "contacts") return item.kind.startsWith("contact");
    if (tab === "careers") return item.kind.startsWith("career");
    if (tab === "overdue") return item.kind.endsWith("overdue");
    if (tab === "unassigned") return item.kind.endsWith("unassigned");
    return true;
  });

  const todayItems = [
    { label: "New contacts", value: data.contacts.newToday, href: "/contacts?status=NEW" },
    { label: "New applications", value: data.careers.newToday, href: "/careers?status=NEW" },
    { label: "Unassigned", value: data.contacts.unassigned + data.careers.unassigned, href: "/contacts?assignee=unassigned" },
    { label: "Overdue", value: data.contacts.overdue + data.careers.overdue, href: "/contacts?followup=overdue" },
    ...(showActivity
      ? [{ label: "Team actions (24h)", value: data.activity.sinceYesterday, href: "/activity?hours=24" }]
      : []),
  ];

  const isCareer = (item) => item.kind.startsWith("career");

  return (
    <div className="flex flex-col gap-6">
      {/* ── Operational header ── */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting()}, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="mt-0.5 text-sm text-ink-500">
            {today} — here's what needs attention today.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-ink-500">
          <span>Last updated {timeAgo(updatedAt)}</span>
          <button type="button" onClick={refresh} className="btn-ghost gap-1.5 px-3 py-1.5">
            <RefreshCw size={13} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Today strip + quick actions ── */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <section aria-label="Today" className="card flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <span className="section-label">Today</span>
          {todayItems.map((item) => (
            <Link key={item.label} to={item.href} className="group flex items-baseline gap-1.5 rounded px-1 py-0.5 text-sm hover:bg-ink-50">
              <span className="font-bold text-ink-900">{item.value}</span>
              <span className="text-ink-500 group-hover:text-brand-700">{item.label.toLowerCase()}</span>
            </Link>
          ))}
        </section>
        <div className="flex shrink-0 flex-wrap items-center gap-2" aria-label="Quick actions">
          <Link to="/contacts?followup=overdue" className="btn-ghost gap-1.5 px-3 py-1.5 text-xs">
            <CalendarClock size={13} aria-hidden="true" />
            View overdue
          </Link>
          <Link to="/careers?status=NEW" className="btn-ghost gap-1.5 px-3 py-1.5 text-xs">
            <Briefcase size={13} aria-hidden="true" />
            Review applications
          </Link>
          <Link to="/notifications" className="btn-ghost gap-1.5 px-3 py-1.5 text-xs">
            <Bell size={13} aria-hidden="true" />
            Notifications
          </Link>
        </div>
      </div>

      {/* ── KPI grid (every card navigates to its filtered view) ── */}
      <section aria-label="Key metrics">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={UserPlus} label="New contacts" value={data.contacts.new} context={`${data.contacts.newToday} arrived today`} to="/contacts?status=NEW" tone="blue" />
          <Metric icon={UserX} label="Unassigned contacts" value={data.contacts.unassigned} context="Needs an owner" to="/contacts?assignee=unassigned" tone="amber" />
          <Metric icon={CalendarClock} label="Overdue follow-ups" value={data.contacts.overdue} context="Past due date" to="/contacts?followup=overdue" tone="red" />
          <Metric icon={Briefcase} label="New applications" value={data.careers.new} context={`${data.careers.newToday} arrived today`} to="/careers?status=NEW" tone="violet" />
          <Metric icon={Users} label="Unassigned applications" value={data.careers.unassigned} context="Needs a reviewer" to="/careers?assignee=unassigned" tone="neutral" />
          <Metric icon={Clock} label="Overdue applications" value={data.careers.overdue} context="Past follow-up date" to="/careers?followup=overdue" tone="neutral" />
          {showActivity ? (
            <Metric icon={Activity} label="Team actions (24h)" value={data.activity.sinceYesterday} context="Across all admins" to="/activity?hours=24" tone="brand" />
          ) : null}
          <Metric icon={CheckCircle2} label="Qualified pipeline" value={data.contacts.byStatus.QUALIFIED || 0} context={`${data.contacts.byStatus.CONTACTED || 0} contacted`} to="/contacts?status=QUALIFIED" tone="brand" />
        </div>
      </section>

      {/* ── Needs attention ── */}
      <section aria-label="Needs attention" className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold">Needs attention</h2>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-ink-200 p-0.5" role="tablist" aria-label="Attention filter">
              {ATTENTION_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-md px-3 py-1 text-xs font-medium ${tab === t.id ? "bg-ink-900 text-white" : "text-ink-600 hover:text-ink-900"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Link to="/contacts?followup=overdue" className="text-xs font-semibold text-brand-700 hover:underline">
              View all
            </Link>
          </div>
        </div>
        {visibleQueue.length === 0 ? (
          <div className="mt-3">
            <EmptyState title={EMPTY_COPY[tab].title} hint={EMPTY_COPY[tab].hint} icon={CheckCircle2} />
          </div>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {visibleQueue.map((item) => {
              const career = isCareer(item);
              const overdue = item.kind.endsWith("overdue");
              const title = career ? `${item.firstName} ${item.lastName}` : item.name;
              const subtitle = career ? item.role : item.company || item.email;
              return (
                <li key={item._id}>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-200 px-4 py-3 transition hover:border-brand-200">
                    <div className="flex min-w-0 items-center gap-3">
                      {overdue ? (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600" title="Follow-up overdue">
                          <CalendarClock size={15} aria-hidden="true" />
                        </span>
                      ) : (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600" title="Unassigned">
                          <UserX size={15} aria-hidden="true" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-ink-900">{subtitle}</div>
                        <div className="truncate text-sm text-ink-500">
                          {title} · {overdue ? "follow-up overdue" : "unassigned"}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-xs text-ink-500">
                      <span className="inline-flex items-center gap-1">
                        <UserX size={13} aria-hidden="true" />
                        {item.assigneeName || "Unassigned"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={13} aria-hidden="true" />
                        {timeAgo(item.createdAt)}
                      </span>
                      <Link
                        to={career ? `/careers/${item._id}` : `/contacts/${item._id}`}
                        className="btn-ghost gap-1 px-3 py-1.5"
                      >
                        Open
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Recent activity (operational roles only) ── */}
      {showActivity ? (
        <section aria-label="Recent activity" className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Recent activity</h2>
            <Link to="/activity" className="text-sm font-semibold text-brand-700 hover:underline">
              View all activity
            </Link>
          </div>
          <div className="mt-3">
            <Timeline items={data.activity.recent.slice(0, 8)} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
