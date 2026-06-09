"use client";

import { useState } from "react";
import type { Card } from "@/lib/retro";

interface Props {
  card: Card;
  accentHex: string;
  revealed: boolean;
  isOwn: boolean;
  draft?: boolean;
  remaining?: number;
  myVotes?: number;
  onVote?: (id: string, delta: 1 | -1) => void;
  onPublish?: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export default function RetroCard({
  card,
  accentHex,
  revealed,
  isOwn,
  draft = false,
  remaining = 0,
  myVotes = 0,
  onVote,
  onPublish,
  onEdit,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(card.text);

  const hidden = !draft && !revealed && !isOwn;

  const save = () => {
    const t = text.trim();
    if (t) onEdit(card.id, t);
    else setText(card.text);
    setEditing(false);
  };

  // +1 allowed if you have budget, or it reduces an existing downvote.
  // -1 allowed if you have budget, or it reduces an existing upvote.
  const plusEnabled = revealed && !isOwn && (remaining > 0 || myVotes < 0);
  const minusEnabled = revealed && !isOwn && (remaining > 0 || myVotes > 0);
  const countColor = card.votes > 0 ? accentHex : card.votes < 0 ? "#f54e00" : "#65675e";

  return (
    <div
      className={`group bg-cream-paper rounded-cards border shadow-soft p-3 pl-4 ${
        draft ? "border-dashed border-fern/60" : "border-ash-border"
      }`}
      style={{ borderLeft: `4px solid ${accentHex}` }}
    >
      {isOwn && editing ? (
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              save();
            }
            if (e.key === "Escape") {
              setText(card.text);
              setEditing(false);
            }
          }}
          className="w-full resize-none bg-transparent text-sm text-bark outline-none"
          rows={3}
        />
      ) : (
        <p
          className={`text-sm text-bark whitespace-pre-wrap transition-all duration-500 ${
            hidden ? "blur-[5px] select-none pointer-events-none" : ""
          } ${isOwn && !draft ? "cursor-text" : ""}`}
          onDoubleClick={() => isOwn && setEditing(true)}
          aria-hidden={hidden}
        >
          {card.text}
        </p>
      )}

      <div className="mt-2 flex items-center justify-between gap-2">
        {/* vote control: -1 [score] +1 (published cards only) */}
        {draft ? (
          <span className="text-[10px] uppercase tracking-wide text-fern font-semibold">Private</span>
        ) : (
          <div className="inline-flex items-center rounded-full bg-linen">
            <button
              onClick={() => onVote?.(card.id, -1)}
              disabled={!minusEnabled}
              title={isOwn ? "You can\u2019t vote your own card" : revealed ? "Downvote" : "Voting opens after reveal"}
              className={`text-xs font-semibold rounded-l-full px-2 py-1 transition-colors ${
                minusEnabled ? "text-dark-olive hover:bg-fog-khaki hover:text-ember" : "text-moss cursor-not-allowed"
              }`}
            >
              -1
            </button>
            <span className="px-2 text-xs font-bold tabular-nums" style={{ color: countColor }}>
              {card.votes}
            </span>
            <button
              onClick={() => onVote?.(card.id, 1)}
              disabled={!plusEnabled}
              title={isOwn ? "You can\u2019t vote your own card" : revealed ? "Upvote" : "Voting opens after reveal"}
              className={`text-xs font-semibold rounded-r-full px-2 py-1 transition-colors ${
                plusEnabled ? "text-dark-olive hover:bg-fog-khaki" : "text-moss cursor-not-allowed"
              }`}
            >
              +1
            </button>
            {revealed && myVotes !== 0 && (
              <span className="px-2 text-[10px] font-semibold" style={{ color: countColor }}>
                you {myVotes > 0 ? `+${myVotes}` : myVotes}
              </span>
            )}
          </div>
        )}

        {/* owner controls / status */}
        <div className="flex items-center gap-2">
          {isOwn && (
            <span className="text-[10px] uppercase tracking-wide text-amber-shadow">You</span>
          )}
          {draft && (
            <button
              onClick={() => onPublish?.(card.id)}
              className="text-xs font-semibold bg-amber text-bark rounded-buttons px-2 py-1 hover:bg-amber-deep"
              title="Publish to the board"
            >
              Publish
            </button>
          )}
          {isOwn ? (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditing(true)} className="text-xs text-moss hover:text-bark">
                Edit
              </button>
              <button onClick={() => onDelete(card.id)} className="text-xs text-moss hover:text-ember">
                Delete
              </button>
            </div>
          ) : (
            !revealed && <span className="text-[10px] uppercase tracking-wide text-moss">Hidden</span>
          )}
        </div>
      </div>
    </div>
  );
}
