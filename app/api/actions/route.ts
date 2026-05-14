import { NextResponse } from "next/server";
import { getActions } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const actions = getActions();
  return NextResponse.json({ actions });
}
