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
          actions: extractedActions.map((a) => ({ ...a, retro_id: retroId })),
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

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-cloud-whisper border border-sunset-orange/20 text-sunset-orange px-5 py-4 rounded-cards text-sm">
          {error}
        </div>
      )}

      {step === "input" ? (
        <div className="space-y-5">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Retro notlarinizi buraya yapistirin..."
            className="input-field w-full h-52 resize-y"
          />
          <button
            onClick={handleExtract}
            disabled={loading || !notes.trim()}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="inline-block w-4 h-4 border-2 border-canvas-white/30 border-t-canvas-white rounded-full animate-spin" />
                AI ile aksiyonlar cikariliyor...
              </span>
            ) : (
              "Aksiyonlari Cikar"
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-heading-sm text-midnight">
              Cikarilan Aksiyonlar
            </h2>
            <button
              onClick={() => { setStep("input"); setError(null); }}
              className="btn-secondary"
            >
              Geri
            </button>
          </div>

          {recurringMatches.length > 0 && (
            <div className="bg-warm-ivory rounded-cards p-5">
              <p className="text-sm font-medium text-data-gold">
                Tekrarlayan Sorunlar Tespit Edildi
              </p>
              <ul className="mt-2 space-y-1">
                {recurringMatches.map((m, i) => (
                  <li key={i} className="text-caption text-dark-shale">
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
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-3">
                <span className="inline-block w-4 h-4 border-2 border-canvas-white/30 border-t-canvas-white rounded-full animate-spin" />
                Kaydediliyor...
              </span>
            ) : (
              "Tum Aksiyonlari Kaydet"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
