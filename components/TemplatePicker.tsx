"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATES, type Accent } from "@/lib/retro";
import { createRetroRemote } from "@/lib/store";

const ACCENT_HEX: Record<Accent, string> = {
  fern: "#6aa84f",
  ember: "#f54e00",
  cobalt: "#2f80fa",
  amber: "#f1a82c",
  saffron: "#b17816",
};

export default function TemplatePicker() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const choose = async (templateId: (typeof TEMPLATES)[number]["id"]) => {
    if (busy) return;
    setBusy(true);
    try {
      const retro = await createRetroRemote(templateId);
      router.push(`/retro/${retro.id}`);
    } catch {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {TEMPLATES.map((tpl) => (
        <button
          key={tpl.id}
          onClick={() => choose(tpl.id)}
          disabled={busy}
          className="text-left bg-cream-paper border border-ash-border rounded-large p-5 hover:shadow-soft hover:border-amber transition-all disabled:opacity-60"
        >
          <div className="flex gap-1.5 mb-4">
            {tpl.columns.map((c) => (
              <span key={c.id} className="h-2 flex-1 rounded-full" style={{ background: ACCENT_HEX[c.accent] }} />
            ))}
          </div>
          <h3 className="text-subheading font-semibold text-bark">{tpl.name}</h3>
          <p className="text-caption text-olive mt-1">{tpl.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tpl.columns.map((c) => (
              <span key={c.id} className="badge bg-linen text-dark-olive">
                {c.title}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}
