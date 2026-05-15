import { NextResponse } from 'next/server'

// Legacy endpoint — feature removed.
export async function POST() {
  return NextResponse.json({ error: 'disabled' }, { status: 410 })
}
