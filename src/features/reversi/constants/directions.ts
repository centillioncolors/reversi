import { Direction } from "../types/reversi";

export const DIRECTIONS: Direction[] = [
  { rowDelta: -1, colDelta: 0 },  // Up
  { rowDelta: 1, colDelta: 0 },   // Down
  { rowDelta: 0, colDelta: -1 },  // Left
  { rowDelta: 0, colDelta: 1 },   // Right
  { rowDelta: -1, colDelta: -1 }, // Up-Left
  { rowDelta: -1, colDelta: 1 },  // Up-Right
  { rowDelta: 1, colDelta: -1 },  // Down-Left
  { rowDelta: 1, colDelta: 1 },   // Down-Right
];
