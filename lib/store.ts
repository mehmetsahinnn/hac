// Unified data layer. Uses Supabase (shared real-time) when configured,
// otherwise localStorage (per-browser, with cross-tab sync).

import {
  Retro,
  TemplateId,
  uid,
  getRetro as localGet,
  saveRetro as localSave,
} from "./retro";
import { isSupabaseEnabled, supabase } from "./supabase";

export const backendMode: "supabase" | "local" = isSupabaseEnabled ? "supabase" : "local";

export async function createRetroRemote(templateId: TemplateId): Promise<Retro> {
  const retro: Retro = {
    id: uid("r-"),
    title: "Untitled retrospective",
    templateId,
    cards: [],
    actions: [],
    createdAt: Date.now(),
  };
  // Always keep a local copy (cache + recent-boards list).
  localSave(retro);
  if (supabase) {
    await supabase.from("retros").upsert({ id: retro.id, data: retro });
  }
  return retro;
}

export async function loadRetro(id: string): Promise<Retro | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("retros")
      .select("data")
      .eq("id", id)
      .maybeSingle();
    if (!error && data?.data) {
      const r = data.data as Retro;
      localSave(r); // mirror to local cache
      return r;
    }
    // Not found remotely - fall back to any local copy.
    return localGet(id);
  }
  return localGet(id);
}

export async function persistRetro(retro: Retro): Promise<void> {
  localSave(retro);
  if (supabase) {
    await supabase
      .from("retros")
      .upsert({ id: retro.id, data: retro, updated_at: new Date().toISOString() });
  }
}

export function subscribeRetro(id: string, cb: (r: Retro) => void): () => void {
  if (supabase) {
    const sb = supabase;
    const channel = sb
      .channel("retro-" + id)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "retros", filter: `id=eq.${id}` },
        (payload: { new?: { data?: Retro } }) => {
          const d = payload.new?.data;
          if (d) cb(d);
        }
      )
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }

  // Local mode: live updates across tabs of the same browser.
  const onStorage = (e: StorageEvent) => {
    if (e.key === "retrotool.retros") {
      const fresh = localGet(id);
      if (fresh) cb(fresh);
    }
  };
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
  return () => {
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}
