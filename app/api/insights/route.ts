import { NextResponse } from "next/server";
import "@/lib/init";
import Anthropic from "@anthropic-ai/sdk";
import { getActions, getRetros } from "@/lib/storage";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const actions = getActions();
    const retros = getRetros();

    if (actions.length === 0) {
      return NextResponse.json({
        insights: {
          summary: "Henuz retro verisi yok. Ilk retronuzu olusturun!",
          categories: {},
          trends: [],
          lessons: [],
        },
      });
    }

    const stats = {
      total_actions: actions.length,
      closed: actions.filter((a) => a.status === "closed").length,
      open: actions.filter((a) => a.status === "open").length,
      in_progress: actions.filter((a) => a.status === "in-progress").length,
      blockers: actions.filter((a) => a.is_blocker).length,
      total_retros: retros.length,
      categories: actions.reduce(
        (acc, a) => {
          acc[a.category] = (acc[a.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Analyze this team's retrospective history and generate insights in Turkish.

Stats:
${JSON.stringify(stats)}

Recent actions (last 30):
${JSON.stringify(actions.slice(0, 30).map((a) => ({
  description: a.description,
  category: a.category,
  status: a.status,
  is_blocker: a.is_blocker,
  created_at: a.created_at,
  closed_at: a.closed_at,
  recurring_count: a.recurring_count,
})))}

Retro notes (last 5):
${JSON.stringify(retros.slice(0, 5).map((r) => ({ date: r.created_at, notes: r.raw_notes.substring(0, 500) })))}

Generate insights as JSON:
{
  "summary": "2-3 sentence overall team health summary in Turkish",
  "trends": ["trend 1", "trend 2", "trend 3"],
  "recurring_patterns": ["pattern 1", "pattern 2"],
  "lessons_learned": ["lesson 1", "lesson 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Return ONLY valid JSON, no other text.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ insights: null });
    }

    let text = content.text.trim();
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) text = fenceMatch[1].trim();

    const insights = JSON.parse(text);
    return NextResponse.json({ insights, stats });
  } catch (error) {
    console.error("Insights error:", error);
    return NextResponse.json({
      insights: {
        summary: "Insights su anda yuklenemiyor. Lutfen daha sonra tekrar deneyin.",
        trends: [],
        recurring_patterns: [],
        lessons_learned: [],
        recommendations: [],
      },
      stats: null,
      error: String(error),
    });
  }
}
