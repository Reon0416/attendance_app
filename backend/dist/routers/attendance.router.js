import express from "express";
import { resisterAttendanceHandler, getMonthlyAttendanceHandler, getLatestAttendanceRecordHandler } from "../controllers/attendance.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();
// 勤怠情報登録
router.post("/resister", authMiddleware, resisterAttendanceHandler);
//勤怠情報取得
router.get("/getAttendanceHistory", authMiddleware, getMonthlyAttendanceHandler);
// 最新の勤怠情報を一件取得
router.get("/getLatestAttendanceHistory", authMiddleware, getLatestAttendanceRecordHandler);
export default router;
