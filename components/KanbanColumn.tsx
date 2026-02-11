"use client";

import { useDroppable } from "@dnd-kit/core";
import { type KanbanColumn as KanbanColumnType } from "@/lib/data";

interface KanbanColumnProps {
  column: KanbanColumnType;
  children: React.ReactNode;
}

export function KanbanColumn({ column, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex-shrink-0 w-72 sm:w-80">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${column.color}`} />
          <h3 className="font-semibold text-white">{column.title}</h3>
          <span className="text-xs text-[var(--muted)] bg-[var(--card)] px-2 py-0.5 rounded-full">
            {column.items.length}
          </span>
        </div>
        <button className="text-[var(--muted)] hover:text-white p-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`kanban-column bg-[var(--card)]/30 rounded-xl p-3 border transition-colors ${
          isOver
            ? "border-accent-500/50 bg-accent-500/5"
            : "border-[var(--border)]"
        }`}
      >
        {column.items.length === 0 ? (
          <div className="text-center py-8 text-[var(--muted)] text-sm">
            <p>No items</p>
            <p className="text-xs mt-1">Drag items here</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
