'use client'

import { useState } from 'react'
import ActionList from './ActionList'

interface ExtractedAction {
  description: string
  category: 'bug' | 'feature' | 'refactor' | 'process' | 'other'
  is_blocker: boolean
  inferred_owner: string
}

interface RetroCaptureProps {
  onRetroSubmitted: () => void
}

export default function RetroCapture({ onRetroSubmitted }: RetroCaptureProps) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [extracted, setExtracted] = useState<ExtractedAction[]>([])
  const [step, setStep] = useState<'input' | 'review'>('input')
  const [error, setError] = useState('')

  const handleExtract = async () => {
    if (!notes.trim()) {
      setError('Please enter retro notes')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })

      if (!response.ok) throw new Error('Extraction failed')

      const data = await response.json()
      setExtracted(data.actions)
      setStep('review')
    } catch (err) {
      setError('Failed to extract actions. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveActions = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/actions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actions: extracted,
        }),
      })

      if (!response.ok) throw new Error('Save failed')

      setNotes('')
      setExtracted([])
      setStep('input')
      onRetroSubmitted()
    } catch (err) {
      setError('Failed to save actions. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {step === 'input' ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Capture Retrospective Notes</h2>
          <p className="text-gray-600 mb-4">
            Paste your retro notes or action items. AI will extract and structure them.
          </p>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste retro notes here... (include team name, action items, blockers)"
            className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
          />

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleExtract}
              disabled={loading || !notes.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Extracting...' : 'Extract Actions'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Review Extracted Actions</h2>
          <p className="text-gray-600 mb-4">
            Review and adjust the extracted actions before saving.
          </p>

          <ActionList
            actions={extracted}
            editable={true}
            onActionsChange={setExtracted}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                setStep('input')
                setExtracted([])
              }}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSaveActions}
              disabled={loading || extracted.length === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Actions'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
