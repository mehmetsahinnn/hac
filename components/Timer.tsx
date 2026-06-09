"use client";

import { useEffect, useState } from "react";

interface Props {
  endsAt: number | null;
  durationSec: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onChangeDuration: (sec: number) => void;
}

const PRESETS = [3, 5, 10, 15];

export default function Timer({
  endsAt,
  durationSec,
  onStart,
  onPause,
  onReset,
  onChangeDuration,
}: Props) {
  const [, force] = useState(0);
  const [editing, setEditing] = useState(false);

  // Re-render every second while the shared timer is running.
  useEffect(() => {
    if (!endsAt) return;
    const id = setInterval(() => force((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const running = !!endsAt;
  const remaining = running
    ? Math.max(0, Math.round((endsAt - Date.now()) / 1000))
    : durationSec;

  const mm = Math.floor(remaining / 60).toString();
  const ss = (remaining % 60).toString().padStart(2, "0");
  const minutes = Math.max(1, Math.round(durationSec / 60));

  return (
    <div className="flex items-center gap-1.5">
      {!running && (
        <button
          onClick={() => onChangeDuration(Math.max(60, (minutes - 1) * 60))}
          className="w-6 h-6 rounded-full border border-ash-border text-dark-olive hover:bg-fog-khaki text-sm leading-none"
          title="Less time"
        >
          -
        </button>
      )}

      <button
        onClick={() => setEditing((e) => !e)}
        className="font-mono text-sm tabular-nums text-bark min-w-[46px] text-center hover:text-amber-shadow"
        title="Set timer length"
      >
        {mm}:{ss}
      </button>

      {!running && (
        <button
          onClick={() => onChangeDuration(Math.min(90 * 60, (minutes + 1) * 60))}
          className="w-6 h-6 rounded-full border border-ash-border text-dark-olive hover:bg-fog-khaki text-sm leading-none"
          title="More time"
        >
          +
        </button>
      )}

      <button
        onClick={() => (running ? onPause() : onStart())}
        className="w-7 h-7 rounded-full bg-amber hover:bg-amber-deep flex items-center justify-center text-bark text-xs font-bold transition-colors"
        title={running ? "Pause" : "Start"}
      >
        {running ? "II" : ">"}
      </button>

      <button onClick={onReset} className="text-moss hover:text-bark text-sm" title="Reset">
        Reset
      </button>

      {editing && !running && (
        <div className="flex items-center gap-1 ml-1">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => {
                onChangeDuration(p * 60);
                setEditing(false);
              }}
              className={`text-xs rounded-full px-2 py-0.5 border ${
                minutes === p
                  ? "bg-amber border-amber text-bark"
                  : "border-ash-border text-dark-olive hover:bg-fog-khaki"
              }`}
            >
              {p}m
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
