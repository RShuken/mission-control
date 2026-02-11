"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "@/components/KanbanColumn";
import { KanbanCard } from "@/components/KanbanCard";
import {
  getKanbanColumns,
  saveKanbanState,
  loadKanbanState,
  type KanbanColumn as KanbanColumnType,
  type KanbanItem,
} from "@/lib/data";

export default function KanbanPage() {
  const [columns, setColumns] = useState<KanbanColumnType[]>([]);
  const [activeItem, setActiveItem] = useState<KanbanItem | null>(null);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const saved = loadKanbanState();
    if (saved) {
      setColumns(saved);
    } else {
      setColumns(getKanbanColumns());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && columns.length > 0) {
      saveKanbanState(columns);
    }
  }, [columns, loading]);

  function findColumnByItemId(itemId: string): KanbanColumnType | undefined {
    return columns.find((col) => col.items.some((item) => item.id === itemId));
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const column = findColumnByItemId(active.id as string);
    if (column) {
      const item = column.items.find((i) => i.id === active.id);
      setActiveItem(item || null);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source and destination columns
    const sourceColumn = findColumnByItemId(activeId);
    let destColumn = columns.find((col) => col.id === overId);

    // If over is an item, find its column
    if (!destColumn) {
      destColumn = findColumnByItemId(overId);
    }

    if (!sourceColumn || !destColumn) return;

    // Same column - reorder
    if (sourceColumn.id === destColumn.id) {
      const oldIndex = sourceColumn.items.findIndex((i) => i.id === activeId);
      const newIndex = sourceColumn.items.findIndex((i) => i.id === overId);

      if (oldIndex !== newIndex) {
        setColumns((prev) =>
          prev.map((col) => {
            if (col.id === sourceColumn.id) {
              return {
                ...col,
                items: arrayMove(col.items, oldIndex, newIndex),
              };
            }
            return col;
          })
        );
      }
    } else {
      // Different columns - move item
      const item = sourceColumn.items.find((i) => i.id === activeId);
      if (!item) return;

      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === sourceColumn.id) {
            return {
              ...col,
              items: col.items.filter((i) => i.id !== activeId),
            };
          }
          if (col.id === destColumn!.id) {
            const overIndex = col.items.findIndex((i) => i.id === overId);
            const newItems = [...col.items];
            if (overIndex >= 0) {
              newItems.splice(overIndex, 0, item);
            } else {
              newItems.push(item);
            }
            return {
              ...col,
              items: newItems,
            };
          }
          return col;
        })
      );

      // Trigger workflow based on destination column
      console.log(`Item ${item.title} moved to ${destColumn.title}`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  const totalItems = columns.reduce((sum, col) => sum + col.items.length, 0);

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Kanban Board</h1>
          <p className="text-[var(--muted)]">
            {totalItems} items across {columns.length} columns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm text-gray-300">
            <option value="all">All Projects</option>
            <option value="oci">OpenClaw Install</option>
            <option value="dat">Denver AI Training</option>
            <option value="mc-leads">MC Leads</option>
          </select>
          <button className="px-4 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg text-sm text-white font-medium transition-colors">
            + Add Task
          </button>
        </div>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column}>
              <SortableContext
                items={column.items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {column.items.map((item) => (
                  <KanbanCard key={item.id} item={item} />
                ))}
              </SortableContext>
            </KanbanColumn>
          ))}
        </div>

        <DragOverlay>
          {activeItem ? <KanbanCard item={activeItem} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
