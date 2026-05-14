"use client";

import { useEffect, useState } from "react";

interface Insights {
  summary: string;
  trends: string[];
  recurring_patterns: string[];
  lessons_learned: string[];
  recommendations: string[];
}

interface Stats {
  total_actions: number;
  closed: number;
  open: number;
  in_progress: number;
  blockers: number;
  total_retros: number;
  categories: Record<string, number>;
}

export default function TeamMemory() {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/insights")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setInsights(data.insights);
        setStats(data.stats || null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="inline-block w-6 h-6 border-2 border-midnight/20 border-t-midnight rounded-full animate-spin" />
        <p className="text-caption text-silver-ash">Takim hafizasi yukleniyor...</p>
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

  if (!insights) {
    return (
      <div className="text-center py-20">
        <p className="text-silver-ash text-sm">Henuz yeterli veri yok.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Summary */}
      <div className="bg-warm-ivory rounded-cards p-6">
        <p className="text-body text-midnight">{insights.summary}</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-5">
          <MetricCard value={stats.total_actions} label="Toplam Aksiyon" />
          <MetricCard
            value={`${stats.total_actions > 0 ? Math.round((stats.closed / stats.total_actions) * 100) : 0}%`}
            label="Tamamlanma"
            accent
          />
          <MetricCard value={stats.blockers} label="Blocker" />
        </div>
      )}

      {/* Sections */}
      {insights.trends?.length > 0 && (
        <InsightSection title="Trendler" items={insights.trends} />
      )}
      {insights.recurring_patterns?.length > 0 && (
        <InsightSection title="Tekrarlayan Problemler" items={insights.recurring_patterns} />
      )}
      {insights.lessons_learned?.length > 0 && (
        <InsightSection title="Ogrenilen Dersler" items={insights.lessons_learned} />
      )}
      {insights.recommendations?.length > 0 && (
        <InsightSection title="Oneriler" items={insights.recommendations} />
      )}
    </div>
  );
}

function MetricCard({ value, label, accent }: { value: number | string; label: string; accent?: boolean }) {
  return (
    <div className="bg-slate-mist rounded-cards p-5 text-center">
      <span className={`block font-display text-heading-sm ${accent ? "text-sunset-orange" : "text-midnight"}`}>
        {value}
      </span>
      <span className="text-caption text-silver-ash">{label}</span>
    </div>
  );
}

function InsightSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-display text-subheading text-midnight mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-body text-dark-shale pl-4 border-l-2 border-light-pearl">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
