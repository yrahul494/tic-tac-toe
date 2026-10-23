
import express from "express";
import cors from "cors";

import gamesRouter from "./src/routes/games.routes.js";
import scoreboardRouter from "./src/routes/scoreboard.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/games", gamesRouter);
app.use("/api/scoreboard", scoreboardRouter);

app.use((err, req, res, next) => {
  const statusByMessage = {
    "Game not found": 404,
    "Invalid game mode": 400,
    "Invalid cell index": 400,
    "Not this player's turn": 409,
    "Cell is already occupied": 409,
    "Game is already completed": 409,
    "Computer controls player O": 409,
  };

  const status = statusByMessage[err.message] || 500;

  res.status(status).json({
    error: {
      code: status === 500 ? "INTERNAL_ERROR" : "GAME_ERROR",
      message:
        status === 500
          ? "An unexpected server error occurred."
          : err.message,
    },
  });
});

export default app;
