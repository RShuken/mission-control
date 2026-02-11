"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type KanbanItem } from "@/lib/data";
import { formatDistanceToNow } from "date-fns";

interface KanbanCardProps {
  item: KanbanItem;
  isDragging?: boolean;
}

const typeIcons: Record<string, string> = {
  pr: "🔀",
  task: "📋",
  content: "✍️",
  bug: "🐛",
  feature: "✨",
};

const priorityColors: Record<string, string> = {
  critical: "priority-critical",
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
};

const projectColors: Record<string, string> = {
  "OpenClaw Install": "bg-purple-500",
  "Denver AI Training": "bg-blue-500",
  "MC Leads Worker": "bg-green-500",
  "Mission Control": "bg-amber-500",
};

export function KanbanCard({ item, isDragging = false }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`kanban-card ${isDragging ? "dragging" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{typeIcons[item.type] || "📋"}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              projectColors[item.project] || "bg-gray-500"
            }`}
            title={item.project}
          />
        </div>
        <span className={`status-badge ${priorityColors[item.priority]}`}>
          {item.priority}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-medium text-white text-sm mb-2 line-clamp-2">
        {item.title}
      </h4>

      {/* Description */}
      {item.description && (
        <p className="text-xs text-[var(--muted)] mb-3 line-clamp-2">
          {item.description}
        </p>
      )}

      {/* Labels */}
      {item.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.labels.slice(0, 3).map((label) => (
            <span
              key={label}
              className="text-xs px-2 py-0.5 rounded bg-[var(--background)] text-[var(--muted)]"
            >
              {label}
            </span>
          ))}
          {item.labels.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded bg-[var(--background)] text-[var(--muted)]">
              +{item.labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{item.project}</span>
        <span>
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
