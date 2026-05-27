"use client";

import React from "react";
import { Board, Position, Stone, MoveRecord } from "../types/reversi";
import { ReversiCell } from "./ReversiCell";
import styles from "./ReversiBoard.module.css";
import { BOARD_SIZE } from "../constants/board";

type ReversiBoardProps = {
  board: Board;
  validMoves: Position[];
  lastMove: Position | null;
  currentPlayer: Stone;
  moveHistory: MoveRecord[];
  onCellClick: (position: Position) => void;
};

export const ReversiBoard: React.FC<ReversiBoardProps> = ({
  board,
  validMoves,
  lastMove,
  currentPlayer,
  moveHistory,
  onCellClick,
}) => {
  // Get the flipped coordinates from the very last move to trigger CSS flip animation
  const lastMoveRecord = moveHistory.at(-1);
  const flippedPositions = lastMoveRecord?.flippedPositions ?? [];

  // Generate the cells list
  const cells = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const position = { row: r, col: c };

      const isValid = validMoves.some(
        (m) => m.row === r && m.col === c
      );

      const isLast = lastMove !== null && lastMove.row === r && lastMove.col === c;

      const isFlipped = flippedPositions.some(
        (f) => f.row === r && f.col === c
      );

      cells.push(
        <ReversiCell
          key={`${r}-${c}`}
          cellState={board[r][c]}
          position={position}
          isValidMove={isValid}
          isLastMove={isLast}
          isFlippedByLastMove={isFlipped}
          currentPlayer={currentPlayer}
          onClick={onCellClick}
        />
      );
    }
  }

  return (
    <div className={styles.boardWrapper}>
      <div className={styles.board} role="grid" aria-colcount={8} aria-rowcount={8}>
        {cells}
      </div>
    </div>
  );
};
