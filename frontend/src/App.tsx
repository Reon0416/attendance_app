import LoginPage from "./pages/LoginPage";
import EmployeeAttendance from "./pages/EmployeeAttendance";
import OwnerDashboard from "./pages/OwnerDash";
import SettingEmp from "./pages/SettingEmp";
import PayrollDisplay from "./pages/PayrollEmp";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import HistoryAttendance from './pages/HistoryAttendance';
import type { User } from "./types";
import HealthRecord from "./pages/HealthRecord";

function App() {
  const { user, initialLoading, handleLoginSuccess, error, handleLogout } =
    useAuth();

  if (initialLoading) {
    return (
      <div className="text-3xl font-bold text-blue-600">
        ログイン状態を確認しています…
      </div>
    );
  }

  return (
    <div className="font-sans">
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-center font-medium">
          {error}
        </div>
      )}

      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLogin={handleLoginSuccess} />
            )
          }
        />

        <Route
          path="/employee"
          element={
            <ProtectedRoute user={user}>
              <EmployeeAttendance user={user as User} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner"
          element={
            <ProtectedRoute user={user}>
              <OwnerDashboard user={user as User} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute user={user}>
              <HistoryAttendance onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health"
          element={
            <ProtectedRoute user={user}>
              <HealthRecord onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <ProtectedRoute user={user}>
              <SettingEmp onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll"
          element={
            <ProtectedRoute user={user}>
              <PayrollDisplay onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={user.role === "OWNER" ? "/owner" : "/employee"}
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

      </Routes>
    </div>
  );
}

export default App;
