import { describe, it, expect } from "vitest";
import { computeAiMove } from "../ai";
import { createInitialGameState } from "../game";
import { Board } from "../../types/reversi";
import { BOARD_SIZE } from "../../constants/board";

describe("ai logic", () => {
  it("should return null if there are no valid moves", () => {
    const gameState = createInitialGameState();
    gameState.validMoves = [];
    const move = computeAiMove(gameState, "easy");
    expect(move).toBeNull();
  });

  it("should return a random valid move for easy difficulty", () => {
    const gameState = createInitialGameState();
    // Valid moves for initial black player: (2,3), (3,2), (4,5), (5,4)
    expect(gameState.validMoves.length).toBeGreaterThan(0);
    const move = computeAiMove(gameState, "easy");
    expect(move).not.toBeNull();
    
    // Ensure the move is one of the valid moves
    const isValid = gameState.validMoves.some(m => m.row === move?.row && m.col === move?.col);
    expect(isValid).toBe(true);
  });

  it("should return the move that flips the most stones for normal difficulty", () => {
    const gameState = createInitialGameState();
    // Create a custom board where one move flips 1 stone and another flips 2 stones
    // Default initial board:
    // W B
    // B W
    // Let's modify it to force a specific greedy move.
    
    const customBoard: Board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
    customBoard[3][3] = "white";
    customBoard[3][4] = "black";
    customBoard[4][3] = "black";
    customBoard[4][4] = "white";
    
    // Setup a scenario where putting black at 3,5 flips 1 white (at 3,4 is black, wait... 3,4 is black, so putting black at 3,5 doesn't flip white).
    // Let's set it up:
    customBoard[3][2] = "black";
    customBoard[3][3] = "white";
    customBoard[3][4] = "white"; // Placing black at 3,5 flips two whites
    
    customBoard[2][3] = "black";
    customBoard[2][4] = "white"; // Placing black at 2,5 flips one white
    
    gameState.board = customBoard;
    gameState.currentPlayer = "black";
    // Manually set valid moves for the test
    gameState.validMoves = [
      { row: 3, col: 5 }, // flips (3,4) and (3,3) -> 2 stones
      { row: 2, col: 5 }  // flips (2,4) -> 1 stone
    ];

    const move = computeAiMove(gameState, "normal");
    expect(move).toEqual({ row: 3, col: 5 });
  });

  it("should favor corners for hard difficulty", () => {
    const gameState = createInitialGameState();
    
    const customBoard: Board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
    customBoard[0][1] = "white";
    customBoard[1][1] = "black"; // Can take corner (0,0) by placing black there if white is at (0,1)? Wait, needs to bound white.
    
    // Let's create a clear situation:
    // B W . (at 0,0 0,1 0,2). If black places at 0,2, flips 0,1.
    // . W .
    // . . B
    
    // Better setup:
    // Corner (0,0) is empty.
    // (0,1) is white.
    // (0,2) is black.
    // Black can place at (0,0) to flip (0,1).
    customBoard[0][2] = "black";
    customBoard[0][1] = "white";
    
    // Another valid move:
    // (4,4) is white
    // (4,5) is black
    // Black can place at (4,3) to flip (4,4).
    customBoard[4][5] = "black";
    customBoard[4][4] = "white";

    gameState.board = customBoard;
    gameState.currentPlayer = "black";
    gameState.validMoves = [
      { row: 0, col: 0 }, // Takes corner! Very high weight.
      { row: 4, col: 3 }  // Normal move.
    ];

    const move = computeAiMove(gameState, "hard");
    expect(move).toEqual({ row: 0, col: 0 }); // Hard AI should recognize corner is the best move
  });
});
