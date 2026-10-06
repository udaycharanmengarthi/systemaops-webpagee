import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import { notificationsApi } from "../api/resources.js";
import { useFetch } from "../hooks/useFetch.js";
import { useToast } from "../components/Toast.jsx";
import { EmptyState, ErrorState, Pagination, SkeletonRows, timeAgo } from "../components/ui.jsx";

export default function Notifications() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data, meta, loading, error, refresh } = useFetch(
    () => notificationsApi.list({ page, limit: 25, unread: unreadOnly ? "true" : undefined }),
    `${page}-${unreadOnly}`
  );

  const markRead = async (id) => {
    try {
      await notificationsApi.markRead(id);
      refresh();
    } catch (err) {
      toast.error(err.message || "Unable to update notification.");
    }
  };

  const markAll = async () => {
    try {
      const result = await notificationsApi.markAllRead();
      toast.success(`Marked ${result.data.updated} as read.`);
      refresh();
    } catch (err) {
      toast.error(err.message || "Unable to update notifications.");
    }
  };

  const targetFor = (n) => {
    if (n.entityType === "contact" && n.entityId) return `/contacts/${n.entityId}`;
    if (n.entityType === "career" && n.entityId) return `/careers/${n.entityId}`;
    return null;
  };

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-ink-500">
            {data && data.unread > 0 ? `${data.unread} unread` : "You're all caught up."}
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => {
              setUnreadOnly((v) => !v);
              setPage(1);
            }}
            className={`btn-ghost ${unreadOnly ? "border-brand-600 bg-brand-50" : ""}`}
            aria-pressed={unreadOnly}
          >
            Unread only
          </button>
          <button type="button" onClick={markAll} className="btn-ghost gap-1.5">
            <CheckCheck size={14} aria-hidden="true" />
            Mark all read
          </button>
        </div>
      </div>

      {loading ? (
        <SkeletonRows count={6} />
      ) : error ? (
        <ErrorState message={error.message} onRetry={refresh} />
      ) : data.items.length === 0 ? (
        <EmptyState
          title="No notifications."
          hint={unreadOnly ? "You are all caught up." : "New contacts, applications and assignments will appear here."}
          icon={Bell}
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {data.items.map((n) => {
            const target = targetFor(n);
            return (
              <li
                key={n._id}
                className={`card flex items-center justify-between gap-3 px-4 py-3 ${
                  n.read ? "" : "border-brand-600"
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  {!n.read ? (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-label="Unread" />
                  ) : (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ink-200" aria-hidden="true" />
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-ink-900">{n.title}</div>
                    {n.body ? <div className="mt-0.5 truncate text-sm text-ink-500">{n.body}</div> : null}
                    <div className="mt-0.5 text-xs text-ink-500">
                      {n.type.replace(/_/g, " ")} · {timeAgo(n.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2 text-sm">
                  {target ? (
                    <Link to={target} className="btn-ghost px-3 py-1.5">
                      Open
                    </Link>
                  ) : null}
                  {!n.read ? (
                    <button type="button" onClick={() => markRead(n._id)} className="btn-ghost px-3 py-1.5">
                      Mark read
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Pagination meta={meta} onPage={setPage} />
    </div>
  );
}
