import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { activityApi } from "../api/resources.js";
import { useFetch, useDebouncedValue } from "../hooks/useFetch.js";
import { EmptyState, ErrorState, Pagination, SkeletonRows, timeAgo } from "../components/ui.jsx";

function describe(item) {
  const from = item.fromValue ? `${item.fromValue} → ` : "";
  const to = item.toValue || "";
  switch (item.action) {
    case "CONTACT_CREATED":
      return <span>created contact <strong>{item.entityLabel}</strong></span>;
    case "CAREER_CREATED":
      return <span>received application <strong>{item.entityLabel}</strong></span>;
    case "CONTACT_STATUS_CHANGED":
      return <span>moved <strong>{item.entityLabel}</strong> {from}{to}</span>;
    case "CAREER_STATUS_CHANGED":
      return <span>moved <strong>{item.entityLabel}</strong> {from}{to}</span>;
    case "CONTACT_ASSIGNED":
    case "CAREER_ASSIGNED":
      return <span>assigned <strong>{item.entityLabel}</strong> to {to}</span>;
    case "CONTACT_PRIORITY_CHANGED":
    case "CAREER_PRIORITY_CHANGED":
      return <span>changed priority of <strong>{item.entityLabel}</strong> {from}{to}</span>;
    case "CONTACT_NOTE_ADDED":
    case "CAREER_NOTE_ADDED":
      return <span>added a note to <strong>{item.entityLabel}</strong></span>;
    case "ADMIN_LOGIN":
      return <span>logged in</span>;
    case "ADMIN_ROLE_CHANGED":
      return <span>updated admin <strong>{item.entityLabel}</strong> ({to})</span>;
    default:
      return <span>{item.action.toLowerCase().replace(/_/g, " ")} {item.entityLabel}</span>;
  }
}

export default function Activity() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [actorSearch, setActorSearch] = useState("");
  const actor = useDebouncedValue(actorSearch);

  /* ?hours=N (e.g. from the dashboard's "Team actions (24h)" card)
     maps to the backend's real `from` range filter — never faked. */
  const hoursParam = searchParams.get("hours");
  const hours = Number.isFinite(Number(hoursParam)) ? Math.max(1, Number(hoursParam)) : null;
  const fromIso = hours ? new Date(Date.now() - hours * 3600 * 1000).toISOString() : null;

  const params = useMemo(
    () => ({
      page,
      limit: 25,
      action: action || undefined,
      entityType: entityType || undefined,
      from: fromIso || undefined,
    }),
    [page, action, entityType, fromIso]
  );

  const { data, meta, loading, error, refresh } = useFetch(
    () => activityApi.list(params),
    JSON.stringify(params)
  );

  useEffect(() => {
    setPage(1);
  }, [action, entityType]);

  const items = useMemo(() => {
    const list = data?.items || [];
    if (!actor.trim()) return list;
    const needle = actor.trim().toLowerCase();
    return list.filter((a) => (a.actorName || "").toLowerCase().includes(needle));
  }, [data, actor]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity</h1>
        <p className="text-sm text-ink-500">Company-wide audit trail. Records are immutable.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={actorSearch}
          onChange={(e) => setActorSearch(e.target.value)}
          placeholder="Filter by actor name…"
          aria-label="Filter by actor"
          className="input"
        />
        <select value={entityType} onChange={(e) => setEntityType(e.target.value)} aria-label="Entity filter" className="select">
          <option value="">All entities</option>
          <option value="contact">Contacts</option>
          <option value="career">Careers</option>
          <option value="adminuser">Admin users</option>
          <option value="auth">Auth events</option>
        </select>
        <select value={action} onChange={(e) => setAction(e.target.value)} aria-label="Action filter" className="select">
          <option value="">All actions</option>
          <option value="CONTACT_CREATED">Contact created</option>
          <option value="CONTACT_STATUS_CHANGED">Contact status changed</option>
          <option value="CONTACT_ASSIGNED">Contact assigned</option>
          <option value="CAREER_CREATED">Application created</option>
          <option value="CAREER_STATUS_CHANGED">Application status changed</option>
          <option value="ADMIN_LOGIN">Logins</option>
        </select>
      </div>

      {loading ? (
        <SkeletonRows count={8} />
      ) : error ? (
        <ErrorState message={error.message} onRetry={refresh} />
      ) : items.length === 0 ? (
        <EmptyState title="No activity found." hint="Try changing your filters." icon={SlidersHorizontal} />
      ) : (
        <div className="card p-5">
          <ol className="flex flex-col">
            {items.map((item) => (
              <li key={item._id} className="flex items-start justify-between gap-4 border-b border-ink-100 py-3 last:border-0">
                <div className="min-w-0">
                  <div className="text-sm text-ink-900">
                    <span className="font-semibold">{item.actorName || "System"}</span>{" "}
                    {describe(item)}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-500">{timeAgo(item.createdAt)}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {item.entityType === "contact" && item.entityId ? (
                    <Link to={`/contacts/${item.entityId}`} className="btn-ghost px-2.5 py-1 text-xs">
                      Open
                    </Link>
                  ) : null}
                  {item.entityType === "career" && item.entityId ? (
                    <Link to={`/careers/${item.entityId}`} className="btn-ghost px-2.5 py-1 text-xs">
                      Open
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
      <Pagination meta={meta} onPage={setPage} />
    </div>
  );
}
