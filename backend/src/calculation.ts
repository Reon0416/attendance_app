import { AuthRequest } from "./auth";
import { Response } from "express";
import { prisma } from "./prismaClient";
import { getMonthlyAttendanceRecords } from "./services/attendanceService";
import { calculatePayroll } from "./services/payrollService";

/**
 * 今月の給与計算を行うハンドラー
 */
export async function payrollHandler(req: AuthRequest, res: Response) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "未認証です" });
  }

  try {
    const rateRecord = await prisma.rate.findFirst({
      orderBy: { id: "asc" },
      select: {
        hourlyRate: true,
        lateNightRate: true,
      },
    });

    // 時給情報がない場合のチェック
    if (
      !rateRecord ||
      rateRecord.hourlyRate === undefined ||
      rateRecord.lateNightRate === undefined
    ) {
      return res
        .status(404)
        .json({ message: "時給情報が設定されていません。" });
    }

    const attendanceRecords = await getMonthlyAttendanceRecords(user.id);

    // 給与計算の実行
    const payrollResult = calculatePayroll(
      attendanceRecords as any,
      rateRecord as any
    );

    const now = new Date();
    return res.status(200).json({
      month: now.getMonth() + 1,
      ...payrollResult,
    });
  } catch (error) {
    console.error("Payroll calculation failed:", error);
    return res
      .status(500)
      .json({ message: "給与計算中にエラーが発生しました" });
  }
}
