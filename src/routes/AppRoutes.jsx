import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

// Loader
import Loader from "../components/common/Loader";

// Lazy pages
const Login = lazy(() => import("../pages/auth/Login"));
const EmployeeDashboard = lazy(() => import("../pages/employee/Dashboard"));
const CameraPage = lazy(() => import("../pages/employee/CameraPage"));
const AttendancePage = lazy(() => import("../pages/employee/Attendance"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const Employees = lazy(() => import("../pages/admin/Employees"));
const Reports = lazy(() => import("../pages/admin/Reports"));

const AppRoutes = () => {
  const { loading } = useAuth();

  // 👇 loader minimum vaqt (ms)
  const MIN_LOADING_TIME = 2000; // 2 sekund

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, MIN_LOADING_TIME);

    return () => clearTimeout(timer);
  }, []);

  // ⛔ auth yoki minimal vaqt tugamaguncha loader
  if (loading || showLoader) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
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
