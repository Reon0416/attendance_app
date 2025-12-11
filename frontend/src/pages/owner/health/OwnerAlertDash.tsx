import { useState, useEffect, useCallback } from "react";
import {
  fetchUncheckedAlerts,
  markAlertAsCheckedAPI,
} from "../../../api/healthCheck";
import type { AlertLog } from "../../../types";
import { LoadingImage } from "../../../components/LoadingImage";
import "./style/OwnerAlertDash.css";

export function OwnerAlertDash() {
  const [alerts, setAlerts] = useState<AlertLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchUncheckedAlerts();
    setAlerts(data);
    setIsLoading(false);
  }, []);

  const handleCheckAlert = useCallback(
    async (alertId: number) => {
      setUpdatingId(alertId);
      await markAlertAsCheckedAPI(alertId);

      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== alertId)
      );

      setUpdatingId(null);
    },
    [loadAlerts]
  );

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // --- レンダリング ---

  if (isLoading) {
    return <div className="alerts-loading">未確認アラートを読み込み中...</div>;
  }

  if (alerts.length === 0) {
    return <div className="alerts-no-data">未確認のアラートはありません。</div>;
  }

  return (
    <div className="alerts-dashboard-container">
      <h2>未確認健康アラート ({alerts.length}件)</h2>

      {alerts.map((alert) => {
        const isCurrentAlertUpdating = updatingId === alert.id;
        return (
          <div key={alert.id} className="alert-item">
            <div className="alert-details">
              <p>
                <strong>従業員:</strong> {alert.user.name} 
              </p>
              <p>
                <strong>内容:</strong> {alert.alertType} (合計{" "}
                {alert.totalPoints}pt)
              </p>
              <p className="alert-time">
                <strong>記録日時</strong>: {new Date(alert.loggedAt).toLocaleString("ja-JP")}
              </p>
            </div>

            <button
              onClick={() => handleCheckAlert(alert.id)}
              disabled={isCurrentAlertUpdating}
              className="check-button"
            >
              {isCurrentAlertUpdating ? <LoadingImage /> : "確認"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
