import { useReducer, useMemo } from "react";
import { Position, Score } from "../types/reversi";
import { gameReducer } from "../state/gameReducer";
import { createInitialGameState } from "../logic/game";
import { calculateScore } from "../logic/scoring";

/**
 * Custom React hook that exposes the game state, calculated score,
 * and dispatching functions to place a stone or reset the game.
 */
export function useReversiGame() {
  const [gameState, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialGameState
  );

  // Memoize score calculation based on the board state
  const score: Score = useMemo(() => {
    return calculateScore(gameState.board);
  }, [gameState.board]);

  const placeStone = (position: Position) => {
    dispatch({ type: "PLACE_STONE", payload: { position } });
  };

  const resetGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  return {
    gameState,
    score,
    placeStone,
    resetGame,
  };
}
