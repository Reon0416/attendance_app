import type { AttendanceActionType, AttendanceRecord } from "../types";

const API_BASE_URL = "http://localhost:8080";

export async function resisterAttendance(action: AttendanceActionType) {
  const res = await fetch(`${API_BASE_URL}/api/attendance/resister`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  });

  if (!res.ok) {
    console.log("[attendance error] status:", res.status);
    let errorMessage = "勤怠登録に失敗しました";

    const errorBody = await res.json();
    if (errorBody && typeof errorBody.message === "string") {
      errorMessage = errorBody.message;
    }

    throw new Error(errorMessage);
  }

  const data = await res.json();
  return data;
}

export async function getMonthlyAttendance(): Promise<AttendanceRecord[]> {
  const res = await fetch(
    `${API_BASE_URL}/api/attendance/getAttendanceHistory`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    console.log("[get attendance error] status:", res.status);
    let errorMessage = "打刻履歴の取得に失敗しました";
    
    const errorBody = await res.json();
    if (errorBody && typeof errorBody.message === "string") {
      errorMessage = errorBody.message;
    }

    throw new Error(errorMessage);
  }

  const data: AttendanceRecord[] = await res.json();
  return data;
}
