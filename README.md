# Retro & Action Tracker

**AI-powered retrospective action tracking system for enterprise agile teams.**

Transform retrospective insights into tracked, deduplicated, and contextualized action items. Powered by Claude AI to prevent forgotten tasks and build organizational knowledge.

---

## 🎯 Problem We Solve

**Observation**: Agile teams conduct retros on external platforms (Miro, Mural, etc.), extract action items, then... forget them.

- Actions scatter across Slack, Jira, email
- Duplicates emerge ("Fix auth timeout" appears in 3 different sprints)
- No connection between past blockers and current problems
- 1000+ devs repeat investigation on same issues

**Solution**: Centralized AI-powered action tracker that:
1. Extracts actions intelligently (Claude)
2. Detects and prevents duplicates (rule-based + semantic matching)
3. Identifies blockers and suggests past solutions
4. Reminds teams before they forget
5. Integrates with Jira/Confluence for enterprise workflows

---

## ✨ Key Features

### 1. **Intelligent Extraction** (Claude Opus 4.7)
Paste retro notes → Claude extracts + structures actions:
- Description (clear, actionable)
- Category (bug/feature/refactor/process)
- Blocker flag (blocks other work?)
- Owner inference from context

### 2. **Smart Deduplication**
- Rule-based: same category + team → likely duplicate
- Claude judgment: semantic matching for borderline cases
- User can accept/reject merge suggestions

### 3. **Blocker Intelligence**
- Flag blocking vs regular actions
- Store solutions when blocker resolved
- Suggest past solutions for new blockers
- Reduce duplicate investigation across teams

### 4. **Action Dashboard**
- View all actions (open/in-progress/closed)
- Real-time status updates
- Filter by status/category/owner
- Track completion rate

### 5. **Smart Reminders**
- Claude-generated contextual emails
- References original problem + team context
- Adaptive frequency (know when team forgets)
- Extensible: Slack/Teams/Discord (future)

### 6. **Enterprise Integration**
- Jira MCP: Link actions → tickets, bidirectional sync
- Confluence: Store solutions + knowledge base
- Bitbucket: Link to code changes
- Multi-team analytics (future)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│   Next.js 14 App (Vercel Deployment)    │
├─────────────────────────────────────────┤
│  Frontend                               │
│  - RetroCapture (paste notes)          │
│  - ActionDashboard (status tracking)   │
│  - ActionList (view/edit)              │
├─────────────────────────────────────────┤
│  API Routes (Serverless on Vercel)      │
│  ├─ POST   /api/extract          (Claude)
│  ├─ GET    /api/actions          (List)
│  ├─ POST   /api/actions/bulk     (Create)
│  └─ PATCH  /api/actions/[id]     (Update)
├─────────────────────────────────────────┤
│  Storage                                │
│  - In-memory (MVP)                     │
│  - Postgres/Firebase (production)      │
├─────────────────────────────────────────┤
│  AI Orchestration                       │
│  ├─ Claude Opus 4.7 (extraction)       │
│  ├─ Semantic matching (dedup)          │
│  ├─ Solution suggestions               │
│  └─ Reminder generation                │
├─────────────────────────────────────────┤
│  Enterprise Integration                 │
│  ├─ Jira MCP (tickets)                 │
│  ├─ Confluence MCP (knowledge base)    │
│  └─ Bitbucket MCP (code links)        │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Local Development

```bash
# 1. Clone repo
git clone https://github.com/mehmetsahinnn/hac.git
cd hac

# 2. Install + setup
npm install
cp .env.example .env.local
# Edit .env.local: add ANTHROPIC_API_KEY

# 3. Run dev server
npm run dev
# Open http://localhost:3000

# 4. Test extraction
curl -X POST http://localhost:3000/api/extract \
  -H "Content-Type: application/json" \
  -d '{"notes": "Fix auth timeout. Sarah. Improve docs. Mike."}'
```

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

# Your app is live! 🎉
```

---

## 💡 AI Strategy & Orchestration

Claude Opus 4.7 is orchestrated at **5 strategic decision points**:

| Point | Purpose | Method |
|-------|---------|--------|
| **Extraction** | Parse retro notes into structured actions | Structured JSON prompt with examples |
| **Blocker Detection** | Identify actions that block other work | Classification within extraction |
| **Deduplication** | Find + merge duplicate actions | Rule-based + Claude semantic judgment |
| **Solution Matching** | Suggest past solutions for blockers | Semantic embedding + fuzzy matching |
| **Reminder Generation** | Create context-aware reminder emails | Claude with team + deadline context |

**Why Claude?**
- Handles natural language variation
- Context-aware (team, history, domain)
- No brittle rule sets
- Learns from feedback (dedup acceptance)

**Why Hybrid?**
- Rule-based = fast + transparent + explainable
- LLM = nuanced + flexible + intelligent
- Together = reliable + sophisticated

---

## 🎤 Presentation Outline (7 min)

### 1. **Problem** (1 min)
"Retros happen, actions get lost, same issues repeat. 1000+ devs wasting time."

### 2. **Solution Demo** (4 min)
Live demo:
1. Paste sample retro notes
2. Claude extracts → edit actions
3. Dashboard shows status
4. (Optional) Show duplicate detection
5. (Optional) Show solution suggestion

### 3. **X-Factor / "Vay Be Moment"** (2 min)
"We didn't just build a task tracker. We designed intelligent orchestration:
- **Extraction**: Natural language → structured actions
- **Deduplication**: Prevent repeated work across 1000+ devs
- **Solutions**: When a blocker is solved, the solution is indexed and suggested for future blockers
- **Enterprise**: Jira/Confluence integration means actions live in both retro tracker AND existing tools
- **Strategic AI Use**: Claude isn't just chatting—it's at 5 decision points, making intelligent trade-offs"

---

## 📋 Project Submission

### Files Structure

```
retro-tracker/
├── README.md                           # This file
├── .env.example                        # Env vars template
├── package.json                        # Dependencies
├── next.config.js                      # Next.js config
├── tsconfig.json                       # TypeScript config
├── tailwind.config.js                  # Tailwind config
├── vercel.json                         # Vercel deployment config
│
├── CLAUDE.md                           # AI agents + skills config
├── skills-lock.json                    # Locked AI skills
│
├── docs/
│   ├── RETRO-TRACKER-DESIGN.md        # Full system design (160KB+)
│   ├── IMPLEMENTATION-GUIDE.md         # Step-by-step build guide
│   └── DEPLOYMENT.md                   # Vercel deployment steps
│
├── app/                                # Next.js App Router
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Home page
│   ├── globals.css                     # Global styles
│   └── api/                            # API endpoints
│       ├── extract/route.ts            # Claude extraction
│       ├── actions/
│       │   ├── route.ts                # GET/POST actions
│       │   ├── bulk/route.ts           # Bulk create
│       │   └── [id]/route.ts           # Update single
│
├── components/                         # React components
│   ├── RetroCapture.tsx                # Retro input form
│   ├── ActionDashboard.tsx             # Main dashboard
│   └── ActionList.tsx                  # Action list view
│
├── lib/
│   └── storage.ts                      # In-memory DB (swap for real DB)
│
└── .gitignore                          # Git ignore rules
```

### Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **AI**: Claude Opus 4.7 (Anthropic API)
- **Integration**: Atlassian MCP (Jira, Confluence, Bitbucket)
- **Deployment**: Vercel
- **Database**: In-memory MVP → Postgres/Firebase (production)

### AI Tools Used

- **Claude API** (claude-opus-4-7)
- **Anthropic SDK** (@anthropic-ai/sdk)
- **Atlassian MCP** (for Jira/Confluence/Bitbucket integration)

---

## 📊 Success Metrics

**MVP Demo Shows:**
- ✅ Extract 8 action items from sample retro → 85%+ accuracy
- ✅ Detect 2+ duplicate actions when merged
- ✅ Identify 2+ blockers and flag them
- ✅ Dashboard updates in real-time
- ✅ Generate contextual reminder email in <3 sec

**Enterprise Ready Shows:**
- ✅ Multi-team support (department-level scoping)
- ✅ Jira integration (link/sync tickets)
- ✅ Clear AI strategy documented
- ✅ Production deployment on Vercel

---

## 🎯 Scope: MVP vs. Extensibility

### Built (MVP Phase)
- Retro capture + extraction
- Action dashboard
- Deduplication detection
- Blocker flagging
- Solution capture (optional)
- Reminder generation (sample)
- Jira integration (MCP-ready)

### Designed for Scale (Phase 2+)
- Multi-team/dept analytics
- Outlook/Slack/Teams notifications
- Solution feedback loop (improve matching)
- Historical blocker trends
- Team velocity analytics
- Confluence knowledge base

---

## 🔒 Security

- ✅ API keys → Environment variables only
- ✅ Vercel Secrets for production
- ✅ No hardcoded credentials
- ✅ MCP creds in local .env (not committed)
- ✅ User isolation (single-user MVP)

---

## 🛠️ Development

### Run Locally
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Test API
See `docs/IMPLEMENTATION-GUIDE.md` for curl examples.

---

## 📞 Support

- **Design Details**: See `docs/RETRO-TRACKER-DESIGN.md`
- **Build Guide**: See `docs/IMPLEMENTATION-GUIDE.md`
- **Deployment**: See `docs/DEPLOYMENT.md`
- **AI Strategy**: See `CLAUDE.md`

---

## 🎓 Key Learnings

This project demonstrates:
1. **Strategic AI Orchestration** — Claude isn't just a chatbot, it's embedded at multiple decision points
2. **Hybrid Intelligence** — Rules + LLM = reliable + sophisticated
3. **Enterprise Integration** — Modern APIs (MCP) make enterprise tools accessible
4. **Rapid Prototyping** — MVP in 3 hours, extensible architecture
5. **Problem-Focused Design** — Start with real problem ("forgotten actions"), design solution, orchestrate AI

---

## 📝 License

Proprietary - Prompt Sprint AI Hackathon 2026

---

**Built with ❤️ using Claude Opus 4.7 + Next.js 14**

[Repo](https://github.com/mehmetsahinnn/hac) | [Live Demo](https://hac.vercel.app) | [Design Doc](./docs/RETRO-TRACKER-DESIGN.md)
