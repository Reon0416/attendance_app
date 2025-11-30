import { Response, NextFunction } from "express";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt";
import { AuthRequest } from "../auth";

/**
 * リクエストボディの'currentPassword'がDBに保存されているハッシュと一致するか検証するミドルウェア
 */
export async function verifyPasswordMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "未認証です" });
  }

  const { currentPassword } = req.body;

  if (!currentPassword) {
    return res
      .status(400)
      .json({ message: "現在のパスワードを入力してください" });
  }

  try {
    // ハッシュ化されたパスワードをDBから取得
    const userRecord = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!userRecord || !userRecord.passwordHash) {
      return res.status(500).json({ message: "ユーザー情報に問題があります" });
    }

    // 照合
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      userRecord.passwordHash
    );

    // パスワードが一致しない場合
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "現在のパスワードが正しくありません。" });
    }

    next();
  } catch (error) {
    console.error("Password verification middleware failed:", error);
    return res
      .status(500)
      .json({
        message: "パスワード認証処理中に予期せぬエラーが発生しました。",
      });
  }
}
