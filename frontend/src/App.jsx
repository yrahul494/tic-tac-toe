
import { useState } from "react";
import {
  createGame,
  makeMove,
  undoMove,
  resetGame,
  resetScoreboard,
} from "./services/gameApi";

import Board from "./components/Board";
import GameControls from "./components/GameControls";
import GameStatus from "./components/GameStatus";
import MoveHistory from "./components/MoveHistory";
import Scoreboard from "./components/Scoreboard";

import "./App.css";

function App() {
  const [game, setGame] = useState(null);
  const [mode, setMode] = useState("TwoPlayer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startGame(selectedMode = mode) {
    try {
      setLoading(true);
      setError("");

      const newGame = await createGame(selectedMode);

      setGame(newGame);
      setMode(selectedMode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCellClick(index) {
    if (!game || game.status !== "InProgress" || loading) return;
    if (game.board[index] !== null) return;

    try {
      setLoading(true);
      setError("");

      const updatedGame = await makeMove(
        game.id,
        game.currentPlayer,
        index
      );

      setGame(updatedGame);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUndo() {
    if (!game || loading) return;

    try {
      setLoading(true);
      setError("");

      const updatedGame = await undoMove(game.id);

      setGame(updatedGame);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetScoreboard() {
    try {
      setLoading(true);
      setError("");

      await resetScoreboard();
      const newGame = await createGame(mode);

      setGame(newGame);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
async function handleNewGame() {
  if (!game) {
    await startGame(mode);
    return;
  }

  try {
    setLoading(true);
    setError("");

    const newGame = await resetGame(game.id);
    setGame(newGame);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
  const canUndo =
    game?.status === "InProgress" && game.moveHistory.length > 0;

  return (
    <main className="app">
      <h1>Tic Tac Toe</h1>

      <GameControls
        mode={mode}
        onModeChange={startGame}
        onUndo={handleUndo}
        onNewGame={handleNewGame}
        onResetScoreboard={handleResetScoreboard}
        loading={loading}
        canUndo={canUndo}
      />

      <GameStatus game={game} error={error} loading={loading} />

      {game && (
        <>
          <Board
            game={game}
            onCellClick={handleCellClick}
            loading={loading}
          />

          <Scoreboard scoreboard={game.scoreboard} />

          <MoveHistory moves={game.moveHistory} />
        </>
      )}
    </main>
  );
}

export default App;
