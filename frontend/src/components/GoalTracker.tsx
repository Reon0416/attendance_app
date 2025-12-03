import { useState, useEffect, useCallback } from "react";
import { fetchGoalProgress } from "../api/goal";
import type { GoalProgressResponse } from "../types";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./style/Goal.css";

type GoalTrackerProps = {
  reloadKey: number;
};

const COLORS = ["#10b981", "#f3f4f6"];
// const RADIAN = Math.PI / 180;

// グラフの中央に達成率を表示する関数
const renderProgressLabel = ({ cx, cy, percent }: any) => {
  return (
    <text
      x={cx}
      y={cy}
      fill="#333"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: "20px", fontWeight: "bold" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function GoalTracker({ reloadKey }: GoalTrackerProps) {
  const [progressData, setProgressData] = useState<GoalProgressResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    setIsLoading(true);

    const data = await fetchGoalProgress();
    setProgressData(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress, reloadKey]);

  if (isLoading)
    return <div className="goal-loading">目標データを計算中...</div>;

  // データがない、または目標が設定されていない場合
  if (!progressData || !progressData.target) {
    return (
      <div className="goal-tracker-container">
        <div className="goal-status-card no-goal">
          <p>{progressData?.message || "目標設定が必要です。"}</p>
        </div>
      </div>
    );
  }

  const {
    target,
    progressPercent,
    earnedAmount,
    neededAmount,
    message,
    isCompleted,
  } = progressData;

  const chartRenderData = [
    { name: "達成額", value: earnedAmount, color: COLORS[0] },
    { name: "不足額", value: neededAmount, color: COLORS[1] },
  ];

  return (
    <div className="goal-tracker-container">
      <div className="progress-display">
        <div className="goal-status-card">
          <h2>目標達成トラッカー</h2>
          <h3 className="target-description">
            目標: {target.description} (¥{target.targetAmount.toLocaleString()})
          </h3>

          <div className="chart-and-metrics">
            <div className="chart-wrapper">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={chartRenderData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={1}
                    labelLine={false}
                  >
                    {chartRenderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="chart-center-text">
                {Math.round(progressPercent)}%
              </div>
            </div>

            <div className="metrics">
              <p className={`percent-label ${isCompleted ? "completed" : ""}`}>
                {Math.round(progressPercent)}% 達成
              </p>
              <p className="status-message">{message}</p>
              <p>
                現在貯めた金額:{" "}
                <span className="earned-amount">
                  ¥{earnedAmount.toLocaleString()}
                </span>
              </p>
              <p>
                不足金額:{" "}
                <span className="needed-amount">
                  ¥{neededAmount.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
