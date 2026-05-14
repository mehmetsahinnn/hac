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
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
        <p className="text-sm text-gray-500">Takim hafizasi yukleniyor...</p>
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

  if (!insights) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">Henuz yeterli veri yok.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">{insights.summary}</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <span className="block text-2xl font-bold text-gray-900">
              {stats.total_actions}
            </span>
            <span className="text-xs text-gray-500">Toplam Aksiyon</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <span className="block text-2xl font-bold text-green-600">
              {stats.total_actions > 0
                ? Math.round((stats.closed / stats.total_actions) * 100)
                : 0}
              %
            </span>
            <span className="text-xs text-gray-500">Tamamlanma</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <span className="block text-2xl font-bold text-red-600">
              {stats.blockers}
            </span>
            <span className="text-xs text-gray-500">Blocker</span>
          </div>
        </div>
      )}

      {/* Trends */}
      {insights.trends && insights.trends.length > 0 && (
        <Section title="Trendler">
          {insights.trends.map((t, i) => (
            <li key={i} className="text-sm text-gray-700">
              {t}
            </li>
          ))}
        </Section>
      )}

      {/* Recurring Patterns */}
      {insights.recurring_patterns && insights.recurring_patterns.length > 0 && (
        <Section title="Tekrarlayan Problemler">
          {insights.recurring_patterns.map((p, i) => (
            <li key={i} className="text-sm text-gray-700">
              {p}
            </li>
          ))}
        </Section>
      )}

      {/* Lessons */}
      {insights.lessons_learned && insights.lessons_learned.length > 0 && (
        <Section title="Ogrenilen Dersler">
          {insights.lessons_learned.map((l, i) => (
            <li key={i} className="text-sm text-gray-700">
              {l}
            </li>
          ))}
        </Section>
      )}

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <Section title="Oneriler">
          {insights.recommendations.map((r, i) => (
            <li key={i} className="text-sm text-gray-700">
              {r}
            </li>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
      <ul className="space-y-1 list-disc list-inside">{children}</ul>
    </div>
  );
}
