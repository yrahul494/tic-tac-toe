
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

export function getWinningCells(board) {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;

    if (
      board[a] !== null &&
      board[a] === board[b] &&
      board[b] === board[c]
    ) {
      return combination;
    }
  }

  return [];
}

export function getGameStatus(board) {
  const winningCells = getWinningCells(board);

  if (winningCells.length > 0) {
    return {
      status: "Won",
      winner: board[winningCells[0]],
      winningCells,
    };
  }

  if (board.every((cell) => cell !== null)) {
    return {
      status: "Draw",
      winner: null,
      winningCells: [],
    };
  }

  return {
    status: "InProgress",
    winner: null,
    winningCells: [],
  };
}
