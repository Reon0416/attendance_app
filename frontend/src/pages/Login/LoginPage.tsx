import { useState } from "react";
import { login } from "../../api/auth";
import type { User } from "../../types";
import { LoadingImage } from "../../components/LoadingImage";
import "./style/LoginPage.css";

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
    <div className="login-page-wrapper">
      <div className="login-card">
        <h2 className="login-header">
          <span>勤怠管理</span> ログイン
        </h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label htmlFor="userId" className="login-form label">
              ユーザーID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="login-form input"
              placeholder="あなたのユーザーID"
            />
          </div>

          <div>
            <label htmlFor="password" className="login-form label">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-form input"
              placeholder="********"
            />
          </div>

          {error && <p className="login-error-message">{error}</p>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? <LoadingImage /> : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
