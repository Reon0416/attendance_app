import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routers/auth.router";
import attendanceRouter from "./routers/attendance.router";
import healthRouter from "./routers/health.router";
import goalRouter from "./routers/goal.router";
import settingRouter from "./routers/setting.router";
import calculationRouter from "./routers/calculation.router";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://attendance-app-0416.vercel.app",
];


app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ルーティング‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐

app.use("/api/auth", authRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/healthCheck", healthRouter);
app.use("/api/setting", settingRouter);
app.use("/api/goal", goalRouter);
app.use("/api/calculation", calculationRouter);

// 動作確認用
app.get("/", (req, res) => {
  res.send("backend is running");
});


// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
