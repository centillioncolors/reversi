import { useReducer, useMemo, useEffect, useState, useCallback } from "react";
import { Position, Score, GameSettings } from "../types/reversi";
import { gameReducer } from "../state/gameReducer";
import { createInitialGameState } from "../logic/game";
import { calculateScore } from "../logic/scoring";
import { computeAiMove } from "../logic/ai";

/**
 * Custom React hook that exposes the game state, calculated score,
 * and dispatching functions to place a stone or reset the game.
 */
export function useReversiGame(settings?: GameSettings) {
  const [gameState, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialGameState
  );

  // CPU思考中の状態
  const [isCpuThinking, setIsCpuThinking] = useState(false);

  // Memoize score calculation based on the board state
  const score: Score = useMemo(() => {
    return calculateScore(gameState.board);
  }, [gameState.board]);

  const placeStone = useCallback((position: Position) => {
    // If game has not started or CPU is thinking, ignore human clicks
    if (gameState.status !== "playing" || isCpuThinking) return;
    dispatch({ type: "PLACE_STONE", payload: { position } });
  }, [gameState.status, isCpuThinking]);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  // CPUの自動プレイを監視する副作用
  useEffect(() => {
    if (!settings) return;
    
    const { mode, difficulty, playerColor } = settings;
    const { currentPlayer, status, validMoves } = gameState;

    // ゲーム未開始時、ゲーム終了時、PvP時は何もしない
    if (status !== "playing" || mode === "pvp") return;

    // 現在のターンがCPU（人間の担当色以外）であるか判定
    const isCpuTurn = currentPlayer !== playerColor;

    if (isCpuTurn && validMoves.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCpuThinking(true);
      
      // ユーザーが状況を認識できるよう、意図的な遅延（思考時間）を入れる
      const thinkTimeMs = 600; 
      
      const timerId = setTimeout(() => {
        const aiMove = computeAiMove(gameState, difficulty);
        if (aiMove) {
          dispatch({ type: "PLACE_STONE", payload: { position: aiMove } });
        }
        setIsCpuThinking(false);
      }, thinkTimeMs);

      return () => {
        clearTimeout(timerId);
        setIsCpuThinking(false);
      };
    }
  }, [gameState, settings]);

  return {
    gameState,
    score,
    placeStone,
    resetGame,
    startGame,
    isCpuThinking,
  };
}
