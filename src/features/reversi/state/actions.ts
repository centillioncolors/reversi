import { Position } from "../types/reversi";

export type GameAction =
  | { type: "PLACE_STONE"; payload: { position: Position } }
  | { type: "START_GAME" }
  | { type: "RESET_GAME" };
