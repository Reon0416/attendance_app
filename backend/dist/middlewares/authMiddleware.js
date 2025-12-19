import jwt from "jsonwebtoken";
// JWTの署名に使う秘密鍵
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";
export function authMiddleware(req, res, next) {
    const token = req.cookies.access_token; // CookieからJWTトークンを取り出す
    if (!token) {
        return res.status(401).json({ message: "未ログインです" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error("JWT verify error:", err);
        return res.status(401).json({ message: "トークンが無効です" });
    }
}
