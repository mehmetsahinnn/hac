import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getActions } from "@/lib/storage";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { action_descriptions } = await request.json();

    if (!Array.isArray(action_descriptions) || action_descriptions.length === 0) {
      return NextResponse.json(
        { error: "action_descriptions must be a non-empty array" },
        { status: 400 }
      );
    }

    const pastActions = getActions();
    if (pastActions.length === 0) {
      return NextResponse.json({ matches: [] });
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Compare these NEW action descriptions with PAST actions. Identify recurring issues (same or very similar problem appearing again).

NEW actions:
${JSON.stringify(action_descriptions.map((d: string, i: number) => ({ index: i, description: d })))}

PAST actions:
${JSON.stringify(pastActions.slice(0, 50).map((a) => ({ id: a.id, description: a.description, category: a.category })))}

Return ONLY valid JSON array of matches (empty array if no recurring issues):
[{ "new_index": 0, "past_id": "action-...", "reason": "brief explanation why these are the same recurring issue" }]`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ matches: [] });
    }

    let text = content.text.trim();
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) text = fenceMatch[1].trim();

    const matches = JSON.parse(text);
    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Recurring detection error:", error);
    return NextResponse.json(
      { error: "Failed to detect recurring issues" },
      { status: 500 }
    );
  }
}
