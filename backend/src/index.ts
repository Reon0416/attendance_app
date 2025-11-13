import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { loginHandler, authMiddleware, meHandler, logoutHandler } from "./auth.js";
import { resisterAttendanceHandler } from "./attendance.js";

const app = express();
const PORT = process.env.PORT

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
app.post("api/attendance/resister", authMiddleware, resisterAttendanceHandler);




// 動作確認用
app.get("/", (req, res) => {
  res.send("backend is running");
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});