import { useState } from "react";
import { GoalInput } from "../components/GoalInput";
import { GoalTracker } from "../components/GoalTracker";
import { HeaderEmp } from "../components/HeaderEmp";
import "../components/style/Goal.css";

type Props = {
  onLogout: () => void;
};

export function GoalEmp({ onLogout }: Props) {
  const [reloadKey, setReloadKey] = useState(0);

  const handleGoalSet = () => {
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div>
      <HeaderEmp onLogout={onLogout} />
      <div className="goal-emp-page-container">
        <h2>目標管理ダッシュボード</h2>

        <div className="goal-content-grid">
          <div className="grid-item tracker-area">
            <GoalTracker reloadKey={reloadKey} />
          </div>

          <div className="grid-item input-area">
            <GoalInput onGoalSet={handleGoalSet} />
          </div>
        </div>
      </div>
    </div>
  );
}
