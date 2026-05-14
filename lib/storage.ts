export interface Action {
  id: string;
  description: string;
  category: "bug" | "feature" | "refactor" | "process" | "other";
  is_blocker: boolean;
  inferred_owner: string | null;
  status: "open" | "in-progress" | "closed";
  created_at: string;
  closed_at: string | null;
}

interface StorageState {
  actions: Map<string, Action>;
  idCounter: number;
}

const globalForStorage = globalThis as unknown as { __storage?: StorageState };

if (!globalForStorage.__storage) {
  globalForStorage.__storage = {
    actions: new Map(),
    idCounter: 0,
  };
}

const store = globalForStorage.__storage;

function generateId(): string {
  store.idCounter++;
  return `action-${Date.now()}-${store.idCounter}`;
}

export function addActions(
  items: Omit<Action, "id" | "status" | "created_at" | "closed_at">[]
): Action[] {
  const created: Action[] = [];

  for (const item of items) {
    const action: Action = {
      ...item,
      id: generateId(),
      status: "open",
      created_at: new Date().toISOString(),
      closed_at: null,
    };
    store.actions.set(action.id, action);
    created.push(action);
  }

  return created;
}

export function getActions(): Action[] {
  return Array.from(store.actions.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function updateAction(
  id: string,
  updates: Partial<Pick<Action, "status" | "description" | "category" | "inferred_owner">>
): Action | null {
  const action = store.actions.get(id);
  if (!action) return null;

  const updated: Action = { ...action, ...updates };

  if (updates.status === "closed" && action.status !== "closed") {
    updated.closed_at = new Date().toISOString();
  }

  store.actions.set(id, updated);
  return updated;
}
