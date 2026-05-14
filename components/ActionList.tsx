"use client";

import { Action } from "@/lib/storage";

interface ActionListProps {
  actions: Action[];
  editable?: boolean;
  onEdit?: (index: number, field: string, value: string | boolean) => void;
  onStatusChange?: (id: string, status: Action["status"]) => void;
}

const CATEGORY_STYLES: Record<string, string> = {
  bug: "bg-sunset-orange/10 text-sunset-orange",
  feature: "bg-midnight/5 text-midnight",
  refactor: "bg-data-gold/10 text-data-gold",
  process: "bg-warm-ivory text-dark-shale",
  other: "bg-slate-mist text-silver-ash",
};

function getRiskStyle(score: number): string {
  if (score >= 60) return "bg-sunset-orange text-canvas-white";
  if (score >= 30) return "bg-data-gold text-canvas-white";
  return "bg-slate-mist text-dark-shale";
}

function getDeadlineStatus(deadline: string | null, status: string): string | null {
  if (!deadline || status === "closed") return null;
  const diffDays = (new Date(deadline).getTime() - Date.now()) / 86400000;
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
      <p className="text-silver-ash text-center py-12 text-sm">
        Goruntulecek aksiyon yok.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {actions.map((action, index) => {
        const dlStatus = getDeadlineStatus(action.deadline, action.status);

        return (
          <li
            key={action.id || index}
            className={`rounded-cards p-5 transition-all ${
              dlStatus === "overdue"
                ? "bg-canvas-white border-2 border-sunset-orange/40"
                : dlStatus === "approaching"
                ? "bg-canvas-white border-2 border-data-gold/40"
                : "bg-slate-mist border border-transparent"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-3">
                {editable ? (
                  <input
                    type="text"
                    value={action.description}
                    onChange={(e) => onEdit?.(index, "description", e.target.value)}
                    className="input-field w-full text-sm font-medium"
                  />
                ) : (
                  <p className="text-sm font-medium text-midnight">
                    {action.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`badge ${CATEGORY_STYLES[action.category] || CATEGORY_STYLES.other}`}>
                    {action.category}
                  </span>

                  {action.is_blocker && (
                    <span className="badge bg-sunset-orange text-canvas-white">
                      BLOCKER
                    </span>
                  )}

                  {!editable && action.risk_score > 0 && (
                    <span className={`badge ${getRiskStyle(action.risk_score)}`}>
                      Risk {action.risk_score}
                    </span>
                  )}

                  {action.recurring_count > 0 && (
                    <span className="badge bg-data-gold/10 text-data-gold">
                      Tekrarlayan x{action.recurring_count}
                    </span>
                  )}

                  {action.inferred_owner && (
                    <span className="text-caption text-silver-ash">
                      {action.inferred_owner}
                    </span>
                  )}

                  {!editable && action.status && (
                    <span className={`badge ${
                      action.status === "closed"
                        ? "bg-midnight/5 text-midnight"
                        : action.status === "in-progress"
                        ? "bg-data-gold/10 text-data-gold"
                        : "bg-sunset-orange/10 text-sunset-orange"
                    }`}>
                      {action.status === "in-progress" ? "devam ediyor" : action.status === "closed" ? "kapali" : "acik"}
                    </span>
                  )}
                </div>

                {/* Deadline + Closure */}
                {(action.deadline || action.closure_criteria) && !editable && (
                  <div className="flex flex-wrap gap-4 text-caption">
                    {action.deadline && (
                      <span className={
                        dlStatus === "overdue"
                          ? "text-sunset-orange font-medium"
                          : dlStatus === "approaching"
                          ? "text-data-gold font-medium"
                          : "text-silver-ash"
                      }>
                        {dlStatus === "overdue" && "GECIKTI "}
                        {dlStatus === "approaching" && "YAKLASYOR "}
                        {action.deadline}
                      </span>
                    )}
                    {action.closure_criteria && (
                      <span className="text-silver-ash">
                        Done: {action.closure_criteria}
                      </span>
                    )}
                  </div>
                )}

                {/* Editable fields */}
                {editable && (
                  <div className="flex gap-3">
                    <input
                      type="date"
                      value={action.deadline || ""}
                      onChange={(e) => onEdit?.(index, "deadline", e.target.value)}
                      className="input-field text-caption"
                    />
                    <input
                      type="text"
                      value={action.closure_criteria || ""}
                      onChange={(e) => onEdit?.(index, "closure_criteria", e.target.value)}
                      className="input-field flex-1 text-caption"
                      placeholder="Tamamlanma kriteri..."
                    />
                  </div>
                )}
              </div>

              {!editable && onStatusChange && (
                <select
                  value={action.status}
                  onChange={(e) => onStatusChange(action.id, e.target.value as Action["status"])}
                  className="input-field text-caption"
                >
                  <option value="open">Acik</option>
                  <option value="in-progress">Devam</option>
                  <option value="closed">Kapali</option>
                </select>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
