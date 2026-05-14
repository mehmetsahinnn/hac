'use client'

interface Action {
  description: string
  category: 'bug' | 'feature' | 'refactor' | 'process' | 'other'
  is_blocker: boolean
  inferred_owner: string
}

interface ActionListProps {
  actions: Action[]
  editable?: boolean
  onActionsChange?: (actions: Action[]) => void
}

export default function ActionList({
  actions,
  editable = false,
  onActionsChange,
}: ActionListProps) {
  const handleActionChange = (index: number, field: keyof Action, value: any) => {
    if (!editable || !onActionsChange) return

    const updated = [...actions]
    updated[index] = { ...updated[index], [field]: value }
    onActionsChange(updated)
  }

  const handleRemove = (index: number) => {
    if (!editable || !onActionsChange) return
    onActionsChange(actions.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {actions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No actions extracted yet. Please enter retro notes.
        </div>
      ) : (
        actions.map((action, idx) => (
          <div
            key={idx}
            className="p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-lg"
          >
            {editable ? (
              <div className="space-y-3">
                <textarea
                  value={action.description}
                  onChange={(e) =>
                    handleActionChange(idx, 'description', e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded font-semibold focus:border-indigo-500 focus:outline-none"
                  rows={2}
                />

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={action.category}
                      onChange={(e) =>
                        handleActionChange(
                          idx,
                          'category',
                          e.target.value as Action['category']
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="bug">Bug</option>
                      <option value="feature">Feature</option>
                      <option value="refactor">Refactor</option>
                      <option value="process">Process</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Owner
                    </label>
                    <input
                      type="text"
                      value={action.inferred_owner}
                      onChange={(e) =>
                        handleActionChange(idx, 'inferred_owner', e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                      placeholder="Team member"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Blocker?
                    </label>
                    <input
                      type="checkbox"
                      checked={action.is_blocker}
                      onChange={(e) =>
                        handleActionChange(idx, 'is_blocker', e.target.checked)
                      }
                      className="w-5 h-5 mt-2 cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(idx)}
                  className="text-sm text-red-600 hover:text-red-800 font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-gray-900 flex-1">
                    {action.description}
                  </p>
                  {action.is_blocker && (
                    <span className="ml-2 px-2 py-1 bg-red-200 text-red-800 text-xs font-bold rounded">
                      BLOCKER
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Category: <span className="font-semibold">{action.category}</span> | Owner: <span className="font-semibold">{action.inferred_owner}</span>
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
