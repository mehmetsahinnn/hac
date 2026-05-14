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

    const updated = updateAction(id, body);

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
