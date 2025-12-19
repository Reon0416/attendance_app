import express from "express";
import { payrollHandler } from "../controllers/calculation.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();
// 給与取得
router.get("/payroll", authMiddleware, payrollHandler);
export default router;
