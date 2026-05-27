"use client";

import React from "react";
import styles from "./GameControls.module.css";

type GameControlsProps = {
  onReset: () => void;
};

export const GameControls: React.FC<GameControlsProps> = ({ onReset }) => {
  return (
    <div className={styles.container}>
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
        <span>対局をリセット</span>
      </button>
    </div>
  );
};
