// Types
export interface Project {
  id: string;
  name: string;
  repo: string;
  type: "site" | "worker" | "content" | "infra";
  status: "healthy" | "warning" | "error";
  url?: string;
  branches: string[];
  lastActivity: string;
}

export interface PR {
  id: string;
  number: number;
  title: string;
  repo: string;
  branch: string;
  status: "open" | "merged" | "closed";
  stage: "open" | "in-progress" | "review" | "truth-review" | "ready" | "deployed";
  author: string;
  createdAt: string;
  updatedAt: string;
  labels: string[];
  checksPass: boolean;
  reviewStatus: "pending" | "approved" | "changes-requested";
}

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  type: "commit" | "pr" | "deploy" | "task" | "content";
  project: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  items: KanbanItem[];
  workflowId?: string;
  workflowDescription?: string;
}

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  type: "pr" | "task" | "content" | "bug" | "feature";
  priority: "critical" | "high" | "medium" | "low";
  project: string;
  assignee?: string;
  labels: string[];
  createdAt: string;
  dueDate?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: "column-move" | "label-add" | "pr-created" | "schedule";
    condition: string;
  };
  actions: {
    type: "run-checks" | "truth-review" | "notify" | "deploy" | "merge";
    config: Record<string, unknown>;
  }[];
  enabled: boolean;
  lastRun?: string;
}

// Mock data - In production, this would fetch from GitHub API and local storage
export function getProjects(): Project[] {
  return [
    {
      id: "oci",
      name: "OpenClaw Install",
      repo: "RShuken/openclawinstall",
      type: "site",
      status: "healthy",
      url: "https://openclawinstall.net",
      branches: ["main", "develop"],
      lastActivity: new Date().toISOString(),
    },
    {
      id: "dat",
      name: "Denver AI Training",
      repo: "RShuken/denveraitraining",
      type: "site",
      status: "healthy",
      url: "https://denveraitraining.com",
      branches: ["main", "develop"],
      lastActivity: new Date().toISOString(),
    },
    {
      id: "mc-leads",
      name: "MC Leads Worker",
      repo: "RShuken/molty-bot-sites",
      type: "worker",
      status: "healthy",
      url: "https://mc-leads.ryanshuken.workers.dev",
      branches: ["main"],
      lastActivity: new Date().toISOString(),
    },
    {
      id: "mission-control",
      name: "Mission Control",
      repo: "RShuken/mission-control",
      type: "infra",
      status: "healthy",
      branches: ["main"],
      lastActivity: new Date().toISOString(),
    },
  ];
}

export function getPRs(): PR[] {
  return [
    {
      id: "pr-dat-15",
      number: 15,
      title: "feat: 2 viral moment blog posts",
      repo: "denveraitraining",
      branch: "blog/viral-moments",
      status: "open",
      stage: "review",
      author: "molty",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      labels: ["content", "blog"],
      checksPass: true,
      reviewStatus: "pending",
    },
    {
      id: "pr-dat-16",
      number: 16,
      title: "feat: 3 industry landing pages (healthcare, restaurants, construction)",
      repo: "denveraitraining",
      branch: "feature/industry-pages",
      status: "open",
      stage: "review",
      author: "molty",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      labels: ["feature", "seo"],
      checksPass: true,
      reviewStatus: "pending",
    },
  ];
}

export function getWorkItems(): WorkItem[] {
  const now = new Date();
  return [
    {
      id: "work-1",
      title: "Removed all fabricated testimonials and fake stats",
      description: "Truth audit - purged 22 fake testimonials and 10+ fake metrics",
      type: "commit",
      project: "OpenClaw Install",
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "work-2",
      title: "Merged develop to main",
      description: "All Feb 2026 content consolidated and deployed",
      type: "deploy",
      project: "OpenClaw Install",
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "work-3",
      title: "Built AI Tools Directory page",
      description: "72+ tools across 12 categories for SEO",
      type: "commit",
      project: "Denver AI Training",
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "work-4",
      title: "Created ROI Calculator document",
      description: "Shows AI assistants save $37K-225K/year",
      type: "content",
      project: "Denver AI Training",
      timestamp: new Date(now.getTime() - 14 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "work-5",
      title: "YouTube Shorts scripts",
      description: "5 complete 60-second scripts ready to film",
      type: "content",
      project: "OpenClaw Install",
      timestamp: new Date(now.getTime() - 16 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "work-6",
      title: "Cold outreach campaign",
      description: "20 Denver prospects with personalized emails",
      type: "content",
      project: "Denver AI Training",
      timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "work-7",
      title: "Exit-intent lead capture plan",
      description: "Implementation plan + 13KB lead magnet guide",
      type: "task",
      project: "OpenClaw Install",
      timestamp: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function getKanbanColumns(): KanbanColumn[] {
  return [
    {
      id: "backlog",
      title: "Backlog",
      color: "bg-gray-500",
      workflowId: undefined,
      workflowDescription: undefined,
      items: [
        {
          id: "task-1",
          title: "Add email capture gate to quiz",
          description: "Currently quiz shows results without capturing email",
          type: "feature",
          priority: "high",
          project: "OpenClaw Install",
          labels: ["lead-gen", "conversion"],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "task-2",
          title: "Set up Google Business Profile",
          description: "Optimize for local SEO in Denver",
          type: "task",
          priority: "medium",
          project: "Denver AI Training",
          labels: ["seo", "local"],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-500",
      workflowId: undefined,
      workflowDescription: "Task is actively being worked on. No automated actions.",
      items: [
        {
          id: "task-3",
          title: "Build Mission Control dashboard",
          description: "Kanban + ticket views for project management",
          type: "feature",
          priority: "high",
          project: "Mission Control",
          labels: ["infra", "dashboard"],
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "code-review",
      title: "Code Review",
      color: "bg-purple-500",
      workflowId: "wf-1",
      workflowDescription: "🔍 Auto Code Review: Runs linting, type checks, and build verification. Blocks merge if checks fail.",
      items: [
        {
          id: "pr-dat-15",
          title: "PR #15: 2 viral moment blog posts",
          description: "DAT blog content for viral traffic",
          type: "pr",
          priority: "medium",
          project: "Denver AI Training",
          labels: ["content", "blog"],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "pr-dat-16",
          title: "PR #16: 3 industry landing pages",
          description: "Healthcare, restaurants, construction",
          type: "pr",
          priority: "medium",
          project: "Denver AI Training",
          labels: ["feature", "seo"],
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: "truth-review",
      title: "Truth Review",
      color: "bg-pink-500",
      workflowId: "wf-2",
      workflowDescription: "🔍 Truth Agent Review: Scans for fabricated testimonials, fake statistics, unverifiable claims, and bogus ratings. Zero tolerance for fake content.",
      items: [],
    },
    {
      id: "ready-deploy",
      title: "Ready to Deploy",
      color: "bg-green-500",
      workflowId: "wf-3",
      workflowDescription: "🚀 Auto Deploy: Merges to develop branch when all reviews pass. Sends Telegram notification for morning review.",
      items: [],
    },
    {
      id: "deployed",
      title: "Deployed",
      color: "bg-emerald-500",
      workflowId: undefined,
      workflowDescription: "✅ Complete: Item has been deployed to production. No further actions needed.",
      items: [
        {
          id: "task-4",
          title: "OCI: Fabricated content purge",
          description: "Removed all fake testimonials and stats",
          type: "task",
          priority: "critical",
          project: "OpenClaw Install",
          labels: ["truth", "cleanup"],
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
  ];
}

export function getWorkflows(): Workflow[] {
  return [
    {
      id: "wf-1",
      name: "Auto Code Review",
      description: "Run linting and type checks when PR enters Code Review",
      trigger: {
        type: "column-move",
        condition: "to:code-review",
      },
      actions: [
        {
          type: "run-checks",
          config: { checks: ["lint", "typecheck", "build"] },
        },
      ],
      enabled: true,
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "wf-2",
      name: "Truth Agent Review",
      description: "Scan for fabricated claims when PR enters Truth Review",
      trigger: {
        type: "column-move",
        condition: "to:truth-review",
      },
      actions: [
        {
          type: "truth-review",
          config: {
            scanFor: ["testimonials", "statistics", "claims", "ratings"],
          },
        },
      ],
      enabled: true,
    },
    {
      id: "wf-3",
      name: "Auto Deploy to Develop",
      description: "Merge to develop branch when PR passes all reviews",
      trigger: {
        type: "column-move",
        condition: "to:ready-deploy",
      },
      actions: [
        {
          type: "merge",
          config: { targetBranch: "develop", requireChecks: true },
        },
        {
          type: "notify",
          config: { channel: "telegram", message: "PR ready for morning review" },
        },
      ],
      enabled: true,
    },
    {
      id: "wf-4",
      name: "Morning Briefing",
      description: "Generate summary of overnight work at 8 AM",
      trigger: {
        type: "schedule",
        condition: "0 8 * * *",
      },
      actions: [
        {
          type: "notify",
          config: {
            channel: "telegram",
            template: "morning-briefing",
          },
        },
      ],
      enabled: true,
    },
  ];
}

// Local storage helpers for state persistence
export function saveKanbanState(columns: KanbanColumn[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("kanban-state", JSON.stringify(columns));
  }
}

export function loadKanbanState(): KanbanColumn[] | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("kanban-state");
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return null;
}
