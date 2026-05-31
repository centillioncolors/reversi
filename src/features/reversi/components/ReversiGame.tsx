"use client";

import React, { useState, useEffect } from "react";
import { useReversiGame } from "../hooks/useReversiGame";
import { useGameSettings } from "../hooks/useGameSettings";
import { useGameStats } from "../hooks/useGameStats";
import { ReversiBoard } from "./ReversiBoard";
import { GameInfoPanel } from "./GameInfoPanel";
import { GameControls } from "./GameControls";
import { GameResultDialog } from "./GameResultDialog";
import { GameSettingsDialog } from "./GameSettingsDialog";
import { GameStatsDialog } from "./GameStatsDialog";
import { ConfirmDialog } from "./ConfirmDialog";
import styles from "./ReversiGame.module.css";

export const ReversiGame: React.FC = () => {
  const { settings, updateSettings, isLoaded } = useGameSettings();
  const { stats, recordGameResult } = useGameStats();
  const { gameState, score, placeStone, resetGame, startGame, isCpuThinking } = useReversiGame(settings);
  const { board, validMoves, lastMove, currentPlayer, status, winner, moveHistory, passMessage } = gameState;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  // Record stats when game finishes
  useEffect(() => {
    if (status === "finished" && winner !== null && !hasRecorded && isLoaded) {
      recordGameResult(winner, settings.mode, settings.difficulty, settings.playerColor);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasRecorded(true);
    } else if (status !== "finished") {
      setHasRecorded(false);
    }
  }, [status, winner, settings, isLoaded, hasRecorded, recordGameResult]);

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
        isCpuThinking={isCpuThinking}
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

      {/* 3. Controls */}
      <GameControls 
        isPlaying={status === "playing"}
        onReset={() => setIsResetConfirmOpen(true)} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      {/* 4. Dialogs */}
      <GameResultDialog
        status={status}
        winner={winner}
        score={score}
        onReset={resetGame}
      />

      {isLoaded && (
        <GameSettingsDialog
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentSettings={settings}
          onSave={updateSettings}
          onStartGame={startGame}
        />
      )}

      <GameStatsDialog
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        message="現在の対局をリセットして対局開始画面に戻りますか？"
        onConfirm={() => {
          resetGame();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </main>
  );
};
