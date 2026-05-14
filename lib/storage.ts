export interface Action {
  id: string;
  description: string;
  category: "bug" | "feature" | "refactor" | "process" | "other";
  is_blocker: boolean;
  inferred_owner: string | null;
  status: "open" | "in-progress" | "closed";
  created_at: string;
  closed_at: string | null;
  deadline: string | null;
  closure_criteria: string | null;
  risk_score: number;
  retro_id: string;
  recurring_count: number;
}

export interface Retro {
  id: string;
  raw_notes: string;
  created_at: string;
  actions: string[];
  reviewed: boolean;
}

interface StorageState {
  actions: Map<string, Action>;
  retros: Map<string, Retro>;
  idCounter: number;
}

const globalForStorage = globalThis as unknown as { __storage?: StorageState; __seeded?: boolean };

if (!globalForStorage.__storage) {
  globalForStorage.__storage = {
    actions: new Map(),
    retros: new Map(),
    idCounter: 0,
  };
}

const store = globalForStorage.__storage;

function generateId(prefix: string): string {
  store.idCounter++;
  return `${prefix}-${Date.now()}-${store.idCounter}`;
}

// --- Retro CRUD ---

export function createRetro(raw_notes: string): Retro {
  const retro: Retro = {
    id: generateId("retro"),
    raw_notes,
    created_at: new Date().toISOString(),
    actions: [],
    reviewed: false,
  };
  store.retros.set(retro.id, retro);
  return retro;
}

export function getRetros(): Retro[] {
  return Array.from(store.retros.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getRetro(id: string): Retro | null {
  return store.retros.get(id) || null;
}

export function markRetroReviewed(id: string): Retro | null {
  const retro = store.retros.get(id);
  if (!retro) return null;
  retro.reviewed = true;
  store.retros.set(id, retro);
  return retro;
}

export function getLatestUnreviewedRetro(): Retro | null {
  const retros = getRetros();
  return retros.find((r) => !r.reviewed && r.actions.length > 0) || null;
}

// --- Action CRUD ---

export interface ActionInput {
  description: string;
  category: Action["category"];
  is_blocker: boolean;
  inferred_owner: string | null;
  deadline?: string | null;
  closure_criteria?: string | null;
  retro_id?: string;
  recurring_count?: number;
}

export function addActions(items: ActionInput[], retroId?: string): Action[] {
  const created: Action[] = [];

  for (const item of items) {
    const action: Action = {
      id: generateId("action"),
      description: item.description,
      category: item.category,
      is_blocker: item.is_blocker,
      inferred_owner: item.inferred_owner,
      status: "open",
      created_at: new Date().toISOString(),
      closed_at: null,
      risk_score: 0,
      recurring_count: item.recurring_count ?? 0,
      deadline: item.deadline || null,
      closure_criteria: item.closure_criteria || null,
      retro_id: item.retro_id || retroId || "",
    };
    store.actions.set(action.id, action);
    created.push(action);

    if (retroId) {
      const retro = store.retros.get(retroId);
      if (retro) {
        retro.actions.push(action.id);
        store.retros.set(retroId, retro);
      }
    }
  }

  return created;
}

export function getActions(): Action[] {
  return Array.from(store.actions.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getActionsByRetro(retroId: string): Action[] {
  return getActions().filter((a) => a.retro_id === retroId);
}

export function getOpenActionsFromPreviousRetros(): Action[] {
  return getActions().filter((a) => a.status !== "closed");
}

export function updateAction(
  id: string,
  updates: Partial<Pick<Action, "status" | "description" | "category" | "inferred_owner" | "deadline" | "closure_criteria" | "risk_score" | "recurring_count">>
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
