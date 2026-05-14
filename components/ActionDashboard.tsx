"use client";

import { useEffect, useState } from "react";
import ActionList from "./ActionList";
import { Action } from "@/lib/storage";

type FilterStatus = "all" | "high-risk" | Action["status"];

export default function ActionDashboard() {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const fetchActions = async () => {
    try {
      const res = await fetch("/api/actions");
      if (!res.ok) throw new Error("Failed to fetch actions");
      const data = await res.json();
      setActions(data.actions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleStatusChange = async (id: string, status: Action["status"]) => {
    try {
      const res = await fetch(`/api/actions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const data = await res.json();
      setActions((prev) => prev.map((a) => (a.id === id ? data.action : a)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const filteredActions = (() => {
    switch (filter) {
      case "high-risk":
        return actions.filter((a) => a.risk_score >= 60);
      case "all":
        return actions;
      default:
        return actions.filter((a) => a.status === filter);
    }
  })();

  const counts = {
    all: actions.length,
    "high-risk": actions.filter((a) => a.risk_score >= 60).length,
    open: actions.filter((a) => a.status === "open").length,
    "in-progress": actions.filter((a) => a.status === "in-progress").length,
    closed: actions.filter((a) => a.status === "closed").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="inline-block w-6 h-6 border-2 border-midnight/20 border-t-midnight rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-cloud-whisper border border-sunset-orange/20 text-sunset-orange px-5 py-4 rounded-cards text-sm">
        {error}
      </div>
    );
  }

  const FILTERS: { id: FilterStatus; label: string }[] = [
    { id: "all", label: "Tumu" },
    { id: "high-risk", label: "Riskli" },
    { id: "open", label: "Acik" },
    { id: "in-progress", label: "Devam" },
    { id: "closed", label: "Kapali" },
  ];

  return (
    <div className="space-y-8">
      {/* Metric cards */}
      <div className="grid grid-cols-5 gap-4">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-cards p-4 text-center transition-all ${
              filter === f.id
                ? f.id === "high-risk"
                  ? "bg-sunset-orange text-canvas-white"
                  : "bg-midnight text-canvas-white"
                : "bg-slate-mist text-midnight hover:bg-light-pearl"
            }`}
          >
            <span className="block text-heading-sm font-display">
              {counts[f.id]}
            </span>
            <span className="text-caption opacity-80">{f.label}</span>
          </button>
        ))}
      </div>

      <ActionList actions={filteredActions} onStatusChange={handleStatusChange} />
    </div>
  );
}
