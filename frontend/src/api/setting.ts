import type { PasswordUpdateBody, UserIdUpdateBody, RateUpdatePayload, NewRateResponse } from "../types";

// 成功レスポンスの型 (サーバーからのメッセージを想定)
export type SettingsSuccessResponse = {
  message: string;
  newUserId?: string;
};

const API_BASE_URL = "http://localhost:8080";

/**
 *  パスワードの更新をリクエストする関数。
 */
export async function updatePassword(
  data: PasswordUpdateBody
): Promise<SettingsSuccessResponse> {
  const res = await fetch(`${API_BASE_URL}/api/setting/password`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error("[Password update error] status:", res.status);
    let errorMessage = "パスワード更新に失敗しました";

    const errorBody = await res.json();
    if (errorBody && typeof errorBody.message === "string") {
      errorMessage = errorBody.message;
    }
    throw new Error(errorMessage);
  }

  const responseData: SettingsSuccessResponse = await res.json();
  return responseData;
}

/**
 *  ユーザーID（メールアドレス）の更新をリクエストする関数。
 */
export async function updateUserId(
  data: UserIdUpdateBody
): Promise<SettingsSuccessResponse> {
  const res = await fetch(`${API_BASE_URL}/api/setting/userId`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error("[UserID update error] status:", res.status);
    let errorMessage = "メールアドレスの更新に失敗しました";

    const errorBody = await res.json();
    if (errorBody && typeof errorBody.message === "string") {
      errorMessage = errorBody.message;
    }
    throw new Error(errorMessage);
  }

  const responseData: SettingsSuccessResponse = await res.json();
  return responseData;
}

/**
 * 新しい時給および深夜時給をサーバーに送信し、新しいレートを記録する。
 */
export async function updateRateAPI(
  payload: RateUpdatePayload
): Promise<{ message: string; rate: NewRateResponse }> {
  if (
    typeof payload.hourlyRate !== "number" ||
    typeof payload.lateNightRate !== "number"
  ) {
    throw new Error("時給は数値である必要があります。");
  }

  const res = await fetch(`${API_BASE_URL}/api/setting/rate`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("[rate update error] status:", res.status);
    let errorMessage = "時給の更新に失敗しました";

    const errorBody = await res.json();
    if (errorBody && typeof errorBody.message === "string") {
      errorMessage = errorBody.message;
    }
    throw new Error(errorMessage);
  }

  return res.json();
}
