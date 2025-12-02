import { useState, useEffect } from "react";
import { fetchMonthlyPayroll } from "../api/payroll";
import type {PayrollResult} from "../api/payroll";
import "./style/PayrollDisplay.css";

export function PayrollDisplay() {
  const [payrollData, setPayrollData] = useState<PayrollResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPayroll = async () => {
      const data = await fetchMonthlyPayroll();
      setPayrollData(data);
      setIsLoading(false);
    };

    loadPayroll();
  }, []);

  // --- レンダリング ---

  if (isLoading) {
    return <div className="payroll-loading">今月の給与データを計算中...</div>;
  }

  if (!payrollData) {
    return (
      <div className="payroll-no-data">今月の計算データがありません。</div>
    );
  }

  const { month, totalPay, totalNormalHours, totalLateNightHours } =
    payrollData;

  return (
    <div className="payroll-container">
      <h2>{month}月度の給与計算結果</h2>

      <div className="total-pay-card">
        <h3>総支給額 (概算)</h3>
        <p className="total-amount">¥ {totalPay.toLocaleString()}</p>
      </div>

      <div className="details-grid">
        <h4>勤務時間の内訳</h4>

        <div className="detail-item">
          <span className="label">通常勤務時間</span>
          <span className="value">{totalNormalHours.toFixed(2)} 時間</span>
        </div>

        <div className="detail-item">
          <span className="label">深夜勤務時間 (22時〜翌4時)</span>
          <span className="value">{totalLateNightHours.toFixed(2)} 時間</span>
        </div>

        <div className="detail-item total">
          <span className="label">合計実労働時間</span>
          <span className="value">
            {(totalNormalHours + totalLateNightHours).toFixed(2)} 時間
          </span>
        </div>
      </div>
    </div>
  );
}
