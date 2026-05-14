"use client";

import { useEffect, useState } from "react";

interface Reminder {
  action_id: string;
  to: string;
  subject: string;
  body: string;
}

export default function ReminderPreview() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reminders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setReminders(data.reminders || []))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = async (reminder: Reminder) => {
    const text = `Konu: ${reminder.subject}\nKime: ${reminder.to}\n\n${reminder.body}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(reminder.action_id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
        <p className="text-sm text-gray-500">Hatirlatmalar hazirlaniyor...</p>
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

  if (reminders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">
          Yuksek riskli aksiyon yok - hatirlatma gerekmez!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Sadece yuksek riskli aksiyonlar icin baglam odakli hatirlatmalar:
      </p>
      {reminders.map((reminder) => (
        <div
          key={reminder.action_id}
          className="border border-gray-200 rounded-lg p-4 bg-white"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500">
                Kime: <span className="font-medium">{reminder.to}</span>
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {reminder.subject}
              </p>
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                {reminder.body}
              </p>
            </div>
            <button
              onClick={() => handleCopy(reminder)}
              className="ml-3 shrink-0 text-xs px-2.5 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {copiedId === reminder.action_id ? "Kopyalandi!" : "Kopyala"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
