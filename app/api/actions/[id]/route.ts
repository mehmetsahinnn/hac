import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET() {
  try {
    const actions = storage.getActions()
    return NextResponse.json({ actions })
  } catch (error) {
    console.error('Get actions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch actions' },
      { status: 500 }
    )
  }
}
