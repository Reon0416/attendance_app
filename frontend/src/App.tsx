import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import type { User } from "./types";
import { LoadingImage } from "./components/LoadingImage";
import LoginPage from "./pages/Login/LoginPage";
import HealthPage from "./pages/employee/health/HealthPage";
import EmployeeTablePage from "./pages/owner/table/EmployeeTablePage";
import SettingOwnerPage from "./pages/owner/setting/SettingOwnerPage";
import HistoryAttendancePage from "./pages/employee/history/HistoryAttendancePage";
import SettingEmpPage from "./pages/employee/setting/SettingEmpPage";
import PayrollPage from "./pages/employee/payroll/PayrollPage";
import AttendancePage from "./pages/employee/attendance/AttendancePage";
import OwnerPage from "./pages/owner/health/OwnerPage";
import "./App.css";

function App() {
  const { user, initialLoading, handleLoginSuccess, error, handleLogout } =
    useAuth();


  if (initialLoading) {
    return (
      <div className="login-load">
        <LoadingImage />
      </div>
    );
  }

  const isOwner = user?.role === "OWNER";

  return (
    <div >
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={isOwner ? "/owner" : "/employee"} replace />
            ) : (
              <LoginPage onLogin={handleLoginSuccess} />
            )
          }
        />

        // オーナールート
        <Route
          path="/owner"
          element={
            <ProtectedRoute user={user}>
              <OwnerPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/table"
          element={
            <ProtectedRoute user={user}>
              <EmployeeTablePage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/setting"
          element={
            <ProtectedRoute user={user}>
              <SettingOwnerPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />


        // 従業員ルート
        <Route
          path="/employee"
          element={
            <ProtectedRoute user={user}>
              <AttendancePage user={user as User} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/history"
          element={
            <ProtectedRoute user={user}>
              <HistoryAttendancePage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/health"
          element={
            <ProtectedRoute user={user}>
              <HealthPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/setting"
          element={
            <ProtectedRoute user={user}>
              <SettingEmpPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/payroll"
          element={
            <ProtectedRoute user={user}>
              <PayrollPage onLogout={handleLogout} />
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
