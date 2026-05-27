import { describe, it, expect } from "vitest";
import { calculateScore, determineWinner } from "../scoring";
import { createInitialBoard } from "../board";

describe("scoring logic", () => {
  it("should calculate score on initial board", () => {
    const board = createInitialBoard();
    const score = calculateScore(board);

    expect(score.black).toBe(2);
    expect(score.white).toBe(2);
  });

  it("should calculate custom score correctly", () => {
    const board = createInitialBoard();
    board[0][0] = "black";
    board[0][1] = "black";
    board[0][2] = "white";

    const score = calculateScore(board);
    expect(score.black).toBe(4); // 2 initial + 2 custom
    expect(score.white).toBe(3); // 2 initial + 1 custom
  });

  it("should determine winner correctly", () => {
    expect(determineWinner({ black: 5, white: 3 })).toBe("black");
    expect(determineWinner({ black: 2, white: 4 })).toBe("white");
    expect(determineWinner({ black: 3, white: 3 })).toBe("draw");
  });
});
