import type {
  AccountRegisterBody,
  AccountRegisterResponse,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 新規アカウント登録をサーバーにリクエストする関数。
 */
export async function resisterNewUser(
  data: AccountRegisterBody
): Promise<AccountRegisterResponse> {
  const res = await fetch(`${API_BASE_URL}/api/setting/account`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error("[Register error] status:", res.status);
    let errorMessage = "アカウント登録に失敗しました";

    const errorBody = await res.json();
    if (errorBody && typeof errorBody.message === "string") {
      errorMessage = errorBody.message;
    }

    throw new Error(errorMessage);
  }

  const responseData: AccountRegisterResponse = await res.json();
  return responseData;
}
