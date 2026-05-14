"use client";

import { Action } from "@/lib/storage";

interface ActionListProps {
  actions: Action[];
  editable?: boolean;
  onEdit?: (index: number, field: string, value: string | boolean) => void;
  onStatusChange?: (id: string, status: Action["status"]) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  bug: "bg-red-100 text-red-700",
  feature: "bg-blue-100 text-blue-700",
  refactor: "bg-purple-100 text-purple-700",
  process: "bg-yellow-100 text-yellow-700",
  other: "bg-gray-100 text-gray-700",
};

const STATUS_COLORS: Record<string, string> = {
  open: "bg-orange-100 text-orange-700",
  "in-progress": "bg-blue-100 text-blue-700",
  closed: "bg-green-100 text-green-700",
};

export default function ActionList({
  actions,
  editable = false,
  onEdit,
  onStatusChange,
}: ActionListProps) {
  if (actions.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No actions to display.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {actions.map((action, index) => (
        <li
          key={action.id || index}
          className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {editable ? (
                <input
                  type="text"
                  value={action.description}
                  onChange={(e) =>
                    onEdit?.(index, "description", e.target.value)
                  }
                  className="w-full text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900">
                  {action.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    CATEGORY_COLORS[action.category] || CATEGORY_COLORS.other
                  }`}
                >
                  {action.category}
                </span>

                {action.is_blocker && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-600 text-white">
                    BLOCKER
                  </span>
                )}

                {action.inferred_owner && (
                  <span className="text-xs text-gray-500">
                    Owner: {action.inferred_owner}
                  </span>
                )}

                {!editable && action.status && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      STATUS_COLORS[action.status]
                    }`}
                  >
                    {action.status}
                  </span>
                )}
              </div>
            </div>

            {!editable && onStatusChange && (
              <select
                value={action.status}
                onChange={(e) =>
                  onStatusChange(action.id, e.target.value as Action["status"])
                }
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
