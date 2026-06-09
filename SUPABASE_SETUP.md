# Real-time multi-user with Supabase (free tier)

RetroTool works out of the box in local mode (one browser, live cross-tab sync).
To let multiple people on different devices share a board live, connect a free
Supabase project. The free plan includes a Postgres database and 200 concurrent
realtime connections - plenty for a retro.

## 1. Create a project
1. Sign up at https://supabase.com and create a new project (Free plan).
2. Wait for it to finish provisioning.

## 2. Get your keys
Easiest: click the green **Connect** button at the top of the dashboard - it
shows the Project URL and key together.

Or via Settings (gear icon, bottom-left) -> **API Keys** (or **API**):
- **Project URL** (https://<ref>.supabase.co)  -> NEXT_PUBLIC_SUPABASE_URL
- **anon / public** key                          -> NEXT_PUBLIC_SUPABASE_ANON_KEY

Note: Supabase is renaming keys. If there is no `anon` key, use the
**Publishable key** (`sb_publishable_...`) instead - it works the same here.
Never put the `service_role` / `secret` (`sb_secret_...`) key in this file.

Create a file named `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

## 3. Create the table + realtime
Open the Supabase SQL editor and run:

```sql
create table if not exists public.retros (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table public.retros enable row level security;

-- Anonymous, link-based access (anyone with the board link can read/write).
create policy "retros read"   on public.retros for select using (true);
create policy "retros insert" on public.retros for insert with check (true);
create policy "retros update" on public.retros for update using (true) with check (true);

-- Broadcast row changes to connected clients.
alter publication supabase_realtime add table public.retros;
```

## 4. Run it
```
npm install
npm run dev
```

If the env vars are present the app automatically switches to shared real-time
mode; otherwise it stays local. Note: free projects pause after ~1 week of
inactivity - just reopen the Supabase dashboard to wake it.

> Access is link-based and anonymous (no login), matching RetroTool's model.
> Anyone who has a board's URL can read and edit that board.
