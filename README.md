# Coach - AI-Powered Task Management for ADHD Support

An AI-powered task management system designed for people with ADHD and executive dysfunction. Provides gentle accountability, encouragement, and realignment through structured daily check-ins.

**Live Demo:** [coach.mxjxn.com](https://coach.mxjxn.com)

## Features

- **AI Coach Integration** - Powered by OpenClaw agents with contextual support
- **Daily Check-ins** - 3x per day (morning, midday, evening) via Telegram
- **Web3 Authentication** - RainbowKit + wagmi for wallet-based login
- **ENS Support** - Automatic ENS name resolution for user profiles
- **SQLite Database** - Full CRUD operations for goals, tasks, and check-ins
- **Next.js 15** - Modern React with App Router

## Architecture

```
coach/
├── frontend/          # Next.js app (Web3 auth, dashboard)
├── coach-webhook/     # Go webhook handler (future)
├── AGENTS.md          # Agent routing configuration
├── SOUL.md           # Coach agent personality
└── migrate_phase1.sql # Database migrations
```

## Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Auth:** RainbowKit, wagmi, viem
- **Database:** SQLite (better-sqlite3)
- **AI:** OpenClaw agent framework
- **Messaging:** Telegram Bot API

## Getting Started

### Prerequisites

- Node.js 18+
- SQLite3
- OpenClaw (for agent integration)
- Telegram bot token

### Installation

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

```bash
sqlite3 coach.db < migrate_phase1.sql
```

## Coach Agent

The Coach agent provides:
- Morning priority planning
- Midday progress check
- Evening reflection and celebration
- Persistent follow-up for engagement
- Contextual encouragement

See `skills/coach/` in the workspace-conductor for agent implementation.

## Roadmap

- [ ] Multi-user support
- [ ] Streak tracking
- [ ] Progress charts
- [ ] Mobile app
- [ ] SaaS monetization

## License

MIT

## Author

Built by [mxjxn](https://mxjxn.com) • Powered by [OpenClaw](https://openclaw.ai)
