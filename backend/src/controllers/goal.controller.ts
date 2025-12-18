import { AuthRequest } from "./auth.controller";
import { Response } from "express";
import { prisma } from "../prismaClient";
import { calculatePayroll } from "../services/payrollService";
import { getAttendanceRecordsSince } from "../services/attendanceService";
import { console } from "inspector";

type GoalBody = {
  targetAmount: number;
  description: string;
};

/**
 * 新しい目標を設定するハンドラー
 * 既存目標の達成判定とアーカイブ、新規目標のアクティブ化をトランザクションで処理する。
 */
export async function setGoalHandler(req: AuthRequest, res: Response) {
  const user = req.user;
  const { targetAmount, description } = req.body as GoalBody;

  if (!user) {
    return res.status(401).json({ message: "未認証です" });
  }
  if (targetAmount <= 0 || !description) {
    return res
      .status(400)
      .json({ message: "目標金額は正の値で、目標の説明が必要です。" });
  }

  try {
    await prisma.$transaction(async (tx: any) => {
      const oldActiveGoal = await tx.goal.findFirst({
        where: { employeeId: user.id, isActive: true },
        orderBy: { createdAt: "desc" },
      });

      if (oldActiveGoal) {
        const rateRecord = await tx.rate.findFirst({ orderBy: { id: "asc" } });
        if (!rateRecord) throw new Error("時給情報が未設定です。");

        const attendanceRecords = await getAttendanceRecordsSince(
          user.id,
          oldActiveGoal.createdAt
        );

        const payrollResult = calculatePayroll(
          attendanceRecords as any,
          rateRecord as any
        );

        const earnedAmount = payrollResult.totalPay;

        const isCompleted = earnedAmount >= oldActiveGoal.targetAmount;

        await tx.goal.update({
          where: { id: oldActiveGoal.id },
          data: {
            isActive: false,
            isAchieved: isCompleted,
          },
        });
      }

      // 新しい目標を設定
      await tx.goal.create({
        data: {
          employeeId: user.id,
          targetAmount: targetAmount,
          description: description,
          isActive: true,
          isAchieved: false,
        },
      });
    });
    return res.status(201).json({ message: "新しい目標を設定しました。" });
  } catch (error) {
    console.error("Goal setting failed:", error);
    return res
      .status(500)
      .json({ message: "目標の設定中にエラーが発生しました。" });
  }
}

// ヘルパー関数: 月が変わったかどうかをチェック
const needsMonthlyReset = (goalCreatedAt: Date, now: Date): boolean => {
  return (
    goalCreatedAt.getMonth() !== now.getMonth() ||
    goalCreatedAt.getFullYear() !== now.getFullYear()
  );
};

/**
 * アクティブな目標の進捗状況を計算し、返すハンドラー
 * 月初めの目標リセットも同時に処理する。
 */
export async function getGoalProgressHandler(req: AuthRequest, res: Response) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "未認証です" });
  }

  try {
    // アクティブな目標を取得
    let activeGoal = await prisma.goal.findFirst({
      where: { employeeId: user.id, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();

    // 月初めの自動リセットチェック(月が変わり、まだ目標がアクティブなら強制リセット)
    if (activeGoal && needsMonthlyReset(activeGoal.createdAt, now)) {
      await prisma.goal.update({
        where: { id: activeGoal.id },
        data: { isActive: false, isAchieved: false },
      });

      activeGoal = null;
    }

    if (!activeGoal) {
      return res
        .status(200)
        .json({
          progressPercent: 0,
          target: null,
          isCompleted: false,
          message: "新しい目標を設定してください。",
        });
    }

    // 時給情報を取得
    const rateRecord = await prisma.rate.findFirst({ orderBy: { id: "asc" } });
    if (!rateRecord) {
      return res
        .status(500)
        .json({ message: "時給情報が設定されていません。" });
    }

    // 目標設定日時以降（今月末まで）の勤怠記録を取得
    const attendanceRecords = await getAttendanceRecordsSince(
      user.id,
      activeGoal.createdAt
    );

    // 目標設定後の給与を計算
    const payrollResult = calculatePayroll(
      attendanceRecords as any,
      rateRecord as any
    );

    const earnedAmount = payrollResult.totalPay;
    const targetAmount = activeGoal.targetAmount;

    // 進捗の計算
    const isCompleted = earnedAmount >= targetAmount;
    let progressPercent = (earnedAmount / targetAmount) * 100;
    if (progressPercent > 100) progressPercent = 100;

    const neededAmount = Math.max(0, targetAmount - earnedAmount);

    let statusMessage = `目標達成まであと ${neededAmount.toLocaleString()}円 です`;
    if (isCompleted) {
      statusMessage = "🎉 目標を達成しました! 目標変更をしてください。";
    }

    return res.status(200).json({
      target: activeGoal,
      earnedAmount: earnedAmount,
      progressPercent: progressPercent,
      neededAmount: neededAmount,
      isCompleted: isCompleted,
      message: statusMessage,
    });
  } catch (error) {
    console.error("Goal progress calculation failed:", error);
    return res
      .status(500)
      .json({ message: "進捗の計算中にエラーが発生しました。" });
  }
}
