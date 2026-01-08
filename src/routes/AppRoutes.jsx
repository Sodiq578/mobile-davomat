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
// Tez vaqt uchun boshqa sahifalarni comment qilamiz
// const CameraPage = lazy(() => import('../pages/employee/CameraPage'));
// const LocationPage = lazy(() => import('../pages/employee/LocationPage'));
// const AttendancePage = lazy(() => import('../pages/employee/Attendance'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
// Tez vaqt uchun boshqa sahifalarni comment qilamiz
// const EmployeesPage = lazy(() => import('../pages/admin/Employees'));
// const LiveTrackingPage = lazy(() => import('../pages/admin/LiveTracking'));
// const MapViewPage = lazy(() => import('../pages/admin/MapView'));
// const ReportsPage = lazy(() => import('../pages/admin/Reports'));

const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loader"></div>
    <p>Yuklanmoqda...</p>
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
          {/* Keyin boshqa sahifalarni qo'shamiz */}
          <Route path="camera" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Kamera sahifasi</h2>
              <p>Tez orada qo'shiladi...</p>
            </div>
          } />
          <Route path="location" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Lokatsiya sahifasi</h2>
              <p>Tez orada qo'shiladi...</p>
            </div>
          } />
          <Route path="attendance" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Davomat sahifasi</h2>
              <p>Tez orada qo'shiladi...</p>
            </div>
          } />
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
          {/* Keyin boshqa sahifalarni qo'shamiz */}
          <Route path="employees" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Xodimlar sahifasi</h2>
              <p>Tez orada qo'shiladi...</p>
            </div>
          } />
          <Route path="live" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Real vaqtda kuzatish</h2>
              <p>Tez orada qo'shiladi...</p>
            </div>
          } />
          <Route path="map" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Xarita sahifasi</h2>
              <p>Tez orada qo'shiladi...</p>
            </div>
          } />
          <Route path="reports" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Hisobotlar sahifasi</h2>
              <p>Tez orada qo'shiladi...</p>
            </div>
          } />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;