import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateStats, DEFAULT_STATS } from "../stats";

describe("stats logic", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("updateStats", () => {
    it("should update CPU wins if human wins", () => {
      // Human is white, winner is white -> Human wins
      const newStats = updateStats(DEFAULT_STATS, "white", "cpu", "hard", "white");
      expect(newStats.cpu.hard.wins).toBe(1);
      expect(newStats.cpu.hard.losses).toBe(0);
    });

    it("should update CPU losses if CPU wins", () => {
      // Human is black, winner is white -> CPU wins
      const newStats = updateStats(DEFAULT_STATS, "white", "cpu", "easy", "black");
      expect(newStats.cpu.easy.wins).toBe(0);
      expect(newStats.cpu.easy.losses).toBe(1);
    });

    it("should update draws for CPU mode", () => {
      const newStats = updateStats(DEFAULT_STATS, "draw", "cpu", "normal", "black");
      expect(newStats.cpu.normal.draws).toBe(1);
    });
  });
});
