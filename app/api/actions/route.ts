import { NextResponse } from 'next/server'

// Legacy endpoint — feature removed.
export async function GET() {
  return NextResponse.json({ actions: [] })
}
