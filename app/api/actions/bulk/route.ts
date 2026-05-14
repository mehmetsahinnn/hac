import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const { actions } = await request.json()

    if (!actions || !Array.isArray(actions)) {
      return NextResponse.json(
        { error: 'Actions array required' },
        { status: 400 }
      )
    }

    const saved = storage.addActions(actions)
    return NextResponse.json({ actions: saved }, { status: 201 })
  } catch (error) {
    console.error('Bulk add actions error:', error)
    return NextResponse.json(
      { error: 'Failed to save actions' },
      { status: 500 }
    )
  }
}
