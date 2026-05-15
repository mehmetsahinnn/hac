import { NextResponse } from 'next/server'

// AI features have been removed from the app.
// This endpoint stays as a stub so any cached client gets a clean response.
export async function POST() {
  return NextResponse.json(
    { error: 'AI features have been disabled' },
    { status: 410 }
  )
}
