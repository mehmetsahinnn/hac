# Hackathon Project

3-hour AI hackathon. Build fast, ship working product.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Vercel AI SDK
- Claude API (claude-sonnet-4-6)
- Deploy: Vercel

## Agent Workflow
1. New topic → `@analyst` first always
2. Frontend tasks → `@frontend-dev`
3. Backend/API tasks → `@backend-dev`
4. Feature done → `@qa`
5. Before deploy → `@security`

## Rules
- Working beats perfect
- Every feature needs loading + error state

## If Topic Needs Auth (use pre-built, don't build from scratch)
- Clerk — 15 min setup, free tier: `npm install @clerk/nextjs`
- NextAuth.js — GitHub OAuth: `npm install next-auth`

## If Topic Needs Database (use managed, don't self-host)
- Vercel KV (Redis) — key-value, free tier, 2 min setup
- Supabase — Postgres + free tier + JS SDK: `npm install @supabase/supabase-js`
- JSON file on disk — simplest, fine for local demo

## If Topic Needs State Management
- Zustand — simple, 5 min setup: `npm install zustand`
- React Context — built-in, no install needed
- Avoid Redux (too much boilerplate)

## Env Vars Needed
```
ANTHROPIC_API_KEY=sk-ant-...
```

## Time Budget
- Analysis: 15 min
- Core feature build: 90 min
- Testing + bug fix: 30 min
- Security check: 10 min
- Deploy + demo prep: 15 min
