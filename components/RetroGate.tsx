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
        const open = data.actions.filter((a: Action) => a.status !== "closed");
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
      <div className="flex items-center justify-center py-20">
        <span className="inline-block w-5 h-5 border-2 border-midnight/20 border-t-midnight rounded-full animate-spin" />
      </div>
    );
  }

  if (openActions.length === 0) {
    onPass();
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-warm-ivory rounded-cards p-6">
        <h3 className="font-display text-subheading text-midnight">
          Onceki Aksiyonlar Bekliyor
        </h3>
        <p className="text-caption text-dark-shale mt-2">
          Yeni retro baslatmadan once bu aksiyonlari gozden gecirin.
        </p>
      </div>

      <ul className="space-y-3">
        {openActions.map((action) => (
          <li
            key={action.id}
            className="flex items-center justify-between bg-slate-mist rounded-cards p-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-midnight truncate">
                {action.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {action.inferred_owner && (
                  <span className="text-caption text-silver-ash">
                    {action.inferred_owner}
                  </span>
                )}
                <span className="badge bg-sunset-orange/10 text-sunset-orange">
                  {action.status}
                </span>
              </div>
            </div>
            <select
              value={action.status}
              onChange={(e) => handleStatusUpdate(action.id, e.target.value as Action["status"])}
              className="input-field text-caption ml-4"
            >
              <option value="open">Acik</option>
              <option value="in-progress">Devam</option>
              <option value="closed">Kapali</option>
            </select>
          </li>
        ))}
      </ul>

      <button
        onClick={onPass}
        className="btn-secondary w-full py-3 border border-light-pearl rounded-buttons hover:bg-cloud-whisper"
      >
        Gozden Gecirmeyi Atla
      </button>
    </div>
  );
}
