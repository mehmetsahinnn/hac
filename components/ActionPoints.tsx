"use client";

import { useState } from "react";
import type { ActionItem } from "@/lib/retro";

interface Props {
  actions: ActionItem[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function ActionPoints({ actions, onAdd, onToggle, onDelete, onClose }: Props) {
  const [draft, setDraft] = useState("");
  const submit = () => {
    const t = draft.trim();
    if (!t) return;
    onAdd(t);
    setDraft("");
  };

  return (
    <aside className="fixed top-7 right-0 h-[calc(100%-1.75rem)] w-full sm:w-96 bg-browser-white border-l border-ash-border shadow-window z-40 flex flex-col">
      <header className="flex items-center justify-between px-5 py-4 border-b border-ash-border">
        <h3 className="text-subheading font-semibold text-bark">Action points</h3>
        <button onClick={onClose} className="text-moss hover:text-bark text-sm">Close</button>
      </header>

      <div className="px-5 py-4 flex gap-2 border-b border-ash-border">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Add an action point"
          className="input-field flex-1"
        />
        <button onClick={submit} className="btn-primary shrink-0">Add</button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {actions.length === 0 ? (
          <p className="text-caption text-moss text-center py-8">
            Capture concrete next steps from this retro here.
          </p>
        ) : (
          actions.map((a) => (
            <div key={a.id} className="group flex items-start gap-3 bg-cream-paper border border-ash-border rounded-cards px-3 py-2">
              <input
                type="checkbox"
                checked={a.done}
                onChange={() => onToggle(a.id)}
                className="mt-1 accent-fern"
              />
              <span className={`flex-1 text-sm ${a.done ? "line-through text-moss" : "text-bark"}`}>
                {a.text}
              </span>
              <button
                onClick={() => onDelete(a.id)}
                className="text-xs text-moss hover:text-ember opacity-0 group-hover:opacity-100"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
