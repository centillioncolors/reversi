import { Board, Score, Winner } from "../types/reversi";
import { BOARD_SIZE } from "../constants/board";

/**
 * Counts the number of black and white stones on the board.
 */
export function calculateScore(board: Board): Score {
  let black = 0;
  let white = 0;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = board[r][c];
      if (cell === "black") {
        black++;
      } else if (cell === "white") {
        white++;
      }
    }
  }

  return { black, white };
}

/**
 * Determines the winner based on the current score.
 */
export function determineWinner(score: Score): Winner {
  if (score.black > score.white) {
    return "black";
  } else if (score.white > score.black) {
    return "white";
  } else {
    return "draw";
  }
}
