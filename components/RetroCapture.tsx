"use client";

import { useState } from "react";
import ActionList from "./ActionList";
import { Action } from "@/lib/storage";

type ExtractedAction = Omit<Action, "id" | "status" | "created_at" | "closed_at">;

interface RetroCaptureProps {
  onSaved: () => void;
}

export default function RetroCapture({ onSaved }: RetroCaptureProps) {
  const [notes, setNotes] = useState("");
  const [extractedActions, setExtractedActions] = useState<ExtractedAction[]>([]);
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
        body: JSON.stringify({ actions: extractedActions }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      setNotes("");
      setExtractedActions([]);
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
            placeholder="Paste your retrospective notes here...&#10;&#10;Example:&#10;- Fix auth timeout issue. Sarah needs to look at this.&#10;- We should improve the onboarding docs. Mike volunteered.&#10;- CI pipeline is too slow, blocks everyone."
            className="w-full h-48 border border-gray-300 rounded-lg p-4 text-sm resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleExtract}
            disabled={loading || !notes.trim()}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Extracting actions with AI...
              </span>
            ) : (
              "Extract Actions"
            )}
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Review Extracted Actions ({extractedActions.length})
            </h2>
            <button
              onClick={handleBack}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Back to edit
            </button>
          </div>

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
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              "Save All Actions"
            )}
          </button>
        </>
      )}
    </div>
  );
}
