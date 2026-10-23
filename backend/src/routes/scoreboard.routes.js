
import { Router } from "express";
import {
  getScoreboard,
  resetScoreboard,
} from "../controllers/scoreboard.controller.js";

const router = Router();

router.get("/", getScoreboard);
router.post("/reset", resetScoreboard);

export default router;
