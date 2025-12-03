import type { GoalSetBody, GoalSetResponse, GoalProgressResponse } from "../types";

const API_BASE_URL = "http://localhost:8080";

/** 目標を登録 */
export async function setGoal(data: GoalSetBody): Promise<GoalSetResponse> {
  const res = await fetch(`${API_BASE_URL}/api/goal/set`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "目標設定に失敗しました");
  }

  const responseData: GoalSetResponse = await res.json();
  return responseData;
}

/** 目標の進捗情報を取得 */
export async function fetchGoalProgress(): Promise<GoalProgressResponse> {
    const res = await fetch(`${API_BASE_URL}/api/goal/progress`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.message || "進捗データの取得に失敗しました");
    }
    
    const responseData: GoalProgressResponse = await res.json();
    return responseData;
}
