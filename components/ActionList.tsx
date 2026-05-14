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

function getRiskColor(score: number): string {
  if (score >= 60) return "bg-red-600 text-white";
  if (score >= 30) return "bg-yellow-500 text-white";
  return "bg-green-500 text-white";
}

function getDeadlineStatus(deadline: string | null, status: string): string | null {
  if (!deadline || status === "closed") return null;
  const now = new Date();
  const dl = new Date(deadline);
  const diffDays = (dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return "overdue";
  if (diffDays <= 3) return "approaching";
  return null;
}

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
      {actions.map((action, index) => {
        const deadlineStatus = getDeadlineStatus(action.deadline, action.status);

        return (
          <li
            key={action.id || index}
            className={`border rounded-lg p-4 bg-white shadow-sm ${
              deadlineStatus === "overdue"
                ? "border-red-300"
                : deadlineStatus === "approaching"
                ? "border-yellow-300"
                : "border-gray-200"
            }`}
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

                {/* Badges row */}
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

                  {/* Risk Score Badge */}
                  {!editable && action.risk_score > 0 && (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(
                        action.risk_score
                      )}`}
                      title={`Risk: ${action.risk_score}/100`}
                    >
                      Risk {action.risk_score}
                    </span>
                  )}

                  {/* Recurring Badge */}
                  {action.recurring_count > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-600 text-white">
                      Tekrarlayan x{action.recurring_count}
                    </span>
                  )}

                  {action.inferred_owner && (
                    <span className="text-xs text-gray-500">
                      {action.inferred_owner}
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

                {/* Deadline + Closure Criteria */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {action.deadline && (
                    <span
                      className={`text-xs ${
                        deadlineStatus === "overdue"
                          ? "text-red-600 font-semibold"
                          : deadlineStatus === "approaching"
                          ? "text-yellow-600 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {deadlineStatus === "overdue" && "GECIKTI: "}
                      {deadlineStatus === "approaching" && "YAKLASYOR: "}
                      Deadline: {action.deadline}
                    </span>
                  )}
                  {action.closure_criteria && (
                    <span className="text-xs text-gray-400" title="Tamamlanma kriteri">
                      Done: {action.closure_criteria}
                    </span>
                  )}
                </div>

                {/* Editable deadline + closure criteria */}
                {editable && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="date"
                      value={action.deadline || ""}
                      onChange={(e) =>
                        onEdit?.(index, "deadline", e.target.value)
                      }
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                      placeholder="Deadline"
                    />
                    <input
                      type="text"
                      value={action.closure_criteria || ""}
                      onChange={(e) =>
                        onEdit?.(index, "closure_criteria", e.target.value)
                      }
                      className="flex-1 text-xs border border-gray-300 rounded px-2 py-1"
                      placeholder="Tamamlanma kriteri..."
                    />
                  </div>
                )}
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
        );
      })}
    </ul>
  );
}
