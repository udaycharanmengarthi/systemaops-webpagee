import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarClock, ClipboardList, FileText, ShieldCheck, Tag } from "lucide-react";
import { careersApi, usersApi } from "../api/resources.js";
import { useFetch } from "../hooks/useFetch.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import { canMutate } from "../auth/permissions.js";
import { useToast } from "../components/Toast.jsx";
import {
  ErrorState,
  PriorityBadge,
  SkeletonRows,
  StatusBadge,
  TagChip,
  Timeline,
} from "../components/ui.jsx";

const STATUSES = ["NEW", "REVIEWING", "SHORTLISTED", "INTERVIEW", "OFFER", "HIRED", "REJECTED"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="section-label">{label}</dt>
      <dd className="text-sm text-ink-900">{children}</dd>
    </div>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="card p-5">
      <h2 className="flex items-center gap-2 text-sm font-bold">
        {Icon ? <Icon size={15} className="text-ink-500" aria-hidden="true" /> : null}
        {title}
      </h2>
      {children}
    </section>
  );
}

function ExtLink({ href, label }) {
  if (!href) return "—";
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">
      {label || href}
    </a>
  );
}

export default function CareerDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const writable = canMutate(user?.role);
  const { data, loading, error, refresh } = useFetch(() => careersApi.get(id), id);

  const [users, setUsers] = useState([]);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");
  const [followUpAt, setFollowUpAt] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
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
  }, [writable]);

  useEffect(() => {
    if (data?.career) {
      setTags((data.career.tags || []).join(", "));
      setFollowUpAt(data.career.followUpAt ? data.career.followUpAt.slice(0, 16) : "");
      setFollowUpNote(data.career.followUpNote || "");
    }
  }, [data]);

  if (loading) return <SkeletonRows count={6} />;
  if (error || !data) return <ErrorState message={error?.message} onRetry={refresh} />;
  const { career, timeline } = data;

  const mutate = async (fn, successMessage) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
      toast.success(successMessage);
      refresh();
    } catch (err) {
      toast.error(err.message || "Unable to save changes.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/careers" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
          <ArrowLeft size={14} aria-hidden="true" />
          All applications
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            {career.firstName} {career.lastName}
          </h1>
          <StatusBadge value={career.status} />
          <PriorityBadge value={career.priority} />
        </div>
        <p className="mt-0.5 text-sm text-ink-500">
          {career.role} · {career.assigneeName ? `Assigned to ${career.assigneeName}` : "Unassigned"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Panel title="Candidate">
            <dl className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Email">{career.email}</Field>
              <Field label="Phone">{career.phone}</Field>
              <Field label="LinkedIn"><ExtLink href={career.linkedin} label="Open profile" /></Field>
              <Field label="Portfolio"><ExtLink href={career.portfolio} label={career.portfolio ? "Open portfolio" : ""} /></Field>
              <Field label="Resume"><ExtLink href={career.resumeUrl} label="Open resume" /></Field>
              <Field label="Tags">
                <span className="flex flex-wrap gap-1">
                  {(career.tags || []).map((t) => (
                    <TagChip key={t} label={t} />
                  ))}
                  {(career.tags || []).length === 0 ? "—" : null}
                </span>
              </Field>
            </dl>
            {career.whyUs ? (
              <div className="mt-4">
                <div className="section-label">Why SystemaOps</div>
                <div className="mt-1 rounded-xl bg-ink-50 p-4 text-sm leading-relaxed">{career.whyUs}</div>
              </div>
            ) : null}
          </Panel>

          <Panel title={`Notes (${(career.notes || []).length})`} icon={ClipboardList}>
            <ul className="mt-3 flex flex-col gap-3">
              {(career.notes || []).map((n, i) => (
                <li key={`${n.createdAt}-${i}`} className="rounded-xl border border-ink-200 p-3 text-sm">
                  <div className="flex items-center justify-between text-xs text-ink-500">
                    <span className="font-semibold text-ink-900">{n.authorName}</span>
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap">{n.body}</p>
                </li>
              ))}
              {(career.notes || []).length === 0 ? (
                <li className="text-sm text-ink-500">No notes yet. Notes are internal only.</li>
              ) : null}
            </ul>
            {writable ? (
              <form
                className="mt-3 flex flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!note.trim()) return;
                  mutate(() => careersApi.addNote(id, note.trim()), "Note added.").then(() => setNote(""));
                }}
              >
                <label htmlFor="note" className="sr-only">Add an internal note</label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  placeholder="Add an internal note…"
                  className="input"
                />
                <button type="submit" disabled={busy || !note.trim()} className="btn-primary self-end">
                  Add note
                </button>
              </form>
            ) : null}
          </Panel>

          <Panel title="Timeline">
            <div className="mt-3">
              <Timeline items={timeline} />
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Manage">
            {!writable ? (
              <p className="mt-2 text-sm text-ink-500">Your role is read-only.</p>
            ) : (
              <div className="mt-3 flex flex-col gap-3 text-sm">
                <label className="flex flex-col gap-1 font-medium">
                  Status
                  <select
                    value={career.status}
                    disabled={busy}
                    onChange={(e) =>
                      mutate(() => careersApi.setStatus(id, e.target.value), `Status changed to ${e.target.value.replace(/_/g, " ")}.`)
                    }
                    className="select"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 font-medium">
                  Assignee
                  <select
                    value={career.assigneeId || ""}
                    disabled={busy}
                    onChange={(e) => mutate(() => careersApi.setAssignee(id, e.target.value || null), "Assignment updated.")}
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
                <label className="flex flex-col gap-1 font-medium">
                  Priority
                  <select
                    value={career.priority}
                    disabled={busy}
                    onChange={(e) => mutate(() => careersApi.setPriority(id, e.target.value), "Priority updated.")}
                    className="select"
                  >
                    {PRIORITIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutate(
                      () => careersApi.setTags(id, tags.split(",").map((t) => t.trim()).filter(Boolean)),
                      "Tags updated."
                    );
                  }}
                  className="flex flex-col gap-1 font-medium"
                >
                  <label htmlFor="tags" className="inline-flex items-center gap-1.5">
                    <Tag size={13} aria-hidden="true" />
                    Tags (comma-separated)
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="frontend, urgent…"
                      className="input min-w-0 flex-1"
                    />
                    <button type="submit" disabled={busy} className="btn-ghost">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}
          </Panel>

          <Panel title="Follow-up" icon={CalendarClock}>
            {career.followUpAt ? (
              <p className="mt-2 text-sm">
                {career.followUpDone ? "Completed" : "Scheduled"}:{" "}
                {new Date(career.followUpAt).toLocaleString()}
                {career.followUpNote ? ` — ${career.followUpNote}` : ""}
              </p>
            ) : (
              <p className="mt-2 text-sm text-ink-500">No follow-up scheduled.</p>
            )}
            {writable ? (
              <form
                className="mt-3 flex flex-col gap-2 text-sm"
                onSubmit={(e) => {
                  e.preventDefault();
                  mutate(
                    () =>
                      careersApi.setFollowUp(id, {
                        followUpAt: followUpAt ? new Date(followUpAt).toISOString() : null,
                        followUpNote,
                      }),
                    "Follow-up updated."
                  );
                }}
              >
                <label className="flex flex-col gap-1 font-medium">
                  Date & time
                  <input
                    type="datetime-local"
                    value={followUpAt}
                    onChange={(e) => setFollowUpAt(e.target.value)}
                    className="input"
                  />
                </label>
                <label className="flex flex-col gap-1 font-medium">
                  Note
                  <input
                    value={followUpNote}
                    onChange={(e) => setFollowUpNote(e.target.value)}
                    maxLength={500}
                    placeholder="Schedule interview…"
                    className="input"
                  />
                </label>
                <div className="flex gap-2">
                  <button type="submit" disabled={busy} className="btn-primary">
                    Save
                  </button>
                  {career.followUpAt && !career.followUpDone ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => mutate(() => careersApi.setFollowUp(id, { followUpDone: true }), "Follow-up completed.")}
                      className="btn-ghost"
                    >
                      Mark done
                    </button>
                  ) : null}
                </div>
              </form>
            ) : null}
          </Panel>

          <Panel title="Record" icon={ShieldCheck}>
            <dl className="mt-3 flex flex-col gap-3">
              <Field label="Privacy acknowledgement">
                {career.privacyAccepted ? `Accepted (v${career.privacyVersion || "?"})` : "Missing"}
              </Field>
              <Field label="Applied">{new Date(career.createdAt).toLocaleString()}</Field>
              <Field label="Last updated">{new Date(career.updatedAt).toLocaleString()}</Field>
              <Field label="Retention expires">
                {career.expiresAt ? new Date(career.expiresAt).toLocaleDateString() : "—"}
              </Field>
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
}
