"use client";

import React from "react";
import { useReversiGame } from "../hooks/useReversiGame";
import { ReversiBoard } from "./ReversiBoard";
import { GameInfoPanel } from "./GameInfoPanel";
import { GameControls } from "./GameControls";
import { GameResultDialog } from "./GameResultDialog";
import styles from "./ReversiGame.module.css";

export const ReversiGame: React.FC = () => {
  const { gameState, score, placeStone, resetGame } = useReversiGame();
  const { board, validMoves, lastMove, currentPlayer, status, winner, moveHistory, passMessage } = gameState;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>REVERSI</h1>
        <p className={styles.subtitle}>Web Reversi App</p>
      </header>

      {/* 1. Score & Turn Indicator Panel */}
      <GameInfoPanel
        currentPlayer={currentPlayer}
        score={score}
        status={status}
        passMessage={passMessage}
      />

      {/* 2. Reversi 8x8 Board */}
      <ReversiBoard
        board={board}
        validMoves={validMoves}
        lastMove={lastMove}
        currentPlayer={currentPlayer}
        moveHistory={moveHistory}
        onCellClick={placeStone}
      />

      {/* 3. Controls (Reset button) */}
      <GameControls onReset={resetGame} />

      {/* 4. Game Result modal popup */}
      <GameResultDialog
        status={status}
        winner={winner}
        score={score}
        onReset={resetGame}
      />
    </main>
  );
};
