import { Response } from "express";
import { AttendanceAction } from "@prisma/client";
import { prisma } from "./prismaClient.js";
import { AuthRequest } from "./auth.js";

export async function resisterAttendanceHandler(req: AuthRequest, res: Response) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "未ログインです" });
  }

  const action = req.body

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