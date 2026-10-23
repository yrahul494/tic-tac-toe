
import * as gameService from "../services/game.service.js";


export function createGame(req, res, next) {
  try {
    const { mode = "TwoPlayer" } = req.body;
    const game = gameService.createGame(mode);

    res.status(201).json(game);
  } catch (error) {
    next(error);
  }
}

export function getGame(req, res, next) {
  try {
    res.json(gameService.getGameState(req.params.id));
  } catch (error) {
    next(error);
  }
}

export function makeMove(req, res, next) {
  try {
    const { player, index } = req.body;

    res.json(
      gameService.makeMove(req.params.id, player, index)
    );
  } catch (error) {
    next(error);
  }
}
export function undoGameMove(req, res, next) {
  try {
    const game = gameService.undoMove(req.params.id);
    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
}
export function resetGameSession(req, res, next) {
  try {
    const game = gameService.resetGame(req.params.id);
    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
}