'use client'

import { useState, useEffect } from 'react'

interface SavedAction {
  id: string
  description: string
  category: string
  is_blocker: boolean
  owner: string
  status: 'open' | 'in-progress' | 'closed'
  deadline?: string
  created_at: string
}

interface ActionDashboardProps {
  refreshTrigger: number
}

export default function ActionDashboard({ refreshTrigger }: ActionDashboardProps) {
  const [actions, setActions] = useState<SavedAction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all')

  useEffect(() => {
    fetchActions()
  }, [refreshTrigger])

  const fetchActions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/actions')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setActions(data.actions || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/actions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchActions()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = actions.filter((a) => {
    if (filter === 'open') return a.status !== 'closed'
    if (filter === 'closed') return a.status === 'closed'
    return true
  })

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Action Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded font-semibold ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            All ({actions.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded font-semibold ${
              filter === 'open'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Open ({actions.filter((a) => a.status !== 'closed').length})
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-4 py-2 rounded font-semibold ${
              filter === 'closed'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Closed ({actions.filter((a) => a.status === 'closed').length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No actions yet. Create retro to start!
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((action) => (
            <div
              key={action.id}
              className={`p-4 border-l-4 rounded-lg ${
                action.status === 'closed'
                  ? 'border-gray-400 bg-gray-50 opacity-75'
                  : action.is_blocker
                    ? 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p
                    className={`font-semibold text-lg ${
                      action.status === 'closed'
                        ? 'line-through text-gray-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {action.description}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Owner: <span className="font-semibold">{action.owner}</span>
                    {' | '}
                    Category: <span className="font-semibold">{action.category}</span>
                  </p>
                </div>
                <div className="ml-4 flex gap-2">
                  {action.is_blocker && (
                    <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-bold rounded">
                      BLOCKER
                    </span>
                  )}
                  <select
                    value={action.status}
                    onChange={(e) => handleStatusChange(action.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded font-semibold text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
