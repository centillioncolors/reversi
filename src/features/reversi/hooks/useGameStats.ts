import { useState, useEffect, useCallback } from "react";
import { GameStats, Winner, GameMode, Difficulty, Stone } from "../types/reversi";
import { DEFAULT_STATS, updateStats as computeUpdatedStats } from "../logic/stats";

const STATS_STORAGE_KEY = "reversi_game_stats";

function loadStats(): GameStats {
  if (typeof window === "undefined") {
    return DEFAULT_STATS;
  }

  try {
    const data = localStorage.getItem(STATS_STORAGE_KEY);
    if (!data) return DEFAULT_STATS;
    
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === "object" && parsed.cpu) {
      return parsed as GameStats;
    }
  } catch (e) {
    console.error("Failed to load game stats", e);
  }
  
  return DEFAULT_STATS;
}

function saveStats(stats: GameStats): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to save game stats", e);
  }
}

export function useGameStats() {
  const [stats, setStats] = useState<GameStats | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(loadStats());
  }, []);

  const recordGameResult = useCallback(
    (winner: Winner, mode: GameMode, difficulty: Difficulty, playerColor: Stone) => {
      setStats((prev) => {
        if (!prev) return prev;
        const newStats = computeUpdatedStats(prev, winner, mode, difficulty, playerColor);
        saveStats(newStats);
        return newStats;
      });
    },
    []
  );
  
  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    saveStats(DEFAULT_STATS);
  }, []);

  return {
    stats,
    recordGameResult,
    resetStats,
  };
}
