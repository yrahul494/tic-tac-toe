
import * as gameService from "../services/game.service.js";

export function getScoreboard(req, res) {
  res.status(200).json(gameService.getScoreboard());
}

export function resetScoreboard(req, res) {
  res.status(200).json(gameService.resetScoreboard());
}
