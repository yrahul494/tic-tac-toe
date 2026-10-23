
function Cell({ value, isWinning, onClick, disabled, index }) {
  return (
    <button
      type="button"
      className={`cell ${isWinning ? "winning-cell" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Cell ${index + 1}${value ? `: ${value}` : ""}`}
    >
      {value}
    </button>
  );
}

export default Cell;
