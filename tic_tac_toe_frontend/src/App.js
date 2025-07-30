import React, { useState } from "react";
import "./App.css";

/**
 * Checks for a winner given the current squares state.
 * @param {Array} squares The tic-tac-toe board.
 * @returns {'X' | 'O' | null} Winner mark or null.
 */
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** This is a public function.
      Returns 'X', 'O', or null if there's no winner. */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function isDraw(squares) {
  /** This is a public function. Returns true if the board is full and there's no winner. */
  return squares.every(Boolean) && !calculateWinner(squares);
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /** This is a public function. Renders a single tic-tac-toe square. */
  return (
    <button
      className={`ttt-square ${highlight ? "highlight" : ""}`}
      onClick={onClick}
      aria-label={value ? `Player ${value}` : "Empty square"}
      tabIndex={0}
      disabled={Boolean(value)}
      type="button"
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  /** This is a public function. Renders the 3x3 tic-tac-toe board. */
  return (
    <div className="ttt-board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const idx = row * 3 + col;
            return (
              <Square
                key={idx}
                value={squares[idx]}
                onClick={() => onSquareClick(idx)}
                highlight={winningLine.includes(idx)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function getWinningLine(squares) {
  /** This is a public function. Returns the indices for the winning line, or [] if none. */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return line;
    }
  }
  return [];
}

// PUBLIC_INTERFACE
function App() {
  /** This is the root application for Tic Tac Toe. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  const winner = calculateWinner(squares);
  const draw = isDraw(squares);
  const winningLine = getWinningLine(squares);

  // PUBLIC_INTERFACE
  const handleSquareClick = (idx) => {
    /** Handle user clicking a square */
    if (squares[idx] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext((prev) => !prev);

    // If this move results in a win/draw, update score at next render
    // Will be handled in the effect below
  };

  React.useEffect(() => {
    if (winner) {
      setScore((prev) => ({
        ...prev,
        [winner]: prev[winner] + 1,
      }));
    } else if (draw) {
      setScore((prev) => ({
        ...prev,
        draw: prev.draw + 1,
      }));
    }
    // eslint-disable-next-line
  }, [winner, draw]);

  // PUBLIC_INTERFACE
  const handleReset = () => {
    /** Handler for game board reset */
    setSquares(Array(9).fill(null));
    setXIsNext((prev) =>
      // If just ended and there was a winner, alternate starter for fairness
      winner || draw ? !prev : prev
    );
  };

  // UI strings
  let status;
  if (winner) {
    status = `Winner: Player ${winner}`;
  } else if (draw) {
    status = "It's a draw!";
  } else {
    status = `Next: Player ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="ttt-app-bg">
      <div className="ttt-container">
        <div className="ttt-scoreboard">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <div className="ttt-scores">
            <span className="ttt-score ttt-score-x">
              X&nbsp;
              <span className="ttt-score-number">{score.X}</span>
            </span>
            <span className="ttt-score ttt-score-o">
              O&nbsp;
              <span className="ttt-score-number">{score.O}</span>
            </span>
            <span className="ttt-score ttt-score-draw">
              <span role="img" aria-label="draw">
                🤝
              </span>
              &nbsp;
              <span className="ttt-score-number">{score.draw}</span>
            </span>
          </div>
          <div className="ttt-status" role="status">{status}</div>
        </div>
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />
        <button className="ttt-reset-btn" onClick={handleReset}>
          Reset Game
        </button>
        <footer className="ttt-footer">
          <span className="ttt-footer-brand">
            Minimalistic React Tic Tac Toe &mdash; KAVIA
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
