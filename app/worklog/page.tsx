"use client";

import { useState, useEffect } from "react";
import { getWorkItems, type WorkItem } from "@/lib/data";
import { format, formatDistanceToNow, isToday, isYesterday, startOfDay } from "date-fns";

export default function WorkLogPage() {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterProject, setFilterProject] = useState<string>("all");

  useEffect(() => {
    setWorkItems(getWorkItems());
    setLoading(false);
  }, []);

  const filteredItems = workItems.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (
      filterProject !== "all" &&
      !item.project.toLowerCase().includes(filterProject.toLowerCase())
    )
      return false;
    return true;
  });

  // Group items by date
  const groupedItems = filteredItems.reduce((groups, item) => {
    const date = startOfDay(new Date(item.timestamp)).toISOString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, WorkItem[]>);

  const sortedDates = Object.keys(groupedItems).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const typeStyles: Record<string, { icon: string; bg: string; text: string }> = {
    commit: { icon: "📝", bg: "bg-green-500/20", text: "text-green-400" },
    pr: { icon: "🔀", bg: "bg-purple-500/20", text: "text-purple-400" },
    deploy: { icon: "🚀", bg: "bg-blue-500/20", text: "text-blue-400" },
    task: { icon: "✅", bg: "bg-amber-500/20", text: "text-amber-400" },
    content: { icon: "✍️", bg: "bg-pink-500/20", text: "text-pink-400" },
  };

  function getDateLabel(dateStr: string): string {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  // Stats
  const stats = {
    total: filteredItems.length,
    commits: filteredItems.filter((i) => i.type === "commit").length,
    prs: filteredItems.filter((i) => i.type === "pr").length,
    deploys: filteredItems.filter((i) => i.type === "deploy").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Work Log</h1>
          <p className="text-[var(--muted)]">
            Timeline of all work completed by Molty
          </p>
        </div>
        <button className="px-4 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg text-sm text-white font-medium transition-colors">
          Export Log
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-3xl font-bold text-white">{stats.total}</p>
          <p className="text-sm text-[var(--muted)]">Total Items</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-3xl font-bold text-green-400">{stats.commits}</p>
          <p className="text-sm text-[var(--muted)]">Commits</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-3xl font-bold text-purple-400">{stats.prs}</p>
          <p className="text-sm text-[var(--muted)]">PRs</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-3xl font-bold text-blue-400">{stats.deploys}</p>
          <p className="text-sm text-[var(--muted)]">Deploys</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-gray-300"
        >
          <option value="all">All Types</option>
          <option value="commit">Commits</option>
          <option value="pr">Pull Requests</option>
          <option value="deploy">Deploys</option>
          <option value="task">Tasks</option>
          <option value="content">Content</option>
        </select>

        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-gray-300"
        >
          <option value="all">All Projects</option>
          <option value="openclaw">OpenClaw Install</option>
          <option value="denver">Denver AI Training</option>
          <option value="mc-leads">MC Leads</option>
          <option value="mission">Mission Control</option>
        </select>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {sortedDates.map((dateStr) => (
          <div key={dateStr}>
            {/* Date Header */}
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-lg font-semibold text-white">
                {getDateLabel(dateStr)}
              </h2>
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-sm text-[var(--muted)]">
                {groupedItems[dateStr].length} items
              </span>
            </div>

            {/* Items */}
            <div className="space-y-3 pl-4 border-l-2 border-[var(--border)] ml-4">
              {groupedItems[dateStr].map((item) => {
                const style = typeStyles[item.type] || typeStyles.task;
                return (
                  <div
                    key={item.id}
                    className="relative bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--border-hover)] transition-colors"
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[25px] top-5 w-4 h-4 rounded-full ${style.bg} border-2 border-[var(--background)]`}
                    />

                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center text-lg shrink-0`}
                      >
                        {style.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-white">{item.title}</p>
                            {item.description && (
                              <p className="text-sm text-[var(--muted)] mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-[var(--muted)] whitespace-nowrap">
                            {format(new Date(item.timestamp), "h:mm a")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <span className={`status-badge ${style.bg} ${style.text}`}>
                            {item.type}
                          </span>
                          <span className="text-xs text-[var(--muted)]">
                            {item.project}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-[var(--muted)]">
          <p className="text-2xl mb-2">📋</p>
          <p>No work items found matching your filters</p>
        </div>
      )}
    </div>
  );
}
