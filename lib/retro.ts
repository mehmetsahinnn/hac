// Client-side retro store. Anonymous, no AI.
// Persists boards in the browser via localStorage, with a stable per-browser
// user id so we can tell "my cards" from other people's cards.

export type TemplateId =
  | "start-stop-continue"
  | "mad-sad-glad"
  | "liked-learned-lacked";

export type Accent = "fern" | "ember" | "cobalt" | "amber" | "saffron";

export interface ColumnDef {
  id: string;
  title: string;
  prompt: string;
  accent: Accent;
}

export interface TemplateDef {
  id: TemplateId;
  name: string;
  tagline: string;
  columns: ColumnDef[];
}

export const TEMPLATES: TemplateDef[] = [
  {
    id: "start-stop-continue",
    name: "Start / Stop / Continue",
    tagline: "Focus on concrete behaviours to change.",
    columns: [
      { id: "start", title: "Start", prompt: "Things the team should try. Experiments, process improvements, good habits.", accent: "fern" },
      { id: "stop", title: "Stop", prompt: "Things the team should stop doing. Inefficiencies, time wasters, bad habits.", accent: "ember" },
      { id: "continue", title: "Continue", prompt: "Things that worked well but are not yet habits or part of the process.", accent: "cobalt" },
    ],
  },
  {
    id: "mad-sad-glad",
    name: "Mad / Sad / Glad",
    tagline: "Surface how the team felt this sprint.",
    columns: [
      { id: "mad", title: "Mad", prompt: "Things that frustrated or angered the team.", accent: "ember" },
      { id: "sad", title: "Sad", prompt: "Things that disappointed the team.", accent: "cobalt" },
      { id: "glad", title: "Glad", prompt: "Things that made the team happy.", accent: "amber" },
    ],
  },
  {
    id: "liked-learned-lacked",
    name: "Liked / Learned / Lacked",
    tagline: "A balanced look back at the sprint.",
    columns: [
      { id: "liked", title: "Liked", prompt: "What the team enjoyed about this sprint.", accent: "fern" },
      { id: "learned", title: "Learned", prompt: "New things the team learned.", accent: "cobalt" },
      { id: "lacked", title: "Lacked", prompt: "What the team was missing or could improve.", accent: "ember" },
    ],
  },
];

export interface Card {
  id: string;
  columnId: string;
  text: string;
  votes: number;
  createdAt: number;
  authorId: string;
  published: boolean;
}

export interface ActionItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Retro {
  id: string;
  title: string;
  templateId: TemplateId;
  cards: Card[];
  actions: ActionItem[];
  createdAt: number;
  finishedAt?: number;
  revealed?: boolean;
  timerEndsAt?: number | null;
  timerDurationSec?: number;
}

const KEY = "retrotool.retros";

function readAll(): Record<string, Retro> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, Retro>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function uid(prefix: string): string {
  return prefix + Math.random().toString(36).slice(2, 9);
}

// Stable, anonymous per-browser identity used to mark card ownership.
export function getUserId(): string {
  if (typeof window === "undefined") return "anon";
  let id = window.localStorage.getItem("retrotool.uid");
  if (!id) {
    id = "u-" + Math.random().toString(36).slice(2, 10);
    window.localStorage.setItem("retrotool.uid", id);
  }
  return id;
}

export function getTemplate(id: TemplateId): TemplateDef {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}

export function createRetro(templateId: TemplateId): Retro {
  const retro: Retro = {
    id: uid("r-"),
    title: "Untitled retrospective",
    templateId,
    cards: [],
    actions: [],
    createdAt: Date.now(),
    revealed: false,
    timerEndsAt: null,
    timerDurationSec: 300,
  };
  const all = readAll();
  all[retro.id] = retro;
  writeAll(all);
  return retro;
}

export function getRetro(id: string): Retro | null {
  return readAll()[id] || null;
}

export function saveRetro(retro: Retro): void {
  const all = readAll();
  all[retro.id] = retro;
  writeAll(all);
}

export function listRetros(): Retro[] {
  return Object.values(readAll()).sort((a, b) => b.createdAt - a.createdAt);
}

export function deleteRetro(id: string): void {
  const all = readAll();
  delete all[id];
  writeAll(all);
}

export function isPublished(c: Card): boolean {
  // legacy cards (no flag) count as published
  return c.published !== false;
}

export function toMarkdown(retro: Retro): string {
  const tpl = getTemplate(retro.templateId);
  const lines: string[] = [`# ${retro.title}`, ""];
  lines.push(`Template: ${tpl.name}`);
  lines.push(`Date: ${new Date(retro.createdAt).toLocaleDateString()}`, "");
  for (const col of tpl.columns) {
    lines.push(`## ${col.title}`);
    const cards = retro.cards
      .filter((c) => c.columnId === col.id && isPublished(c))
      .sort((a, b) => b.votes - a.votes);
    if (cards.length === 0) lines.push("_No cards._");
    for (const c of cards) lines.push(`- ${c.text} (${c.votes} votes)`);
    lines.push("");
  }
  if (retro.actions.length > 0) {
    lines.push("## Action points");
    for (const a of retro.actions) lines.push(`- [${a.done ? "x" : " "}] ${a.text}`);
    lines.push("");
  }
  return lines.join("\n");
}

// --- Per-user vote budget (anonymous, stored per board in this browser) ---

export const VOTE_LIMIT = 5;

export function getMyVotes(retroId: string): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem("retrotool.votes." + retroId) || "{}");
  } catch {
    return {};
  }
}

export function saveMyVotes(retroId: string, votes: Record<string, number>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("retrotool.votes." + retroId, JSON.stringify(votes));
}

export function votesUsed(votes: Record<string, number>): number {
  return Object.values(votes).reduce((sum, n) => sum + Math.abs(n || 0), 0);
}
