import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { loginHandler, meHandler, logoutHandler } from "./auth";
import {
  resisterAttendanceHandler,
  getMonthlyAttendanceHandler,
  getLatestAttendanceRecordHandler,
} from "./attendance";
import {
  resisterHealthRecordHandler,
  getHealthRecordsHandler,
  getEmployeeListHandler,
  getAlertLogHandler,
  updateAlertLogHandler,
} from "./healthCheck";
import { setGoalHandler, getGoalProgressHandler } from "./goal";
import { accountRegisterHandler } from "./account";

import { authMiddleware } from "./middlewares/authMiddleware";
import { verifyPasswordMiddleware } from "./middlewares/verifyPasswordMiddleware";
import { updatePasswordHandler, updateRateHandler, updateUserIdHandler } from "./setting";
import { payrollHandler } from "./calculation";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ルーティング‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐

// ログイン
app.post("/api/auth/login", loginHandler);

//アカウント新規作成
app.post("/api/account/create", accountRegisterHandler);

// ログイン中ユーザー情報
app.get("/api/auth/me", authMiddleware, meHandler);

// ログアウト
app.post("/api/auth/logout", authMiddleware, logoutHandler);

// 勤怠情報登録
app.post("/api/attendance/resister", authMiddleware, resisterAttendanceHandler);

//勤怠情報取得
app.get(
  "/api/attendance/getAttendanceHistory",
  authMiddleware,
  getMonthlyAttendanceHandler
);

// 最新の勤怠情報を一件取得
app.get(
  "/api/attendance/getLatestAttendanceHistory",
  authMiddleware,
  getLatestAttendanceRecordHandler
);

// 体調記録
app.post(
  "/api/healthCheck/resister",
  authMiddleware,
  resisterHealthRecordHandler
);

// 体調データ取得
app.get(
  "/api/healthCheck/getHealthRecords",
  authMiddleware,
  getHealthRecordsHandler
);

// アラートが出ている従業員情報を取得
app.get("/api/healthCheck/getAlertLog", authMiddleware, getAlertLogHandler);

// アラートが出ている従業員情報を更新
app.put("/api/healthCheck/updateAlertLog", authMiddleware, updateAlertLogHandler);

// 全従業員のリストを取得
app.get("/api/healthCheck/employees", authMiddleware, getEmployeeListHandler);

// パスワードの更新
app.put(
  "/api/setting/password",
  authMiddleware,
  verifyPasswordMiddleware,
  updatePasswordHandler
);

// ユーザーIDの更新
app.put(
  "/api/setting/userId",
  authMiddleware,
  verifyPasswordMiddleware,
  updateUserIdHandler
);

// 時給の更新
app.put("/api/setting/rate", authMiddleware, updateRateHandler);

// 給与取得
app.get("/api/calculation/payroll", authMiddleware, payrollHandler);

// 目標の設定
app.post("/api/goal/set", authMiddleware, setGoalHandler);

// 進捗の取得
app.get("/api/goal/progress", authMiddleware, getGoalProgressHandler);

// 動作確認用
app.get("/", (req, res) => {
  res.send("backend is running");
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
