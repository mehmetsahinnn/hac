import { Anthropic } from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

// Mock extraction cache for demo mode
const mockExtractions: Record<string, any[]> = {
  'fix auth': [
    { description: 'Fix authentication timeout issue', category: 'bug', is_blocker: true, inferred_owner: 'Sarah' },
    { description: 'Add refresh token mechanism', category: 'feature', is_blocker: true, inferred_owner: 'Sarah' },
  ],
  'improve docs': [
    { description: 'Improve API documentation', category: 'process', is_blocker: false, inferred_owner: 'Mike' },
  ],
  'default': [
    { description: 'Refactor database connection pooling', category: 'refactor', is_blocker: true, inferred_owner: 'Alex' },
    { description: 'Add comprehensive error handling', category: 'feature', is_blocker: false, inferred_owner: 'Jordan' },
    { description: 'Set up monitoring and alerts', category: 'process', is_blocker: false, inferred_owner: 'Casey' },
  ],
}

const isDemoMode = !process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'demo'
const client = isDemoMode ? null : new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { notes } = await request.json()

    if (!notes || !notes.trim()) {
      return NextResponse.json({ error: 'Notes required' }, { status: 400 })
    }

    let actions = []

    if (isDemoMode) {
      // Demo mode - return mock data based on content
      const notesLower = notes.toLowerCase()
      if (notesLower.includes('auth') && notesLower.includes('timeout')) {
        actions = mockExtractions['fix auth']
      } else if (notesLower.includes('doc')) {
        actions = mockExtractions['improve docs']
      } else {
        actions = mockExtractions['default']
      }
    } else {
      // Real mode - use Claude API
      const prompt = `Extract action items from this retrospective. For each action, identify:
- description (1-2 sentences, clear and actionable)
- category (bug, feature, refactor, process, or other)
- is_blocker (true if blocks progress, false otherwise)
- inferred_owner (person name if mentioned, otherwise empty string)

Return ONLY a valid JSON array, no markdown, no explanation:
[
  {"description": "...", "category": "bug", "is_blocker": false, "inferred_owner": "..."},
  ...
]

Retro notes:
${notes}`

      const message = await client!.messages.create({
        model: 'claude-opus-4-7',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      })

      const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
      try {
        actions = JSON.parse(responseText)
      } catch (e) {
        const jsonMatch = responseText.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          actions = JSON.parse(jsonMatch[0])
        }
      }
    }

    return NextResponse.json({
      actions: actions.map((action: any) => ({
        description: action.description || '',
        category: action.category || 'other',
        is_blocker: action.is_blocker || false,
        inferred_owner: action.inferred_owner || '',
      })),
      demo: isDemoMode,
    })
  } catch (error) {
    console.error('Extraction error:', error)
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 })
  }
}
