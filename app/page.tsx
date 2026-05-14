"use client";

import { useState } from "react";
import RetroCapture from "@/components/RetroCapture";
import ActionDashboard from "@/components/ActionDashboard";
import RetroGate from "@/components/RetroGate";
import ReminderPreview from "@/components/ReminderPreview";
import TeamMemory from "@/components/TeamMemory";

type Tab = "retro" | "dashboard" | "reminders" | "memory";

const TABS: { id: Tab; label: string }[] = [
  { id: "retro", label: "Yeni Retro" },
  { id: "dashboard", label: "Dashboard" },
  { id: "reminders", label: "Hatirlatmalar" },
  { id: "memory", label: "Takim Hafizasi" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("retro");
  const [refreshKey, setRefreshKey] = useState(0);
  const [gateCleared, setGateCleared] = useState(false);

  const handleActionsSaved = () => {
    setRefreshKey((k) => k + 1);
    setGateCleared(false);
    setActiveTab("dashboard");
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-20">
        <h1 className="font-display text-heading text-midnight">
          Retro & Action Tracker
        </h1>
        <p className="mt-3 text-body text-dark-shale">
          AI destekli retro aksiyonlarini cikar, takip et, unutma
        </p>
      </header>

      <nav className="flex gap-1 mb-10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-buttons text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-midnight text-canvas-white"
                : "text-silver-ash hover:text-midnight"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section>
        {activeTab === "retro" && !gateCleared ? (
          <RetroGate onPass={() => setGateCleared(true)} />
        ) : activeTab === "retro" && gateCleared ? (
          <RetroCapture onSaved={handleActionsSaved} />
        ) : activeTab === "dashboard" ? (
          <ActionDashboard key={refreshKey} />
        ) : activeTab === "reminders" ? (
          <ReminderPreview />
        ) : (
          <TeamMemory />
        )}
      </section>
    </main>
  );
}
