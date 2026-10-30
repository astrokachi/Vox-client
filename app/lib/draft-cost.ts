import type { DraftUsage } from "~/types";

// What each action spends from the free allowance. Mirrors the server
// (DRAFTS_PER_PROMPT and refineMessage in x-bot's chat service): a new set asks
// for 3 and gets fewer when fewer are left; a refine uses 1.
export const DRAFT_COST = { set: 3, refine: 1 } as const;

export type DraftAction = keyof typeof DRAFT_COST;

const drafts = (n: number) => `${n} draft${n === 1 ? "" : "s"}`;

// The composer hint: what's left and what the next action will take,
// e.g. "4 drafts left · a new set uses 3".
export const costHint = (usage: DraftUsage, action: DraftAction): string => {
  const left = `${drafts(usage.remaining)} left`;
  if (action === "refine") return `${left} · each refine uses 1`;

  const granted = Math.min(DRAFT_COST.set, usage.remaining);
  return granted < DRAFT_COST.set
    ? `${left} · you'll get ${drafts(granted)}`
    : `${left} · a new set uses ${granted}`;
};
