import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// JWTの署名に使う秘密鍵（.env から読み込む）
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";


// JWTの中に入れる情報の型
export type JwtPayload = {
  id: number;
  role: "EMPLOYEE" | "OWNER";
};

// 認証後に req.user を使いたいので Request を拡張した型
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.access_token; // CookieからJWTトークンを取り出す

  if (!token) {
    return res.status(401).json({ message: "未ログインです" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verify error:", err);
    return res.status(401).json({ message: "トークンが無効です" });
  }
}