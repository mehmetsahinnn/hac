# Retro & Action Tracker

AI-powered retrospective action extraction and tracking platform. Extracts action items from meeting notes, calculates forgotten risk scores, detects recurring issues, and generates smart reminders.

## Features

### Core
- **AI Extraction** -- Paste retro notes, Claude extracts structured actions with owner, deadline, and closure criteria
- **Accountability Loop** -- Every action has an owner, deadline, and "done" definition
- **Status Dashboard** -- Track actions as open/in-progress/closed with filtering

### Intelligence
- **Forgotten Risk Score** -- 0-100 risk calculation based on age, missing owner/deadline, blocker status
- **Recurring Issue Detection** -- AI compares new actions against history, flags repeating problems
- **Next Retro Gate** -- Forces review of open actions before starting a new retro
- **Smart Reminders** -- Context-aware Turkish reminder emails for high-risk actions only
- **Team Memory** -- AI-generated insights, trends, and lessons from retrospective history

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (Ventriloc design system)
- Claude API (claude-sonnet-4-6)
- In-memory storage (globalThis persistence)

## Setup

```bash
# Install dependencies
npm install

# Copy environment file and add your API key
cp .env.example .env.local

# Start development server (increase file limit for macOS)
ulimit -n 10240 && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo data auto-loads on first API access (3 retros, 15 actions).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/extract` | Extract actions from retro notes + detect recurring issues |
| GET | `/api/actions` | List all actions with calculated risk scores |
| POST | `/api/actions/bulk` | Save multiple actions to a retro |
| PATCH | `/api/actions/[id]` | Update action status/deadline/criteria |
| POST | `/api/recurring` | Detect recurring issues against past actions |
| GET | `/api/reminders` | Generate smart reminders for high-risk actions |
| GET | `/api/insights` | AI-generated team memory insights |

## Architecture

```
app/
  page.tsx              -- 4-tab UI (Yeni Retro, Dashboard, Hatirlatmalar, Takim Hafizasi)
  api/
    extract/            -- Claude extraction + recurring detection
    actions/            -- CRUD with risk calculation
    recurring/          -- Standalone recurring detection
    reminders/          -- Smart reminder generation
    insights/           -- Team memory insights
components/
  RetroCapture.tsx      -- Note input + extraction flow
  RetroGate.tsx         -- Open action review gate
  ActionDashboard.tsx   -- Filterable dashboard with metrics
  ActionList.tsx        -- Reusable list with risk/recurring badges
  ReminderPreview.tsx   -- Reminder cards with copy-to-clipboard
  TeamMemory.tsx        -- AI insights display
lib/
  storage.ts            -- In-memory store (Action + Retro models)
  risk.ts               -- Risk score formula
  seed.ts               -- Demo data (3 retros, 15 actions)
  init.ts               -- Auto-seed on first access
```

## AI Orchestration Points

1. **Extraction** -- Retro notes to structured actions (description, category, owner, deadline, closure criteria)
2. **Recurring Detection** -- New actions vs past actions similarity check
3. **Smart Reminders** -- Contextual Turkish emails for high-risk items
4. **Team Insights** -- Trends, patterns, lessons from full retro history

## Deployment

```bash
npm run build
git push origin master
```

Deploy via Vercel: import repo, add `ANTHROPIC_API_KEY` in environment settings.
