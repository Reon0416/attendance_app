import { Response } from "express";
import { prisma } from "./prismaClient";
import bcrypt from "bcrypt";
import { AuthRequest } from "./middlewares/authMiddleware";

// パスワード変更のリクエストボディの型
type PasswordUpdateBody = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

// ユーザーID変更のリクエストボディの型
type UserIdUpdateBody = {
  currentPassword: string;
  newUserId: string;
};

/**
 *  パスワードを新しい値に更新するハンドラー関数
 */
export async function updatePasswordHandler(req: AuthRequest, res: Response) {
  const user = req.user!;

  const { newPassword, newPasswordConfirm } = req.body as PasswordUpdateBody;

  // 新しいパスワードの確認
  if (!newPassword || newPassword !== newPasswordConfirm) {
    return res
      .status(400)
      .json({ message: "新しいパスワードと確認用パスワードが一致しません。" });
  }

  // 最低限のパスワード強度チェック
  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "パスワードは8文字以上である必要があります。" });
  }

  try {
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return res
      .status(200)
      .json({ message: "パスワードが正常に更新されました。" });
  } catch (error) {
    console.error("Password update failed:", error);
    return res
      .status(500)
      .json({ message: "パスワードの更新中にエラーが発生しました。" });
  }
}

/**
 *  ユーザーID（メールアドレス）を新しい値に更新するハンドラー関数
 */
export async function updateUserIdHandler(req: AuthRequest, res: Response) {
  const user = req.user!;
  const { newUserId } = req.body as UserIdUpdateBody;

  // 新しいユーザーIDの確認
  if (!newUserId || newUserId.trim() === "") {
    return res
      .status(400)
      .json({ message: "新しいユーザーIDを入力してください。" });
  }

  try {

    // 新しいユーザーIDの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { userId: newUserId },
      select: { id: true }
    });

    if(existingUser && existingUser.id !== user.id) {
      return res.status(409).json({ message: "そのユーザーIDは既に使用されています。" });
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { userId: newUserId },
    });

    return res.status(200).json({ message: "メールアドレスが正常に更新されました。", newUserId: newUserId });
  } catch (error) {
    console.error("UserID update failed:", error);
    return res.status(500).json({ message: "メールアドレスの更新中にエラーが発生しました。" });
  }
}
