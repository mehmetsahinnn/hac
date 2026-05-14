interface StoredAction {
  id: string
  description: string
  category: string
  is_blocker: boolean
  owner: string
  status: 'open' | 'in-progress' | 'closed'
  created_at: string
  deadline?: string
}

// Demo data - pre-populated for demo mode
const demoActions: StoredAction[] = [
  {
    id: 'action-1',
    description: 'Fix authentication timeout issue affecting 5% of users',
    category: 'bug',
    is_blocker: true,
    owner: 'Sarah',
    status: 'open',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'action-2',
    description: 'Improve API documentation for new endpoints',
    category: 'process',
    is_blocker: false,
    owner: 'Mike',
    status: 'open',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'action-3',
    description: 'Refactor database connection pooling',
    category: 'refactor',
    is_blocker: true,
    owner: 'Alex',
    status: 'in-progress',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'action-4',
    description: 'Add unit tests for payment module',
    category: 'feature',
    is_blocker: false,
    owner: 'Jordan',
    status: 'closed',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

let actions: StoredAction[] = [...demoActions]
let actionId = 4

export const storage = {
  addActions: (newActions: any[]) => {
    const added = newActions.map((action) => {
      const id = `action-${++actionId}`
      return {
        id,
        description: action.description,
        category: action.category,
        is_blocker: action.is_blocker,
        owner: action.inferred_owner,
        status: 'open' as const,
        created_at: new Date().toISOString(),
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }
    })
    actions.push(...added)
    return added
  },

  getActions: () => {
    return actions
  },

  updateAction: (id: string, updates: Partial<StoredAction>) => {
    const index = actions.findIndex((a) => a.id === id)
    if (index !== -1) {
      actions[index] = { ...actions[index], ...updates }
      return actions[index]
    }
    return null
  },
}
