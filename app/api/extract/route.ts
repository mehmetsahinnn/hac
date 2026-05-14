import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { notes } = await request.json();

    if (!notes || typeof notes !== "string" || notes.trim().length === 0) {
      return NextResponse.json(
        { error: "Notes field is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Extract action items from the following retrospective notes. For each action item:
1. Description (concise, actionable)
2. Category: one of "bug", "feature", "refactor", "process", "other"
3. Is blocker? (blocks other work) - boolean
4. Inferred owner (person name if mentioned, otherwise null)

Return ONLY valid JSON array, no other text:
[{ "description": "...", "category": "...", "is_blocker": true/false, "inferred_owner": "..." or null }]

Retrospective notes:
${notes}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response from AI" },
        { status: 500 }
      );
    }

    const actions = JSON.parse(content.text);

    return NextResponse.json({ actions });
  } catch (error) {
    console.error("Extract API error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response as JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to extract actions" },
      { status: 500 }
    );
  }
}
