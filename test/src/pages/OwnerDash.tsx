import type { User } from "../types";

type Props = {
  user: User;
  onLogout: () => void;
};

function OwnerDash({ user, onLogout }: Props) {
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
          <h1 style={{ margin: 0 }}>オーナー管理画面</h1>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
            {user.name}（{user.userId}）としてログイン中
          </p>
        </div>
        <button onClick={onLogout}>ログアウト</button>
      </header>

      <main>
        <p>ここに「従業員一覧」「勤怠集計」などの機能を実装していく。</p>
      </main>
    </div>
  );
}

export default OwnerDash;