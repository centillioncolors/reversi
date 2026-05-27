"use client";

import React from "react";
import { Winner, Score, GameStatus } from "../types/reversi";
import styles from "./GameResultDialog.module.css";

type GameResultDialogProps = {
  status: GameStatus;
  winner: Winner;
  score: Score;
  onReset: () => void;
};

export const GameResultDialog: React.FC<GameResultDialogProps> = ({
  status,
  winner,
  score,
  onReset,
}) => {
  if (status !== "finished") {
    return null;
  }

  const getWinnerMessage = () => {
    if (winner === "black") {
      return "黒の勝ち！";
    }
    if (winner === "white") {
      return "白の勝ち！";
    }
    return "引き分け";
  };

  const getWinnerClass = () => {
    if (winner === "black") {
      return styles.winnerBlack;
    }
    if (winner === "white") {
      return styles.winnerWhite;
    }
    return styles.winnerDraw;
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className={styles.dialog}>
        <h2 id="dialog-title" className={`${styles.title} ${getWinnerClass()}`}>
          {getWinnerMessage()}
        </h2>

        {/* Scores summary */}
        <div className={styles.scoreContainer}>
          <div className={styles.scoreItem}>
            <div className={`${styles.stone} ${styles.black}`} />
            <span className={styles.stoneName}>黒 (Black)</span>
            <span className={styles.stoneCount}>{score.black}</span>
          </div>

          <div className={styles.scoreItem}>
            <div className={`${styles.stone} ${styles.white}`} />
            <span className={styles.stoneName}>白 (White)</span>
            <span className={styles.stoneCount}>{score.white}</span>
          </div>
        </div>

        {/* Restart button */}
        <button className={styles.button} onClick={onReset}>
          もう一度遊ぶ
        </button>
      </div>
    </div>
  );
};
