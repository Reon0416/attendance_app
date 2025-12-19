import { prisma } from "../prismaClient.js";
const ROLLING_DAYS = 7;
const BORDER_VALUE = 5;
const severityToPoints = (severity) => {
    return -severity;
};
// 5時区切りの勤務日
const getWorkDayBoundaries = (now) => {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const fiveAMToday = new Date(startOfDay);
    fiveAMToday.setHours(5, 0, 0, 0);
    let startOfWorkDay;
    if (now.getTime() < fiveAMToday.getTime()) {
        startOfWorkDay = new Date(fiveAMToday);
        startOfWorkDay.setDate(startOfWorkDay.getDate() - 1);
    }
    else {
        startOfWorkDay = fiveAMToday;
    }
    const endOfWorkDay = new Date(startOfWorkDay);
    endOfWorkDay.setDate(endOfWorkDay.getDate() + 1);
    return { startOfWorkDay, endOfWorkDay };
};
export async function resisterHealthRecordHandler(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "未ログインです" });
    }
    const { health, motivation } = req.body;
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
        }
        else {
            recordResult = await prisma.healthCheck.create({
                data: {
                    employeeId: user.id,
                    health: health,
                    motivation: motivation,
                },
                select: { recordedAt: true },
            });
        }
        const cutoffDate = new Date(Date.now() - ROLLING_DAYS * 24 * 60 * 60 * 1000);
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
        let alertMessages = [];
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
            alertMessages.push(`【体調警告】過去${ROLLING_DAYS}日間で体調不良傾向が続いています。`);
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
            alertMessages.push(`【モチベーション警告】過去${ROLLING_DAYS}日間でモチベーションの低下が確認されています。`);
        }
        const date = new Date(recordResult.recordedAt);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return res.status(201).json({
            message: `体調記録を完了しました(${hours}:${minutes})`,
            isAlert: alertTriggered,
            recordedAt: recordResult.recordedAt,
            alertMessage: alertMessages.join(" "),
        });
    }
    catch (error) {
        console.error("Health record registration failed:", error);
        return res
            .status(500)
            .json({ message: "体調記録の処理中にエラーが発生しました。" });
    }
}
export async function getHealthRecordsHandler(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "未ログインです" });
    }
    // クエリパラメータから取得したいIDを取得
    const targetEmployeeIdParam = req.query.employeeId;
    const requestedId = targetEmployeeIdParam
        ? Number(targetEmployeeIdParam)
        : null;
    // デフォルトでログインユーザーのIDを使用
    let finalEmployeeId = user.id;
    // 他人のデータを要求している場合はオーナーかどうかのチェック
    if (requestedId !== null && requestedId !== user.id) {
        if (user.role !== "OWNER") {
            return res
                .status(403)
                .json({ message: "他者のデータ閲覧権限がありません。" });
        }
        finalEmployeeId = requestedId;
    }
    // requestedIdがnullの場合（従業員自身のページ）は、finalEmployeeIdはuser.idのまま
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
                employeeId: finalEmployeeId,
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
    }
    catch (error) {
        console.error("Failed to fetch health records:", error);
        return res
            .status(500)
            .json({ message: "データの取得中にエラーが発生しました。" });
    }
}
/** isAlertLogからisCheckedがfalseのデータを返す関数 */
export async function getAlertLogHandler(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "未ログインです" });
    }
    if (user.role !== "OWNER") {
        return res
            .status(403)
            .json({ message: "この操作はオーナーのみ実行可能です" });
    }
    try {
        const records = await prisma.healthAlertLog.findMany({
            where: {
                isChecked: false,
            },
            orderBy: {
                loggedAt: "desc",
            },
            include: {
                user: {
                    select: { name: true, userId: true },
                },
            },
        });
        return res.status(200).json(records);
    }
    catch (error) {
        console.error("Failed to fetch unchecked alert logs:", error);
        return res
            .status(500)
            .json({ message: "アラートログの取得中にエラーが発生しました。" });
    }
}
/** isAlertLogのisCheckedをtrueにする関数 */
export async function updateAlertLogHandler(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "未ログインです" });
    }
    if (user.role !== "OWNER") {
        return res
            .status(403)
            .json({ message: "この操作はオーナーのみ実行可能です" });
    }
    const { alertLogId } = req.body;
    if (!alertLogId) {
        return res
            .status(400)
            .json({ message: "更新対象のアラートIDが指定されていません" });
    }
    try {
        const updatedRecord = await prisma.healthAlertLog.update({
            where: {
                id: alertLogId,
            },
            data: {
                isChecked: true,
            },
            select: {
                id: true,
                alertType: true,
                isChecked: true,
            },
        });
        return res.status(200).json({
            messgage: `${updatedRecord.id}を確認済みにしました`,
            record: updatedRecord,
        });
    }
    catch (error) {
        console.error("Failed to update alert log:", error);
        return res
            .status(500)
            .json({ message: "アラートログの更新中にエラーが発生しました。" });
    }
}
/** 全従業員のリストを取得する関数 */
export async function getEmployeeListHandler(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "未ログインです" });
    }
    try {
        const employees = await prisma.user.findMany({
            where: {
                role: "EMPLOYEE",
            },
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
                userId: true,
            },
        });
        return res.status(200).json(employees);
    }
    catch (error) {
        console.error("Failed to fetch employee list:", error);
        return res
            .status(500)
            .json({
            message: "従業員リストの取得中にサーバーエラーが発生しました。",
        });
    }
}
