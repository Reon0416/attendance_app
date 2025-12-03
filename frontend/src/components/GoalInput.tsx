import React, { useState } from "react";
import { setGoal } from "../api/goal";
import type { GoalSetResponse, GoalSetBody } from "../types";
import "./style/Goal.css";

type GoalInputProps = {
  onGoalSet: () => void;
};

export function GoalInput({ onGoalSet }: GoalInputProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const targetAmount = parseFloat(amount);

    if (isNaN(targetAmount) || targetAmount <= 0) {
      setMessage("目標金額は有効な正の値である必要があります。");
      setLoading(false);
      return;
    }

    if (!description.trim()) {
      setMessage("目標の説明を入力してください。");
      setLoading(false);
      return;
    }

    const data: GoalSetBody = { targetAmount, description };

    const response: GoalSetResponse = await setGoal(data);
    setMessage(response.message);
    setAmount("");
    setDescription("");

    onGoalSet();
    setLoading(false);
  };

  return (
    <div className="goal-input-card">
      <h3>新しい目標を設定する</h3>
      <form onSubmit={handleSubmit}>
        {message && (
          <p
            className={`goal-message ${
              message.includes("失敗") ? "error" : "success"
            }`}
          >
            {message}
          </p>
        )}

        <label>ほしいもの（目標）</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>目標金額 (¥)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="1"
        />

        <button type="submit" disabled={loading}>
          {loading ? "設定中..." : "目標を設定"}
        </button>
      </form>
    </div>
  );
}
