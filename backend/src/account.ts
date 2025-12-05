import { Response } from "express";
import { prisma } from "./prismaClient";
import bcrypt from "bcrypt";
import { Request } from "express";
import type { AccountRegisterBody } from "./type";


/**
 * 新しいユーザーアカウントをDBに登録するハンドラー関数。
 */
export async function accountRegisterHandler(req: Request, res: Response) {
  const { userId, name, password, role } = req.body as AccountRegisterBody; 

  if (!userId || !name || !password || !role) {
    return res.status(400).json({ message: "すべての項目を入力してください。" });
  }

  if(password.length < 8) {
    return res.status(400).json({ message: "パスワードは8文字以上である必要があります。" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { userId }});
    if(existingUser) {
      return res.status(409).json({ message: "このメールアドレスはすでに登録されています。" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        userId,
        name,
        passwordHash,
        role,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        role: true,
      }
    });

    return res.status(201).json({
      message: "アカウントが正常に作成されました。",
      user: { id: newUser.id, userId: newUser.userId, name: newUser.name, role: newUser.role }
    });
  } catch (error) {
    console.error("User registration failed:", error);
    return res.status(500).json({ message: "アカウント作成中にエラーが発生しました。" });
  }
}