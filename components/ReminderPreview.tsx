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
      .catch((err) => setError(err instanceof Error ? err.message : "Failed"))
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
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="inline-block w-6 h-6 border-2 border-midnight/20 border-t-midnight rounded-full animate-spin" />
        <p className="text-caption text-silver-ash">Hatirlatmalar hazirlaniyor...</p>
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

  if (reminders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-silver-ash text-sm">
          Yuksek riskli aksiyon yok — hatirlatma gerekmez.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-caption text-silver-ash">
        Sadece yuksek riskli aksiyonlar icin baglam odakli hatirlatmalar
      </p>
      {reminders.map((reminder) => (
        <div
          key={reminder.action_id}
          className="bg-slate-mist rounded-cards p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <p className="text-caption text-silver-ash">
                Kime: <span className="text-midnight font-medium">{reminder.to}</span>
              </p>
              <p className="text-sm font-medium text-midnight">
                {reminder.subject}
              </p>
              <p className="text-body text-dark-shale whitespace-pre-wrap">
                {reminder.body}
              </p>
            </div>
            <button
              onClick={() => handleCopy(reminder)}
              className="btn-ghost shrink-0 text-caption"
            >
              {copiedId === reminder.action_id ? "Kopyalandi" : "Kopyala"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
