export type WorldProgress = {
  worldId: string;
  chapter: number;
  score: number;
  attempts: number;
  completed: boolean;
  lastPlayedAt: string;
};

const KEY = "chateau-world-progress";

export function loadWorldProgress(worldId: string): WorldProgress {
  const fallback: WorldProgress = {
    worldId,
    chapter: 0,
    score: 0,
    attempts: 0,
    completed: false,
    lastPlayedAt: new Date(0).toISOString()
  };

  if (typeof window === "undefined") return fallback;

  try {
    const all = JSON.parse(localStorage.getItem(KEY) || "{}") as Record<string, WorldProgress>;
    return { ...fallback, ...(all[worldId] || {}) };
  } catch {
    return fallback;
  }
}

export function saveWorldProgress(progress: WorldProgress) {
  if (typeof window === "undefined") return;
  try {
    const all = JSON.parse(localStorage.getItem(KEY) || "{}") as Record<string, WorldProgress>;
    all[progress.worldId] = progress;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // Local storage may be blocked; gameplay should continue without crashing.
  }
}
