"use client";

import { useEffect, useState } from "react";

export default function DesktopBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 h-7 z-50 bg-bark/90 backdrop-blur text-cream-paper text-[11px] flex items-center justify-between px-3 select-none shadow-soft">
      <div className="flex items-center gap-3">
        <span className="font-semibold tracking-tight">RetroTool</span>
        <span className="hidden sm:inline opacity-60">File</span>
        <span className="hidden sm:inline opacity-60">Board</span>
        <span className="hidden sm:inline opacity-60">Help</span>
      </div>
      <span className="font-mono tabular-nums opacity-90">{time || "--:--"}</span>
    </div>
  );
}
