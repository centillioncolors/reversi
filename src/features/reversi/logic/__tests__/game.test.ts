import { describe, it, expect } from "vitest";
import { createInitialGameState, applyMove, isGameOver } from "../game";
import { createInitialBoard } from "../board";

describe("game flow logic", () => {
  it("should create correct initial game state", () => {
    const state = createInitialGameState();

    expect(state.currentPlayer).toBe("black");
    expect(state.status).toBe("playing");
    expect(state.winner).toBeNull();
    expect(state.lastMove).toBeNull();
    expect(state.moveHistory.length).toBe(0);
    expect(state.passMessage).toBeNull();
    expect(state.validMoves.length).toBe(4);
  });

  it("should apply valid move and transition turn", () => {
    const state = createInitialGameState();
    // Black places at [2][3]
    const nextState = applyMove(state, { row: 2, col: 3 });

    expect(nextState.board[2][3]).toBe("black");
    expect(nextState.board[3][3]).toBe("black"); // flipped from white to black
    expect(nextState.currentPlayer).toBe("white");
    expect(nextState.lastMove).toEqual({ row: 2, col: 3 });
    expect(nextState.moveHistory.length).toBe(1);
    expect(nextState.moveHistory[0].flippedPositions).toEqual([{ row: 3, col: 3 }]);
    expect(nextState.passMessage).toBeNull();
  });

  it("should ignore invalid move and return same state reference", () => {
    const state = createInitialGameState();
    // Invalid cell [0][0]
    const nextState = applyMove(state, { row: 0, col: 0 });

    expect(nextState).toBe(state);
  });

  it("should finish the game when a move wipes out the opponent", () => {
    const mockState = {
      board: [
        ["black", "white", null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
      ],
      currentPlayer: "black" as const,
      status: "playing" as const,
      winner: null,
      lastMove: null,
      validMoves: [{ row: 0, col: 2 }],
      moveHistory: [],
      passMessage: null,
    };
    
    const finishedState = applyMove(mockState, { row: 0, col: 2 });
    expect(finishedState.status).toBe("finished");
    expect(finishedState.winner).toBe("black");
  });

  it("should trigger pass message when opponent has no moves but current player does", () => {
    // Construct a board where:
    // - Black plays at [0][2] and flips [0][1] (white) to black.
    // - White still has an isolated stone at [7][6].
    // - Only other empty cell is [7][7].
    // After Black's move, White has no valid moves at [7][7], but Black can play [7][7] to sandwich [7][6].
    const board = Array.from({ length: 8 }, () => Array(8).fill("black"));
    board[0][1] = "white";
    board[0][2] = null;
    board[7][6] = "white";
    board[7][7] = null;

    const mockState = {
      board,
      currentPlayer: "black" as const,
      status: "playing" as const,
      winner: null,
      lastMove: null,
      validMoves: [{ row: 0, col: 2 }],
      moveHistory: [],
      passMessage: null,
    };

    const nextState = applyMove(mockState, { row: 0, col: 2 });

    expect(nextState.status).toBe("playing");
    expect(nextState.currentPlayer).toBe("black"); // Turn remains black (white passed)
    expect(nextState.passMessage).toBe("白は置ける場所がないためパスしました");
    expect(nextState.validMoves).toEqual([{ row: 7, col: 7 }]);
  });
});
