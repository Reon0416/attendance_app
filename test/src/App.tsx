import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import EmployeeDashboard from "./pages/EmployeeDash";
import OwnerDashboard from "./pages/OwnerDash";
import { fetchMe, logout } from "./api";
import type { User } from "./types";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadMe = async () => {
      try {
        const me = await fetchMe();
        if (me) setUser(me);
      } catch (err) {
        console.error(err);
        setError("ログイン状態の確認に失敗しました");
      } finally {
        setInitialLoading(false);
      }
    };
    loadMe();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setUser(user);
    setError("");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        ログイン状態を確認しています…
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ fontFamily: "sans-serif" }}>
        {error && (<p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>{error}</p>)}
        <LoginPage onLogin={handleLoginSuccess} />
      </div>
    );
  }

  // ログイン済みのとき
  if (user.role === "EMPLOYEE") {
    return (
      <EmployeeDashboard user={user} onLogout={handleLogout} />
    );
  }

  return <OwnerDashboard user={user} onLogout={handleLogout} />;
}

export default App;