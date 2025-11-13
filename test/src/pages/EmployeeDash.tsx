import type { User } from "../types";

type Props = {
  user: User;
  onLogout: () => void;
};

function EmployeeDash({ user, onLogout }: Props) {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "1.5rem" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>従業員用ダッシュボード</h1>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
            {user.name}（{user.userId}）としてログイン中
          </p>
        </div>
        <button onClick={onLogout}>ログアウト</button>
      </header>

      <main>
        <p>ここに「出勤」「退勤」「休憩」のボタンや勤怠履歴を実装していく。</p>
      </main>
    </div>
  );
}

export default EmployeeDash;