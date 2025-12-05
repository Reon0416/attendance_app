import { useState } from "react";
import { GoalInput } from "../components/GoalInput";
import { GoalTracker } from "../components/GoalTracker";
import { PayrollDisplay } from "../components/PayrollDisplay";
import { HeaderEmp } from "../components/HeaderEmp";
import "./style/PayrollEmp.css";

type Props = {
  onLogout: () => void;
};

function PayrollEmp({ onLogout }: Props) {
  const [reloadKey, setReloadKey] = useState(0);

  const handleGoalSet = () => {
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div>
      <HeaderEmp onLogout={onLogout} />
      <div className="pay-container">
        <div className="goal-card">
          <GoalTracker reloadKey={reloadKey} />
          <GoalInput onGoalSet={handleGoalSet} />
        </div>
        <div className="payroll-card">
          <PayrollDisplay />
        </div>
      </div>
    </div>
  );
}

export default PayrollEmp;
