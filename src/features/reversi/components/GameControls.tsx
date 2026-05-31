"use client";

import React from "react";
import styles from "./GameControls.module.css";

type GameControlsProps = {
  isPlaying: boolean;
  onReset: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
};

export const GameControls: React.FC<GameControlsProps> = ({ 
  isPlaying,
  onReset, 
  onOpenSettings,
  onOpenStats 
}) => {
  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={onOpenStats}
        aria-label="View Stats"
      >
        <svg
          className={styles.icon}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h2v8H3zM9 9h2v12H9zM15 5h2v16h-2zM21 11h2v10h-2z" />
        </svg>
        <span>成績</span>
      </button>

      <button
        className={`${styles.button} ${isPlaying ? styles.disabled : ""}`}
        onClick={onOpenSettings}
        aria-label="Start Match"
        disabled={isPlaying}
      >
        <svg
          className={styles.icon}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>対局開始</span>
      </button>

      <button
        className={styles.button}
        onClick={onReset}
        aria-label="Reset the game"
      >
        <svg
          className={styles.resetIcon}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3"
          />
        </svg>
        <span>リセット</span>
      </button>
    </div>
  );
};
