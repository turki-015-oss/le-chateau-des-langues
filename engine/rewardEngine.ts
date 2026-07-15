import type { RewardBundle } from "./types";

export function calculateCafeRewards(
  correctAnswers: number,
  totalAnswers: number,
  reputation: number
): RewardBundle {
  const accuracy = totalAnswers > 0 ? correctAnswers / totalAnswers : 0;
  const xp = Math.round(45 + accuracy * 35 + reputation * 0.2);
  const coins = Math.round(8 + accuracy * 8);
  const reputationBonus = accuracy >= 0.8 ? 12 : accuracy >= 0.5 ? 7 : 3;
  return { xp, coins, reputation: reputationBonus };
}

export function calculateStars(correctAnswers: number, totalAnswers: number) {
  const accuracy = totalAnswers > 0 ? correctAnswers / totalAnswers : 0;
  if (accuracy >= 0.9) return 3;
  if (accuracy >= 0.6) return 2;
  return 1;
}