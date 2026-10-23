
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  createGame,
  getGameState,
  makeMove,
  undoMove,
  resetGame,
  getScoreboard,
  resetScoreboard,
} from "../src/services/game.service.js";

beforeEach(() => {
  resetScoreboard();
});

test("creates a TwoPlayer game", () => {
  const game = createGame("TwoPlayer");

  assert.equal(game.mode, "TwoPlayer");
  assert.equal(game.currentPlayer, "X");
  assert.equal(game.status, "InProgress");
  assert.deepEqual(game.board, Array(9).fill(null));
});

test("creates a Computer game", () => {
  const game = createGame("Computer");

  assert.equal(game.mode, "Computer");
  assert.equal(game.currentPlayer, "X");
});

test("rejects an invalid game mode", () => {
  assert.throws(() => createGame("Invalid"), {
    message: "Invalid game mode",
  });
});

test("switches turns after a valid TwoPlayer move", () => {
  const game = createGame("TwoPlayer");

  const afterX = makeMove(game.id, "X", 0);
  assert.equal(afterX.currentPlayer, "O");

  const afterO = makeMove(game.id, "O", 4);
  assert.equal(afterO.currentPlayer, "X");
  assert.equal(afterO.moveHistory.length, 2);
});

test("rejects a move on an occupied cell", () => {
  const game = createGame("TwoPlayer");

  makeMove(game.id, "X", 0);

  assert.throws(() => makeMove(game.id, "O", 0), {
    message: "Cell is already occupied",
  });
});

test("rejects an invalid cell index", () => {
  const game = createGame("TwoPlayer");

  assert.throws(() => makeMove(game.id, "X", 9), {
    message: "Invalid cell index",
  });
});

test("computer automatically makes an O move", () => {
  const game = createGame("Computer");

  const result = makeMove(game.id, "X", 0);

  assert.equal(result.board[0], "X");
  assert.equal(result.board[4], "O");
  assert.equal(result.moveHistory.length, 2);
  assert.equal(result.moveHistory[1].source, "Computer");
  assert.equal(result.currentPlayer, "X");
});

test("computer blocks an immediate X win", () => {
  const game = createGame("Computer");

  // X takes the top-left; computer takes the center.
  makeMove(game.id, "X", 0);

  // X takes the top-middle; computer should block top-right.
  const result = makeMove(game.id, "X", 1);

  assert.equal(result.board[2], "O");
  assert.equal(result.status, "InProgress");
});

test("undo removes the latest TwoPlayer move", () => {
  const game = createGame("TwoPlayer");

  makeMove(game.id, "X", 0);
  makeMove(game.id, "O", 4);

  const result = undoMove(game.id);

  assert.equal(result.board[4], null);
  assert.equal(result.board[0], "X");
  assert.equal(result.moveHistory.length, 1);
  assert.equal(result.currentPlayer, "O");
});

test("undo removes the human and computer moves", () => {
  const game = createGame("Computer");

  makeMove(game.id, "X", 0);

  const result = undoMove(game.id);

  assert.deepEqual(result.board, Array(9).fill(null));
  assert.equal(result.moveHistory.length, 0);
  assert.equal(result.currentPlayer, "X");
});

test("detects an X win and updates the scoreboard", () => {
  const game = createGame("TwoPlayer");

  makeMove(game.id, "X", 0);
  makeMove(game.id, "O", 3);
  makeMove(game.id, "X", 1);
  makeMove(game.id, "O", 4);

  const result = makeMove(game.id, "X", 2);

  assert.equal(result.status, "Won");
  assert.equal(result.winner, "X");
  assert.deepEqual(result.winningCells, [0, 1, 2]);
  assert.equal(getScoreboard().xWins, 1);
});

test("rejects moves after a game is completed", () => {
  const game = createGame("TwoPlayer");

  makeMove(game.id, "X", 0);
  makeMove(game.id, "O", 3);
  makeMove(game.id, "X", 1);
  makeMove(game.id, "O", 4);
  makeMove(game.id, "X", 2);

  assert.throws(() => makeMove(game.id, "O", 5), {
    message: "Game is already completed",
  });
});

test("rejects undo when there are no moves", () => {
  const game = createGame("TwoPlayer");

  assert.throws(() => undoMove(game.id), {
    message: "No moves to undo",
  });
});

test("rejects undo after the game is completed", () => {
  const game = createGame("TwoPlayer");

  makeMove(game.id, "X", 0);
  makeMove(game.id, "O", 3);
  makeMove(game.id, "X", 1);
  makeMove(game.id, "O", 4);
  makeMove(game.id, "X", 2);

  assert.throws(() => undoMove(game.id), {
    message: "Cannot undo a completed game",
  });
});

test("throws when the game ID does not exist", () => {
  assert.throws(() => getGameState("unknown-game-id"), {
    message: "Game not found",
  });
});

test("computer takes a winning move when available", () => {
  const game = createGame("Computer");

  makeMove(game.id, "X", 0);
  makeMove(game.id, "X", 1);
  const result = makeMove(game.id, "X", 8);

  assert.equal(result.board[2], "O");
  assert.equal(result.board[4], "O");
  assert.equal(result.board[6], "O");
  assert.equal(result.status, "Won");
  assert.equal(result.winner, "O");
});

test("resetGame creates a fresh session and preserves the scoreboard", () => {
  const game = createGame("TwoPlayer");

  makeMove(game.id, "X", 0);
  const beforeReset = getScoreboard();

  const reset = resetGame(game.id);

  assert.notEqual(reset.id, game.id);
  assert.equal(reset.mode, "TwoPlayer");
  assert.deepEqual(reset.board, Array(9).fill(null));
  assert.equal(reset.currentPlayer, "X");
  assert.equal(reset.status, "InProgress");
  assert.deepEqual(reset.moveHistory, []);
  assert.deepEqual(reset.scoreboard, beforeReset);

  assert.throws(() => getGameState(game.id), {
    message: "Game not found",
  });
});

test("records a draw and increments the draw counter once", () => {
  const game = createGame("TwoPlayer");

  const moves = [
    ["X", 0],
    ["O", 1],
    ["X", 2],
    ["O", 4],
    ["X", 3],
    ["O", 5],
    ["X", 7],
    ["O", 6],
    ["X", 8],
  ];

  let result;

  for (const [player, index] of moves) {
    result = makeMove(game.id, player, index);
  }

  assert.equal(result.status, "Draw");
  assert.equal(result.winner, null);
  assert.equal(result.currentPlayer, null);
  assert.equal(getScoreboard().draws, 1);
});
