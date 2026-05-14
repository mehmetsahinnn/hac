# Retro & Action Tracker

**AI-powered retrospective action tracking system for enterprise agile teams.**

Transform retrospective insights into tracked, deduplicated, and contextualized action items. Powered by Claude AI to prevent forgotten tasks and build organizational knowledge.

---

## Problem We Solve

**Observation**: Agile teams conduct retros on external platforms (Miro, Mural, etc.), extract action items, then... forget them.

- Actions scatter across Slack, Jira, email
- Duplicates emerge ("Fix auth timeout" appears in 3 different sprints)
- No connection between past blockers and current problems
- 1000+ devs repeat investigation on same issues

**Solution**: Centralized AI-powered action tracker that:
1. Extracts actions intelligently (Claude)
2. Detects recurring issues across retros (semantic matching)
3. Calculates "forgotten risk score" to prevent lost actions
4. Reminds teams before they forget (contextual, not spam)
5. Builds team memory from retrospective history

---

## Key Features

### 1. Intelligent Extraction (Claude Sonnet 4.6)
Paste retro notes → Claude extracts + structures actions:
- Description (clear, actionable)
- Category (bug/feature/refactor/process)
- Blocker flag (blocks other work?)
- Owner inference from context
- Deadline (inferred or "next sprint")
- Closure criteria (what "done" means)

### 2. Accountability Loop
Every action has an owner, deadline, and completion criteria:
- Color-coded deadlines (red = overdue, yellow = approaching)
- Inline editing for deadline and closure criteria
- Status tracking: open → in-progress → closed

### 3. Forgotten Risk Score (0-100)
AI-calculated risk that an action will be forgotten:
- Age factor: +2/day since creation (max 40)
- No owner: +20
- No deadline: +15
- No closure criteria: +10
- Is blocker: +15
- Still open after 7 days: +10

### 4. Next Retro Gate
Before starting a new retro, the system forces review of unresolved actions from previous retros. Users must acknowledge/update each or explicitly skip.

### 5. Recurring Issue Detection
After extraction, Claude compares new actions against all past actions to detect recurring themes. Flagged with "Tekrarlayan" badge showing how many times the issue appeared.

### 6. Smart Reminders
Claude-generated contextual emails (Turkish) for high-risk actions only (risk > 60):
- References original problem + team context
- Includes deadline and completion criteria
- Copy-to-clipboard (no spam, manual send)

### 7. Team Memory
AI-generated insights from full retrospective history:
- Trends across sprints
- Recurring patterns
- Lessons learned
- Recommendations for improvement

---

## Architecture

```
┌─────────────────────────────────────────┐
│   Next.js 14 App (Vercel Deployment)    │
├─────────────────────────────────────────┤
│  Frontend (Ventriloc Design System)     │
│  - RetroCapture (paste notes)           │
│  - RetroGate (open actions review)      │
│  - ActionDashboard (metrics + filter)   │
│  - ActionList (risk/recurring badges)   │
│  - ReminderPreview (email preview)      │
│  - TeamMemory (AI insights)             │
├─────────────────────────────────────────┤
│  API Routes (Serverless on Vercel)      │
│  ├─ POST   /api/extract       (Claude)  │
│  ├─ GET    /api/actions        (List)   │
│  ├─ POST   /api/actions/bulk   (Create) │
│  ├─ PATCH  /api/actions/[id]   (Update) │
│  ├─ POST   /api/recurring      (Detect) │
│  ├─ GET    /api/reminders      (Generate)│
│  └─ GET    /api/insights       (Memory) │
├─────────────────────────────────────────┤
│  Storage                                │
│  - In-memory (MVP, globalThis)          │
│  - Postgres/Firebase (production)       │
├─────────────────────────────────────────┤
│  AI Orchestration (Claude Sonnet 4.6)   │
│  ├─ Extraction (notes → actions)        │
│  ├─ Recurring detection (similarity)    │
│  ├─ Risk scoring (formula-based)        │
│  ├─ Reminder generation (contextual)    │
│  └─ Team insights (trend analysis)      │
├─────────────────────────────────────────┤
│  Enterprise Integration (Future)        │
│  ├─ Jira MCP (tickets)                  │
│  ├─ Confluence MCP (knowledge base)     │
│  └─ Bitbucket MCP (code links)          │
└─────────────────────────────────────────┘
```

---

## Quick Start

### Local Development

```bash
# 1. Clone repo
git clone https://github.com/mehmetsahinnn/hac.git
cd hac

# 2. Install + setup
npm install
cp .env.example .env.local
# Edit .env.local: add ANTHROPIC_API_KEY

# 3. Run dev server (increase file limit for macOS)
ulimit -n 10240 && npm run dev
# Open http://localhost:3000

# 4. Test extraction
curl -X POST http://localhost:3000/api/extract \
  -H "Content-Type: application/json" \
  -d '{"notes": "Fix auth timeout. Sarah. Improve docs. Mike."}'
```

Demo data auto-loads on first API access (3 retros, 15 actions across different statuses and risk levels).

### Deploy to Vercel

```bash
# 1. Push to GitHub
git push origin master

# 2. Deploy on Vercel
npm i -g vercel
vercel

# 3. Set environment variable
vercel env add ANTHROPIC_API_KEY sk-ant-...
vercel --prod
```

---

## AI Strategy & Orchestration

Claude Sonnet 4.6 is orchestrated at **5 strategic decision points**:

| Point | Purpose | Method |
|-------|---------|--------|
| **Extraction** | Parse retro notes into structured actions | Structured JSON prompt with deadline + criteria |
| **Recurring Detection** | Find same issues appearing across retros | Semantic comparison of new vs past actions |
| **Risk Scoring** | Predict which actions will be forgotten | Rule-based formula (deterministic, no API call) |
| **Reminder Generation** | Create context-aware Turkish reminder emails | Claude with team + deadline + criteria context |
| **Team Insights** | Generate trends and lessons from history | Full retro history analysis via Claude |

**Why Claude?**
- Handles natural language variation in retro notes
- Context-aware (team, history, domain)
- No brittle rule sets for extraction
- Generates human-quality reminders

**Why Hybrid?**
- Rule-based risk scoring = fast + transparent + explainable
- LLM extraction = nuanced + flexible + intelligent
- Together = reliable + sophisticated

---

## Presentation Outline (7 min)

### 1. Problem (1 min)
"Retros happen, actions get lost, same issues repeat. 1000+ devs wasting time."

### 2. Solution Demo (4 min)
Live demo:
1. Show pre-loaded dashboard (15 actions, risk badges, recurring indicators)
2. Navigate to "Yeni Retro" → see Retro Gate blocking with open actions
3. Paste sample retro notes → Claude extracts with deadlines + criteria
4. Show recurring detection ("Bu sorun daha once de konusulmus!")
5. Show smart reminders tab (Turkish contextual emails)
6. Show team memory tab (AI-generated insights)

### 3. X-Factor / "Vay Be Moment" (2 min)
"We didn't just build a task tracker. We designed intelligent orchestration:
- **Extraction**: Natural language → structured actions with deadlines + done criteria
- **Recurring Detection**: AI catches the same problem appearing sprint after sprint
- **Forgotten Risk Score**: Proactively identifies actions about to be forgotten
- **Retro Gate**: Forces accountability before moving to next retro
- **Team Memory**: The team's institutional knowledge, always available
- **Strategic AI Use**: Claude at 5 decision points, making intelligent trade-offs"

---

## Project Structure

```
retro-tracker/
├── README.md
├── .env.example
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── CLAUDE.md
├── skills-lock.json
│
├── docs/
│   └── IMPLEMENTATION-GUIDE.md
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # 4-tab UI
│   ├── globals.css                 # Ventriloc design tokens
│   └── api/
│       ├── extract/route.ts        # Claude extraction + recurring
│       ├── actions/
│       │   ├── route.ts            # GET with risk calculation
│       │   ├── bulk/route.ts       # Bulk create
│       │   └── [id]/route.ts       # PATCH update
│       ├── recurring/route.ts      # Standalone recurring detection
│       ├── reminders/route.ts      # Smart reminder generation
│       └── insights/route.ts       # Team memory insights
│
├── components/
│   ├── RetroCapture.tsx            # Note input + extraction
│   ├── RetroGate.tsx               # Open action review gate
│   ├── ActionDashboard.tsx         # Filterable dashboard
│   ├── ActionList.tsx              # List with risk/recurring badges
│   ├── ReminderPreview.tsx         # Reminder cards
│   └── TeamMemory.tsx              # AI insights display
│
├── lib/
│   ├── storage.ts                  # In-memory store (Action + Retro)
│   ├── risk.ts                     # Risk score formula
│   ├── seed.ts                     # Demo data (3 retros, 15 actions)
│   └── init.ts                     # Auto-seed on first access
│
└── .gitignore
```

### Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS (Ventriloc design system)
- **Backend**: Next.js API Routes (serverless)
- **AI**: Claude Sonnet 4.6 (Anthropic API)
- **Integration**: Atlassian MCP (Jira, Confluence, Bitbucket) - future
- **Deployment**: Vercel
- **Database**: In-memory MVP → Postgres/Firebase (production)

### AI Tools Used

- **Claude API** (claude-sonnet-4-6)
- **Anthropic SDK** (@anthropic-ai/sdk)
- **Claude Code Skills** (Marketplace'den alinip kullanildi):
  - **Caveman Skill** -- Token-efficient communication mode for faster AI interactions
  - **Brainstorming Skill** -- Collaborative design exploration before implementation
- **Atlassian MCP** (for Jira/Confluence/Bitbucket integration - planned)

---

## Success Metrics

**MVP Demo Shows:**
- Extract 8+ action items from sample retro → 85%+ accuracy
- Detect recurring issues across retros
- Calculate risk scores for all open actions
- Retro Gate blocks new retro until previous reviewed
- Generate contextual Turkish reminder email in <5 sec
- Show team memory insights from history

**Enterprise Ready (Phase 2):**
- Multi-team support (department-level scoping)
- Jira integration (link/sync tickets)
- Outlook/Slack/Teams notifications
- Historical blocker trends
- Team velocity analytics

---

## Scope: MVP vs. Extensibility

### Built (MVP)
- Retro capture + AI extraction (with deadline + criteria)
- Action dashboard with risk scores
- Recurring issue detection
- Next Retro Gate
- Smart reminders (Turkish, copy-to-clipboard)
- Team memory insights
- Ventriloc design system
- Demo data (3 retros, 15 actions)

### Designed for Scale (Phase 2+)
- Multi-team/dept analytics
- Outlook/Slack/Teams notifications
- Jira MCP integration (link tickets)
- Confluence knowledge base
- Solution feedback loop
- Historical blocker trends
- Team velocity analytics

---

## Security

- API keys → Environment variables only
- Vercel Secrets for production
- No hardcoded credentials
- MCP creds in local .env (not committed)
- User isolation (single-user MVP)

---

## Development

### Run Locally
```bash
npm install
ulimit -n 10240 && npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Test API
See `docs/IMPLEMENTATION-GUIDE.md` for curl examples.

---

## Key Learnings

This project demonstrates:
1. **Strategic AI Orchestration** — Claude isn't just a chatbot, it's embedded at 5 decision points
2. **Hybrid Intelligence** — Rules (risk scoring) + LLM (extraction, detection) = reliable + sophisticated
3. **Accountability by Design** — Retro Gate + Risk Score prevent actions from being forgotten
4. **Enterprise Integration** — Modern APIs (MCP) make enterprise tools accessible
5. **Rapid Prototyping** — Full MVP in 3 hours, extensible architecture
6. **Problem-Focused Design** — Start with real problem ("forgotten actions"), design solution, orchestrate AI

---

## License

Proprietary - Prompt Sprint AI Hackathon 2026

---

**Built with Claude Sonnet 4.6 + Next.js 14**

[Repo](https://github.com/mehmetsahinnn/hac) | [Live Demo](https://hac-two.vercel.app) | [Design Doc](./docs/IMPLEMENTATION-GUIDE.md)
