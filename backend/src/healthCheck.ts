import { AuthRequest } from "./middlewares/authMiddleware";
import { Response } from "express";
import { prisma } from "./prismaClient";

const ROLLING_DAYS = 7;
const BORDER_VALUE = 20;

type HealthRecordBody = {
  health: number;
  motivation: number;
};

const severityToPoints = (severity: number): number => {
  return -severity;
};

// 5時区切りの勤務日
const getWorkDayBoundaries = (now: Date) => {
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const fiveAMToday = new Date(startOfDay);
  fiveAMToday.setHours(5, 0, 0, 0);

  let startOfWorkDay: Date;

  if (now.getTime() < fiveAMToday.getTime()) {
    startOfWorkDay = new Date(fiveAMToday);
    startOfWorkDay.setDate(startOfWorkDay.getDate() - 1);
  } else {
    startOfWorkDay = fiveAMToday;
  }

  const endOfWorkDay = new Date(startOfWorkDay);
  endOfWorkDay.setDate(endOfWorkDay.getDate() + 1);

  return { startOfWorkDay, endOfWorkDay };
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
    const now = new Date();
    const { startOfWorkDay, endOfWorkDay } = getWorkDayBoundaries(now);
    const existingRecord = await prisma.healthCheck.findFirst({
      where: {
        employeeId: user.id,
        recordedAt: {
          gte: startOfWorkDay,
          lt: endOfWorkDay,
        },
      },
    });

    let recordResult;

    if (existingRecord) {
      recordResult = await prisma.healthCheck.update({
        where: { id: existingRecord.id },
        data: {
          health: health,
          motivation: motivation,
        },
        select: { recordedAt: true },
      });
    } else {
      recordResult = await prisma.healthCheck.create({
        data: {
          employeeId: user.id,
          health: health,
          motivation: motivation,
        },
        select: { recordedAt: true },
      });
    }

    const cutoffDate = new Date(
      Date.now() - ROLLING_DAYS * 24 * 60 * 60 * 1000
    );

    const pastRecords = await prisma.healthCheck.findMany({
      where: {
        employeeId: user.id,
        recordedAt: { gte: cutoffDate },
      },
      select: { health: true, motivation: true },
    });

    let totalHealthPoints = 0;
    let totalMotivationPoints = 0;

    pastRecords.forEach((record) => {
      totalHealthPoints += severityToPoints(record.health);
      totalMotivationPoints += severityToPoints(record.motivation);
    });

    let alertTriggered = false;
    let alertMessages: string[] = [];

    // 体調ポイントの判定とDB記録
    if (totalHealthPoints >= BORDER_VALUE) {
      await prisma.healthAlertLog.create({
        data: {
          employeeId: user.id,
          alertType: "体調",
          totalPoints: totalHealthPoints,
          isChecked: false,
        },
      });
      alertTriggered = true;
      alertMessages.push(
        `【体調警告】過去${ROLLING_DAYS}日間で体調不良傾向が続いています。`
      );
    }

    // モチベーションポイントの判定とDB記録
    if (totalMotivationPoints >= BORDER_VALUE) {
      await prisma.healthAlertLog.create({
        data: {
          employeeId: user.id,
          alertType: "モチベーション",
          totalPoints: totalMotivationPoints,
          isChecked: false,
        },
      });
      alertTriggered = true;
      alertMessages.push(
        `【モチベーション警告】過去${ROLLING_DAYS}日間でモチベーションの低下が確認されています。`
      );
    }

    const date = new Date(recordResult.recordedAt);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return res.status(201).json({
      message: `体調記録を完了しました(${hours}:${minutes})`,
      isAlert: alertTriggered,
      recordedAt: recordResult.recordedAt,
      alertMessage: alertMessages.join(" | "),
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
