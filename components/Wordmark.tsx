"use client";

// "RetroTool" wordmark - clean blocky logo, no rainbow.
interface Props {
  size?: "sm" | "lg";
  className?: string;
}

export default function Wordmark({ size = "sm", className = "" }: Props) {
  const cls = size === "lg" ? "text-3xl sm:text-4xl" : "text-lg sm:text-xl";
  return (
    <span
      className={`font-mono font-extrabold tracking-tight leading-none ${cls} ${className}`}
      style={{ filter: "drop-shadow(1.5px 1.5px 0 rgba(35,37,29,0.18))" }}
      aria-label="RetroTool"
    >
      <span className="text-bark">Retro</span>
      <span className="text-amber">Tool</span>
    </span>
  );
}
