import { useState } from "react";
import { login } from "../api";
import type { User } from "../types";
import "./LoginPage.css";

type LoginPageProps = {
  onLogin: (user: User) => void;
};

function LoginPage({ onLogin }: LoginPageProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userId || !password) {
      setError("ユーザーIDとパスワードを入力してください");
      return;
    }

    setLoading(true);
    try {
      const user = await login(userId, password);
      onLogin(user);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("ログインに失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">ログイン</h2>

        <div className="form-group">
          <label htmlFor="userId">ユーザーID</label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading} className="login-button">
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;