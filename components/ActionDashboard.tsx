"use client";

import { useEffect, useState } from "react";
import ActionList from "./ActionList";
import { Action } from "@/lib/storage";

type FilterStatus = "all" | Action["status"];

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
      setActions((prev) =>
        prev.map((a) => (a.id === id ? data.action : a))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const filteredActions =
    filter === "all" ? actions : actions.filter((a) => a.status === filter);

  const counts = {
    all: actions.length,
    open: actions.filter((a) => a.status === "open").length,
    "in-progress": actions.filter((a) => a.status === "in-progress").length,
    closed: actions.filter((a) => a.status === "closed").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg
          className="animate-spin h-6 w-6 text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {(["all", "open", "in-progress", "closed"] as FilterStatus[]).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="block text-lg font-bold">{counts[status]}</span>
              <span className="capitalize">{status === "in-progress" ? "In Progress" : status}</span>
            </button>
          )
        )}
      </div>

      <ActionList actions={filteredActions} onStatusChange={handleStatusChange} />
    </div>
  );
}
