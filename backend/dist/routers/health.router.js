import express from "express";
import { resisterHealthRecordHandler, getHealthRecordsHandler, getAlertLogHandler, updateAlertLogHandler, getEmployeeListHandler, } from "../controllers/health.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();
// 体調記録
router.post("/resister", authMiddleware, resisterHealthRecordHandler);
// 体調データ取得
router.get("/getHealthRecords", authMiddleware, getHealthRecordsHandler);
// アラートが出ている従業員情報を取得
router.get("/getAlertLog", authMiddleware, getAlertLogHandler);
// アラートが出ている従業員情報を更新
router.put("/updateAlertLog", authMiddleware, updateAlertLogHandler);
// 全従業員のリストを取得
router.get("/employees", authMiddleware, getEmployeeListHandler);
export default router;
