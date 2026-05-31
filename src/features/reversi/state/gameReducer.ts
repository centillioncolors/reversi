import { GameState } from "../types/reversi";
import { GameAction } from "./actions";
import { applyMove, createInitialGameState } from "../logic/game";

/**
 * Reducer that delegates state updates to pure game logic functions.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "PLACE_STONE":
      return applyMove(state, action.payload.position);
    case "START_GAME":
      return { ...state, status: "playing" };
    case "RESET_GAME":
      return createInitialGameState();
    default:
      return state;
  }
}
