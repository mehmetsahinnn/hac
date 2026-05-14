import { NextResponse } from "next/server";
import { updateAction } from "@/lib/storage";

const VALID_STATUSES = ["open", "in-progress", "closed"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (body.status) updates.status = body.status;
    if (body.description) updates.description = body.description;
    if (body.category) updates.category = body.category;
    if (body.inferred_owner !== undefined) updates.inferred_owner = body.inferred_owner;
    if (body.deadline !== undefined) updates.deadline = body.deadline;
    if (body.closure_criteria !== undefined) updates.closure_criteria = body.closure_criteria;

    const updated = updateAction(id, updates);

    if (!updated) {
      return NextResponse.json(
        { error: "Action not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ action: updated });
  } catch (error) {
    console.error("Update action error:", error);
    return NextResponse.json(
      { error: "Failed to update action" },
      { status: 500 }
    );
  }
}
