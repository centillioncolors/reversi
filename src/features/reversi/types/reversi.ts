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

export type GameStatus = "idle" | "playing" | "finished";

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

export type GameMode = "pvp" | "cpu";
export type Difficulty = "easy" | "normal" | "hard";

export type GameSettings = {
  mode: GameMode;
  difficulty: Difficulty;
  playerColor: Stone; // Color the human plays when in CPU mode
};

export type StatRecord = {
  wins: number;
  losses: number;
  draws: number;
};

export type GameStats = {
  cpu: {
    easy: StatRecord;
    normal: StatRecord;
    hard: StatRecord;
  };
};
