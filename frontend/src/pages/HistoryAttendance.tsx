import { AttendanceHistoryData } from "../components/AttendanceHistoryData";
import { HeaderEmp } from "../components/HeaderEmp";

type Props = {
  onLogout: () => void;
};

function HistoryAttendance({ onLogout }: Props) {
  return (
    <div>
      <HeaderEmp onLogout={onLogout} />
      <AttendanceHistoryData />
    </div>
  );
}

export default HistoryAttendance;
