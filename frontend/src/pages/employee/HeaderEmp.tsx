import { NavLink } from "react-router-dom";
import "../style/Header.css";

type HeaderEmpProps = {
  onLogout: () => void;
};

export function HeaderEmp({ onLogout }: HeaderEmpProps) {
  return (
    <header className="header-emp">
      <p>勤怠管理</p>
      <div className="nav-wrapper">
        <nav className="header-nav">
          <NavLink to="/employee" end>打刻</NavLink>
          <NavLink to="/employee/health">健康管理</NavLink>
          <NavLink to="/employee/payroll">給与</NavLink>
          <NavLink to="/employee/history">勤怠履歴</NavLink>
          <NavLink to="/employee/setting">設定</NavLink>
        </nav>

        <button className="logout-button" onClick={onLogout}>
          ログアウト
        </button>
      </div>
    </header>
  );
}
