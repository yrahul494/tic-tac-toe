
import { randomUUID } from "node:crypto";
import { getGameStatus } from "../utils/gameRules.js";

const games = new Map();

const scoreboard = {
  xWins: 0,
  oWins: 0,
  draws: 0,
};

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createGame(mode = "TwoPlayer") {
  if (!["TwoPlayer", "Computer"].includes(mode)) {
    throw new Error("Invalid game mode");
  }

  const game = {
    id: randomUUID(),
    board: Array(9).fill(null),
    currentPlayer: "X",
    mode,
    status: "InProgress",
    winner: null,
    winningCells: [],
    moveHistory: [],
    scoreUpdated: false,
  };

  games.set(game.id, game);

  return getGameState(game.id);
}

export function getGameState(gameId) {
  const game = games.get(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  return {
    ...game,
    board: [...game.board],
    winningCells: [...game.winningCells],
    moveHistory: game.moveHistory.map((move) => ({ ...move })),
    scoreboard: getScoreboard(),
  };
}

export function makeMove(gameId, player, index) {
  const game = games.get(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  if (game.status !== "InProgress") {
    throw new Error("Game is already completed");
  }

  if (game.mode === "Computer" && player === "O") {
    throw new Error("Computer controls player O");
  }

  if (player !== game.currentPlayer) {
    throw new Error("Not this player's turn");
  }

  if (!Number.isInteger(index) || index < 0 || index > 8) {
    throw new Error("Invalid cell index");
  }

  if (game.board[index] !== null) {
    throw new Error("Cell is already occupied");
  }

  recordMove(game, player, index, "Human");
  updateGameStatus(game);

  // In Computer mode, O responds automatically after X.
  if (game.mode === "Computer" && game.status === "InProgress") {
    const computerIndex = chooseComputerMove(game.board);

    recordMove(game, "O", computerIndex, "Computer");
    updateGameStatus(game);
  } else if (game.status === "InProgress") {
    game.currentPlayer = player === "X" ? "O" : "X";
  }

  return getGameState(gameId);
}

function recordMove(game, player, index, source) {
  game.board[index] = player;

  game.moveHistory.push({
    moveNumber: game.moveHistory.length + 1,
    player,
    index,
    row: Math.floor(index / 3) + 1,
    column: (index % 3) + 1,
    source,
  });
}

function chooseComputerMove(board) {
  // 1. Win immediately if O has a winning move.
  const winningMove = findWinningMove(board, "O");
  if (winningMove !== -1) return winningMove;

  // 2. Block X from winning.
  const blockingMove = findWinningMove(board, "X");
  if (blockingMove !== -1) return blockingMove;

  // 3. Take the center.
  if (board[4] === null) return 4;

  // 4. Take an available corner.
  const corners = [0, 2, 6, 8];
  const availableCorner = corners.find((index) => board[index] === null);
  if (availableCorner !== undefined) return availableCorner;

  // 5. Take any remaining available cell.
  return board.findIndex((cell) => cell === null);
}

function findWinningMove(board, player) {
  for (const combination of WINNING_COMBINATIONS) {
    const playerCells = combination.filter(
      (index) => board[index] === player
    );

    const emptyCells = combination.filter(
      (index) => board[index] === null
    );

    if (playerCells.length === 2 && emptyCells.length === 1) {
      return emptyCells[0];
    }
  }

  return -1;
}

function updateGameStatus(game) {
  const result = getGameStatus(game.board);

  game.status = result.status;
  game.winner = result.winner;
  game.winningCells = result.winningCells;

  if (game.status !== "InProgress" && !game.scoreUpdated) {
    if (game.status === "Won") {
      if (game.winner === "X") {
        scoreboard.xWins += 1;
      } else {
        scoreboard.oWins += 1;
      }
    } else if (game.status === "Draw") {
      scoreboard.draws += 1;
    }

    game.scoreUpdated = true;
  }

  if (game.status !== "InProgress") {
    game.currentPlayer = null;
  } else {
    game.currentPlayer = game.mode === "Computer"
      ? "X"
      : game.moveHistory.at(-1)?.player === "X"
        ? "O"
        : "X";
  }
}

export function undoMove(gameId) {
  const game = games.get(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  if (game.status !== "InProgress") {
    throw new Error("Cannot undo a completed game");
  }

  if (game.moveHistory.length === 0) {
    throw new Error("No moves to undo");
  }

  if (game.mode === "Computer") {
    // Remove the computer response first, if present.
    if (game.moveHistory.at(-1)?.source === "Computer") {
      const computerMove = game.moveHistory.pop();
      game.board[computerMove.index] = null;
    }

    // Remove the human move that triggered that response.
    if (game.moveHistory.at(-1)?.player === "X") {
      const humanMove = game.moveHistory.pop();
      game.board[humanMove.index] = null;
    }
  } else {
    const lastMove = game.moveHistory.pop();
    game.board[lastMove.index] = null;
  }

  // Keep move numbers sequential after undo.
  game.moveHistory.forEach((move, index) => {
    move.moveNumber = index + 1;
  });

  game.status = "InProgress";
  game.winner = null;
  game.winningCells = [];
  game.currentPlayer = game.mode === "Computer"
    ? "X"
    : game.moveHistory.length === 0
      ? "X"
      : game.moveHistory.at(-1).player === "X"
        ? "O"
        : "X";

  return getGameState(gameId);
}

export function getScoreboard() {
  return { ...scoreboard };
}

export function resetScoreboard() {
  scoreboard.xWins = 0;
  scoreboard.oWins = 0;
  scoreboard.draws = 0;

  return getScoreboard();
}
export function resetGame(gameId) {
  const game = games.get(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  const mode = game.mode;

  // Remove the old session and create a fresh one.
  games.delete(gameId);

  return createGame(mode);
}