export type PayrollResult = {
  month: number;
  totalPay: number;
  totalNormalHours: number;
  totalLateNightHours: number;
};

const API_BASE_URL = "http://localhost:8080";

/**
 * 認証済みユーザーの今月の給与計算結果をサーバーから取得する関数。
 */
export async function fetchMonthlyPayroll(): Promise<PayrollResult> {
  const res = await fetch(`${API_BASE_URL}/api/calculation/payroll`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error("[Payroll fetch error] status:", res.status);
    let errorMessage = "給与データの取得に失敗しました";

    const errorBody = await res.json();
    if (errorBody && typeof errorBody.message === "string") {
      errorMessage = errorBody.message;
    }

    throw new Error(errorMessage);
  }

  const data: PayrollResult = await res.json();
  return data;
}
