"use client";

import { useState, useEffect } from "react";
import { getPRs, getKanbanColumns, type PR, type KanbanItem } from "@/lib/data";
import { formatDistanceToNow } from "date-fns";

type ViewMode = "all" | "prs" | "tasks";

interface TicketItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  priority: string;
  project: string;
  labels: string[];
  createdAt: string;
  updatedAt?: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Combine PRs and Kanban items into tickets
    const prs = getPRs();
    const columns = getKanbanColumns();

    const prTickets: TicketItem[] = prs.map((pr) => ({
      id: pr.id,
      title: pr.title,
      description: `PR #${pr.number} • ${pr.branch}`,
      type: "pr",
      status: pr.stage,
      priority: "medium",
      project: pr.repo,
      labels: pr.labels,
      createdAt: pr.createdAt,
      updatedAt: pr.updatedAt,
    }));

    const kanbanTickets: TicketItem[] = columns.flatMap((col) =>
      col.items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        status: col.id,
        priority: item.priority,
        project: item.project,
        labels: item.labels,
        createdAt: item.createdAt,
      }))
    );

    // Remove duplicates (PRs that are also in kanban)
    const allTickets = [...prTickets];
    kanbanTickets.forEach((kt) => {
      if (!allTickets.some((t) => t.id === kt.id)) {
        allTickets.push(kt);
      }
    });

    setTickets(allTickets);
    setLoading(false);
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    if (viewMode === "prs" && ticket.type !== "pr") return false;
    if (viewMode === "tasks" && ticket.type === "pr") return false;
    if (
      searchQuery &&
      !ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (selectedPriority !== "all" && ticket.priority !== selectedPriority)
      return false;
    if (
      selectedProject !== "all" &&
      !ticket.project.toLowerCase().includes(selectedProject.toLowerCase())
    )
      return false;
    return true;
  });

  const statusColors: Record<string, string> = {
    open: "status-open",
    "in-progress": "status-in-progress",
    backlog: "status-open",
    "code-review": "status-review",
    review: "status-review",
    "truth-review": "status-truth-review",
    "ready-deploy": "status-ready",
    deployed: "status-deployed",
  };

  const priorityColors: Record<string, string> = {
    critical: "priority-critical",
    high: "priority-high",
    medium: "priority-medium",
    low: "priority-low",
  };

  const typeIcons: Record<string, string> = {
    pr: "🔀",
    task: "📋",
    content: "✍️",
    bug: "🐛",
    feature: "✨",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tickets</h1>
          <p className="text-[var(--muted)]">
            {filteredTickets.length} of {tickets.length} items
          </p>
        </div>
        <button className="px-4 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg text-sm text-white font-medium transition-colors">
          + Create Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[var(--background)] rounded-lg">
          {(["all", "prs", "tasks"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === mode
                  ? "bg-[var(--card)] text-white"
                  : "text-[var(--muted)] hover:text-white"
              }`}
            >
              {mode === "all" ? "All" : mode === "prs" ? "PRs" : "Tasks"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-accent-500/50"
          />
        </div>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-gray-300"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Project Filter */}
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-gray-300"
        >
          <option value="all">All Projects</option>
          <option value="openclawinstall">OpenClaw Install</option>
          <option value="denveraitraining">Denver AI Training</option>
          <option value="mc-leads">MC Leads</option>
          <option value="mission-control">Mission Control</option>
        </select>
      </div>

      {/* Ticket List */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
        {/* Table Header - Hidden on mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-[var(--border)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
          <div className="col-span-1">Type</div>
          <div className="col-span-4">Title</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-2">Project</div>
          <div className="col-span-2">Updated</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[var(--border)]">
          {filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-[var(--muted)]">
              <p className="text-2xl mb-2">🔍</p>
              <p>No tickets found matching your filters</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
              >
                {/* Mobile Layout */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{typeIcons[ticket.type] || "📋"}</span>
                      <p className="font-medium text-white">{ticket.title}</p>
                    </div>
                  </div>
                  {ticket.description && (
                    <p className="text-xs text-[var(--muted)]">{ticket.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span className={`status-badge ${statusColors[ticket.status] || "status-open"}`}>
                      {ticket.status.replace("-", " ")}
                    </span>
                    <span className={`status-badge ${priorityColors[ticket.priority] || "priority-medium"}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                    <span>{ticket.project}</span>
                    <span>{formatDistanceToNow(new Date(ticket.updatedAt || ticket.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-12 gap-4">
                  <div className="col-span-1 flex items-center">
                    <span className="text-lg">{typeIcons[ticket.type] || "📋"}</span>
                  </div>
                  <div className="col-span-4">
                    <p className="font-medium text-white truncate">{ticket.title}</p>
                    {ticket.description && (
                      <p className="text-xs text-[var(--muted)] truncate mt-0.5">
                        {ticket.description}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className={`status-badge ${statusColors[ticket.status] || "status-open"}`}>
                      {ticket.status.replace("-", " ")}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <span className={`status-badge ${priorityColors[ticket.priority] || "priority-medium"}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-400 truncate">{ticket.project}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-[var(--muted)]">
                      {formatDistanceToNow(new Date(ticket.updatedAt || ticket.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
