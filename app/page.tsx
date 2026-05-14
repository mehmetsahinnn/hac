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
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Retro & Action Tracker
        </h1>
        <p className="mt-1 text-gray-500">
          AI destekli retro aksiyonlarini cikar, takip et, unutma
        </p>
      </header>

      <nav className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

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
    </main>
  );
}
