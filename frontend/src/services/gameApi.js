
const API_BASE_URL = "http://localhost:5001/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Something went wrong");
  }

  return data;
}

export function createGame(mode = "TwoPlayer") {
  return request("/games", {
    method: "POST",
    body: JSON.stringify({ mode }),
  });
}

export function getGame(gameId) {
  return request(`/games/${gameId}`);
}

export function makeMove(gameId, player, index) {
  return request(`/games/${gameId}/moves`, {
    method: "POST",
    body: JSON.stringify({ player, index }),
  });
}

export function undoMove(gameId) {
  return request(`/games/${gameId}/undo`, {
    method: "POST",
  });
}

export function getScoreboard() {
  return request("/scoreboard");
}

export function resetScoreboard() {
  return request("/scoreboard/reset", {
    method: "POST",
  });
}
export function resetGame(gameId) {
  return request(`/games/${gameId}/reset`, {
    method: "POST",
  });
}
// Step 2: Understand the code
// - API_BASE_URL — the address of your backend.
// - request() — a reusable function that sends HTTP requests and handles errors.
// - createGame() — creates a new game in either mode.
// - makeMove() — sends the player's chosen cell to the backend.
// - undoMove() — asks the backend to undo the previous move or move pair.
// - getScoreboard() and resetScoreboard() — retrieve and reset the scores.