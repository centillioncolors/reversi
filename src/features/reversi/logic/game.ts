import { Board, GameState, Position, Stone, GameStatus } from "../types/reversi";
import { createInitialBoard, cloneBoard } from "./board";
import { getOpponent, getValidMoves, getFlippablePositions } from "./rules";
import { calculateScore, determineWinner } from "./scoring";

/**
 * Creates the initial game state.
 */
export function createInitialGameState(): GameState {
  const board = createInitialBoard();

  return {
    board,
    currentPlayer: "black",
    status: "idle",
    winner: null,
    lastMove: null,
    validMoves: getValidMoves(board, "black"),
    moveHistory: [],
    passMessage: null,
  };
}

/**
 * Checks if the specified player has at least one valid move.
 */
export function hasAnyValidMove(board: Board, player: Stone): boolean {
  return getValidMoves(board, player).length > 0;
}

/**
 * Checks if the game is over.
 * The game is over when neither player has any valid moves.
 */
export function isGameOver(board: Board): boolean {
  return !hasAnyValidMove(board, "black") && !hasAnyValidMove(board, "white");
}

/**
 * Applies a move to the game state. Returns a new game state.
 * If the move is invalid or the game is already finished, it returns the state unchanged.
 */
export function applyMove(gameState: GameState, position: Position): GameState {
  // 1. If the game is not playing (e.g. idle or finished), return the current state
  if (gameState.status !== "playing") {
    return gameState;
  }

  // 2. If the move is not valid, return the current state
  const isValid = gameState.validMoves.some(
    (m) => m.row === position.row && m.col === position.col
  );
  if (!isValid) {
    return gameState;
  }

  const player = gameState.currentPlayer;
  const opponent = getOpponent(player);

  // 3. Get flippable positions
  const flippable = getFlippablePositions(gameState.board, position, player);

  // 4. Clone the board
  const newBoard = cloneBoard(gameState.board);

  // 5. Place the stone
  newBoard[position.row][position.col] = player;

  // 6. Flip the stones
  for (const flipPos of flippable) {
    newBoard[flipPos.row][flipPos.col] = player;
  }

  // Determine next turn status
  let nextPlayer: Stone = opponent;
  let nextStatus: GameStatus = gameState.status;
  let nextWinner = gameState.winner;
  let nextValidMoves = getValidMoves(newBoard, opponent);
  let nextPassMessage: string | null = null;

  // 7. Check if opponent has moves
  if (nextValidMoves.length > 0) {
    // Normal turn switch, clear any pass message
    nextPlayer = opponent;
  } else {
    // Opponent has no moves, check if current player can move
    const currentPlayerMoves = getValidMoves(newBoard, player);

    if (currentPlayerMoves.length > 0) {
      // Opponent passes, current player gets another turn
      nextPlayer = player;
      nextValidMoves = currentPlayerMoves;
      nextPassMessage =
        opponent === "white"
          ? "白は置ける場所がないためパスしました"
          : "黒は置ける場所がないためパスしました";
    } else {
      // Neither player has moves, game is finished
      nextStatus = "finished";
      nextValidMoves = [];
      const score = calculateScore(newBoard);
      nextWinner = determineWinner(score);
      nextPassMessage = null;
    }
  }

  // 8. Record the move
  const moveRecord = {
    player,
    position,
    flippedPositions: flippable,
    boardBefore: cloneBoard(gameState.board),
    boardAfter: cloneBoard(newBoard),
  };

  return {
    board: newBoard,
    currentPlayer: nextPlayer,
    status: nextStatus,
    winner: nextWinner,
    lastMove: position,
    validMoves: nextValidMoves,
    moveHistory: [...gameState.moveHistory, moveRecord],
    passMessage: nextPassMessage,
  };
}
