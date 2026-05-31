"use client";

import React from "react";
import { Stone, Score, GameStatus } from "../types/reversi";
import styles from "./GameInfoPanel.module.css";

type GameInfoPanelProps = {
  currentPlayer: Stone;
  score: Score;
  status: GameStatus;
  passMessage: string | null;
  isCpuThinking?: boolean;
};

export const GameInfoPanel: React.FC<GameInfoPanelProps> = ({
  currentPlayer,
  score,
  status,
  passMessage,
  isCpuThinking = false,
}) => {
  const getPlayerName = (stone: Stone) => {
    return stone === "black" ? "黒" : "白";
  };

  return (
    <div className={styles.panel}>
      <div className={styles.mainInfo}>
        {/* Turn indicator */}
        <div className={styles.turnContainer}>
          <div
            className={`${styles.stoneIndicator} ${
              currentPlayer === "black" ? styles.black : styles.white
            }`}
            style={{ opacity: status === "idle" ? 0 : 1 }}
          />
          <span className={styles.turnText}>
            {status === "idle"
              ? "「対局開始」を押してください"
              : status === "playing"
              ? `${getPlayerName(currentPlayer)}の番です`
              : "対局終了"}
          </span>
          {isCpuThinking && (
            <span className={styles.thinkingIndicator}>
              <span className={styles.dot}>.</span>
              <span className={styles.dot}>.</span>
              <span className={styles.dot}>.</span>
            </span>
          )}
        </div>

        {/* Scores */}
        <div className={styles.scoreContainer}>
          <div className={styles.scoreBox} aria-label={`Black stones: ${score.black}`}>
            <div className={`${styles.scoreLabel} ${styles.black}`} />
            <span className={styles.scoreValue}>{score.black}</span>
          </div>
          <div className={styles.scoreBox} aria-label={`White stones: ${score.white}`}>
            <div className={`${styles.scoreLabel} ${styles.white}`} />
            <span className={styles.scoreValue}>{score.white}</span>
          </div>
        </div>
      </div>

      {/* Slide-down notification for Pass */}
      {status === "playing" && passMessage && (
        <div className={styles.passMessageContainer} role="alert">
          <span className={styles.passText}>{passMessage}</span>
        </div>
      )}
    </div>
  );
};
