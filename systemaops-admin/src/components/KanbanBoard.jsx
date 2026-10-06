import { useState } from "react";
import { CalendarClock, Clock, UserRound } from "lucide-react";
import { PriorityBadge, TagChip, timeAgo } from "./ui.jsx";

function KanbanCard({ item, title, subtitle, onOpen, onDragStart, draggable, dragging }) {
  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={() => onOpen(item)}
      aria-grabbed={dragging ? "true" : undefined}
      className={`block w-full rounded-xl border border-ink-200 bg-white p-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition hover:border-brand-300 hover:shadow-[0_4px_14px_rgba(11,23,32,0.08)] ${
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      } ${dragging ? "scale-[1.02] opacity-60 shadow-lg" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-ink-900">{title}</div>
          <div className="truncate text-xs text-ink-500">{subtitle}</div>
        </div>
        <PriorityBadge value={item.priority} />
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1">
          <UserRound size={12} aria-hidden="true" />
          {item.assigneeName || "Unassigned"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={12} aria-hidden="true" />
          {timeAgo(item.createdAt)}
        </span>
      </div>
      {item.followUpAt && !item.followUpDone ? (
        <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">
          <CalendarClock size={12} aria-hidden="true" />
          Follow-up {new Date(item.followUpAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </div>
      ) : null}
      {item.tags && item.tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </div>
      ) : null}
    </button>
  );
}

/* Board groups items by status client-side (single ?status=a,b,c fetch).
   Drag-and-drop calls onMove(item, toStatus); the parent performs the
   PATCH and refetches, so a failed move visibly reverts. The per-card
   "Move to" <select> is the keyboard-accessible equivalent (drag is
   never the only way to change status). */
export default function KanbanBoard({
  columns,
  itemsByStatus,
  onOpen,
  titleFor,
  subtitleFor,
  onMove,
  canMove,
  movingId,
}) {
  const [dropTarget, setDropTarget] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  return (
    <div
      className="slim-scroll -mx-1 flex gap-3 overflow-x-auto px-1 pb-4"
      role="list"
      aria-label="Pipeline board"
      onDragEnd={() => {
        setDraggingId(null);
        setDropTarget(null);
      }}
    >
      {columns.map((status) => {
        const items = itemsByStatus[status] || [];
        const active = dropTarget === status;
        return (
          <div
            key={status}
            role="listitem"
            aria-label={`${status} column`}
            onDragOver={(e) => {
              if (!canMove) return;
              e.preventDefault();
              setDropTarget(status);
            }}
            onDragLeave={() => setDropTarget((t) => (t === status ? null : t))}
            onDrop={(e) => {
              e.preventDefault();
              setDropTarget(null);
              setDraggingId(null);
              if (!canMove) return;
              let raw = "";
              try {
                raw = e.dataTransfer.getData("application/x-record");
              } catch {
                raw = "";
              }
              if (raw) {
                try {
                  const parsed = JSON.parse(raw);
                  if (parsed.from !== status) onMove(parsed.item, status);
                } catch {
                  /* ignore malformed drag payload */
                }
              }
            }}
            className={`w-72 shrink-0 rounded-2xl border p-3 ${
              active ? "border-brand-600 bg-brand-50" : "border-ink-200 bg-ink-100/60"
            }`}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-700">
                {status.replace(/_/g, " ")}
              </h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-ink-500">
                {items.length}
              </span>
            </div>
            <div className="flex max-h-[62vh] flex-col gap-2 overflow-y-auto slim-scroll">
              {items.map((item) => (
                <div key={item._id}>
                  <KanbanCard
                    item={item}
                    title={titleFor(item)}
                    subtitle={subtitleFor(item)}
                    onOpen={onOpen}
                    dragging={draggingId === item._id}
                    draggable={!!canMove && movingId !== item._id}
                    onDragStart={(e) => {
                      setDraggingId(item._id);
                      e.dataTransfer.setData(
                        "application/x-record",
                        JSON.stringify({ item, from: item.status })
                      );
                      e.dataTransfer.effectAllowed = "move";
                    }}
                  />
                  {canMove ? (
                    <label className="mt-1 flex items-center gap-1 text-[11px] text-ink-500">
                      <span className="sr-only">Move {titleFor(item)} to status</span>
                      Move to{" "}
                      <select
                        value={item.status}
                        disabled={movingId === item._id}
                        onChange={(e) => {
                          if (e.target.value !== item.status) onMove(item, e.target.value);
                        }}
                        className="rounded-md border border-ink-300 bg-white px-1 py-0.5 text-[11px]"
                      >
                        {columns.map((c) => (
                          <option key={c} value={c}>
                            {c.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                </div>
              ))}
              {items.length === 0 && !active ? (
                <div className="rounded-xl border border-dashed border-ink-300 px-3 py-6 text-center text-xs text-ink-500">
                  No records
                </div>
              ) : null}
              {active ? (
                <div className="rounded-xl border-2 border-dashed border-brand-600 bg-brand-50 px-3 py-6 text-center text-xs font-semibold text-brand-800">
                  Drop contact here
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
