
function Scoreboard({ scoreboard }) {
  return (
    <section className="scoreboard">
      <h2>Scoreboard</h2>

      <div className="scoreboard-stats">
        <p>
          <span>X wins</span>
          <strong>{scoreboard.xWins}</strong>
        </p>

        <p>
          <span>O wins</span>
          <strong>{scoreboard.oWins}</strong>
        </p>

        <p>
          <span>Draws</span>
          <strong>{scoreboard.draws}</strong>
        </p>
      </div>
    </section>
  );
}

export default Scoreboard;
