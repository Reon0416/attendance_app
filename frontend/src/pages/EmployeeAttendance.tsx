import { AttendanceButtons } from "../components/AttendanceButtons";
import { RealTimeClock } from "../components/RealTimeClock";
import { HeaderEmp } from "../components/HeaderEmp";
import type { User } from "../types";
import "./style/EmployeeAttendance.css";

type Props = {
  user: User;
  onLogout: () => void;
};

function EmployeeAttendance({ user, onLogout }: Props) {
  return (
    <div className="attendance-page-wrapper">
      <HeaderEmp onLogout={onLogout} />
      <div className="main-content-area">
        <div className="card">
          <p className="username">名前：{user.name}</p>
          <div className="clock-area">
            <RealTimeClock />
          </div>
          <div className="attendance-buttons-wrapper">
            <AttendanceButtons />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeAttendance;
