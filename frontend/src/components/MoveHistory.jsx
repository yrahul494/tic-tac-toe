
function MoveHistory({ moves }) {
  return (
    <section className="history">
      <h2>Move History</h2>

      {moves.length === 0 ? (
        <p>No moves yet.</p>
      ) : (
        <ol>
          {moves.map((move) => (
            <li key={`${move.moveNumber}-${move.player}-${move.index}`}>
              {move.player} — Row {move.row}, Column {move.column}
              {move.source === "Computer" && " (Computer)"}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default MoveHistory;
