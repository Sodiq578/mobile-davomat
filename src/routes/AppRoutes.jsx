import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

/* ================= AUTH ================= */
const Login = lazy(() => import("../pages/auth/Login"));

/* ================= EMPLOYEE ================= */
const EmployeeDashboard = lazy(() =>
  import("../pages/employee/Dashboard")
);
const CameraPage = lazy(() =>
  import("../pages/employee/CameraPage")
);
const AttendancePage = lazy(() =>
  import("../pages/employee/Attendance")
);

/* ================= ADMIN ================= */
const AdminDashboard = lazy(() =>
  import("../pages/admin/Dashboard")
);
const Employees = lazy(() =>
  import("../pages/admin/Employees")
);
const Reports = lazy(() =>
  import("../pages/admin/Reports")
);

/* ================= LOADING ================= */
const LoadingFallback = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#1e3a8a",
      color: "white",
      flexDirection: "column",
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        border: "4px solid rgba(255,255,255,0.4)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: 10,
      }}
    />
    <p>Yuklanmoqda...</p>

    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

/* ================= ROUTES ================= */
const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) return <LoadingFallback />;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* EMPLOYEE */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeDashboard />} />
          <Route path="camera" element={<CameraPage />} />
          <Route path="attendance" element={<AttendancePage />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
