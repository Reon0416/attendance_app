import React, { useState } from "react";
import { updateUserId } from "../api/setting";
import type { UserIdUpdateBody } from "../types";
import { LoadingImage } from "./LoadingImage";
import "./style/Setting.css";

export function UserIdSetting() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUserId, setNewUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (currentPassword.length === 0) {
      setMessage("現在のパスワードを入力してください。");
      setLoading(false);
      return;
    }

    const data: UserIdUpdateBody = {
      currentPassword,
      newUserId,
    };

    try {
      
      const response = await updateUserId(data);

      const displayId = response.newUserId || newUserId;
      setMessage(
        response.message ||
          `ユーザーID（メールアドレス）を ${displayId} に更新しました。`
      );
      setCurrentPassword("");
      setNewUserId("");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setting-form-card">
      <h2>メールアドレス（ユーザーID）の変更</h2>
      <form onSubmit={handleSubmit}>
        {message && (
          <p
            className={`message ${
              message.includes("失敗") ||
              message.includes("新しい") ||
              message.includes("正しくありません") ||
              message.includes("既に使用されています")
                ? "error"
                : "success"
            }`}
          >
            {message}
          </p>
        )}

        <label>現在のパスワード</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <label>新しいメールアドレス</label>
        <input
          type="email"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          required
        />

      {/* 一時的にボタンを押せないようにしています。通常のコードはコメントアウトしているコードになります。 */}

        {/* <button type="submit" disabled={loading}>
          {loading ? <LoadingImage /> : "メールアドレスを更新"}
        </button> */}
        <button type="submit" disabled={true}>
          {loading ? <LoadingImage /> : "メールアドレスを更新"}
        </button>
      </form>
    </div>
  );
}
