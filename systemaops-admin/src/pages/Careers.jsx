import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Columns3, List, Search, SlidersHorizontal, UserX } from "lucide-react";
import { careersApi } from "../api/resources.js";
import { useFetch, useDebouncedValue } from "../hooks/useFetch.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import { canMutate } from "../auth/permissions.js";
import { useToast } from "../components/Toast.jsx";
import KanbanBoard from "../components/KanbanBoard.jsx";
import RecordDrawer from "../components/RecordDrawer.jsx";
import {
  EmptyState,
  ErrorState,
  Pagination,
  PriorityBadge,
  SkeletonRows,
  StatusBadge,
  timeAgo,
} from "../components/ui.jsx";

const COLUMNS = ["NEW", "REVIEWING", "SHORTLISTED", "INTERVIEW", "OFFER", "HIRED", "REJECTED"];
const STATUSES = ["", ...COLUMNS];
const PRIORITIES = ["", "LOW", "MEDIUM", "HIGH", "URGENT"];

export default function Careers() {
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
  const [followup, setFollowup] = useState("");
  const [role, setRole] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [movingId, setMovingId] = useState(null);
  const [drawerId, setDrawerId] = useState(null);

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
      role: role || undefined,
      sort,
    }),
    [page, q, status, priority, assignee, followup, role, sort]
  );

  const list = useFetch(
    () => (view === "list" ? careersApi.list(listParams) : Promise.resolve({ data: { items: [] }, meta: null })),
    `list-${JSON.stringify(listParams)}-${view}`
  );
  const board = useFetch(
    () =>
      view === "board"
        ? careersApi.list({
            limit: 100,
            status: COLUMNS.join(","),
            q: q || undefined,
            priority: priority || undefined,
            assignee: assignee || undefined,
            followup: followup || undefined,
            role: role || undefined,
            sort: "-createdAt",
          })
        : Promise.resolve({ data: { items: [] } }),
    `board-${q}-${priority}-${assignee}-${followup}-${role}-${view}`
  );

  useEffect(() => {
    setPage(1);
  }, [q, status, priority, assignee, followup, role, sort, view]);

  const itemsByStatus = useMemo(() => {
    const grouped = Object.fromEntries(COLUMNS.map((c) => [c, []]));
    for (const item of board.data?.items || []) {
      if (grouped[item.status]) grouped[item.status].push(item);
    }
    return grouped;
  }, [board.data]);

  const moveCard = async (item, toStatus) => {
    setMovingId(item._id);
    try {
      await careersApi.setStatus(item._id, toStatus);
      toast.success(`Moved to ${toStatus.replace(/_/g, " ")}.`);
      board.refresh();
      list.refresh();
    } catch (err) {
      toast.error(err.message || "Unable to update application. Changes were not saved.");
      board.refresh();
    } finally {
      setMovingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setAssignee("");
    setFollowup("");
    setRole("");
  };

  const filters = (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-52 flex-1">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, role…"
          aria-label="Search applications"
          className="input w-full pl-9"
        />
      </div>
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role contains…"
        aria-label="Role filter"
        className="input"
      />
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
      {(search || status || priority || assignee || followup || role) ? (
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
          <h1 className="text-2xl font-bold tracking-tight">Careers</h1>
          <p className="text-sm text-ink-500">Candidate applications across the hiring pipeline.</p>
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
          {list.loading ? (
            <SkeletonRows count={8} />
          ) : list.error ? (
            <ErrorState message={list.error.message} onRetry={list.refresh} />
          ) : list.data.items.length === 0 ? (
            <EmptyState
              title="No applications found."
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
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Assignee</th>
                    <th className="px-4 py-3">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {list.data.items.map((c) => (
                    <tr key={c._id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50">
                      <td className="px-4 py-3 font-semibold">
                        <button
                          type="button"
                          onClick={() => setDrawerId(c._id)}
                          className="text-left hover:text-brand-700 hover:underline"
                        >
                          {c.firstName} {c.lastName}
                        </button>
                        <div className="text-xs font-normal text-ink-500">{c.email}</div>
                      </td>
                      <td className="px-4 py-3">{c.role}</td>
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
          titleFor={(item) => `${item.firstName} ${item.lastName}`}
          subtitleFor={(item) => item.role}
          onMove={moveCard}
          canMove={writable}
          movingId={movingId}
        />
      )}

      {drawerId ? (
        <RecordDrawer
          entity="career"
          id={drawerId}
          onClose={() => setDrawerId(null)}
          onChanged={() => {
            list.refresh();
            board.refresh();
          }}
        />
      ) : null}
    </div>
  );
}
