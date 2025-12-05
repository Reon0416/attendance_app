import { NavLink } from "react-router-dom";
import "./style/HeaderEmp.css"

type HeaderEmpProps = {
  onLogout: () => void;
};

export function HeaderEmp({ onLogout }: HeaderEmpProps) {
  return (
    <header className="header-emp">
      <p>勤怠管理</p>
      <div className="nav-wrapper">
        <nav className="header-nav">
          <NavLink to="/employee">打刻</NavLink>
          <NavLink to="/health">健康管理</NavLink>
          <NavLink to="/payroll">給与</NavLink>
          <NavLink to="/history">勤怠履歴</NavLink>
          <NavLink to="/setting">設定</NavLink>
        </nav>

        <button className="logout-button" onClick={onLogout}>
          ログアウト
        </button>
      </div>
    </header>
  );
}
