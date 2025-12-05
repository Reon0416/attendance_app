import type {
  AccountRegisterBody,
  AccountRegisterResponse,
} from "../types";

const API_BASE_URL = "http://localhost:8080";

/**
 * 新規アカウント登録をサーバーにリクエストする関数。
 */
export async function resisterNewUser(
  data: AccountRegisterBody
): Promise<AccountRegisterResponse> {
  const res = await fetch(`${API_BASE_URL}/api/account/create`, {
    method: "POST",
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
