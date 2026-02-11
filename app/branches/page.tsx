"use client";

import { useState, useEffect } from "react";
import { getProjects, type Project } from "@/lib/data";

interface Branch {
  name: string;
  project: string;
  projectId: string;
  isDefault: boolean;
  status: "active" | "stale" | "merged";
  lastCommit?: string;
  aheadBehind?: { ahead: number; behind: number };
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const projects = getProjects();

    // Generate branch data from projects
    const allBranches: Branch[] = projects.flatMap((project) =>
      project.branches.map((branch) => ({
        name: branch,
        project: project.name,
        projectId: project.id,
        isDefault: branch === "main",
        status: branch === "main" ? "active" : branch === "develop" ? "active" : "stale",
        lastCommit: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        aheadBehind: branch === "main" ? undefined : {
          ahead: Math.floor(Math.random() * 10),
          behind: Math.floor(Math.random() * 5),
        },
      }))
    );

    setBranches(allBranches);
    setLoading(false);
  }, []);

  const filteredBranches = branches.filter((branch) => {
    if (filterProject !== "all" && branch.projectId !== filterProject) return false;
    if (filterStatus !== "all" && branch.status !== filterStatus) return false;
    return true;
  });

  // Group by project
  const groupedBranches = filteredBranches.reduce((groups, branch) => {
    if (!groups[branch.project]) {
      groups[branch.project] = [];
    }
    groups[branch.project].push(branch);
    return groups;
  }, {} as Record<string, Branch[]>);

  const statusStyles: Record<string, { bg: string; text: string }> = {
    active: { bg: "bg-green-500/20", text: "text-green-400" },
    stale: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
    merged: { bg: "bg-purple-500/20", text: "text-purple-400" },
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
          <h1 className="text-2xl font-bold text-white">Branches</h1>
          <p className="text-[var(--muted)]">
            {branches.length} branches across all projects
          </p>
        </div>
        <button className="px-4 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg text-sm text-white font-medium transition-colors">
          Sync with GitHub
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-gray-300"
        >
          <option value="all">All Projects</option>
          <option value="oci">OpenClaw Install</option>
          <option value="dat">Denver AI Training</option>
          <option value="mc-leads">MC Leads Worker</option>
          <option value="mission-control">Mission Control</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-gray-300"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="stale">Stale</option>
          <option value="merged">Merged</option>
        </select>
      </div>

      {/* Branch Groups */}
      <div className="space-y-6">
        {Object.entries(groupedBranches).map(([projectName, projectBranches]) => (
          <div
            key={projectName}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden"
          >
            {/* Project Header */}
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">📁</span>
                <h2 className="font-semibold text-white">{projectName}</h2>
                <span className="text-xs text-[var(--muted)] bg-[var(--background)] px-2 py-0.5 rounded-full">
                  {projectBranches.length} branches
                </span>
              </div>
              <a
                href={`https://github.com/RShuken/${projectBranches[0]?.projectId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-400 hover:text-accent-300 flex items-center gap-1"
              >
                View on GitHub
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>

            {/* Branches Table */}
            <div className="divide-y divide-[var(--border)]">
              {projectBranches.map((branch) => {
                const status = statusStyles[branch.status];
                return (
                  <div
                    key={`${branch.project}-${branch.name}`}
                    className="p-4 hover:bg-[var(--card-hover)] transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-[var(--muted)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                          />
                        </svg>
                        <span className="font-mono text-sm text-white">
                          {branch.name}
                        </span>
                        {branch.isDefault && (
                          <span className="text-xs px-2 py-0.5 rounded bg-accent-500/20 text-accent-400">
                            default
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {branch.aheadBehind && (
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-green-400">
                            ↑ {branch.aheadBehind.ahead} ahead
                          </span>
                          <span className="text-red-400">
                            ↓ {branch.aheadBehind.behind} behind
                          </span>
                        </div>
                      )}
                      <span className={`status-badge ${status.bg} ${status.text}`}>
                        {branch.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-[var(--background)] rounded-lg text-[var(--muted)] hover:text-white transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                            />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-[var(--background)] rounded-lg text-[var(--muted)] hover:text-white transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredBranches.length === 0 && (
        <div className="text-center py-12 text-[var(--muted)]">
          <p className="text-2xl mb-2">🌿</p>
          <p>No branches found matching your filters</p>
        </div>
      )}
    </div>
  );
}
