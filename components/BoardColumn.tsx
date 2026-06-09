"use client";

import { useState } from "react";
import { type Card, type ColumnDef, isPublished } from "@/lib/retro";
import RetroCard from "./RetroCard";

const ACCENT_HEX: Record<string, string> = {
  fern: "#6aa84f",
  ember: "#f54e00",
  cobalt: "#2f80fa",
  amber: "#f1a82c",
  saffron: "#b17816",
};

interface Props {
  column: ColumnDef;
  cards: Card[];
  userId: string;
  revealed: boolean;
  remaining: number;
  myVotes: Record<string, number>;
  onAddDraft: (columnId: string, text: string) => void;
  onPublish: (id: string) => void;
  onPublishAll: (columnId: string) => void;
  onVote: (id: string, delta: 1 | -1) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export default function BoardColumn({
  column,
  cards,
  userId,
  revealed,
  remaining,
  myVotes,
  onAddDraft,
  onPublish,
  onPublishAll,
  onVote,
  onEdit,
  onDelete,
}: Props) {
  const [draft, setDraft] = useState("");
  const hex = ACCENT_HEX[column.accent];

  const published = cards
    .filter((c) => isPublished(c))
    .sort((a, b) => b.votes - a.votes || b.createdAt - a.createdAt);
  const myDrafts = cards
    .filter((c) => !isPublished(c) && c.authorId === userId)
    .sort((a, b) => a.createdAt - b.createdAt);

  const submit = () => {
    const t = draft.trim();
    if (!t) return;
    onAddDraft(column.id, t);
    setDraft("");
  };

  return (
    <section className="flex flex-col bg-linen/60 rounded-large border border-ash-border min-h-[60vh]">
      <header className="px-4 pt-4 pb-3 border-b border-ash-border" style={{ borderTop: `3px solid ${hex}` }}>
        <h2 className="text-subheading font-semibold text-bark">{column.title}</h2>
        <p className="text-caption text-olive mt-1">{column.prompt}</p>
      </header>

      {/* Published cards (shared board) */}
      <div className="flex-1 px-3 py-3 space-y-3 overflow-y-auto">
        {published.length === 0 ? (
          <p className="text-center text-caption text-moss py-8">No cards yet.</p>
        ) : (
          published.map((card) => (
            <RetroCard
              key={card.id}
              card={card}
              accentHex={hex}
              revealed={revealed}
              isOwn={card.authorId === userId}
              remaining={remaining}
              myVotes={myVotes[card.id] || 0}
              onVote={onVote}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* Private Section - draft here, then publish to the board */}
      <div className="border-t-2 border-fern/50 bg-cream-paper/60 rounded-b-large px-3 pt-3 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-caption font-semibold text-fern uppercase tracking-wide">
            Private section
          </span>
          {myDrafts.length > 0 && (
            <button
              onClick={() => onPublishAll(column.id)}
              className="text-xs font-semibold text-amber-shadow hover:text-bark"
            >
              Publish all
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Type here... (only you can see drafts)"
            className="input-field flex-1"
            enterKeyHint="done"
          />
          <button onClick={submit} className="btn-primary shrink-0">
            Add
          </button>
        </div>

        {myDrafts.length > 0 && (
          <div className="mt-3 space-y-2">
            {myDrafts.map((card) => (
              <RetroCard
                key={card.id}
                card={card}
                accentHex={hex}
                revealed
                isOwn
                draft
                onPublish={onPublish}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
