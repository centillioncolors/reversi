import { Position, GameState, Difficulty, Stone, Board } from "../types/reversi";
import { getValidMoves, getFlippablePositions } from "./rules";
import { BOARD_SIZE } from "../constants/board";
import { calculateScore } from "./scoring";

/**
 * Returns a random element from an array.
 */
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Evaluates the board for the given player. Higher is better.
 * Uses a static weight matrix for position evaluation.
 */
function evaluateBoard(board: Board, player: Stone): number {
  let score = 0;
  const opponent = player === "black" ? "white" : "black";

  // Typical Reversi weight matrix
  const weights = [
    [100, -20,  10,   5,   5,  10, -20, 100],
    [-20, -50,  -2,  -2,  -2,  -2, -50, -20],
    [ 10,  -2,  -1,  -1,  -1,  -1,  -2,  10],
    [  5,  -2,  -1,  -1,  -1,  -1,  -2,   5],
    [  5,  -2,  -1,  -1,  -1,  -1,  -2,   5],
    [ 10,  -2,  -1,  -1,  -1,  -1,  -2,  10],
    [-20, -50,  -2,  -2,  -2,  -2, -50, -20],
    [100, -20,  10,   5,   5,  10, -20, 100],
  ];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === player) {
        score += weights[r][c];
      } else if (board[r][c] === opponent) {
        score -= weights[r][c];
      }
    }
  }

  // Add mobility (number of valid moves) as a bonus
  const myMoves = getValidMoves(board, player).length;
  const oppMoves = getValidMoves(board, opponent).length;
  score += (myMoves - oppMoves) * 5;

  return score;
}

/**
 * Applies a move to the board (pure logic for AI simulation).
 */
function simulateMove(board: Board, position: Position, player: Stone): Board {
  // Deep copy the board
  const newBoard: Board = board.map(row => [...row]);
  const flippable = getFlippablePositions(newBoard, position, player);
  
  newBoard[position.row][position.col] = player;
  for (const f of flippable) {
    newBoard[f.row][f.col] = player;
  }
  
  return newBoard;
}

/**
 * Minimax algorithm with alpha-beta pruning.
 */
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  player: Stone,
  opponent: Stone
): number {
  if (depth === 0) {
    return evaluateBoard(board, player);
  }

  const currentPlayer = isMaximizing ? player : opponent;
  const validMoves = getValidMoves(board, currentPlayer);

  if (validMoves.length === 0) {
    // If current player has no moves, check if opponent has moves
    const nextPlayer = isMaximizing ? opponent : player;
    const nextValidMoves = getValidMoves(board, nextPlayer);
    
    if (nextValidMoves.length === 0) {
      // Game over, calculate exact score difference as a huge weight
      const score = calculateScore(board);
      const myScore = player === "black" ? score.black : score.white;
      const oppScore = opponent === "black" ? score.black : score.white;
      return (myScore - oppScore) * 1000; 
    }

    // Pass turn
    return minimax(board, depth - 1, alpha, beta, !isMaximizing, player, opponent);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const nextBoard = simulateMove(board, move, currentPlayer);
      const ev = minimax(nextBoard, depth - 1, alpha, beta, false, player, opponent);
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break; // Beta cutoff
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const nextBoard = simulateMove(board, move, currentPlayer);
      const ev = minimax(nextBoard, depth - 1, alpha, beta, true, player, opponent);
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break; // Alpha cutoff
    }
    return minEval;
  }
}

/**
 * Computes the next move for the AI.
 */
export function computeAiMove(gameState: GameState, difficulty: Difficulty): Position | null {
  const { validMoves, board, currentPlayer } = gameState;
  
  if (validMoves.length === 0) {
    return null;
  }

  if (difficulty === "easy") {
    // Random move
    return getRandomElement(validMoves);
  }

  if (difficulty === "normal") {
    // Greedy: Choose the move that flips the most stones
    let bestMove = validMoves[0];
    let maxFlipped = -1;

    for (const move of validMoves) {
      const flippedCount = getFlippablePositions(board, move, currentPlayer).length;
      if (flippedCount > maxFlipped) {
        maxFlipped = flippedCount;
        bestMove = move;
      }
    }
    return bestMove;
  }

  if (difficulty === "hard") {
    // Minimax with depth 4
    let bestMove = validMoves[0];
    let maxEval = -Infinity;
    const opponent = currentPlayer === "black" ? "white" : "black";

    for (const move of validMoves) {
      const nextBoard = simulateMove(board, move, currentPlayer);
      // Next turn is opponent's (minimizing)
      const ev = minimax(nextBoard, 3, -Infinity, Infinity, false, currentPlayer, opponent);
      
      if (ev > maxEval) {
        maxEval = ev;
        bestMove = move;
      }
    }
    return bestMove;
  }

  const _exhaustiveCheck: never = difficulty;
  return _exhaustiveCheck;
}
