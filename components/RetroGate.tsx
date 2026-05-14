"use client";

import { useEffect, useState } from "react";
import { Action } from "@/lib/storage";

interface RetroGateProps {
  onPass: () => void;
}

export default function RetroGate({ onPass }: RetroGateProps) {
  const [openActions, setOpenActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/actions")
      .then((res) => res.json())
      .then((data) => {
        const open = data.actions.filter(
          (a: Action) => a.status !== "closed"
        );
        setOpenActions(open);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id: string, status: Action["status"]) => {
    const res = await fetch(`/api/actions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOpenActions((prev) =>
        status === "closed"
          ? prev.filter((a) => a.id !== id)
          : prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (openActions.length === 0) {
    onPass();
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="text-amber-800 font-semibold text-sm">
          Onceki Retro Aksiyonlari Bekliyor
        </h3>
        <p className="text-amber-700 text-xs mt-1">
          Yeni retro baslatmadan once bu aksiyonlari gozden gecirin.
        </p>
      </div>

      <ul className="space-y-2">
        {openActions.map((action) => (
          <li
            key={action.id}
            className="flex items-center justify-between border border-gray-200 rounded-lg p-3 bg-white"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">
                {action.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {action.inferred_owner && (
                  <span className="text-xs text-gray-500">
                    {action.inferred_owner}
                  </span>
                )}
                <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                  {action.status}
                </span>
              </div>
            </div>
            <select
              value={action.status}
              onChange={(e) =>
                handleStatusUpdate(action.id, e.target.value as Action["status"])
              }
              className="text-xs border border-gray-300 rounded px-2 py-1 ml-3"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </li>
        ))}
      </ul>

      <button
        onClick={onPass}
        className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Gozden Gecirmeyi Atla &rarr;
      </button>
    </div>
  );
}
