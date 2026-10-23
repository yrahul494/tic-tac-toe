
function GameControls({
  mode,
  onModeChange,
  onUndo,
  onNewGame,
  onResetScoreboard,
  loading,
  canUndo,
}) {
  return (
    <>
      <div className="mode-controls">
        <button
          onClick={() => onModeChange("TwoPlayer")}
          disabled={loading}
        >
          Two Players
        </button>

        <button
          onClick={() => onModeChange("Computer")}
          disabled={loading}
        >
          Play vs Computer
        </button>
      </div>

      <div className="game-controls">
        <button onClick={onUndo} disabled={loading || !canUndo}>
          Undo
        </button>

        <button onClick={onNewGame} disabled={loading}>
          New Game
        </button>
      </div>

      <button
        className="reset-scoreboard"
        onClick={onResetScoreboard}
        disabled={loading}
      >
        Reset Scoreboard
      </button>
    </>
  );
}

export default GameControls;
