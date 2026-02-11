# Mission Control Dashboard

A comprehensive dashboard for tracking PRs, branches, projects, and automated workflows across all repositories. Built as the central command center for managing the OpenClaw ecosystem.

## Features

### 📊 Dashboard Overview
- Project health status indicators
- Open PR counts and statuses
- Recent work timeline
- Revenue impact metrics

### 🔄 Kanban Board
- Drag-and-drop task management
- Customizable columns for workflow stages
- Real-time sync across sessions
- Persistent local state

### 🎫 Tickets View (Jira-style)
- Filter by project, status, priority
- Search across all tickets
- Detailed ticket information
- Status tracking

### 📁 Projects Explorer
- Repository health monitoring
- Branch status overview
- Deployment tracking
- Performance metrics

### 🌿 Branches Manager
- Branch status tracking (active/stale/merged)
- Ahead/behind indicators
- Quick actions (sync, delete, compare)

### 📝 Work Log
- Complete timeline of all work performed
- Filter by work type (commits, PRs, deploys, tasks)
- Project-based grouping
- Export functionality

### ⚙️ Workflows Engine
- Trigger-based automation rules
- Action sequences (code review, truth review, deploy)
- Schedule-based workflows
- Status monitoring

## Architecture

- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **dnd-kit** for drag-and-drop functionality
- **TypeScript** for type safety
- **Cloudflare Pages** for hosting
- **GitHub API** integration for real data

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/RShuken/mission-control.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run locally:
   ```bash
   npm run dev
   ```

## Integration Points

The dashboard is designed to connect with:
- GitHub API for PR and branch data
- Cloudflare Pages for deployment status
- Custom workflow triggers
- Revenue tracking systems

## Roadmap

- [ ] GitHub API integration
- [ ] Real-time data fetching
- [ ] Advanced filtering options
- [ ] Custom workflow builder
- [ ] Team collaboration features
- [ ] Advanced reporting

## License

MIT