import { useState, useEffect, useCallback } from "react";
import { getMonthlyAttendance } from "../api/attendance";
import type { AttendanceRecord } from "../types";

export interface GroupedAttendance {
  [workDay: string]: AttendanceRecord[];
}

/**
 * 打刻日時から、その打刻が属する「勤務日」を決定するロジック
 * 深夜0時〜4時台の打刻は前日の日付として扱う。
 */
const getWorkDayKey = (occurredAt: string): string => {
  const date = new Date(occurredAt);

  const jstOffset = 9 * 60 * 60 * 1000;
  const localDate = new Date(date.getTime() + jstOffset);

  const localHour = localDate.getUTCHours();
  const CUTOFF_HOUR = 5;

if (localHour < CUTOFF_HOUR) {
    const previousDay = new Date(localDate);
    previousDay.setUTCDate(localDate.getUTCDate() - 1);
    return previousDay.toISOString().split("T")[0];
  }

  return localDate.toISOString().split("T")[0];
};

export const useAttendanceHistory = () => {
  const [groupedRecords, setGroupedRecords] = useState<GroupedAttendance>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const records = await getMonthlyAttendance();

      const grouped: GroupedAttendance = {};

      records.forEach((record) => {
        const workDayKey = getWorkDayKey(record.occurredAt);

        if (!grouped[workDayKey]) {
          grouped[workDayKey] = [];
        }

        grouped[workDayKey].push(record);
      });

      const sortedGroupedRecords = Object.keys(grouped)
        .sort((a, b) => b.localeCompare(a))
        .reduce((obj: GroupedAttendance, key: string) => {
          obj[key] = grouped[key].sort(
            (a, b) =>
              new Date(a.occurredAt).getTime() -
              new Date(b.occurredAt).getTime()
          );
          return obj;
        }, {});

      setGroupedRecords(sortedGroupedRecords);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "履歴のロード中に予期せぬエラーが発生しました"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { groupedRecords, isLoading, error, refreshHistory: fetchHistory };
};
