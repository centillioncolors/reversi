import { describe, it, expect } from "vitest";
import {
  getOpponent,
  getFlippablePositionsInDirection,
  getFlippablePositions,
  isValidMove,
  getValidMoves,
} from "../rules";
import { createInitialBoard } from "../board";
import { DIRECTIONS } from "../../constants/directions";

describe("rules logic", () => {
  it("should return the correct opponent", () => {
    expect(getOpponent("black")).toBe("white");
    expect(getOpponent("white")).toBe("black");
  });

  it("should calculate flippable positions in a single direction", () => {
    const board = createInitialBoard();
    // Initial board has:
    // [3][3] = white, [3][4] = black
    // [4][3] = black, [4][4] = white
    // If black places at [2][3] (row 2, col 3), it should flip [3][3] (white) in the Down direction.
    const downDir = DIRECTIONS.find((d) => d.rowDelta === 1 && d.colDelta === 0)!;
    const flips = getFlippablePositionsInDirection(
      board,
      { row: 2, col: 3 },
      "black",
      downDir
    );

    expect(flips).toEqual([{ row: 3, col: 3 }]);
  });

  it("should identify valid moves on initial board for black", () => {
    const board = createInitialBoard();
    const validMoves = getValidMoves(board, "black");

    // Black should have 4 valid moves initially: [2][3], [3][2], [4][5], [5][4]
    expect(validMoves.length).toBe(4);
    expect(validMoves).toContainEqual({ row: 2, col: 3 });
    expect(validMoves).toContainEqual({ row: 3, col: 2 });
    expect(validMoves).toContainEqual({ row: 4, col: 5 });
    expect(validMoves).toContainEqual({ row: 5, col: 4 });
  });

  it("should identify valid moves on initial board for white", () => {
    const board = createInitialBoard();
    const validMoves = getValidMoves(board, "white");

    // White should have 4 valid moves initially: [2][4], [3][5], [4][2], [5][3]
    expect(validMoves.length).toBe(4);
    expect(validMoves).toContainEqual({ row: 2, col: 4 });
    expect(validMoves).toContainEqual({ row: 3, col: 5 });
    expect(validMoves).toContainEqual({ row: 4, col: 2 });
    expect(validMoves).toContainEqual({ row: 5, col: 3 });
  });

  it("should return false for invalid moves", () => {
    const board = createInitialBoard();

    // Already occupied cell
    expect(isValidMove(board, { row: 3, col: 3 }, "black")).toBe(false);

    // Empty cell but no stones flipped
    expect(isValidMove(board, { row: 0, col: 0 }, "black")).toBe(false);

    // Outside board
    expect(isValidMove(board, { row: -1, col: 0 }, "black")).toBe(false);
  });
});
