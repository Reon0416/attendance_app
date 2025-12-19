import express from "express";
import { loginHandler, meHandler, logoutHandler } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();
// ログイン
router.post("/login", loginHandler);
// ログイン中ユーザー情報
router.get("/me", authMiddleware, meHandler);
// ログアウト
router.post("/logout", authMiddleware, logoutHandler);
export default router;
