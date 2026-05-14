import { NextResponse } from "next/server";
import "@/lib/init";
import { getActions, updateAction } from "@/lib/storage";
import { calculateRiskScore } from "@/lib/risk";

export const dynamic = "force-dynamic";

export async function GET() {
  const actions = getActions();

  // Recalculate risk scores on every fetch
  const withRisk = actions.map((action) => {
    const risk_score = calculateRiskScore(action);
    if (risk_score !== action.risk_score) {
      updateAction(action.id, { risk_score });
    }
    return { ...action, risk_score };
  });

  return NextResponse.json({ actions: withRisk });
}
