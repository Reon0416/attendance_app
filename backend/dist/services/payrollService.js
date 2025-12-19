/**
 * 開始時刻と終了時刻の間隔を通常勤務と深夜勤務に分割する
 */
function calculateTimeSegments(start, end) {
    let normalMinutes = 0;
    let lateNightMinutes = 0;
    let current = new Date(start.getTime());
    while (current.getTime() < end.getTime()) {
        const hour = current.getHours();
        // 深夜時間帯の判定: 22時〜翌4時未満
        const isLateNight = hour >= 22 || hour < 4;
        if (isLateNight) {
            lateNightMinutes += 1;
        }
        else {
            normalMinutes += 1;
        }
        current.setMinutes(current.getMinutes() + 1);
    }
    return { normalMinutes, lateNightMinutes };
}
/**
 * 勤務時間と深夜勤務時間を計算し、給与総額を算出する
 */
export function calculatePayroll(records, user) {
    const sortedRecords = [...records].sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
    let totalNormalMinutes = 0;
    let totalLateNightMinutes = 0;
    let clockInTime = null;
    let lastActiveTime = null;
    let breakStartTime = null;
    let workSegments = [];
    for (const record of sortedRecords) {
        const occurredAt = new Date(record.occurredAt);
        switch (record.action) {
            case "CLOCK_IN":
                clockInTime = occurredAt;
                lastActiveTime = occurredAt;
                workSegments = [];
                break;
            case "BREAK_START":
                if (lastActiveTime && clockInTime) {
                    workSegments.push({ start: lastActiveTime, end: occurredAt });
                    breakStartTime = occurredAt;
                    lastActiveTime = null;
                }
                break;
            case "BREAK_END":
                if (breakStartTime) {
                    lastActiveTime = occurredAt;
                    breakStartTime = null;
                }
                break;
            case "CLOCK_OUT":
                if (clockInTime && lastActiveTime) {
                    workSegments.push({ start: lastActiveTime, end: occurredAt });
                    for (const segment of workSegments) {
                        const { normalMinutes, lateNightMinutes } = calculateTimeSegments(segment.start, segment.end);
                        totalNormalMinutes += normalMinutes;
                        totalLateNightMinutes += lateNightMinutes;
                    }
                    clockInTime = null;
                    lastActiveTime = null;
                    workSegments = [];
                }
                break;
        }
    }
    const totalNormalHours = totalNormalMinutes / 60;
    const totalLateNightHours = totalLateNightMinutes / 60;
    // 給与計算
    const normalPay = totalNormalHours * user.hourlyRate;
    const lateNightPay = totalLateNightHours * user.lateNightRate;
    const totalPay = normalPay + lateNightPay;
    return {
        totalPay: Math.round(totalPay),
        totalNormalHours: Math.round(totalNormalHours * 100) / 100,
        totalLateNightHours: Math.round(totalLateNightHours * 100) / 100,
    };
}
