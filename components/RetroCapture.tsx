"use client";

import { useState } from "react";
import ActionList from "./ActionList";
import { Action } from "@/lib/storage";

type ExtractedAction = Omit<Action, "id" | "status" | "created_at" | "closed_at" | "risk_score">;

interface RecurringMatch {
  new_index: number;
  past_id: string;
  reason: string;
}

interface RetroCaptureProps {
  onSaved: () => void;
}

export default function RetroCapture({ onSaved }: RetroCaptureProps) {
  const [notes, setNotes] = useState("");
  const [extractedActions, setExtractedActions] = useState<ExtractedAction[]>([]);
  const [retroId, setRetroId] = useState<string | null>(null);
  const [recurringMatches, setRecurringMatches] = useState<RecurringMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"input" | "review">("input");

  const handleExtract = async () => {
    if (!notes.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Extraction failed");
      }

      const data = await res.json();
      setExtractedActions(data.actions);
      setRetroId(data.retro_id);
      setRecurringMatches(data.recurring_matches || []);
      setStep("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number, field: string, value: string | boolean) => {
    setExtractedActions((prev) =>
      prev.map((action, i) =>
        i === index ? { ...action, [field]: value } : action
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/actions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actions: extractedActions.map((a) => ({
            ...a,
            retro_id: retroId,
          })),
          retro_id: retroId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      setNotes("");
      setExtractedActions([]);
      setRetroId(null);
      setRecurringMatches([]);
      setStep("input");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    setStep("input");
    setError(null);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {step === "input" ? (
        <>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Retro notlarinizi buraya yapiştirin...&#10;&#10;Ornek:&#10;- Auth timeout sorununu cozmemiz lazim. Sarah bakacak.&#10;- Onboarding dokumanlari iyilestirilmeli. Mike gonullu oldu.&#10;- CI pipeline cok yavas, herkesi blokluyor."
            className="w-full h-48 border border-gray-300 rounded-lg p-4 text-sm resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleExtract}
            disabled={loading || !notes.trim()}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                AI ile aksiyonlar cikariliyor...
              </span>
            ) : (
              "Aksiyonlari Cikar"
            )}
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Cikarilan Aksiyonlar ({extractedActions.length})
            </h2>
            <button
              onClick={handleBack}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              &larr; Geri
            </button>
          </div>

          {/* Recurring warnings */}
          {recurringMatches.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-purple-800 text-sm font-semibold">
                Tekrarlayan Sorunlar Tespit Edildi!
              </p>
              <ul className="mt-1 space-y-1">
                {recurringMatches.map((m, i) => (
                  <li key={i} className="text-purple-700 text-xs">
                    #{m.new_index + 1}: {m.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ActionList
            actions={extractedActions as unknown as Action[]}
            editable
            onEdit={handleEdit}
          />

          <button
            onClick={handleSave}
            disabled={saving || extractedActions.length === 0}
            className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Kaydediliyor...
              </span>
            ) : (
              "Tum Aksiyonlari Kaydet"
            )}
          </button>
        </>
      )}
    </div>
  );
}
