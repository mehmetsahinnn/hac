import { NextResponse } from "next/server";

// This endpoint was removed when AI features were dropped.
export function GET() {
  return NextResponse.json({ error: "Gone" }, { status: 410 });
}
