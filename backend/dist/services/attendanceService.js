import { prisma } from "../prismaClient.js";
import { getEndOfCalculationPeriod } from "./lastDayOfMonth.js";
/** 月の勤怠レコードを返す関数 */
export async function getMonthlyAttendanceRecords(employeeId) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const endOfFilterPeriod = new Date(startOfNextMonth.getTime() + 5 * 60 * 60 * 1000);
    const records = await prisma.attendance.findMany({
        where: {
            employeeId: employeeId,
            occurredAt: {
                gte: startOfMonth,
                lt: endOfFilterPeriod,
            },
        },
        orderBy: {
            occurredAt: "desc",
        },
    });
    return records;
}
/**
 * 目標設定日から「給与計算の区切り時刻（翌月1日4時）」までの勤怠記録をすべて取得する関数
 */
export async function getAttendanceRecordsSince(employeeId, startDate) {
    const now = new Date();
    const endOfPeriod = getEndOfCalculationPeriod(now);
    const records = await prisma.attendance.findMany({
        where: {
            employeeId: employeeId,
            occurredAt: {
                gte: startDate,
                lt: endOfPeriod,
            },
        },
        orderBy: {
            occurredAt: "desc",
        },
    });
    return records;
}
