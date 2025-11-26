import { Response } from "express";
import { AttendanceAction } from "@prisma/client";
import { prisma } from "./prismaClient";
import { AuthRequest } from "./auth";


/** 勤怠情報の登録*/
export async function resisterAttendanceHandler(req: AuthRequest, res: Response) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "未ログインです" });
  }

  const action = req.body.action;

  const validActions: AttendanceAction[] = [
    AttendanceAction.CLOCK_IN,
    AttendanceAction.CLOCK_OUT,
    AttendanceAction.BREAK_START,
    AttendanceAction.BREAK_END,
  ];

  //actionがAttendanceActionに含まれていない値の場合
  if (!validActions.includes(action as AttendanceAction)) {
    return res.status(400).json({
      message: "不正な action です。",
    });
  }

  try{
    const attendance = await prisma.attendance.create({
      data:{
        employeeId: user.id,
        action: action as AttendanceAction
      }
    });

    return res.status(201).json(attendance);
  }catch(error){
    console.error("登録できませんでした:", error);
    return res.status(500).json({ message: "勤怠情報の登録に失敗しました" });
  }
}

/** 今月の勤怠情報の取得 */
export async function getMonthlyAttendanceHandler(req: AuthRequest, res: Response) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "認証情報が見つかりません" });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  try {
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        employeeId: user.id,
        occurredAt: { 
          gte: startOfMonth, // 今月1日 00:00:00 以上
          lt: endOfMonth,    // 来月1日 00:00:00 未満
        },
      },
      orderBy: {
        occurredAt: 'desc',// 降順
      },
    });

    return res.status(200).json(attendanceRecords);

  } catch (error) {
    console.error("打刻履歴の取得に失敗しました:", error);
    return res.status(500).json({ message: "打刻履歴の取得中にサーバーエラーが発生しました" });
  }
}
