"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

interface QueuedTask {
  id: string;
  title: string;
  description: string;
  project: string;
  priority: "critical" | "high" | "medium" | "low";
  type: "content" | "code" | "research" | "outreach" | "maintenance";
  estimatedMinutes: number;
  status: "queued" | "in-progress" | "completed" | "blocked";
  createdAt: string;
  scheduledFor?: string;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  config: Record<string, unknown>;
  lastRun?: string;
  successRate?: number;
}

interface MonitoringTarget {
  id: string;
  name: string;
  type: "inbox" | "calendar" | "social" | "site" | "leads" | "repo";
  checkInterval: number; // minutes
  lastChecked?: string;
  status: "ok" | "attention" | "error";
  notes?: string;
}

export default function NightShiftPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "queue" | "strategies" | "monitoring" | "ralph">("overview");
  const [queuedTasks, setQueuedTasks] = useState<QueuedTask[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [monitoringTargets, setMonitoringTargets] = useState<MonitoringTarget[]>([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [actionStatus, setActionStatus] = useState<{message: string; type: "success" | "info" | "error"} | null>(null);

  const handleAddToQueue = () => {
    setShowAddTaskModal(true);
  };

  const handleCheckLeads = () => {
    setActionStatus({ message: "Checking leads...", type: "info" });
    // Simulate API call
    setTimeout(() => {
      setActionStatus({ message: "✅ Lead check complete: 2 new leads, 1 needs follow-up", type: "success" });
      setTimeout(() => setActionStatus(null), 5000);
    }, 1500);
  };

  const handleRunRalphLoop = () => {
    setActiveTab("ralph");
    setActionStatus({ message: "Navigate to Ralph Loop tab to start a new improvement cycle", type: "info" });
    setTimeout(() => setActionStatus(null), 3000);
  };

  useEffect(() => {
    // Load mock data
    setQueuedTasks(getQueuedTasks());
    setStrategies(getStrategies());
    setMonitoringTargets(getMonitoringTargets());
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: "🌙" },
    { id: "queue", label: "Work Queue", icon: "📋" },
    { id: "strategies", label: "Strategies", icon: "🎯" },
    { id: "monitoring", label: "Monitoring", icon: "👁️" },
    { id: "ralph", label: "Ralph Loop", icon: "🔄" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl sm:text-3xl">
            🌙
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">NightShift</h1>
            <p className="text-[var(--muted)] text-xs sm:text-sm">
              Autonomous work while you sleep
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500/20 text-green-400 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Active
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 p-1 bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-accent-600 text-white"
                : "text-[var(--muted)] hover:text-white hover:bg-[var(--background)]"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Action Status Notification */}
      {actionStatus && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          actionStatus.type === "success" ? "bg-green-500/90 text-white" :
          actionStatus.type === "error" ? "bg-red-500/90 text-white" :
          "bg-blue-500/90 text-white"
        }`}>
          {actionStatus.message}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <AddTaskModal
          onClose={() => setShowAddTaskModal(false)}
          onAdd={(task) => {
            setQueuedTasks(prev => [task, ...prev]);
            setShowAddTaskModal(false);
            setActionStatus({ message: "✅ Task added to queue", type: "success" });
            setTimeout(() => setActionStatus(null), 3000);
          }}
        />
      )}

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab
          queuedTasks={queuedTasks}
          strategies={strategies}
          monitoringTargets={monitoringTargets}
          onAddToQueue={handleAddToQueue}
          onCheckLeads={handleCheckLeads}
          onRunRalphLoop={handleRunRalphLoop}
        />
      )}
      {activeTab === "queue" && (
        <QueueTab tasks={queuedTasks} setTasks={setQueuedTasks} />
      )}
      {activeTab === "strategies" && (
        <StrategiesTab strategies={strategies} setStrategies={setStrategies} />
      )}
      {activeTab === "monitoring" && (
        <MonitoringTab targets={monitoringTargets} setTargets={setMonitoringTargets} />
      )}
      {activeTab === "ralph" && <RalphLoopTab />}
    </div>
  );
}

// Overview Tab
function OverviewTab({
  queuedTasks,
  strategies,
  monitoringTargets,
  onAddToQueue,
  onCheckLeads,
  onRunRalphLoop,
}: {
  queuedTasks: QueuedTask[];
  strategies: Strategy[];
  monitoringTargets: MonitoringTarget[];
  onAddToQueue: () => void;
  onCheckLeads: () => void;
  onRunRalphLoop: () => void;
}) {
  const pendingTasks = queuedTasks.filter((t) => t.status === "queued").length;
  const inProgressTasks = queuedTasks.filter((t) => t.status === "in-progress").length;
  const completedTasks = queuedTasks.filter((t) => t.status === "completed").length;
  const enabledStrategies = strategies.filter((s) => s.enabled).length;
  const attentionItems = monitoringTargets.filter((t) => t.status === "attention").length;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Queued" value={pendingTasks} icon="📋" color="blue" />
        <StatCard title="In Progress" value={inProgressTasks} icon="⚡" color="yellow" />
        <StatCard title="Completed" value={completedTasks} icon="✅" color="green" />
        <StatCard title="Active Strategies" value={enabledStrategies} icon="🎯" color="purple" />
        <StatCard title="Needs Attention" value={attentionItems} icon="⚠️" color="red" />
      </div>

      {/* Context Card */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🧠</span> NightShift Context
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-accent-400 mb-2">Primary Mission</h3>
            <p className="text-gray-300 text-sm">
              Take as much off Ryan&apos;s plate as possible. Be relentlessly proactive.
              Ship work overnight so he wakes up to progress, not tasks.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-accent-400 mb-2">Operating Hours</h3>
            <p className="text-gray-300 text-sm">
              Active 23:00 - 08:00 MST. Heartbeat checks every 30 minutes.
              Urgent notifications only during quiet hours.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-accent-400 mb-2">Key Constraints</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Never push to production — PRs only</li>
              <li>• Zero fabricated content</li>
              <li>• Don&apos;t send external comms without approval</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-accent-400 mb-2">Focus Areas</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• OpenClaw Install & Denver AI Training sites</li>
              <li>• Lead pipeline management</li>
              <li>• Content creation & SEO</li>
              <li>• Code improvements & bug fixes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <QuickActionCard
          title="Add to Queue"
          description="Queue a task for tonight's work"
          icon="➕"
          action="Add Task"
          onClick={onAddToQueue}
        />
        <QuickActionCard
          title="Check Leads"
          description="Review new leads and follow-ups"
          icon="📧"
          action="Check Now"
          onClick={onCheckLeads}
        />
        <QuickActionCard
          title="Run Ralph Loop"
          description="Start improvement cycle on a project"
          icon="🔄"
          action="Start Loop"
          onClick={onRunRalphLoop}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>📜</span> Recent NightShift Activity
        </h2>
        <div className="space-y-3">
          {[
            { time: "2h ago", action: "Removed fabricated testimonials from OCI", type: "code" },
            { time: "3h ago", action: "Built Mission Control dashboard v1", type: "code" },
            { time: "5h ago", action: "Created AI Tools Directory page for DAT", type: "content" },
            { time: "8h ago", action: "Processed 3 new leads, sent initial outreach", type: "outreach" },
            { time: "12h ago", action: "Updated pricing to $150/$299/$599", type: "code" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-[var(--background)] rounded-lg">
              <span className="text-lg">
                {activity.type === "code" ? "💻" : activity.type === "content" ? "✍️" : "📧"}
              </span>
              <div className="flex-1">
                <p className="text-sm text-white">{activity.action}</p>
              </div>
              <span className="text-xs text-[var(--muted)]">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Queue Tab
function QueueTab({
  tasks,
  setTasks,
}: {
  tasks: QueuedTask[];
  setTasks: React.Dispatch<React.SetStateAction<QueuedTask[]>>;
}) {
  const priorityColors: Record<string, string> = {
    critical: "priority-critical",
    high: "priority-high",
    medium: "priority-medium",
    low: "priority-low",
  };

  const statusColors: Record<string, string> = {
    queued: "bg-blue-500/20 text-blue-400",
    "in-progress": "bg-yellow-500/20 text-yellow-400",
    completed: "bg-green-500/20 text-green-400",
    blocked: "bg-red-500/20 text-red-400",
  };

  const typeIcons: Record<string, string> = {
    content: "✍️",
    code: "💻",
    research: "🔍",
    outreach: "📧",
    maintenance: "🔧",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Work Queue</h2>
          <p className="text-[var(--muted)]">
            {tasks.filter((t) => t.status === "queued").length} tasks queued for tonight
          </p>
        </div>
        <button className="px-4 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg text-sm text-white font-medium transition-colors">
          + Add Task
        </button>
      </div>

      {/* Queue List */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--border)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
          <div className="col-span-1">Type</div>
          <div className="col-span-4">Task</div>
          <div className="col-span-2">Project</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Est. Time</div>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-[var(--card-hover)] transition-colors"
            >
              <div className="col-span-1 flex items-center">
                <span className="text-xl">{typeIcons[task.type]}</span>
              </div>
              <div className="col-span-4">
                <p className="font-medium text-white">{task.title}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{task.description}</p>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-400">{task.project}</span>
              </div>
              <div className="col-span-1 flex items-center">
                <span className={`status-badge ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className={`status-badge ${statusColors[task.status]}`}>
                  {task.status}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">{task.estimatedMinutes} min</span>
                <button className="text-accent-400 hover:text-accent-300 text-sm">
                  Start →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Repetitive Tasks */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🔁</span> Recurring Tasks
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: "Check inbox for leads", schedule: "Every heartbeat", lastRun: "30 min ago" },
            { name: "Review calendar", schedule: "2x daily", lastRun: "4h ago" },
            { name: "Memory maintenance", schedule: "Every 2 days", lastRun: "1 day ago" },
            { name: "Site health check", schedule: "Daily", lastRun: "8h ago" },
            { name: "PR review sweep", schedule: "Every heartbeat", lastRun: "30 min ago" },
            { name: "Lead follow-up check", schedule: "Daily", lastRun: "12h ago" },
          ].map((task, i) => (
            <div key={i} className="p-4 bg-[var(--background)] rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{task.name}</p>
                <p className="text-xs text-[var(--muted)]">{task.schedule}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--muted)]">Last run</p>
                <p className="text-sm text-gray-400">{task.lastRun}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Strategies Tab
function StrategiesTab({
  strategies,
  setStrategies,
}: {
  strategies: Strategy[];
  setStrategies: React.Dispatch<React.SetStateAction<Strategy[]>>;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">NightShift Strategies</h2>
          <p className="text-[var(--muted)]">
            Automated approaches for different types of work
          </p>
        </div>
        <button className="px-4 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg text-sm text-white font-medium transition-colors">
          + New Strategy
        </button>
      </div>

      <div className="grid gap-4">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className={`bg-[var(--card)] border rounded-xl overflow-hidden ${
              strategy.enabled ? "border-[var(--border)]" : "border-red-500/30 opacity-60"
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/20 to-purple-500/20 flex items-center justify-center text-2xl">
                    {strategy.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{strategy.name}</h3>
                    <p className="text-sm text-[var(--muted)]">{strategy.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={strategy.enabled}
                    onChange={() => {
                      setStrategies((prev) =>
                        prev.map((s) =>
                          s.id === strategy.id ? { ...s, enabled: !s.enabled } : s
                        )
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
                </label>
              </div>

              {strategy.lastRun && (
                <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">
                    Last run: {formatDistanceToNow(new Date(strategy.lastRun), { addSuffix: true })}
                  </span>
                  {strategy.successRate !== undefined && (
                    <span className="text-green-400">{strategy.successRate}% success rate</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Monitoring Tab
function MonitoringTab({
  targets,
  setTargets,
}: {
  targets: MonitoringTarget[];
  setTargets: React.Dispatch<React.SetStateAction<MonitoringTarget[]>>;
}) {
  const [checkingId, setCheckingId] = useState<string | null>(null);

  const statusColors: Record<string, string> = {
    ok: "bg-green-500/20 text-green-400",
    attention: "bg-yellow-500/20 text-yellow-400",
    error: "bg-red-500/20 text-red-400",
  };

  const typeIcons: Record<string, string> = {
    inbox: "📧",
    calendar: "📅",
    social: "📱",
    site: "🌐",
    leads: "💰",
    repo: "📁",
  };

  const handleCheckNow = (targetId: string) => {
    setCheckingId(targetId);
    // Simulate check
    setTimeout(() => {
      setTargets(prev => prev.map(t => 
        t.id === targetId 
          ? { ...t, lastChecked: new Date().toISOString(), status: "ok" as const }
          : t
      ));
      setCheckingId(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Monitoring Targets</h2>
          <p className="text-[var(--muted)]">
            What NightShift watches and how often
          </p>
        </div>
        <button className="px-4 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg text-sm text-white font-medium transition-colors">
          + Add Target
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {targets.map((target) => (
          <div
            key={target.id}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{typeIcons[target.type]}</span>
                <div>
                  <h3 className="font-semibold text-white">{target.name}</h3>
                  <p className="text-xs text-[var(--muted)]">Check every {target.checkInterval} min</p>
                </div>
              </div>
              <span className={`status-badge ${statusColors[target.status]}`}>
                {target.status}
              </span>
            </div>

            {target.notes && (
              <p className="text-sm text-gray-400 mb-4">{target.notes}</p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <span className="text-xs text-[var(--muted)]">
                Last checked:{" "}
                {target.lastChecked
                  ? formatDistanceToNow(new Date(target.lastChecked), { addSuffix: true })
                  : "Never"}
              </span>
              <button 
                onClick={() => handleCheckNow(target.id)}
                disabled={checkingId === target.id}
                className="text-sm text-accent-400 hover:text-accent-300 disabled:opacity-50"
              >
                {checkingId === target.id ? "Checking..." : "Check Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Ralph Wiggum Loop Tab
function RalphLoopTab() {
  const [selectedProject, setSelectedProject] = useState("OpenClaw Install");
  const [improvementTarget, setImprovementTarget] = useState("");
  const [loopStarted, setLoopStarted] = useState(false);

  const handleStartLoop = () => {
    if (!improvementTarget.trim()) {
      alert("Please enter an improvement target");
      return;
    }
    setLoopStarted(true);
    // Reset after showing confirmation
    setTimeout(() => {
      setLoopStarted(false);
      setImprovementTarget("");
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Loop Started Notification */}
      {loopStarted && (
        <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4 text-green-400">
          ✅ Ralph Loop started for <strong>{selectedProject}</strong>: &quot;{improvementTarget}&quot;
          <br />
          <span className="text-sm text-green-300">The loop will run during tonight&apos;s NightShift.</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-4xl">
            🔄
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">The Ralph Wiggum Loop</h2>
            <p className="text-amber-200/80">
              &ldquo;I&apos;m helping!&rdquo; — Continuous improvement through persistent iteration
            </p>
          </div>
        </div>
        <p className="text-gray-300 text-sm">
          Named after Ralph&apos;s enthusiastic (if sometimes misguided) helpfulness, this strategy 
          embraces continuous small improvements. Keep trying, keep learning, keep shipping.
          Even &ldquo;failed&rdquo; attempts provide valuable information.
        </p>
      </div>

      {/* Loop Diagram */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">The Loop</h3>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { step: 1, name: "Observe", icon: "👀", desc: "Look at current state, identify gaps" },
            { step: 2, name: "Attempt", icon: "🛠️", desc: "Try a small improvement" },
            { step: 3, name: "Ship", icon: "🚀", desc: "Deploy to develop (PR for main)" },
            { step: 4, name: "Learn", icon: "📚", desc: "Document what worked/didn't" },
            { step: 5, name: "Repeat", icon: "🔄", desc: "Go again with new knowledge" },
          ].map((phase, i) => (
            <div key={i} className="relative">
              <div className="bg-[var(--background)] rounded-xl p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-2xl mx-auto mb-2">
                  {phase.icon}
                </div>
                <p className="font-semibold text-white">{phase.name}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{phase.desc}</p>
              </div>
              {i < 4 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[var(--muted)]">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Loops */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Active Ralph Loops</h3>
        <div className="space-y-4">
          {[
            {
              project: "OpenClaw Install",
              target: "Conversion rate optimization",
              iteration: 3,
              lastAttempt: "Exit-intent popup implementation",
              learning: "Need email gate on quiz first",
              status: "in-progress",
            },
            {
              project: "Denver AI Training",
              target: "SEO traffic growth",
              iteration: 5,
              lastAttempt: "Industry landing pages",
              learning: "Long-tail keywords working, need more content",
              status: "in-progress",
            },
            {
              project: "Lead Pipeline",
              target: "Response time reduction",
              iteration: 2,
              lastAttempt: "Telegram notifications with inline buttons",
              learning: "Works well, need follow-up automation",
              status: "in-progress",
            },
          ].map((loop, i) => (
            <div key={i} className="p-4 bg-[var(--background)] rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-white">{loop.project}</p>
                  <p className="text-sm text-accent-400">{loop.target}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                    Iteration #{loop.iteration}
                  </span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[var(--muted)]">Last attempt:</p>
                  <p className="text-gray-300">{loop.lastAttempt}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">Learning:</p>
                  <p className="text-gray-300">{loop.learning}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start New Loop */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Start a New Ralph Loop</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--muted)] mb-2">Project</label>
            <select 
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-gray-300"
            >
              <option>OpenClaw Install</option>
              <option>Denver AI Training</option>
              <option>MC Leads Worker</option>
              <option>Mission Control</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[var(--muted)] mb-2">Improvement Target</label>
            <input
              type="text"
              value={improvementTarget}
              onChange={(e) => setImprovementTarget(e.target.value)}
              placeholder="e.g., Increase mobile conversion"
              className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-white placeholder-[var(--muted)]"
            />
          </div>
        </div>
        <button 
          onClick={handleStartLoop}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-lg text-sm text-white font-medium transition-colors"
        >
          🔄 Start Loop
        </button>
      </div>

      {/* Philosophy */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">The Philosophy</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-medium text-amber-400 mb-2">🎯 Small Bets</p>
            <p className="text-gray-300">
              Don&apos;t try to solve everything at once. Make small, reversible changes.
              Each iteration should be deployable and testable.
            </p>
          </div>
          <div>
            <p className="font-medium text-amber-400 mb-2">📝 Document Everything</p>
            <p className="text-gray-300">
              Write down what you tried and what happened. Failed attempts are data.
              Success patterns emerge over time.
            </p>
          </div>
          <div>
            <p className="font-medium text-amber-400 mb-2">🏃 Keep Moving</p>
            <p className="text-gray-300">
              Don&apos;t get stuck analyzing. Ship something, learn from it, move on.
              Momentum beats perfection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/20 text-blue-400",
    yellow: "from-yellow-500/20 to-yellow-600/20 text-yellow-400",
    green: "from-green-500/20 to-green-600/20 text-green-400",
    purple: "from-purple-500/20 to-purple-600/20 text-purple-400",
    red: "from-red-500/20 to-red-600/20 text-red-400",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-4 border border-[var(--border)]`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-3xl font-bold`}>{value}</span>
      </div>
      <p className="text-sm text-[var(--muted)]">{title}</p>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  icon,
  action,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  action: string;
  onClick?: () => void;
}) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--border-hover)] transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/20 to-purple-500/20 flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-[var(--muted)] mt-1">{description}</p>
          <button 
            onClick={onClick}
            className="mt-3 text-sm text-accent-400 hover:text-accent-300"
          >
            {action} →
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Task Modal
function AddTaskModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (task: QueuedTask) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("OpenClaw Install");
  const [priority, setPriority] = useState<"critical" | "high" | "medium" | "low">("medium");
  const [type, setType] = useState<"content" | "code" | "research" | "outreach" | "maintenance">("code");
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const task: QueuedTask = {
      id: `task-${Date.now()}`,
      title,
      description,
      project,
      priority,
      type,
      estimatedMinutes,
      status: "queued",
      createdAt: new Date().toISOString(),
    };
    onAdd(task);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-white">Add Task to Queue</h2>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-white text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-[var(--muted)] mb-1">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Fix mobile navigation"
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-white placeholder-[var(--muted)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--muted)] mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details..."
              rows={2}
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-white placeholder-[var(--muted)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-white"
              >
                <option>OpenClaw Install</option>
                <option>Denver AI Training</option>
                <option>Mission Control</option>
                <option>MC Leads Worker</option>
                <option>Lead Pipeline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-white"
              >
                <option value="code">💻 Code</option>
                <option value="content">✍️ Content</option>
                <option value="research">🔍 Research</option>
                <option value="outreach">📧 Outreach</option>
                <option value="maintenance">🔧 Maintenance</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-white"
              >
                <option value="critical">🔴 Critical</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Est. Time (min)</label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 30)}
                min={5}
                max={480}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[var(--muted)] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg text-sm text-white font-medium"
            >
              Add to Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Mock Data Functions
function getQueuedTasks(): QueuedTask[] {
  return [
    {
      id: "task-1",
      title: "Email gate for quiz component",
      description: "Add email capture before showing quiz results",
      project: "OpenClaw Install",
      priority: "high",
      type: "code",
      estimatedMinutes: 45,
      status: "queued",
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-2",
      title: "5 YouTube Shorts scripts",
      description: "Write 60-second scripts for viral shorts",
      project: "OpenClaw Install",
      priority: "medium",
      type: "content",
      estimatedMinutes: 60,
      status: "completed",
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-3",
      title: "Google Business Profile setup",
      description: "Claim and optimize for local SEO",
      project: "Denver AI Training",
      priority: "medium",
      type: "maintenance",
      estimatedMinutes: 30,
      status: "queued",
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-4",
      title: "Follow up on stale leads",
      description: "Check 48h+ leads and send follow-ups",
      project: "Lead Pipeline",
      priority: "high",
      type: "outreach",
      estimatedMinutes: 20,
      status: "in-progress",
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-5",
      title: "Research competitor pricing",
      description: "Analyze 5 competing OpenClaw install services",
      project: "OpenClaw Install",
      priority: "low",
      type: "research",
      estimatedMinutes: 45,
      status: "queued",
      createdAt: new Date().toISOString(),
    },
  ];
}

function getStrategies(): Strategy[] {
  return [
    {
      id: "strat-1",
      name: "Lead Pipeline Automation",
      description: "Auto-detect new leads, send initial outreach, track follow-ups",
      icon: "📧",
      enabled: true,
      config: { responseTime: "< 1 hour", followUpDays: [2, 5, 10] },
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      successRate: 85,
    },
    {
      id: "strat-2",
      name: "Content Factory",
      description: "Generate blog posts, landing pages, and SEO content overnight",
      icon: "✍️",
      enabled: true,
      config: { postsPerNight: 2, focusKeywords: ["ai assistant", "openclaw"] },
      lastRun: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      successRate: 92,
    },
    {
      id: "strat-3",
      name: "Ralph Wiggum Loop",
      description: "Continuous small improvements through persistent iteration",
      icon: "🔄",
      enabled: true,
      config: { maxIterationsPerNight: 3, autoRevert: true },
      lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      successRate: 78,
    },
    {
      id: "strat-4",
      name: "Truth Patrol",
      description: "Scan all content for fabricated stats, fake testimonials, unverifiable claims",
      icon: "🔍",
      enabled: true,
      config: { scanBeforePR: true, blockFabrications: true },
      lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      successRate: 100,
    },
    {
      id: "strat-5",
      name: "Proactive Health Checks",
      description: "Monitor site uptime, worker health, API endpoints",
      icon: "🏥",
      enabled: true,
      config: { checkInterval: 30, alertThreshold: 2 },
      lastRun: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      successRate: 99,
    },
    {
      id: "strat-6",
      name: "Social Listening",
      description: "Monitor Twitter/Reddit for OpenClaw mentions, respond if appropriate",
      icon: "👂",
      enabled: false,
      config: { platforms: ["twitter", "reddit"], keywords: ["openclaw", "clawdbot"] },
    },
  ];
}

function getMonitoringTargets(): MonitoringTarget[] {
  return [
    {
      id: "mon-1",
      name: "Gmail Inbox",
      type: "inbox",
      checkInterval: 30,
      lastChecked: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      status: "ok",
      notes: "Check for lead replies and urgent messages",
    },
    {
      id: "mon-2",
      name: "Telegram Lead Notifications",
      type: "leads",
      checkInterval: 5,
      lastChecked: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      status: "ok",
      notes: "New leads from worker webhook",
    },
    {
      id: "mon-3",
      name: "OpenClaw Install Site",
      type: "site",
      checkInterval: 60,
      lastChecked: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: "ok",
    },
    {
      id: "mon-4",
      name: "Denver AI Training Site",
      type: "site",
      checkInterval: 60,
      lastChecked: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      status: "ok",
    },
    {
      id: "mon-5",
      name: "GitHub Repos",
      type: "repo",
      checkInterval: 30,
      lastChecked: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      status: "attention",
      notes: "2 open PRs awaiting review",
    },
    {
      id: "mon-6",
      name: "Calendar",
      type: "calendar",
      checkInterval: 120,
      lastChecked: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: "ok",
      notes: "Check for upcoming meetings",
    },
  ];
}
