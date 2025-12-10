import React, { useState } from "react";
import { updateRateAPI } from "../../../api/setting";
import type { RateUpdatePayload } from "../../../types";
import { LoadingImage } from "../../../components/LoadingImage";
import "../../style/Setting.css";

export function RateSetting() {
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [lateNightRate, setLateNightRate] = useState<string>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const hRate = Number(hourlyRate);
    const lnRate = Number(lateNightRate);

    if (isNaN(hRate) || isNaN(lnRate) || hRate <= 0 || lnRate <= 0) {
      setMessage("時給は正の数値を入力してください。");
      setLoading(false);
      return;
    }

    if (currentPassword.length === 0) {
      setMessage("現在のパスワードを入力してください。");
      setLoading(false);
      return;
    }

    const data: RateUpdatePayload = {
      hourlyRate: hRate,
      lateNightRate: lnRate,
      currentPassword: currentPassword,
    };

    try {
      const response = await updateRateAPI(data);

      setMessage(
        response.message ||
          `新しい時給設定 (時給: ¥${hRate.toLocaleString()}, 深夜: ¥${lnRate.toLocaleString()}) を記録しました。`
      );

      setHourlyRate("");
      setLateNightRate("");
      setCurrentPassword("");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setting-form-card">
      <h2>時給・深夜時給の設定</h2>
      <form onSubmit={handleSubmit}>
        {message && (
          <p
            className={`message ${
              message.includes("失敗") ||
              message.includes("権限") ||
              message.includes("数値") ||
              message.includes("オーナーのみ") ||
              message.includes("有効な") ||
              message.includes("エラー") ||
              message.includes("ありません")
                ? "error"
                : "success"
            }`}
          >
            {message}
          </p>
        )}

        <label>基本時給</label>
        <input
          type="number"
          step="1"
          min="1"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          required
        />

        <label>深夜時給</label>
        <input
          type="number"
          step="1"
          min="1"
          value={lateNightRate}
          onChange={(e) => setLateNightRate(e.target.value)}
          required
        />

        <label>オーナーパスワード</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? <LoadingImage /> : "時給設定を記録"}
        </button>
      </form>
    </div>
  );
}
