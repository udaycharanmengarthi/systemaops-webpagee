import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";
import { contactsApi, careersApi, usersApi } from "../api/resources.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import { canMutate } from "../auth/permissions.js";
import { useToast } from "./Toast.jsx";
import { Avatar, PriorityBadge, StatusBadge, Timeline } from "./ui.jsx";

const CONTACT_STATUSES = ["NEW", "IN_REVIEW", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED"];
const CAREER_STATUSES = ["NEW", "REVIEWING", "SHORTLISTED", "INTERVIEW", "OFFER", "HIRED", "REJECTED"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

/* Right-side quick detail drawer: manage controls + timeline, with a
   link to the full detail page for deep work. Uses the same existing
   status/priority/assignee endpoints — backend remains authoritative. */
export default function RecordDrawer({ entity, id, onClose, onChanged }) {
  const { user } = useAuth();
  const toast = useToast();
  const writable = canMutate(user?.role);
  const api = entity === "career" ? careersApi : contactsApi;
  const statuses = entity === "career" ? CAREER_STATUSES : CONTACT_STATUSES;
  const [record, setRecord] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get(id)
      .then((data) => {
        if (cancelled) return;
        setRecord(data[entity]);
        setTimeline(data.timeline || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Unable to load record.");
      });
    if (writable) {
      usersApi
        .assignable()
        .then((r) => {
          if (!cancelled) setUsers(r.data.items || []);
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, entity]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const mutate = async (fn, message) => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await fn();
      setRecord(result.data[entity]);
      toast.success(message);
      if (onChanged) onChanged();
    } catch (err) {
      toast.error(err.message || "Unable to save changes.");
    } finally {
      setBusy(false);
    }
  };

  const title =
    entity === "career"
      ? `${record?.firstName || ""} ${record?.lastName || ""}`.trim()
      : record?.name || "";
  const subtitle = entity === "career" ? record?.role : record?.company || record?.email;

  return (
    <div className="fixed inset-0 z-[85] flex justify-end">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} aria-hidden="true" />
      <div
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`${entity === "career" ? "Application" : "Contact"} details`}
      >
        <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-700">
            {entity === "career" ? "Application" : "Contact"}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100"
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="slim-scroll flex-1 overflow-y-auto p-5">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : !record ? (
            <div className="py-16 text-center text-sm text-ink-500">Loading…</div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <Avatar name={title} size={40} />
                <div className="min-w-0">
                  <div className="truncate text-base font-bold text-ink-900">{title}</div>
                  <div className="truncate text-sm text-ink-500">{subtitle || record.email}</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <StatusBadge value={record.status} />
                    <PriorityBadge value={record.priority} />
                  </div>
                </div>
              </div>

              {writable ? (
                <div className="flex flex-col gap-3 rounded-xl border border-ink-200 p-4 text-sm">
                  <label className="flex flex-col gap-1 font-medium">
                    Status
                    <select
                      value={record.status}
                      disabled={busy}
                      onChange={(e) =>
                        mutate(() => api.setStatus(id, e.target.value), `Status changed to ${e.target.value.replace(/_/g, " ")}.`)
                      }
                      className="select"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 font-medium">
                    Priority
                    <select
                      value={record.priority}
                      disabled={busy}
                      onChange={(e) => mutate(() => api.setPriority(id, e.target.value), "Priority updated.")}
                      className="select"
                    >
                      {PRIORITIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 font-medium">
                    Assignee
                    <select
                      value={record.assigneeId || ""}
                      disabled={busy}
                      onChange={(e) =>
                        mutate(() => api.setAssignee(id, e.target.value || null), "Assignment updated.")
                      }
                      className="select"
                    >
                      <option value="">Unassigned</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.role})
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : null}

              {entity === "contact" && record.message ? (
                <div className="rounded-xl bg-ink-50 p-4 text-sm leading-relaxed">{record.message}</div>
              ) : null}
              {entity === "career" && record.whyUs ? (
                <div className="rounded-xl bg-ink-50 p-4 text-sm leading-relaxed">{record.whyUs}</div>
              ) : null}

              <div>
                <div className="section-label mb-2">Timeline</div>
                <Timeline items={timeline.slice(0, 20)} />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-ink-200 p-3">
          <Link
            to={entity === "career" ? `/careers/${id}` : `/contacts/${id}`}
            className="btn-ghost w-full gap-2"
          >
            Open full page
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
