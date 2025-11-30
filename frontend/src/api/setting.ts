import type { PasswordUpdateBody, UserIdUpdateBody } from "../types";

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
