import { NextResponse } from 'next/server'

// Legacy endpoint — feature removed.
export async function GET() {
  return NextResponse.json({ action: null })
}

export async function PATCH() {
  return NextResponse.json({ error: 'disabled' }, { status: 410 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'disabled' }, { status: 410 })
}
