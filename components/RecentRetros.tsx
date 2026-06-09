"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listRetros, deleteRetro, getTemplate, type Retro } from "@/lib/retro";

export default function RecentRetros() {
  const [retros, setRetros] = useState<Retro[]>([]);

  useEffect(() => {
    setRetros(listRetros());
  }, []);

  const remove = (id: string) => {
    deleteRetro(id);
    setRetros(listRetros());
  };

  if (retros.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-subheading font-semibold text-bark mb-3">Your recent boards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {retros.map((r) => (
          <div
            key={r.id}
            className="group flex items-center justify-between bg-cream-paper border border-ash-border rounded-cards px-4 py-3"
          >
            <Link href={`/retro/${r.id}`} className="min-w-0">
              <p className="text-sm font-medium text-bark truncate flex items-center gap-2">
                {r.title}
                {r.finishedAt && (
                  <span className="badge bg-fern/15 text-fern shrink-0">Finished</span>
                )}
              </p>
              <p className="text-caption text-moss">
                {getTemplate(r.templateId).name} - {r.cards.length} cards
              </p>
            </Link>
            <button
              onClick={() => remove(r.id)}
              className="text-xs text-moss hover:text-ember opacity-0 group-hover:opacity-100"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
