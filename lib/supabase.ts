import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// When both env vars are present, the app runs in shared real-time mode.
// Otherwise it falls back to local (per-browser) storage.
export const isSupabaseEnabled = Boolean(url && key);

export const supabase: SupabaseClient | null = isSupabaseEnabled
  ? createClient(url as string, key as string, {
      realtime: { params: { eventsPerSecond: 5 } },
    })
  : null;
