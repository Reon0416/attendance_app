import { NavLink } from "react-router-dom";
import "../style/Header.css"

type HeaderOwnerProps = {
  onLogout: () => void;
};

export function HeaderOwner({ onLogout }: HeaderOwnerProps) {
  return (
    <header className="header-emp">
      <p>勤怠管理</p>
      <div className="nav-wrapper">
        <nav className="header-nav">
          <NavLink to="/owner" end>体調管理</NavLink>
          <NavLink to="/owner/table">従業員一覧テーブル</NavLink>
          <NavLink to="/owner/setting">設定</NavLink>
        </nav>

        <button className="logout-button" onClick={onLogout}>
          ログアウト
        </button>
      </div>
    </header>
  );
}