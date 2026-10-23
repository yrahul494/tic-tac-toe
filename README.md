# Tic Tac Toe — React & Node.js

A browser-based Tic Tac Toe application built with React and Vite, backed by a Node.js and Express REST API. The application supports two-player gameplay, playing against a computer opponent, move history, undo, win and draw detection, and a scoreboard.

## 1. Project Overview

This project implements a 3 × 3 Tic Tac Toe game. The backend manages game sessions, validates moves, determines game results, maintains move history, controls computer moves, and tracks the scoreboard. The React frontend communicates with the backend through REST APIs.

## 2. Technology Stack

- **Frontend:** React 18, Vite, JavaScript, CSS
- **Backend:** Node.js, Express 4
- **API:** REST API with JSON
- **Storage:** In-memory storage
- **Testing:** Node.js built-in test runner
- **Source control:** Git and GitHub

## 3. Features Implemented

- 3 × 3 interactive game board
- Two Player mode
- Play Against Computer mode
- Automatic player-turn switching
- Move validation and occupied-cell protection
- Row, column, and diagonal win detection
- Draw detection
- Highlighting of winning cells and winner message
- Move history with player and cell position
- Undo in Two Player mode
- Undo in Computer mode, removing the latest human/computer move pair
- Scoreboard tracking X wins, O wins, and draws
- Reset Game while preserving the scoreboard
- Reset Scoreboard
- API error handling and validation
- Backend unit tests

### Computer Opponent Strategy

The computer plays as O and follows this priority:

1. Take a winning move if available.
2. Block X from winning on the next move.
3. Take the center if available.
4. Take an available corner.
5. Take any remaining available cell.

## 4. Prerequisites

Install the following before running the application:

- Node.js 20 or newer
- npm

## 5. Installation

Clone the repository and open a terminal in the project root.

Install the root, frontend, and backend dependencies:

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

Optionally, copy `backend/.env.example` to `backend/.env` to configure environment variables for local development.

## 6. Running the Application

### Option A: Run both applications together

From the project root:

```bash
npm run dev
```

### Option B: Run separately

Open two terminals in the project root.

Terminal 1 — Backend:

```bash
npm run dev:backend
```

Terminal 2 — Frontend:

```bash
npm run dev:frontend
```

### Local URLs

- Frontend: http://localhost:5173
- Backend health check: http://localhost:5001/api/health

The backend port may be configured through the environment settings if supported by the current configuration.

## 7. REST API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/games` | Create a new game session |
| GET | `/api/games/:id` | Retrieve the current game state |
| POST | `/api/games/:id/moves` | Submit a player's move |
| POST | `/api/games/:id/undo` | Undo the latest move or move pair |
| POST | `/api/games/:id/reset` | Start a fresh game session |
| GET | `/api/scoreboard` | Retrieve scoreboard totals |
| POST | `/api/scoreboard/reset` | Reset scoreboard totals |
| GET | `/api/health` | Check backend health |

### Move Request

The move endpoint accepts the game ID in the URL and the player and cell index in the request body.

Example:

```json
{
  "player": "X",
  "index": 0
}
```

Cell indices range from `0` to `8`.

### Game State

The game-state response supplies the information needed to render the game, including the game ID, board, current player, mode, status, winner, winning cells, move history, and scoreboard.

### Validation and Errors

The backend validates game IDs, cell indices, occupied cells, player turns, completed games, and computer-controlled moves. Errors return appropriate HTTP status codes and a JSON error message.

## 8. Running Tests

Run the backend unit tests from the project root:

```bash
npm test --prefix backend
```

The tests cover core game rules and service behavior, including game creation, move validation, turn switching, wins, draws, computer moves, undo, reset, and scoreboard behavior.

To build the frontend for production:

```bash
npm run build --prefix frontend
```

## 9. AI-Assisted Development

AI assistance was used during development to help break down the assignment, plan the API structure, implement game logic, develop the frontend, troubleshoot issues, and review test coverage.

The developer should be able to explain the code, validate generated suggestions, and describe any changes made during development.

Examples of prompts used during development:

- "Break down the Tic Tac Toe assignment into functional requirements and implementation phases."
- "Design a Node.js and Express REST API for game sessions, moves, undo, reset, and scoreboard."
- "Implement Tic Tac Toe win detection, draw detection, move validation, and computer move selection."
- "Create unit tests for game rules, service logic, undo behavior, and scoreboard updates."
- "Review the React frontend for API integration and assignment requirement coverage."

## 10. Design Decisions and Assumptions

- **Backend as source of truth:** Game rules, move validation, status, history, and scoreboard are managed by the backend.
- **In-memory storage:** Game sessions and scores are held in memory; no database is required for this assignment.
- **Computer mode:** X is the human player and O is controlled by the computer.
- **Undo after completion:** Undo is disabled after a win or draw, following Option A in the assignment clarification.
- **Reset Game:** A fresh game session is created, while the scoreboard is preserved.
- **Reset Scoreboard:** Scoreboard totals are reset separately from the game session.
- **Cell positions:** The board uses zero-based cell indices in API requests and one-based row/column positions in displayed move history.

## 11. Known Limitations

- Game sessions and scoreboard data are lost when the backend process restarts.
- The application does not use persistent database storage.
- The computer opponent uses a basic priority-based strategy rather than a full minimax algorithm.
- The application is intended for local development and assignment review rather than production deployment.

## 12. Future Improvements

- Add persistent storage using SQLite or PostgreSQL.
- Add frontend component and API integration tests.
- Improve computer decision-making with the minimax algorithm.
- Add automated end-to-end testing.
- Improve accessibility and responsive design.
- Add deployment instructions and production configuration.

## Backend Technology Note

The assignment's technology expectations specify React.js and mention a .NET backend in the problem statement. This implementation uses Node.js and Express for the backend. Confirm that this substitution is acceptable to the reviewer and document the approved stack accurately.

## License

This project was developed as a technical assignment.
