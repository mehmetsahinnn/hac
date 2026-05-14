import { NextResponse } from "next/server";
import "@/lib/init";
import Anthropic from "@anthropic-ai/sdk";
import { createRetro, getActions } from "@/lib/storage";

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

    const retro = createRetro(notes);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Extract action items from the following retrospective notes. For each action item determine:
1. Description (concise, actionable)
2. Category: one of "bug", "feature", "refactor", "process", "other"
3. Is blocker? (blocks other work) - boolean
4. Inferred owner (person name if mentioned, otherwise null)
5. Deadline (inferred date in YYYY-MM-DD format, or null if not mentioned. If "next sprint" assume 2 weeks from today: ${new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]})
6. Closure criteria (what "done" means for this action - a short sentence, or null if obvious)

Return ONLY valid JSON array, no other text:
[{ "description": "...", "category": "...", "is_blocker": true/false, "inferred_owner": "..." or null, "deadline": "YYYY-MM-DD" or null, "closure_criteria": "..." or null }]

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

    let text = content.text.trim();
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      text = fenceMatch[1].trim();
    }

    const actions = JSON.parse(text);

    // Check for recurring issues against past actions
    const pastActions = getActions();
    let recurringMatches: { new_index: number; past_id: string; reason: string }[] = [];

    if (pastActions.length > 0 && actions.length > 0) {
      try {
        const recurringMessage = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: `Compare these NEW actions with PAST actions. Identify recurring issues (same or very similar problem appearing again).

NEW actions:
${JSON.stringify(actions.map((a: { description: string }, i: number) => ({ index: i, description: a.description })))}

PAST actions:
${JSON.stringify(pastActions.slice(0, 50).map((a) => ({ id: a.id, description: a.description })))}

Return ONLY valid JSON array of matches (empty array if no recurring issues):
[{ "new_index": 0, "past_id": "action-...", "reason": "brief explanation" }]`,
            },
          ],
        });

        const recurContent = recurringMessage.content[0];
        if (recurContent.type === "text") {
          let recurText = recurContent.text.trim();
          const recurFence = recurText.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (recurFence) recurText = recurFence[1].trim();
          recurringMatches = JSON.parse(recurText);
        }
      } catch {
        // Non-critical: if recurring detection fails, continue without it
      }
    }

    // Mark recurring counts on actions
    for (const match of recurringMatches) {
      if (actions[match.new_index]) {
        actions[match.new_index].recurring_count =
          (actions[match.new_index].recurring_count || 0) + 1;
        actions[match.new_index].recurring_reason = match.reason;
        actions[match.new_index].recurring_past_id = match.past_id;
      }
    }

    return NextResponse.json({
      actions,
      retro_id: retro.id,
      recurring_matches: recurringMatches,
    });
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
