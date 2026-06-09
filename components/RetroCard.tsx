"use client";

import { useState } from "react";
import type { Card } from "@/lib/retro";

interface Props {
  card: Card;
  accentHex: string;
  revealed: boolean;
  isOwn: boolean;
  draft?: boolean;
  canVote?: boolean;
  myVotes?: number;
  onVote?: (id: string) => void;
  onUnvote?: (id: string) => void;
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
  canVote = false,
  myVotes = 0,
  onVote,
  onUnvote,
  onPublish,
  onEdit,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(card.text);

  // Own cards (and drafts) are never blurred. Only other people's published
  // cards are hidden until the facilitator reveals.
  const hidden = !draft && !revealed && !isOwn;

  const save = () => {
    const t = text.trim();
    if (t) onEdit(card.id, t);
    else setText(card.text);
    setEditing(false);
  };

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
        {/* left side: vote control (published only) or draft label */}
        {draft ? (
          <span className="text-[10px] uppercase tracking-wide text-fern font-semibold">Private</span>
        ) : (
          <div className="inline-flex items-center rounded-full bg-linen">
            {revealed && myVotes > 0 && (
              <button
                onClick={() => onUnvote?.(card.id)}
                className="px-2 py-1 text-xs font-medium text-dark-olive hover:text-ember"
                title="Remove one of your votes"
              >
                -
              </button>
            )}
            <button
              onClick={() => onVote?.(card.id)}
              disabled={!revealed || !canVote}
              className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 transition-colors ${
                !revealed || !canVote
                  ? "text-moss cursor-not-allowed"
                  : "text-dark-olive hover:bg-fog-khaki"
              }`}
              title={
                !revealed
                  ? "Voting opens when cards are revealed"
                  : !canVote
                  ? "You have used all your votes"
                  : "Upvote"
              }
            >
              <span style={{ color: revealed && canVote ? accentHex : undefined }}>+1</span>
              <span>{card.votes}</span>
            </button>
            {revealed && myVotes > 0 && (
              <span className="px-2 py-1 text-[10px] font-semibold rounded-full" style={{ color: accentHex }}>
                x{myVotes}
              </span>
            )}
          </div>
        )}

        {/* right side: owner controls / status */}
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
