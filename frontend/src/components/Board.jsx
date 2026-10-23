
import Cell from "./Cell";

function Board({ game, onCellClick, loading }) {
  return (
    <div className="board">
      {game.board.map((cell, index) => (
        <Cell
          key={index}
          index={index}
          value={cell}
          isWinning={game.winningCells.includes(index)}
          onClick={() => onCellClick(index)}
          disabled={
            loading ||
            game.status !== "InProgress" ||
            cell !== null
          }
        />
      ))}
    </div>
  );
}

export default Board;
