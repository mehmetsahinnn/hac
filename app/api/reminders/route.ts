import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getActions } from "@/lib/storage";
import { calculateRiskScore } from "@/lib/risk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const actions = getActions();
    const highRiskActions = actions
      .filter((a) => a.status !== "closed")
      .map((a) => ({ ...a, risk_score: calculateRiskScore(a) }))
      .filter((a) => a.risk_score > 60);

    if (highRiskActions.length === 0) {
      return NextResponse.json({ reminders: [] });
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Generate contextual reminder emails in Turkish for these high-risk action items. Each reminder should be 2-3 sentences, friendly but firm, referencing the specific action and its deadline/criteria.

Actions needing reminders:
${JSON.stringify(highRiskActions.map((a) => ({
  id: a.id,
  description: a.description,
  owner: a.inferred_owner,
  deadline: a.deadline,
  closure_criteria: a.closure_criteria,
  risk_score: a.risk_score,
  days_old: Math.floor((Date.now() - new Date(a.created_at).getTime()) / 86400000),
})))}

Return ONLY valid JSON array:
[{ "action_id": "...", "to": "owner name", "subject": "...", "body": "..." }]

Requirements:
- Write in Turkish
- Be contextual (mention specific action details)
- Tone: friendly, urgent but not pushy
- Include deadline if available
- Mention what "done" means if closure_criteria exists`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ reminders: [] });
    }

    let text = content.text.trim();
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) text = fenceMatch[1].trim();

    const reminders = JSON.parse(text);
    return NextResponse.json({ reminders });
  } catch (error) {
    console.error("Reminders error:", error);
    return NextResponse.json(
      { error: "Failed to generate reminders" },
      { status: 500 }
    );
  }
}
