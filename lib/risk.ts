import { Action } from "./storage";

export function calculateRiskScore(action: Action): number {
  if (action.status === "closed") return 0;

  let score = 0;
  const now = new Date();
  const created = new Date(action.created_at);
  const ageDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

  // Age factor: +2 per day, max 40
  score += Math.min(ageDays * 2, 40);

  // No owner: +20
  if (!action.inferred_owner) score += 20;

  // No deadline: +15
  if (!action.deadline) score += 15;

  // No closure criteria: +10
  if (!action.closure_criteria) score += 10;

  // Is blocker: +15
  if (action.is_blocker) score += 15;

  // Still open after 7 days: +10
  if (action.status === "open" && ageDays > 7) score += 10;

  return Math.min(score, 100);
}

export function getRiskLevel(score: number): "low" | "medium" | "high" {
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export function isOverdue(action: Action): boolean {
  if (!action.deadline || action.status === "closed") return false;
  return new Date(action.deadline) < new Date();
}

export function isApproachingDeadline(action: Action, daysThreshold = 3): boolean {
  if (!action.deadline || action.status === "closed") return false;
  const deadline = new Date(action.deadline);
  const now = new Date();
  const diffDays = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= daysThreshold;
}
