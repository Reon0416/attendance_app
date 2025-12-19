import express from "express";
import { setGoalHandler, getGoalProgressHandler } from "../controllers/goal.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();
// 目標の設定
router.post("/set", authMiddleware, setGoalHandler);
// 進捗の取得
router.get("/progress", authMiddleware, getGoalProgressHandler);
export default router;
