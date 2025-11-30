import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { loginHandler, meHandler, logoutHandler } from "./auth";
import {
  resisterAttendanceHandler,
  getMonthlyAttendanceHandler,
} from "./attendance";
import {
  resisterHealthRecordHandler,
  getHealthRecordsHandler,
} from "./healthCheck";
import { authMiddleware } from "./middlewares/authMiddleware";
import { verifyPasswordMiddleware } from "./middlewares/verifyPasswordMiddleware";
import { updatePasswordHandler, updateUserIdHandler } from "./setting";

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




// 動作確認用
app.get("/", (req, res) => {
  res.send("backend is running");
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
