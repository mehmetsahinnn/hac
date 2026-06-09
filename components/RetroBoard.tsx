"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Retro,
  getTemplate,
  getUserId,
  toMarkdown,
  uid,
  VOTE_LIMIT,
  getMyVotes,
  saveMyVotes,
  votesUsed,
} from "@/lib/retro";
import { loadRetro, persistRetro, subscribeRetro } from "@/lib/store";
import BoardColumn from "./BoardColumn";
import ActionPoints from "./ActionPoints";
import Timer from "./Timer";
import Wordmark from "./Wordmark";

export default function RetroBoard({ retroId }: { retroId: string }) {
  const [retro, setRetro] = useState<Retro | null>(null);
  const [userId, setUserId] = useState("anon");
  const [loaded, setLoaded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [myVotes, setMyVotes] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);

  const lastSync = useRef<string>("");

  // Load the board and subscribe to live changes (Supabase or cross-tab).
  useEffect(() => {
    setUserId(getUserId());
    setMyVotes(getMyVotes(retroId));
    let active = true;
    loadRetro(retroId).then((r) => {
      if (!active) return;
      if (r) {
        lastSync.current = JSON.stringify(r);
        setRetro(r);
      }
      setLoaded(true);
    });
    const unsub = subscribeRetro(retroId, (r) => {
      lastSync.current = JSON.stringify(r);
      setRetro(r);
    });
    return () => {
      active = false;
      unsub();
    };
  }, [retroId]);

  // Persist changes, skipping echoes that came from a remote/cross-tab sync.
  useEffect(() => {
    if (!retro) return;
    const json = JSON.stringify(retro);
    if (json === lastSync.current) return;
    lastSync.current = json;
    const t = setTimeout(() => {
      persistRetro(retro);
    }, 300);
    return () => clearTimeout(t);
  }, [retro]);

  useEffect(() => {
    if (loaded) saveMyVotes(retroId, myVotes);
  }, [myVotes, retroId, loaded]);

  // When the shared timer reaches zero, reveal for everyone.
  useEffect(() => {
    const endsAt = retro?.timerEndsAt;
    if (!endsAt) return;
    const id = setInterval(() => {
      if (Date.now() >= endsAt) {
        update((r) => ({ ...r, revealed: true, timerEndsAt: null }));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [retro?.timerEndsAt]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const update = (fn: (r: Retro) => Retro) =>
    setRetro((prev) => (prev ? fn(prev) : prev));

  // Reveal + timer live on the board so every participant stays in sync.
  const revealed = !!retro?.revealed;
  const setRevealed = (v: boolean) => update((r) => ({ ...r, revealed: v }));

  const startTimer = () =>
    update((r) => ({ ...r, timerEndsAt: Date.now() + (r.timerDurationSec ?? 300) * 1000 }));
  const pauseTimer = () =>
    update((r) => {
      const remainingSec = r.timerEndsAt
        ? Math.max(0, Math.round((r.timerEndsAt - Date.now()) / 1000))
        : r.timerDurationSec ?? 300;
      return { ...r, timerEndsAt: null, timerDurationSec: remainingSec };
    });
  const resetTimer = () =>
    update((r) => ({ ...r, timerEndsAt: null, timerDurationSec: 300, revealed: false }));
  const changeDuration = (sec: number) =>
    update((r) => ({ ...r, timerEndsAt: null, timerDurationSec: sec }));

  const used = votesUsed(myVotes);
  const remaining = Math.max(0, VOTE_LIMIT - used);

  const addDraft = (columnId: string, text: string) =>
    update((r) => ({
      ...r,
      cards: [
        ...r.cards,
        { id: uid("c-"), columnId, text, votes: 0, createdAt: Date.now(), authorId: userId, published: false },
      ],
    }));

  const publishCard = (id: string) =>
    update((r) => ({
      ...r,
      cards: r.cards.map((c) =>
        c.id === id && c.authorId === userId ? { ...c, published: true } : c
      ),
    }));

  const publishAll = (columnId: string) =>
    update((r) => ({
      ...r,
      cards: r.cards.map((c) =>
        c.columnId === columnId && c.authorId === userId && c.published === false
          ? { ...c, published: true }
          : c
      ),
    }));

  // One signed vote action: delta is +1 (upvote) or -1 (downvote).
  // Each vote in either direction uses one of your VOTE_LIMIT votes; pressing
  // the opposite direction frees it back up.
  const castVote = (id: string, delta: 1 | -1) => {
    if (!revealed) return flash("Cards must be revealed before voting");
    const target = retro?.cards.find((c) => c.id === id);
    if (target && target.authorId === userId)
      return flash("You can't vote on your own card");
    const cur = myVotes[id] || 0;
    const next = cur + delta;
    const usedByOthers = votesUsed(myVotes) - Math.abs(cur);
    if (usedByOthers + Math.abs(next) > VOTE_LIMIT) {
      return flash(`You have used all ${VOTE_LIMIT} votes`);
    }
    update((r) => ({
      ...r,
      cards: r.cards.map((c) => (c.id === id ? { ...c, votes: c.votes + delta } : c)),
    }));
    setMyVotes((v) => {
      const nv = { ...v };
      if (next === 0) delete nv[id];
      else nv[id] = next;
      return nv;
    });
  };

  // Only the author may edit or delete a card.
  const editCard = (id: string, text: string) =>
    update((r) => ({
      ...r,
      cards: r.cards.map((c) => (c.id === id && c.authorId === userId ? { ...c, text } : c)),
    }));

  const deleteCard = (id: string) => {
    update((r) => ({
      ...r,
      cards: r.cards.filter((c) => !(c.id === id && c.authorId === userId)),
    }));
    setMyVotes((v) => {
      const next = { ...v };
      delete next[id];
      return next;
    });
  };

  const addAction = (text: string) =>
    update((r) => ({ ...r, actions: [...r.actions, { id: uid("a-"), text, done: false }] }));

  const toggleAction = (id: string) =>
    update((r) => ({
      ...r,
      actions: r.actions.map((a) => (a.id === id ? { ...a, done: !a.done } : a)),
    }));

  const deleteAction = (id: string) =>
    update((r) => ({ ...r, actions: r.actions.filter((a) => a.id !== id) }));

  const onExport = () => {
    if (!retro) return;
    const md = toMarkdown(retro);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${retro.title.replace(/\s+/g, "-").toLowerCase() || "retro"}.md`;
    a.click();
    URL.revokeObjectURL(url);
    flash("Exported as Markdown");
  };

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flash("Board link copied");
    } catch {
      flash("Copy failed - copy the URL manually");
    }
  };

  const onFinishStop = () => {
    update((r) => ({ ...r, finishedAt: Date.now() }));
    flash("Retro stopped - cards stay as they are");
  };

  if (!loaded) {
    return <div className="flex items-center justify-center py-32 text-moss">Loading...</div>;
  }

  if (!retro) {
    return (
      <div className="max-w-md mx-auto text-center py-32">
        <h1 className="text-heading-sm font-semibold text-bark">Retro not found</h1>
        <p className="text-body text-dark-olive mt-2">This board does not exist in this browser.</p>
        <Link href="/new" className="btn-primary inline-block mt-6">
          Create a new retrospective
        </Link>
      </div>
    );
  }

  const tpl = getTemplate(retro.templateId);
  const openActions = retro.actions.filter((a) => !a.done).length;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-7 z-20 bg-browser-white/95 backdrop-blur border-b border-ash-border">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 sm:px-6 py-3">
          <Link href="/" aria-label="Back to home" className="shrink-0">
            <Wordmark size="sm" />
          </Link>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-2 rounded-buttons text-sm font-medium text-dark-olive hover:bg-fog-khaki shrink-0"
            title="Back to home"
          >
            <span aria-hidden>&#8249;</span> Home
          </Link>

          <div className="flex-1 min-w-0">
            <input
              value={retro.title}
              onChange={(e) => update((r) => ({ ...r, title: e.target.value }))}
              className="w-full max-w-md bg-transparent text-bark font-medium outline-none truncate focus:bg-linen rounded px-2 py-1"
            />
            <p className="px-2 text-caption text-moss flex items-center gap-2">
              {tpl.name}
              {retro.finishedAt && (
                <span className="badge bg-fern/15 text-fern">Finished</span>
              )}
            </p>
          </div>

          <div className="hidden lg:block">
            <Timer
              endsAt={retro.timerEndsAt ?? null}
              durationSec={retro.timerDurationSec ?? 300}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              onChangeDuration={changeDuration}
            />
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            {revealed && (
              <span className="hidden sm:inline-flex items-center text-caption font-medium text-dark-olive bg-linen rounded-full px-3 py-1.5">
                {remaining}/{VOTE_LIMIT} votes
              </span>
            )}
            <button
              onClick={() => setRevealed(!revealed)}
              className={`px-3 py-2 rounded-buttons text-sm font-medium transition-colors ${
                revealed ? "text-dark-olive hover:bg-fog-khaki" : "bg-amber text-bark hover:bg-amber-deep"
              }`}
              title={revealed ? "Hide cards again" : "Reveal all cards now"}
            >
              {revealed ? "Hide" : "Reveal"}
            </button>
            <button
              onClick={() => setShowActions(true)}
              className="relative px-3 py-2 rounded-buttons text-sm font-medium text-dark-olive hover:bg-fog-khaki"
            >
              Action points
              {openActions > 0 && (
                <span className="absolute -top-1 -right-1 bg-ember text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {openActions}
                </span>
              )}
            </button>
            <button onClick={onExport} className="hidden sm:block px-3 py-2 rounded-buttons text-sm font-medium text-dark-olive hover:bg-fog-khaki">
              Export
            </button>
            <button onClick={onShare} className="hidden sm:block px-3 py-2 rounded-buttons text-sm font-medium text-dark-olive hover:bg-fog-khaki">
              Share
            </button>
            <button
              onClick={onFinishStop}
              className="px-3 py-2 rounded-buttons text-sm font-semibold bg-bark text-cream-paper hover:bg-dark-olive transition-colors"
              title="Stop the retro (cards stay hidden)"
            >
              Finish retro
            </button>
          </nav>
        </div>

        <div className="lg:hidden px-4 pb-3 flex items-center justify-between gap-3">
          <Timer
              endsAt={retro.timerEndsAt ?? null}
              durationSec={retro.timerDurationSec ?? 300}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              onChangeDuration={changeDuration}
            />
          {revealed && (
            <span className="text-caption font-medium text-dark-olive bg-linen rounded-full px-3 py-1">
              {remaining}/{VOTE_LIMIT} votes
            </span>
          )}
        </div>

        {!revealed && (
          <div className="bg-amber/15 border-t border-amber/30 px-4 sm:px-6 py-1.5 text-center">
            <p className="text-caption text-amber-shadow">
              Your own cards are always visible. Other people&apos;s cards stay blurred until the timer ends or you press Reveal.
            </p>
          </div>
        )}
      </header>

      <main className="flex-1 px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {tpl.columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              cards={retro.cards.filter((c) => c.columnId === col.id)}
              userId={userId}
              revealed={revealed}
              remaining={remaining}
              myVotes={myVotes}
              onAddDraft={addDraft}
              onPublish={publishCard}
              onPublishAll={publishAll}
              onVote={castVote}
              onEdit={editCard}
              onDelete={deleteCard}
            />
          ))}
        </div>
      </main>

      {showActions && (
        <>
          <div className="fixed inset-0 bg-bark/20 z-20" onClick={() => setShowActions(false)} />
          <ActionPoints
            actions={retro.actions}
            onAdd={addAction}
            onToggle={toggleAction}
            onDelete={deleteAction}
            onClose={() => setShowActions(false)}
          />
        </>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-bark text-cream-paper text-sm rounded-buttons px-4 py-2 shadow-window z-40">
          {toast}
        </div>
      )}
    </div>
  );
}
