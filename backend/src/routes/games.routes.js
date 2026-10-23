
import { Router } from "express";
import {
  createGame,
  getGame,
  makeMove,
  undoGameMove,
  resetGameSession,
} from "../controllers/games.controller.js";

const router = Router();

router.post("/", createGame);
router.get("/:id", getGame);
router.post("/:id/moves", makeMove);
router.post("/:id/undo", undoGameMove);
router.post("/:id/reset", resetGameSession);

export default router;
