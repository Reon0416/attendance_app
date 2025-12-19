import { AttendanceAction } from "../generated/prisma/enums.js";
import { prisma } from "../prismaClient.js";
import { getMonthlyAttendanceRecords } from "../services/attendanceService.js";
/** 勤怠情報の登録*/
export async function resisterAttendanceHandler(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "未ログインです" });
    }
    const action = req.body.action;
    const validActions = [
        AttendanceAction.CLOCK_IN,
        AttendanceAction.CLOCK_OUT,
        AttendanceAction.BREAK_START,
        AttendanceAction.BREAK_END,
    ];
    //actionがAttendanceActionに含まれていない値の場合
    if (!validActions.includes(action)) {
        return res.status(400).json({
            message: "不正な action です。",
        });
    }
    try {
        const attendance = await prisma.attendance.create({
            data: {
                employeeId: user.id,
                action: action,
            },
        });
        return res.status(201).json(attendance);
    }
    catch (error) {
        console.error("登録できませんでした:", error);
        return res.status(500).json({ message: "勤怠情報の登録に失敗しました" });
    }
}
/** 今月の勤怠情報の取得 */
export async function getMonthlyAttendanceHandler(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "認証情報が見つかりません" });
    }
    try {
        const attendanceRecords = await getMonthlyAttendanceRecords(user.id);
        return res.status(200).json(attendanceRecords);
    }
    catch (error) {
        console.error("打刻履歴の取得に失敗しました:", error);
        return res
            .status(500)
            .json({ message: "打刻履歴の取得中にサーバーエラーが発生しました" });
    }
}
/** 一番最新の勤怠データを取得する */
export async function getLatestAttendanceRecordHandler(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "認証情報が見つかりません" });
    }
    try {
        const latestRecord = await prisma.attendance.findFirst({
            where: {
                employeeId: user.id,
            },
            orderBy: {
                occurredAt: "desc",
            },
            select: {
                action: true,
                occurredAt: true,
            },
        });
        const records = latestRecord ? [latestRecord] : [];
        return res.status(200).json(records);
    }
    catch (error) {
        console.error("Failed to fetch latest attendance record:", error);
        return res.status(500).json({
            message: "最新の勤怠記録の取得中にサーバーエラーが発生しました",
        });
    }
}
