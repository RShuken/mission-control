"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProjects, getPRs, getWorkItems, type Project, type PR, type WorkItem } from "@/lib/data";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [prs, setPRs] = useState<PR[]>([]);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProjects(getProjects());
    setPRs(getPRs());
    setWorkItems(getWorkItems());
    setLoading(false);
  }, []);

  const openPRs = prs.filter((pr) => pr.status === "open");
  const recentWork = workItems.slice(0, 5);
  const todayWork = workItems.filter((item) => {
    const itemDate = new Date(item.timestamp);
    const today = new Date();
    return itemDate.toDateString() === today.toDateString();
  });

  const stats = [
    {
      label: "Active Projects",
      value: projects.length,
      change: "+0",
      icon: "📁",
      color: "text-blue-400",
    },
    {
      label: "Open PRs",
      value: openPRs.length,
      change: openPRs.length > 0 ? "Needs review" : "All clear",
      icon: "🔀",
      color: openPRs.length > 0 ? "text-yellow-400" : "text-green-400",
    },
    {
      label: "Work Items Today",
      value: todayWork.length,
      change: "Today",
      icon: "✅",
      color: "text-emerald-400",
    },
    {
      label: "Pending Workflows",
      value: 0,
      change: "None blocked",
      icon: "⚡",
      color: "text-purple-400",
    },
  ];

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Mission Control</h1>
          <p className="text-[var(--muted)] text-sm">
            Overview of all projects, PRs, and work
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex-1 sm:flex-none px-3 py-2 bg-[var(--card)] hover:bg-[var(--card-hover)] border border-[var(--border)] rounded-lg text-sm text-gray-300 transition-colors">
            Refresh
          </button>
          <Link
            href="/kanban"
            className="flex-1 sm:flex-none px-3 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg text-sm text-white font-medium transition-colors text-center"
          >
            Kanban →
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs ${stat.color}`}>{stat.change}</span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-[var(--muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Overview */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl">
          <div className="p-5 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Projects</h2>
              <Link
                href="/projects"
                className="text-sm text-accent-400 hover:text-accent-300"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      project.type === "site"
                        ? "bg-cyan-500"
                        : project.type === "worker"
                        ? "bg-violet-500"
                        : "bg-amber-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-white">{project.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {project.repo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`status-badge ${
                      project.status === "healthy"
                        ? "status-ready"
                        : project.status === "warning"
                        ? "status-in-progress"
                        : "status-blocked"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open PRs */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl">
          <div className="p-5 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Open PRs</h2>
              <Link
                href="/tickets?filter=pr"
                className="text-sm text-accent-400 hover:text-accent-300"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {openPRs.length === 0 ? (
              <div className="text-center py-8 text-[var(--muted)]">
                <p className="text-2xl mb-2">✨</p>
                <p>No open PRs — all clear!</p>
              </div>
            ) : (
              openPRs.slice(0, 5).map((pr) => (
                <div
                  key={pr.id}
                  className="flex items-start justify-between p-3 bg-[var(--background)] rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {pr.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      #{pr.number} • {pr.repo} •{" "}
                      {formatDistanceToNow(new Date(pr.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <span className={`status-badge status-${pr.stage}`}>
                    {pr.stage.replace("-", " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Work */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl">
        <div className="p-5 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Work</h2>
            <Link
              href="/worklog"
              className="text-sm text-accent-400 hover:text-accent-300"
            >
              View full log →
            </Link>
          </div>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {recentWork.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 pb-4 border-b border-[var(--border)] last:border-0 last:pb-0"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                    item.type === "commit"
                      ? "bg-green-500/20 text-green-400"
                      : item.type === "pr"
                      ? "bg-purple-500/20 text-purple-400"
                      : item.type === "deploy"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {item.type === "commit"
                    ? "📝"
                    : item.type === "pr"
                    ? "🔀"
                    : item.type === "deploy"
                    ? "🚀"
                    : "📋"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {item.project} •{" "}
                    {formatDistanceToNow(new Date(item.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
