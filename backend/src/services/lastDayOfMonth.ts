/**
 * 指定された日付の月の給与計算の区切り時刻（翌月1日の午前4時）を返す関数
 */
export function getEndOfCalculationPeriod(date: Date): Date {
    const nextMonthFirstDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    nextMonthFirstDay.setHours(4, 0, 0, 0);
    
    return nextMonthFirstDay;
}