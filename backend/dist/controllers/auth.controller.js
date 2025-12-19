import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../prismaClient.js";
// JWTの署名に使う秘密鍵（.env から読み込む）
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";
// JWTの有効期限
const JWT_EXPIRES_IN = "1h";
/**
 * POST /api/auth/login
 * ユーザーIDとパスワードを受け取り、認証に成功したらJWTをCookieにセットする
 */
export async function loginHandler(req, res) {
    const { userId, password } = req.body;
    // 入力チェック
    if (!userId || !password) {
        return res
            .status(400)
            .json({ message: "ユーザーIDとパスワードを入力してください" });
    }
    // Userテーブルから userId で検索(findUniqueで一件取得)
    const user = await prisma.user.findUnique({
        where: { userId: userId },
    });
    if (!user) {
        return res
            .status(401)
            .json({ message: "ユーザーIDまたはパスワードが違います" });
    }
    // パスワードチェック（平文 password と DB の passwordHash を比較）
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        return res
            .status(401)
            .json({ message: "ユーザーIDまたはパスワードが違います" });
    }
    // JWTのペイロードを作成
    const payload = {
        id: user.id,
        role: user.role,
    };
    // JWTを署名して発行
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
    // HttpOnly Cookie にJWTをセット
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000, // 1時間（ミリ秒）
    });
    // フロントに返すユーザー情報（トークン本体は返さなくてOK）
    return res.json({
        id: user.id,
        userId: user.userId,
        name: user.name,
        role: user.role,
    });
}
/**
 * GET /api/auth/me
 * 現在ログイン中のユーザー情報を返す
 * （ブラウザに残っているCookieのJWTを検証して使う）
 */
export async function meHandler(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "未ログインです" });
    }
    // JWTのidを使ってDBからユーザーを取り直す
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
    });
    if (!user) {
        return res.status(404).json({ message: "ユーザーが存在しません" });
    }
    return res.json({
        id: user.id,
        userId: user.userId,
        name: user.name,
        role: user.role,
    });
}
/**
 * POST /api/auth/logout
 * Cookieに入っているJWTを削除してログアウトする
 */
export function logoutHandler(req, res) {
    res.clearCookie("access_token");
    return res.json({ message: "ログアウトしました" });
}
