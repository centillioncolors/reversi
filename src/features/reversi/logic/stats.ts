import { GameStats, GameMode, Difficulty, Winner, Stone } from "../types/reversi";

export const DEFAULT_STATS: GameStats = {
  cpu: {
    easy: { wins: 0, losses: 0, draws: 0 },
    normal: { wins: 0, losses: 0, draws: 0 },
    hard: { wins: 0, losses: 0, draws: 0 },
  },
};

/**
 * Updates the stats based on the game result and current settings.
 * For CPU mode, "wins" means the Human player won.
 */
export function updateStats(
  currentStats: GameStats,
  winner: Winner,
  mode: GameMode,
  difficulty: Difficulty,
  playerColor: Stone
): GameStats {
  // Deep clone to avoid mutating state directly
  const newStats: GameStats = JSON.parse(JSON.stringify(currentStats));

  if (mode === "cpu") {
    // CPU Mode: "wins" = Human won. "losses" = CPU won.
    const target = newStats.cpu[difficulty];
    if (winner === "draw") {
      target.draws += 1;
    } else if (winner === playerColor) {
      target.wins += 1; // Human won
    } else {
      target.losses += 1; // CPU won
    }
  }

  return newStats;
}
