# Retro & Action Tracker - Implementation Guide

## Quick Setup (15 minutes to working MVP)

### 1. Initialize Next.js Project

```bash
cd ~/Desktop/hac
npm install next react react-dom typescript @anthropic-ai/sdk tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Create Project Structure

```bash
mkdir -p app/api/{extract,actions/{bulk,\[id\]}} components lib
```

### 3. Key Files to Create

#### `package.json`
- Next.js 14+, React 18, TypeScript, Tailwind CSS
- Include: `@anthropic-ai/sdk` for Claude API
- Scripts: `dev`, `build`, `start`, `lint`

#### `app/layout.tsx`
- Root layout with Tailwind globals
- Metadata (title, description)
- Body with min-h-screen

#### `app/page.tsx`
- Main dashboard with tabs: "New Retro" + "Dashboard"
- Import RetroCapture + ActionDashboard components

#### `components/RetroCapture.tsx`
- Textarea for retro notes input
- Call `/api/extract` on submit
- Show extracted actions with edit UI
- Call `/api/actions/bulk` to save

#### `components/ActionDashboard.tsx`
- Fetch actions from `/api/actions`
- Display as list (open/closed/in-progress)
- Status dropdown to update via `/api/actions/[id]`

#### `components/ActionList.tsx`
- Reusable action display component
- Show: description, category, owner, blocker badge
- Editable mode for review step

#### `lib/storage.ts`
- In-memory storage (replace with DB later)
- Methods:
  - `addActions()` - save extracted actions
  - `getActions()` - list all
  - `updateAction(id, updates)` - update status
  - `getSolutions()` - fetch stored solutions
  - `findSimilarBlockers(description)` - search by similarity

#### `app/api/extract/route.ts`
```typescript
// POST /api/extract
// Body: { notes: string }
// Use Anthropic SDK to call Claude
// Prompt: "Extract actions from retro. Return JSON: [{ description, category, is_blocker, inferred_owner }]"
// Response: { actions: [...] }
```

#### `app/api/actions/route.ts`
```typescript
// GET /api/actions
// Response: { actions: [...] }
```

#### `app/api/actions/bulk/route.ts`
```typescript
// POST /api/actions/bulk
// Body: { actions: [...] }
// Save actions, return created actions with IDs
```

#### `app/api/actions/[id]/route.ts`
```typescript
// PATCH /api/actions/[id]
// Body: { status: "open|in-progress|closed" }
// Update action, return updated action
```

### 4. Environment Setup

Create `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY
DATABASE_URL=  # Optional for production
NODE_ENV=development
```

### 5. Build & Run

```bash
npm run build
npm run dev
# Open http://localhost:3000
```

### 6. Deploy to Vercel

```bash
git add .
git commit -m "feat: Implement Retro & Action Tracker MVP"
git push origin master

# Then via Vercel UI:
# 1. https://vercel.com/new
# 2. Import GitHub repo
# 3. Add ANTHROPIC_API_KEY environment variable
# 4. Deploy
```

---

## Feature Implementation Checklist

### MVP (Phase 1 - Day 1)
- [ ] Retro capture UI (textarea input)
- [ ] Claude extraction via API
- [ ] Action review/edit before save
- [ ] Action dashboard with list
- [ ] Status updates (open → in-progress → closed)

### Enhanced (Phase 2 - After MVP)
- [ ] Blocker detection (is_blocker flag in extraction)
- [ ] Solution capture when closing blockers
- [ ] Similar blocker detection (semantic search)
- [ ] Reminder generation (sample email)
- [ ] Jira MCP integration (link tickets)

### Analytics (Phase 3)
- [ ] Dashboard stats (total actions, completion rate)
- [ ] Blocker trends
- [ ] Team velocity analysis

---

## AI Orchestration Points

### Point 1: Extraction
**File**: `app/api/extract/route.ts`  
**Input**: Raw retro notes  
**Claude Prompt**:
```
Extract action items from retrospective notes. For each:
1. Description (concise, actionable)
2. Category: bug, feature, refactor, process, other
3. Is blocker? (blocks other work)
4. Inferred owner (person name, if mentioned)

Return ONLY valid JSON: [{ description, category, is_blocker, inferred_owner }, ...]
```

### Point 2: Blocker Detection
**Enhancement**: Add Claude call to classify actions as blockers  
**Prompt**:
```
Categorize these actions as blockers (block other work) or regular:
[action list]
Return: { [action_id]: { is_blocker: true/false, reason: "..." } }
```

### Point 3: Deduplication
**Enhancement**: Add similar action detection  
**Logic**:
- Rule: Same category + team → likely duplicate
- Borderline: Send to Claude: "Are these the same action?"

### Point 4: Solution Suggestions
**Enhancement**: When closing blocker, suggest past solutions  
**Logic**:
- Fetch past solutions
- Claude: "Are these similar problems? Suggest solution."
- Return: "Similar issue was solved by..."

### Point 5: Reminder Generation
**Enhancement**: Generate contextual emails  
**Prompt**:
```
Generate a 2-3 sentence reminder email:
- Action: [description]
- Due: [date]
- Team context: [retro notes excerpt]
- Tone: friendly, urgent but not pushy
```

---

## Database Schema (When Ready to Move from In-Memory)

```sql
-- Retros
CREATE TABLE retros (
  id UUID PRIMARY KEY,
  dept_id VARCHAR,
  team_id VARCHAR,
  date TIMESTAMP,
  raw_notes TEXT,
  status VARCHAR,
  created_by VARCHAR,
  created_at TIMESTAMP
);

-- Actions
CREATE TABLE actions (
  id UUID PRIMARY KEY,
  retro_id UUID REFERENCES retros(id),
  description TEXT NOT NULL,
  category VARCHAR,
  priority VARCHAR,
  deadline DATE,
  owner_id VARCHAR,
  status VARCHAR,
  is_blocker BOOLEAN,
  created_at TIMESTAMP,
  closed_at TIMESTAMP
);

-- Solutions
CREATE TABLE solutions (
  id UUID PRIMARY KEY,
  action_id UUID REFERENCES actions(id),
  description TEXT,
  tags TEXT[],
  created_by VARCHAR,
  created_at TIMESTAMP,
  helpful_count INT
);

-- Dedup tracking
CREATE TABLE action_matches (
  id UUID PRIMARY KEY,
  action_id_1 UUID,
  action_id_2 UUID,
  similarity_score FLOAT,
  merge_status VARCHAR,
  created_at TIMESTAMP
);
```

---

## Testing the APIs

### Extract Test
```bash
curl -X POST http://localhost:3000/api/extract \
  -H "Content-Type: application/json" \
  -d '{"notes": "Fix auth timeout. Sarah. Improve docs. Mike."}'
```

### Save Actions
```bash
curl -X POST http://localhost:3000/api/actions/bulk \
  -H "Content-Type: application/json" \
  -d '{"actions": [{"description": "Fix auth", "category": "bug", "is_blocker": true, "inferred_owner": "Sarah"}]}'
```

### Get Actions
```bash
curl http://localhost:3000/api/actions
```

### Update Status
```bash
curl -X PATCH http://localhost:3000/api/actions/action-1 \
  -H "Content-Type: application/json" \
  -d '{"status": "closed"}'
```

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] `.env.example` in repo (no secrets)
- [ ] `.gitignore` excludes: `node_modules`, `.next`, `.env.local`
- [ ] README with setup instructions
- [ ] CLAUDE.md with AI strategy documented
- [ ] Design doc explaining architecture
- [ ] Vercel deployment configured
- [ ] Environment variables set in Vercel:
  - `ANTHROPIC_API_KEY`
  - `NODE_ENV=production`

---

## Next Steps for Production

1. **Database**: Migrate from in-memory to Postgres/Firebase
2. **MCP Integration**: Wire up Jira/Confluence/Bitbucket MCPs
3. **Authentication**: Add user login + team isolation
4. **Email**: Integrate Outlook for reminders
5. **Analytics**: Add dashboard stats + trends
6. **Monitoring**: Set up error tracking + performance monitoring

---

## Time Estimates

| Task | Time |
|------|------|
| Setup + boilerplate | 10 min |
| Extract API + Claude integration | 15 min |
| Components (capture, dashboard, list) | 20 min |
| Actions API (CRUD) | 15 min |
| Testing + bug fixes | 15 min |
| Deployment to Vercel | 10 min |
| **Total MVP** | **85 min** |

---

## Hackathon Tips

1. **Demo focuses on extraction + dashboard** (most visual, shows AI value)
2. **Pre-load sample data** for dashboard demo (in case API is slow)
3. **Have fallback data** if Claude API fails during demo
4. **Test on mobile** (Vercel URL works on phones for judges)
5. **Record a 2-min demo video** as backup if live demo fails
6. **Document the "Vay be" moment**: "We orchestrate Claude at 5 decision points - extraction, dedup, blocker detection, solution suggestions, reminders"
