import { useState, useEffect } from "react";
import { getHealthRecords } from "../api/healthCheck";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import "./style/HelthChart.css";

type ChartData = {
  dateLabel: string;
  health: number;
  motivation: number;
};

export function HealthChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const records = await getHealthRecords();

      // recordsをグラフ描画ライブラリに適した形式に変換
      const formattedData: ChartData[] = records.map((record) => {
        const date = new Date(record.recordedAt);

        // 'MM/DD'形式
        const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;

        return {
          dateLabel: dateLabel,
          health: record.health,
          motivation: record.motivation,
        };
      });

      setChartData(formattedData);

      setLoading(false);
    };

    loadData();
  }, []);

  //----- レンダリング　-----

  if (loading) {
    return (
      <div className="chart-loading-message">グラフデータを読み込み中...</div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="chart-no-data">今月の体調記録データがありません。</div>
    );
  }

  return (
    <div
      className="health-chart-container"
      style={{ width: "100%", height: 350 }}
    >
      <h3>今月の体調・モチベーション推移 (5: 良好 / -5: 不良)</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="dateLabel" />

          <YAxis
            domain={[-5, 5]}
            allowDecimals={false}
            ticks={[-5, 0, 5]}
            label={{ value: "スコア", angle: -90, position: "insideLeft" }}
          />

          <ReferenceLine y={0} stroke="#808080" strokeWidth={2} strokeDasharray="3 3" />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="health"
            name="体調"
            stroke="#4f46e5"
            strokeWidth={2}
            activeDot={{ r: 5 }}
          />

          <Line
            type="monotone"
            dataKey="motivation"
            name="モチベーション"
            stroke="#10b981"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
