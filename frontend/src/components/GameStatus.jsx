
function GameStatus({ game, error, loading }) {
  let message = "Choose a game mode to start playing.";
  let messageClass = "";

  if (loading) {
    message = "Loading...";
  } else if (error) {
    message = error;
    messageClass = "error";
  } else if (game?.status === "Won") {
    message = `🎉 ${game.winner} wins!`;
    messageClass = "winner-message";
  } else if (game?.status === "Draw") {
    message = "It's a draw!";
    messageClass = "draw-message";
  } else if (game?.status === "InProgress" && game.mode === "Computer") {
    message = "Your turn (X)";
  } else if (game?.status === "InProgress") {
    message = `Current turn: ${game.currentPlayer}`;
  }

  return (
    <section className="game-status" aria-live="polite">
      {game && (
        <p>
          Mode: {game.mode === "Computer" ? "Player vs Computer" : "Two Players"}
        </p>
      )}
      <p className={messageClass}>{message}</p>
    </section>
  );
}

export default GameStatus;
