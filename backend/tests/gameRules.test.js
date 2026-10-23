
import test from "node:test";
import assert from "node:assert/strict";
import {
  getWinningCells,
  getGameStatus,
} from "../src/utils/gameRules.js";

test("detects a row win for X", () => {
  const board = [
    "X", "X", "X",
    "O", "O", null,
    null, null, null,
  ];

  assert.deepEqual(getWinningCells(board), [0, 1, 2]);

  assert.deepEqual(getGameStatus(board), {
    status: "Won",
    winner: "X",
    winningCells: [0, 1, 2],
  });
});

test("detects a column win for O", () => {
  const board = [
    "O", "X", null,
    "O", "X", "X",
    "O", null, null,
  ];

  assert.deepEqual(getWinningCells(board), [0, 3, 6]);

  assert.equal(getGameStatus(board).winner, "O");
});

test("detects a diagonal win", () => {
  const board = [
    "X", "O", "O",
    null, "X", null,
    "O", null, "X",
  ];

  assert.deepEqual(getWinningCells(board), [0, 4, 8]);
});

test("detects a draw", () => {
  const board = [
    "X", "O", "X",
    "X", "O", "O",
    "O", "X", "X",
  ];

  assert.deepEqual(getGameStatus(board), {
    status: "Draw",
    winner: null,
    winningCells: [],
  });
});

test("returns InProgress for an unfinished board", () => {
  const board = [
    "X", null, null,
    null, "O", null,
    null, null, null,
  ];

  assert.deepEqual(getGameStatus(board), {
    status: "InProgress",
    winner: null,
    winningCells: [],
  });
});
