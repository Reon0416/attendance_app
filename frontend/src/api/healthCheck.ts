import type {
  HealthRecordBody,
  GetHealthRecord,
  Employee,
  AlertLog,
} from "../types";

const API_BASE_URL = "http://localhost:8080";

export async function resisterHealthRecord(data: HealthRecordBody) {
  const res = await fetch(`${API_BASE_URL}/api/healthCheck/resister`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error("[health record error] status:", res.status);
    let errorMessage = "体調記録の登録に失敗しました";

    const errorBody = await res.json();
    if (errorBody && typeof errorBody.message === "string") {
      errorMessage = errorBody.message;
    }
    throw new Error(errorMessage);
  }

  const responseData = await res.json();
  return responseData;
}

export async function getHealthRecords(
  employeeId?: number
): Promise<GetHealthRecord[]> {
  const url = new URL(`${API_BASE_URL}/api/healthCheck/getHealthRecords`);

  // employeeId が存在する場合のみ、クエリパラメータを追加
  if (employeeId) {
    url.searchParams.append("employeeId", String(employeeId));
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error("[fetch records error] status:", res.status);
    let errorMessage = "体調記録データの取得に失敗しました";

    const errorBody = await res.json();
    if (errorBody && typeof errorBody.message === "string") {
      errorMessage = errorBody.message;
    }

    throw new Error(errorMessage);
  }

  const data: GetHealthRecord[] = await res.json();
  return data;
}

export async function getEmployeeList(): Promise<Employee[]> {
  const res = await fetch(`${API_BASE_URL}/api/healthCheck/employees`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    console.error("[Employee list fetch error] status:", res.status);
    let errorMessage = "従業員リストの取得に失敗しました";

    const errorBody = await res.json();
    if (errorBody && typeof errorBody.message === "string") {
      errorMessage = errorBody.message;
    }

    throw new Error(errorMessage);
  }

  const data: Employee[] = await res.json();
  return data;
}

export async function fetchUncheckedAlerts(): Promise<AlertLog[]> {
  const res = await fetch(`${API_BASE_URL}/api/healthCheck/getAlertLog`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    console.error("[Alert list fetch error] status:", res.status);
    let errorMessage = "アラートリストの取得に失敗しました";

    const errorBody = await res.json();
    if (errorBody && typeof errorBody.message === "string") {
      errorMessage = errorBody.message;
    }

    throw new Error(errorMessage);
  }

  const data: AlertLog[] = await res.json();
  return data;
}

export async function markAlertAsCheckedAPI(
  alertLogId: number
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/healthCheck/updateAlertLog`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alertLogId }),
  });

  if (!res.ok) {
    console.error("[Alert list update error] status:", res.status);
    let errorMessage = "アラートリストの更新に失敗しました";

    const errorBody = await res.json();
    if (errorBody && typeof errorBody.message === "string") {
      errorMessage = errorBody.message;
    }

    throw new Error(errorMessage);
  }

  return res.json();
}
