import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';

// Lazy loading pages
const Login = lazy(() => import('../pages/auth/Login'));

// Employee pages
const EmployeeDashboard = lazy(() => import('../pages/employee/Dashboard'));
const CameraPage = lazy(() => import('../pages/employee/CameraPage'));
const LocationPage = lazy(() => import('../pages/employee/LocationPage'));
// Agar Attendance mavjud bo'lmasa, oddiy component yaratamiz
const AttendancePage = lazy(() => import('../pages/employee/Attendance'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: 'white'
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '5px solid rgba(255,255,255,0.3)',
      borderBottomColor: 'white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem'
    }}></div>
    <p>Yuklanmoqda...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Protected routes - Employee */}
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
          <Route path="location" element={<LocationPage />} />
          <Route path="attendance" element={<AttendancePage />} />
        </Route>

        {/* Protected routes - Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;