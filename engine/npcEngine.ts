import type { NpcProfile } from "./types";

export function pickRandomNpc<T extends NpcProfile>(npcs: T[]): T {
  if (!npcs.length) throw new Error("NPC list cannot be empty.");
  return npcs[Math.floor(Math.random() * npcs.length)];
}

export function isOrderMatch(selected: readonly string[], expected: readonly string[]) {
  return [...selected].sort().join("|") === [...expected].sort().join("|");
}