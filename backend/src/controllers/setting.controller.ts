import { Response } from "express";
import { prisma } from "../prismaClient.js";
import bcrypt from "bcrypt";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { AccountRegisterBody } from "../type.js";
import { Role } from "../generated/prisma/enums.js";

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

// RateUpdateBodyの型定義
type RateUpdateBody = {
  hourlyRate: number;
  lateNightRate: number;
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
      select: { id: true },
    });

    if (existingUser && existingUser.id !== user.id) {
      return res
        .status(409)
        .json({ message: "そのユーザーIDは既に使用されています。" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { userId: newUserId },
    });

    return res.status(200).json({
      message: "メールアドレスが正常に更新されました。",
      newUserId: newUserId,
    });
  } catch (error) {
    console.error("UserID update failed:", error);
    return res
      .status(500)
      .json({ message: "メールアドレスの更新中にエラーが発生しました。" });
  }
}

/**
 * 新しい時給と深夜時給をRateテーブルに記録するハンドラー関数
 */
export async function updateRateHandler(req: AuthRequest, res: Response) {
  const user = req.user!;
  const { hourlyRate, lateNightRate } = req.body as RateUpdateBody;

  if (user.role !== "OWNER") {
    return res
      .status(403)
      .json({ message: "時給の更新はオーナーのみ実行可能です" });
  }

  if (
    typeof hourlyRate !== "number" ||
    typeof lateNightRate !== "number" ||
    hourlyRate <= 0 ||
    lateNightRate <= 0
  ) {
    return res
      .status(400)
      .json({ message: "有効な時給および深夜時給を入力してください。" });
  }

  try {
    const updatedRate = await prisma.rate.update({
      where: {
        id: 1,
      },
      data: {
        hourlyRate: hourlyRate,
        lateNightRate: lateNightRate,
      },
    });

    return res.status(200).json({
      message: "新しい時給設定が正常に上書き更新されました。",
      rate: updatedRate,
    });
  } catch (error) {
    console.error("Rate update failed:", error);
    return res
      .status(500)
      .json({ message: "時給の更新中にエラーが発生しました。" });
  }
}

/**
 * 新しいユーザーアカウントをDBに登録するハンドラー関数。
 */
export async function accountRegisterHandler(req: AuthRequest, res: Response) {
  const user = req.user!;
  const { userId, name, password } = req.body as AccountRegisterBody;

  if (user.role !== "OWNER") {
    return res
      .status(403)
      .json({ message: "アカウント作成はオーナーのみ実行可能です" });
  }

  if (!userId || !name || !password) {
    return res
      .status(400)
      .json({ message: "すべての項目を入力してください。" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "パスワードは8文字以上である必要があります。" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { userId } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "このメールアドレスはすでに登録されています。" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        userId,
        name,
        passwordHash,
        role: Role.EMPLOYEE,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        role: true,
      },
    });

    return res.status(201).json({
      message: "アカウントが正常に作成されました。",
      user: {
        id: newUser.id,
        userId: newUser.userId,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("User registration failed:", error);
    return res
      .status(500)
      .json({ message: "アカウント作成中にエラーが発生しました。" });
  }
}
