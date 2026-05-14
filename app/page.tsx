"use client";

import { useState } from "react";
import RetroCapture from "@/components/RetroCapture";
import ActionDashboard from "@/components/ActionDashboard";

type Tab = "retro" | "dashboard";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("retro");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActionsSaved = () => {
    setRefreshKey((k) => k + 1);
    setActiveTab("dashboard");
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Retro & Action Tracker
        </h1>
        <p className="mt-1 text-gray-500">
          Extract action items from retrospectives with AI
        </p>
      </header>

      <nav className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("retro")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "retro"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          New Retro
        </button>
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "dashboard"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Dashboard
        </button>
      </nav>

      {activeTab === "retro" ? (
        <RetroCapture onSaved={handleActionsSaved} />
      ) : (
        <ActionDashboard key={refreshKey} />
      )}
    </main>
  );
}
