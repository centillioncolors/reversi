import { describe, it, expect } from "vitest";
import { createInitialBoard, cloneBoard, isInsideBoard } from "../board";
import { BOARD_SIZE } from "../../constants/board";

describe("board logic", () => {
  it("should create initial board with 4 center stones", () => {
    const board = createInitialBoard();

    expect(board.length).toBe(BOARD_SIZE);
    expect(board[0].length).toBe(BOARD_SIZE);

    // Initial positions
    expect(board[3][3]).toBe("white");
    expect(board[3][4]).toBe("black");
    expect(board[4][3]).toBe("black");
    expect(board[4][4]).toBe("white");

    // All other positions should be null
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if ((r === 3 || r === 4) && (c === 3 || c === 4)) {
          continue;
        }
        expect(board[r][c]).toBeNull();
      }
    }
  });

  it("should deep clone the board", () => {
    const original = createInitialBoard();
    const cloned = cloneBoard(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned[0]).not.toBe(original[0]);

    // Modifying clone shouldn't affect original
    cloned[0][0] = "black";
    expect(original[0][0]).toBeNull();
  });

  it("should validate board boundaries correctly", () => {
    expect(isInsideBoard({ row: 0, col: 0 })).toBe(true);
    expect(isInsideBoard({ row: 7, col: 7 })).toBe(true);
    expect(isInsideBoard({ row: -1, col: 0 })).toBe(false);
    expect(isInsideBoard({ row: 0, col: -1 })).toBe(false);
    expect(isInsideBoard({ row: 8, col: 0 })).toBe(false);
    expect(isInsideBoard({ row: 0, col: 8 })).toBe(false);
  });
});
