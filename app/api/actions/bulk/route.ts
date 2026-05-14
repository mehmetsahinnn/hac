import { NextResponse } from "next/server";
import { addActions } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const { actions } = await request.json();

    if (!Array.isArray(actions) || actions.length === 0) {
      return NextResponse.json(
        { error: "Actions must be a non-empty array" },
        { status: 400 }
      );
    }

    for (const action of actions) {
      if (!action.description || typeof action.description !== "string") {
        return NextResponse.json(
          { error: "Each action must have a description" },
          { status: 400 }
        );
      }
    }

    const created = addActions(actions);
    return NextResponse.json({ actions: created }, { status: 201 });
  } catch (error) {
    console.error("Bulk create error:", error);
    return NextResponse.json(
      { error: "Failed to save actions" },
      { status: 500 }
    );
  }
}
