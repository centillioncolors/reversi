import { Board, Position, Stone, Direction } from "../types/reversi";
import { BOARD_SIZE } from "../constants/board";
import { DIRECTIONS } from "../constants/directions";
import { isInsideBoard } from "./board";

/**
 * Returns the opponent stone of the given player.
 */
export function getOpponent(player: Stone): Stone {
  return player === "black" ? "white" : "black";
}

/**
 * Returns the positions of opponent stones that would be flipped in a specific direction
 * if the player places a stone at the given position.
 */
export function getFlippablePositionsInDirection(
  board: Board,
  position: Position,
  player: Stone,
  direction: Direction
): Position[] {
  const flippable: Position[] = [];
  const opponent = getOpponent(player);

  let curRow = position.row + direction.rowDelta;
  let curCol = position.col + direction.colDelta;

  // Traverse in the given direction
  while (isInsideBoard({ row: curRow, col: curCol })) {
    const cell = board[curRow][curCol];
    if (cell === opponent) {
      flippable.push({ row: curRow, col: curCol });
    } else if (cell === player) {
      // If we find our own stone, and we've collected opponent stones, they can be flipped
      return flippable;
    } else {
      // Empty cell terminates the line
      break;
    }
    curRow += direction.rowDelta;
    curCol += direction.colDelta;
  }

  // If we walked off the board or hit an empty cell without being capped by our own stone,
  // we can't flip anything in this direction.
  return [];
}

/**
 * Returns all coordinates on the board that will be flipped if the player places
 * a stone at the given position.
 */
export function getFlippablePositions(
  board: Board,
  position: Position,
  player: Stone
): Position[] {
  // If the cell is not empty, we cannot place a stone here
  if (!isInsideBoard(position) || board[position.row][position.col] !== null) {
    return [];
  }

  const allFlippable: Position[] = [];

  for (const direction of DIRECTIONS) {
    const flippableInDir = getFlippablePositionsInDirection(
      board,
      position,
      player,
      direction
    );
    allFlippable.push(...flippableInDir);
  }

  return allFlippable;
}

/**
 * Checks if the given position is a valid move for the specified player.
 * A move is valid if:
 * 1. The position is inside the board.
 * 2. The target cell is empty.
 * 3. Placing a stone there flips at least one opponent stone.
 */
export function isValidMove(
  board: Board,
  position: Position,
  player: Stone
): boolean {
  if (!isInsideBoard(position)) {
    return false;
  }
  if (board[position.row][position.col] !== null) {
    return false;
  }

  // Check if at least one direction returns a non-empty flippable array
  for (const direction of DIRECTIONS) {
    const flippable = getFlippablePositionsInDirection(
      board,
      position,
      player,
      direction
    );
    if (flippable.length > 0) {
      return true;
    }
  }

  return false;
}

/**
 * Returns all valid moves for the specified player on the current board.
 */
export function getValidMoves(board: Board, player: Stone): Position[] {
  const validMoves: Position[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const position = { row: r, col: c };
      if (isValidMove(board, position, player)) {
        validMoves.push(position);
      }
    }
  }

  return validMoves;
}
