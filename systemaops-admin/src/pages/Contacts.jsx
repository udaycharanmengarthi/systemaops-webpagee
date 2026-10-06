import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Columns3, List, Search, SlidersHorizontal, UserX } from "lucide-react";
import { contactsApi, usersApi } from "../api/resources.js";
import { useFetch, useDebouncedValue } from "../hooks/useFetch.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import { canMutate } from "../auth/permissions.js";
import { useToast } from "../components/Toast.jsx";
import KanbanBoard from "../components/KanbanBoard.jsx";
import RecordDrawer from "../components/RecordDrawer.jsx";
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Pagination,
  PriorityBadge,
  SkeletonRows,
  StatusBadge,
  timeAgo,
} from "../components/ui.jsx";

const COLUMNS = ["NEW", "IN_REVIEW", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED"];
const STATUSES = ["", ...COLUMNS];
const PRIORITIES = ["", "LOW", "MEDIUM", "HIGH", "URGENT"];

export default function Contacts() {
  const { user } = useAuth();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const writable = canMutate(user?.role);

  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [priority, setPriority] = useState("");
  const [assignee, setAssignee] = useState(searchParams.get("assignee") || "");
  const [followup, setFollowup] = useState(searchParams.get("followup") || "");
  const [sort, setSort] = useState("-createdAt");
  const [selected, setSelected] = useState([]);
  const [movingId, setMovingId] = useState(null);
  /* Optimistic board state: id -> status the user just chose. Applied
     instantly for responsiveness, then either confirmed by the server
     response (via board refresh) or rolled back on failure. */
  const [optimistic, setOptimistic] = useState({});
  const [drawerId, setDrawerId] = useState(null);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [bulkOp, setBulkOp] = useState(null);
  const [bulkValue, setBulkValue] = useState("");
  const [users, setUsers] = useState([]);

  const q = useDebouncedValue(search);

  const listParams = useMemo(
    () => ({
      page,
      limit: 25,
      q: q || undefined,
      status: status || undefined,
      priority: priority || undefined,
      assignee: assignee || undefined,
      followup: followup || undefined,
      sort,
    }),
    [page, q, status, priority, assignee, followup, sort]
  );

  const boardKey = useMemo(
    () => JSON.stringify({ q, priority, assignee, followup }),
    [q, priority, assignee, followup]
  );

  const list = useFetch(
    () => (view === "list" ? contactsApi.list(listParams) : Promise.resolve({ data: { items: [] }, meta: null })),
    `list-${JSON.stringify(listParams)}-${view}`
  );
  const board = useFetch(
    () =>
      view === "board"
        ? contactsApi.list({
            limit: 100,
            status: COLUMNS.join(","),
            q: q || undefined,
            priority: priority || undefined,
            assignee: assignee || undefined,
            followup: followup || undefined,
            sort: "-createdAt",
          })
        : Promise.resolve({ data: { items: [] } }),
    `board-${boardKey}-${view}`
  );

  useEffect(() => {
    setPage(1);
    setSelected([]);
  }, [q, status, priority, assignee, followup, sort, view]);

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

  const itemsByStatus = useMemo(() => {
    const grouped = Object.fromEntries(COLUMNS.map((c) => [c, []]));
    for (const item of board.data?.items || []) {
      const effective = optimistic[item._id] || item.status;
      if (grouped[effective]) grouped[effective].push({ ...item, status: effective });
    }
    return grouped;
  }, [board.data, optimistic]);

  // Reconcile: fresh server data supersedes optimistic overrides.
  useEffect(() => {
    setOptimistic({});
  }, [board.data]);

  const toggleSelect = (id) =>
    setSelected((sel) => (sel.includes(id) ? sel.filter((s) => s !== id) : [...sel, id]));

  const moveCard = async (item, toStatus) => {
    if (movingId) return;
    setMovingId(item._id);
    setOptimistic((prev) => ({ ...prev, [item._id]: toStatus }));
    try {
      await contactsApi.setStatus(item._id, toStatus);
      toast.success(`Moved to ${toStatus.replace(/_/g, " ")}.`);
      board.refresh();
      list.refresh();
    } catch (err) {
      // Roll back the optimistic move; refresh restores server truth.
      setOptimistic((prev) => {
        const next = { ...prev };
        delete next[item._id];
        return next;
      });
      toast.error(err.message || "Status update failed. Your change was not saved.");
      board.refresh();
    } finally {
      setMovingId(null);
    }
  };

  const runBulk = async () => {
    try {
      const payload = { ids: selected, op: bulkOp };
      if (bulkOp === "status") payload.status = bulkValue;
      if (bulkOp === "priority") payload.priority = bulkValue;
      if (bulkOp === "assign") payload.assigneeId = bulkValue === "__unassign" ? null : bulkValue;
      const result = await contactsApi.bulk(payload);
      toast.success(
        `Updated ${result.data.updated.length} contact(s)${
          result.data.failed.length > 0 ? `, ${result.data.failed.length} skipped` : ""
        }.`
      );
      setSelected([]);
      setBulkOp(null);
      setBulkValue("");
      list.refresh();
      board.refresh();
    } catch (err) {
      toast.error(err.message || "Bulk update failed.");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setAssignee("");
    setFollowup("");
  };

  const filters = (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-52 flex-1">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, company, phone…"
          aria-label="Search contacts"
          className="input w-full pl-9"
        />
      </div>
      <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status filter" className="select">
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s === "" ? "All statuses" : s.replace(/_/g, " ")}</option>
        ))}
      </select>
      <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority filter" className="select">
        {PRIORITIES.map((s) => (
          <option key={s} value={s}>{s === "" ? "All priorities" : s}</option>
        ))}
      </select>
      <select value={assignee} onChange={(e) => setAssignee(e.target.value)} aria-label="Assignee filter" className="select">
        <option value="">Any assignee</option>
        <option value="me">Assigned to me</option>
        <option value="unassigned">Unassigned</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>
      <select value={followup} onChange={(e) => setFollowup(e.target.value)} aria-label="Follow-up filter" className="select">
        <option value="">Any follow-up</option>
        <option value="due">Due (incl. today)</option>
        <option value="overdue">Overdue</option>
        <option value="none">None scheduled</option>
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className="select">
        <option value="-createdAt">Newest</option>
        <option value="createdAt">Oldest</option>
        <option value="-updatedAt">Recently updated</option>
        <option value="followUpAt">Follow-up date</option>
      </select>
      {(search || status || priority || assignee || followup) ? (
        <button type="button" onClick={clearFilters} className="btn-ghost gap-1 px-3 py-2 text-xs">
          Clear
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
          <p className="text-sm text-ink-500">Leads and enquiries across the contact pipeline.</p>
        </div>
        <div className="flex rounded-lg border border-ink-300 p-0.5 text-sm" role="tablist" aria-label="View">
          <button
            type="button"
            role="tab"
            aria-selected={view === "board"}
            onClick={() => setView("board")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium ${view === "board" ? "bg-ink-900 text-white" : "text-ink-700"}`}
          >
            <Columns3 size={14} aria-hidden="true" />
            Board
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "list"}
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium ${view === "list" ? "bg-ink-900 text-white" : "text-ink-700"}`}
          >
            <List size={14} aria-hidden="true" />
            Table
          </button>
        </div>
      </div>

      {filters}

      {view === "list" ? (
        <>
          {writable && selected.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm">
              <span className="font-semibold">{selected.length} selected</span>
              <select
                value={bulkOp || ""}
                onChange={(e) => {
                  setBulkOp(e.target.value || null);
                  setBulkValue("");
                }}
                aria-label="Bulk action"
                className="select"
              >
                <option value="">Bulk action…</option>
                <option value="status">Change status</option>
                <option value="priority">Change priority</option>
                <option value="assign">Assign</option>
              </select>
              {bulkOp === "status" ? (
                <select value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} aria-label="Bulk status" className="select">
                  <option value="">Select status…</option>
                  {COLUMNS.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                  ))}
                </select>
              ) : null}
              {bulkOp === "priority" ? (
                <select value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} aria-label="Bulk priority" className="select">
                  <option value="">Select priority…</option>
                  {PRIORITIES.filter(Boolean).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : null}
              {bulkOp === "assign" ? (
                <select value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} aria-label="Bulk assignee" className="select">
                  <option value="">Select admin…</option>
                  <option value="__unassign">Unassign</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              ) : null}
              <button
                type="button"
                disabled={!bulkOp || !bulkValue}
                onClick={() => {
                  if (bulkOp === "status" && bulkValue === "CLOSED") setConfirmBulk(true);
                  else runBulk();
                }}
                className="btn-brand px-3 py-1.5"
              >
                Apply
              </button>
              <button type="button" onClick={() => setSelected([])} className="text-ink-500 hover:underline">
                Clear
              </button>
            </div>
          ) : null}

          {list.loading ? (
            <SkeletonRows count={8} />
          ) : list.error ? (
            <ErrorState message={list.error.message} onRetry={list.refresh} />
          ) : list.data.items.length === 0 ? (
            <EmptyState
              title="No contacts found."
              hint="Try changing your filters."
              icon={SlidersHorizontal}
              action={
                <button type="button" onClick={clearFilters} className="btn-ghost">
                  Clear filters
                </button>
              }
            />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-ink-200 bg-white">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-200 text-xs uppercase tracking-wider text-ink-500">
                    {writable ? <th className="px-4 py-3"><span className="sr-only">Select</span></th> : null}
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Assignee</th>
                    <th className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {list.data.items.map((c) => (
                    <tr key={c._id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50">
                      {writable ? (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected.includes(c._id)}
                            onChange={() => toggleSelect(c._id)}
                            aria-label={`Select ${c.name}`}
                          />
                        </td>
                      ) : null}
                      <td className="px-4 py-3 font-semibold">
                        <button
                          type="button"
                          onClick={() => setDrawerId(c._id)}
                          className="text-left hover:text-brand-700 hover:underline"
                        >
                          {c.name}
                        </button>
                        <div className="text-xs font-normal text-ink-500">{c.email}</div>
                      </td>
                      <td className="px-4 py-3">{c.company || "—"}</td>
                      <td className="px-4 py-3"><StatusBadge value={c.status} /></td>
                      <td className="px-4 py-3"><PriorityBadge value={c.priority} /></td>
                      <td className="px-4 py-3">
                        {c.assigneeName || (
                          <span className="inline-flex items-center gap-1 text-ink-500">
                            <UserX size={13} aria-hidden="true" />
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink-500">{timeAgo(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination meta={list.meta} onPage={setPage} />
        </>
      ) : board.loading ? (
        <SkeletonRows count={4} />
      ) : board.error ? (
        <ErrorState message={board.error.message} onRetry={board.refresh} />
      ) : (
        <KanbanBoard
          columns={COLUMNS}
          itemsByStatus={itemsByStatus}
          onOpen={(item) => setDrawerId(item._id)}
          titleFor={(item) => item.company || item.name}
          subtitleFor={(item) => item.name}
          onMove={moveCard}
          canMove={writable}
          movingId={movingId}
        />
      )}

      {drawerId ? (
        <RecordDrawer
          entity="contact"
          id={drawerId}
          onClose={() => setDrawerId(null)}
          onChanged={() => {
            list.refresh();
            board.refresh();
          }}
        />
      ) : null}

      <ConfirmDialog
        open={confirmBulk}
        title={`Close ${selected.length} contact(s)?`}
        body="This action will move the selected records to CLOSED. It is recorded in the audit timeline."
        confirmLabel="Close contacts"
        danger
        onCancel={() => setConfirmBulk(false)}
        onConfirm={async () => {
          setConfirmBulk(false);
          await runBulk();
        }}
      />
    </div>
  );
}
