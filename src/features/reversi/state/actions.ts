import { Position } from "../types/reversi";

export type GameAction =
  | { type: "PLACE_STONE"; payload: { position: Position } }
  | { type: "RESET_GAME" };
