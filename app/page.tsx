'use client'

import { useState } from 'react'
import RetroCapture from '@/components/RetroCapture'
import ActionDashboard from '@/components/ActionDashboard'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'capture' | 'dashboard'>('capture')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRetroSubmitted = () => {
    setRefreshTrigger(prev => prev + 1)
    setActiveTab('dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Retro & Action Tracker
            </h1>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
              🎭 Demo Mode
            </span>
          </div>
          <p className="text-gray-600">
            Capture, deduplicate, and track retrospective action items. Prevent forgotten tasks and build organizational knowledge.
          </p>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('capture')}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === 'capture'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            New Retro
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dashboard
          </button>
        </div>

        <div>
          {activeTab === 'capture' && (
            <RetroCapture onRetroSubmitted={handleRetroSubmitted} />
          )}
          {activeTab === 'dashboard' && (
            <ActionDashboard refreshTrigger={refreshTrigger} />
          )}
        </div>
      </div>
    </div>
  )
}
