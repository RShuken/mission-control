"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProjects, getPRs, getWorkItems, type Project } from "@/lib/data";
import { formatDistanceToNow } from "date-fns";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [prCounts, setPrCounts] = useState<Record<string, number>>({});
  const [recentActivity, setRecentActivity] = useState<Record<string, string>>({});

  useEffect(() => {
    const projectData = getProjects();
    const prs = getPRs();
    const workItems = getWorkItems();

    // Count open PRs per project
    const counts: Record<string, number> = {};
    prs.forEach((pr) => {
      if (pr.status === "open") {
        const key = pr.repo.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    // Get most recent activity per project
    const activity: Record<string, string> = {};
    workItems.forEach((item) => {
      const projectKey = item.project.toLowerCase().replace(/\s+/g, "");
      if (!activity[projectKey] || new Date(item.timestamp) > new Date(activity[projectKey])) {
        activity[projectKey] = item.timestamp;
      }
    });

    setProjects(projectData);
    setPrCounts(counts);
    setRecentActivity(activity);
    setLoading(false);
  }, []);

  const typeStyles: Record<string, { bg: string; text: string; icon: string }> = {
    site: { bg: "bg-cyan-500/20", text: "text-cyan-400", icon: "🌐" },
    worker: { bg: "bg-violet-500/20", text: "text-violet-400", icon: "⚡" },
    content: { bg: "bg-amber-500/20", text: "text-amber-400", icon: "📝" },
    infra: { bg: "bg-slate-500/20", text: "text-slate-400", icon: "🔧" },
  };

  const statusStyles: Record<string, { bg: string; text: string }> = {
    healthy: { bg: "bg-green-500/20", text: "text-green-400" },
    warning: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
    error: { bg: "bg-red-500/20", text: "text-red-400" },
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
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-[var(--muted)]">
            {projects.length} active projects
          </p>
        </div>
        <button className="px-4 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg text-sm text-white font-medium transition-colors">
          + Add Project
        </button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => {
          const type = typeStyles[project.type];
          const status = statusStyles[project.status];
          const prCount = prCounts[project.repo.split("/")[1]?.toLowerCase()] || 0;
          const lastActivity = recentActivity[project.name.toLowerCase().replace(/\s+/g, "")] || project.lastActivity;

          return (
            <div
              key={project.id}
              className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--border-hover)] transition-colors"
            >
              {/* Header */}
              <div className="p-6 border-b border-[var(--border)]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${type.bg} rounded-lg p-2`}>
                      {type.icon}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        {project.name}
                      </h3>
                      <p className="text-sm text-[var(--muted)]">{project.repo}</p>
                    </div>
                  </div>
                  <span
                    className={`status-badge ${status.bg} ${status.text}`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--muted)]">Branches:</span>
                    <span className="text-white">{project.branches.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--muted)]">Open PRs:</span>
                    <span className={prCount > 0 ? "text-yellow-400" : "text-green-400"}>
                      {prCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--muted)]">Type:</span>
                    <span className={type.text}>{project.type}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Branches */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
                    Branches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.branches.map((branch) => (
                      <span
                        key={branch}
                        className="px-2 py-1 text-xs bg-[var(--background)] rounded text-gray-400"
                      >
                        {branch}
                      </span>
                    ))}
                  </div>
                </div>

                {/* URLs */}
                {project.url && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
                      Live URL
                    </p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent-400 hover:text-accent-300 flex items-center gap-1"
                    >
                      {project.url}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </div>
                )}

                {/* Last Activity */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <span className="text-xs text-[var(--muted)]">
                    Last activity:{" "}
                    {formatDistanceToNow(new Date(lastActivity), {
                      addSuffix: true,
                    })}
                  </span>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-sm text-accent-400 hover:text-accent-300"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
