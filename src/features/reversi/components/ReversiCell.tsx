"use client";

import React from "react";
import { CellState, Position, Stone } from "../types/reversi";
import styles from "./ReversiCell.module.css";

type ReversiCellProps = {
  cellState: CellState;
  position: Position;
  isValidMove: boolean;
  isLastMove: boolean;
  isFlippedByLastMove: boolean;
  currentPlayer: Stone;
  onClick: (position: Position) => void;
};

export const ReversiCell: React.FC<ReversiCellProps> = ({
  cellState,
  position,
  isValidMove,
  isLastMove,
  isFlippedByLastMove,
  currentPlayer,
  onClick,
}) => {
  const handleClick = () => {
    if (isValidMove) {
      onClick(position);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  // Determine which placement animation class to use for newly placed stones
  const getPlacedAnimationClass = () => {
    if (isLastMove && !isFlippedByLastMove) {
      return cellState === "black"
        ? styles.placedAnimationBlack
        : styles.placedAnimationWhite;
    }
    return "";
  };

  return (
    <div
      className={`${styles.cell} ${isValidMove ? styles.clickable : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="gridcell"
      aria-label={`Cell at row ${position.row + 1}, column ${position.col + 1}${
        cellState ? `, occupied by ${cellState}` : isValidMove ? ", valid move available" : ""
      }`}
    >
      {/* 1. Valid move indicator dot */}
      {isValidMove && cellState === null && (
        <div className={styles.validMarker} />
      )}

      {/* 2. Hover preview of placing a stone */}
      {isValidMove && cellState === null && (
        <div
          className={`${styles.previewStone} ${
            currentPlayer === "black" ? styles.previewBlack : styles.previewWhite
          }`}
        />
      )}

      {/* 3. Placed move highlighting and ripple shockwave */}
      {isLastMove && <div className={styles.lastMoveHighlight} />}
      {isLastMove && !isFlippedByLastMove && (
        <div className={styles.placedRipple} />
      )}

      {/* 4. The actual 3D spinning stone */}
      {cellState !== null && (
        <div
          className={`${styles.stone} ${
            cellState === "black" ? styles.black : styles.white
          } ${getPlacedAnimationClass()} ${
            isFlippedByLastMove ? styles.animateFlip : ""
          }`}
        >
          <div className={`${styles.side} ${styles.front}`} />
          <div className={`${styles.side} ${styles.back}`} />
        </div>
      )}
    </div>
  );
};
