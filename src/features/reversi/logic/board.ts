import { Board, Position } from "../types/reversi";
import { BOARD_SIZE } from "../constants/board";

/**
 * Creates a new board initialized for a Reversi game.
 * The center 4 squares are populated as follows:
 * - row 3, col 3: white
 * - row 3, col 4: black
 * - row 4, col 3: black
 * - row 4, col 4: white
 */
export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(null)
  );

  board[3][3] = "white";
  board[3][4] = "black";
  board[4][3] = "black";
  board[4][4] = "white";

  return board;
}

/**
 * Creates a deep copy of the board to allow immutable updates.
 */
export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

/**
 * Checks if the given position is within the bounds of the board.
 */
export function isInsideBoard(position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < BOARD_SIZE &&
    position.col >= 0 &&
    position.col < BOARD_SIZE
  );
}
