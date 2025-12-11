import React, { useState } from "react";
import { updatePassword } from "../api/setting";
import type { PasswordUpdateBody } from "../types";
import { LoadingImage } from "./LoadingImage";
import "./style/Setting.css";

export function PasswordSetting() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (newPassword !== newPasswordConfirm) {
      setMessage("新しいパスワードと確認用が一致しません。");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage("パスワードは8文字以上である必要があります。");
      setLoading(false);
      return;
    }

    const data: PasswordUpdateBody = {
      currentPassword,
      newPassword,
      newPasswordConfirm,
    };

    try {
      const response = await updatePassword(data);
      setMessage(response.message || "パスワードを更新しました。");

      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setting-form-card">
      <h2>パスワードの変更</h2>
      <form onSubmit={handleSubmit}>
        {message && (
          <p
            className={`message ${
              message.includes("失敗") ||
              message.includes("一致しません") ||
              message.includes("新しい") ||
              message.includes("8") ||
              message.includes("ありません")
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
        <label>新しいパスワード（8文字以上）</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label>新しいパスワード（確認）</label>
        <input
          type="password"
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          required
        />

        {/* 一時的にボタンを押せないようにしています。通常のコードはコメントアウトしているコードになります。 */}

        {/* <button type="submit" disabled={loading}>
          {loading ? <LoadingImage /> : "パスワードを更新"}
        </button> */}
        <button type="submit" disabled={true}>
          {loading ? <LoadingImage /> : "パスワードを更新"}
        </button>
      </form>
    </div>
  );
}
