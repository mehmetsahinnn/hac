"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onComplete?: () => void;
  onReset?: () => void;
}

const PRESETS = [3, 5, 10, 15];

export default function Timer({ onComplete, onReset }: Props) {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const [editing, setEditing] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  useEffect(() => {
    if (running && seconds === 0) {
      setRunning(false);
      onComplete?.();
    }
  }, [seconds, running, onComplete]);

  const applyMinutes = (m: number) => {
    const clamped = Math.max(1, Math.min(90, m));
    setMinutes(clamped);
    setSeconds(clamped * 60);
    setRunning(false);
  };

  const reset = () => {
    setSeconds(minutes * 60);
    setRunning(false);
    onReset?.();
  };

  const mm = Math.floor(seconds / 60).toString();
  const ss = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5">
      {!running && (
        <button
          onClick={() => applyMinutes(minutes - 1)}
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
          onClick={() => applyMinutes(minutes + 1)}
          className="w-6 h-6 rounded-full border border-ash-border text-dark-olive hover:bg-fog-khaki text-sm leading-none"
          title="More time"
        >
          +
        </button>
      )}

      <button
        onClick={() => setRunning((r) => !r)}
        className="w-7 h-7 rounded-full bg-amber hover:bg-amber-deep flex items-center justify-center text-bark text-xs font-bold transition-colors"
        title={running ? "Pause" : "Start"}
      >
        {running ? "II" : ">"}
      </button>

      <button onClick={reset} className="text-moss hover:text-bark text-sm" title="Reset">
        Reset
      </button>

      {editing && !running && (
        <div className="flex items-center gap-1 ml-1">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => {
                applyMinutes(p);
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
