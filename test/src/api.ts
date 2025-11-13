import type { User } from "./types.ts";

const API_BASE_URL="http://localhost:8080";

async function handleJsonResponse(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function login(userId: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ userId, password }),
  });

  const data = await handleJsonResponse(res);

  if (!res.ok) {
    const message =
      (data && (data as any).message) || "ログインに失敗しました";
    throw new Error(message);
  }

  return data as User;
}

export async function fetchMe(): Promise<User | null> {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) {
    return null;
  }

  const data = await handleJsonResponse(res);

  if (!res.ok) {
    const message =(data && (data as any).message) || "ユーザー情報の取得に失敗しました";
    throw new Error(message);
  }

  return data as User;
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await handleJsonResponse(res);
    const message =(data && (data as any).message) || "ログアウトに失敗しました";
    throw new Error(message);
  }
}