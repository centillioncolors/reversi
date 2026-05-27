export type Stone = "black" | "white";

export type CellState = Stone | null;

export type Position = {
  row: number;
  col: number;
};

export type Direction = {
  rowDelta: number;
  colDelta: number;
};

export type Board = CellState[][];

export type Score = {
  black: number;
  white: number;
};

export type Winner = Stone | "draw" | null;

export type GameStatus = "playing" | "finished";

export type MoveRecord = {
  player: Stone;
  position: Position;
  flippedPositions: Position[];
  boardBefore?: Board;
  boardAfter?: Board;
};

export type GameState = {
  board: Board;
  currentPlayer: Stone;
  status: GameStatus;
  winner: Winner;
  lastMove: Position | null;
  validMoves: Position[];
  moveHistory: MoveRecord[];
  passMessage: string | null;
};
