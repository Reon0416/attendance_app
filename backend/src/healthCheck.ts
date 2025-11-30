import { AuthRequest } from "./middlewares/authMiddleware";
import { Response } from "express";
import { prisma } from "./prismaClient";

type HealthRecordBody = {
  health: number;
  motivation: number;
};

export async function resisterHealthRecordHandler(
  req: AuthRequest,
  res: Response
) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "未ログインです" });
  }

  const { health, motivation } = req.body as HealthRecordBody;

  try {
    const newRecord = await prisma.healthCheck.create({
      data: {
        employeeId: user.id,
        health: health,
        motivation: motivation,
      },
      select: {
        recordedAt: true,
      },
    });

    const date = new Date(newRecord.recordedAt);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return res.status(201).json({
      message: `体調記録を完了しました(${hours}:${minutes})`,
      recordedAt: newRecord.recordedAt,
    });
  } catch (error) {
    console.error("Health record registration failed:", error);
    return res
      .status(500)
      .json({ message: "体調記録の処理中にエラーが発生しました。" });
  }
}

export async function getHealthRecordsHandler(req: AuthRequest, res: Response) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "未ログインです" });
  }

  /** 
   * 今月の開始日と次月の開始日を計算してその間のデータを取得するようにする。
   * この方がインデックスを使うから速い。
   * 現在の月と一致するデータを調べて取得する方法もあるが、全行チェックになり遅くなってしまうためやらない。
   */
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  try {
    const records = await prisma.healthCheck.findMany({
      where: {
        employeeId: user.id,
        recordedAt: {
          gte: startOfMonth, // Greater Than Equal
          lt: startOfNextMonth, // Less Than
        },
      },
      orderBy: {
        recordedAt: "asc",
      },
      select: {
        health: true,
        motivation: true,
        recordedAt: true,
      },
    });

    return res.status(200).json(records);
  } catch (error) {
    console.error("Failed to fetch health records:", error);
    return res
      .status(500)
      .json({ message: "データの取得中にエラーが発生しました。" });
  }
}
