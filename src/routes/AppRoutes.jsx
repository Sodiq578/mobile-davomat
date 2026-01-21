import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

// ================= LAYOUTS =================
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

// ================= COMMON =================
import Loader from "../components/common/Loader";

// ================= AUTH =================
const Login = lazy(() => import("../pages/auth/Login"));

// ================= EMPLOYEE =================
const EmployeeDashboard = lazy(() =>
  import("../pages/employee/Dashboard")
);
const CameraPage = lazy(() =>
  import("../pages/employee/CameraPage")
);
const AttendancePage = lazy(() =>
  import("../pages/employee/Attendance")
);

// ================= ADMIN =================
const AdminDashboard = lazy(() =>
  import("../pages/admin/Dashboard")
);
const Employees = lazy(() =>
  import("../pages/admin/Employees")
);
const Reports = lazy(() =>
  import("../pages/admin/Reports")
);

// ================= ROUTES =================
const AppRoutes = () => {
  const { loading } = useAuth();

  // auth tekshirilayotganda
  if (loading) return <Loader />;

  return (
    <Suspense fallback={<Loader />}>
      <Routes>

        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* ===== EMPLOYEE ===== */}
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

        {/* ===== ADMIN ===== */}
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

        {/* ===== 404 ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
