"use client";

import { useState, useEffect } from "react";
import { getWorkflows, type Workflow } from "@/lib/data";
import { formatDistanceToNow } from "date-fns";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWorkflows(getWorkflows());
    setLoading(false);
  }, []);

  const triggerIcons: Record<string, string> = {
    "column-move": "🔀",
    "label-add": "🏷️",
    "pr-created": "📝",
    schedule: "⏰",
  };

  const actionIcons: Record<string, string> = {
    "run-checks": "✅",
    "truth-review": "🔍",
    notify: "📣",
    deploy: "🚀",
    merge: "🔗",
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
          <h1 className="text-2xl font-bold text-white">Workflows</h1>
          <p className="text-[var(--muted)]">
            Automated actions triggered by events
          </p>
        </div>
        <button className="px-4 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg text-sm text-white font-medium transition-colors">
          + Create Workflow
        </button>
      </div>

      {/* Workflow Cards */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className={`bg-[var(--card)] border rounded-xl overflow-hidden ${
              workflow.enabled
                ? "border-[var(--border)]"
                : "border-red-500/30 opacity-60"
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border)]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/20 to-purple-500/20 flex items-center justify-center text-2xl">
                    {triggerIcons[workflow.trigger.type] || "⚡"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {workflow.name}
                    </h3>
                    <p className="text-sm text-[var(--muted)]">
                      {workflow.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {workflow.lastRun && (
                    <span className="text-xs text-[var(--muted)]">
                      Last run:{" "}
                      {formatDistanceToNow(new Date(workflow.lastRun), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workflow.enabled}
                      onChange={() => {
                        setWorkflows((prev) =>
                          prev.map((w) =>
                            w.id === workflow.id
                              ? { ...w, enabled: !w.enabled }
                              : w
                          )
                        );
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Trigger */}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                    Trigger
                  </p>
                  <div className="p-4 bg-[var(--background)] rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">
                        {triggerIcons[workflow.trigger.type]}
                      </span>
                      <span className="font-medium text-white">
                        {workflow.trigger.type.replace("-", " ")}
                      </span>
                    </div>
                    <code className="text-xs text-accent-400 bg-accent-500/10 px-2 py-1 rounded">
                      {workflow.trigger.condition}
                    </code>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center text-[var(--muted)]">
                  <svg
                    className="w-6 h-6 rotate-90 md:rotate-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>

                {/* Actions */}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                    Actions ({workflow.actions.length})
                  </p>
                  <div className="space-y-2">
                    {workflow.actions.map((action, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[var(--background)] rounded-lg flex items-center gap-3"
                      >
                        <span className="text-lg">
                          {actionIcons[action.type] || "⚡"}
                        </span>
                        <div>
                          <span className="font-medium text-white text-sm">
                            {action.type.replace("-", " ")}
                          </span>
                          {action.config && Object.keys(action.config).length > 0 && (
                            <p className="text-xs text-[var(--muted)]">
                              {JSON.stringify(action.config).slice(0, 50)}...
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-[var(--background)] border-t border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="text-sm text-accent-400 hover:text-accent-300">
                  Edit
                </button>
                <button className="text-sm text-accent-400 hover:text-accent-300">
                  View Logs
                </button>
              </div>
              <button className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1">
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
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                  />
                </svg>
                Run Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">How Workflows Work</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-medium text-accent-400 mb-2">1. Trigger</p>
            <p className="text-[var(--muted)]">
              Workflows start when a specific event occurs — like moving a card to a
              column, adding a label, or on a schedule.
            </p>
          </div>
          <div>
            <p className="font-medium text-accent-400 mb-2">2. Conditions</p>
            <p className="text-[var(--muted)]">
              Optional conditions filter which events should trigger the workflow.
              For example, only PRs from a specific repo.
            </p>
          </div>
          <div>
            <p className="font-medium text-accent-400 mb-2">3. Actions</p>
            <p className="text-[var(--muted)]">
              When triggered, workflows execute one or more actions — running checks,
              sending notifications, or deploying code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
