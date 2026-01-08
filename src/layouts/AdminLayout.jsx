import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-layout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.position}</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => 
            isActive ? 'nav-link active' : 'nav-link'
          }>
            🏠 Dashboard
          </NavLink>
          <NavLink to="/admin/employees" className={({ isActive }) => 
            isActive ? 'nav-link active' : 'nav-link'
          }>
            👥 Xodimlar
          </NavLink>
          <NavLink to="/admin/live" className={({ isActive }) => 
            isActive ? 'nav-link active' : 'nav-link'
          }>
            🗺️ Real vaqtda kuzatish
          </NavLink>
          <NavLink to="/admin/reports" className={({ isActive }) => 
            isActive ? 'nav-link active' : 'nav-link'
          }>
            📊 Hisobotlar
          </NavLink>
          <button onClick={logout} className="logout-btn">
            🚪 Chiqish
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Xodim Monitoring Tizimi</h1>
          <div className="header-status">
            <span className="status-indicator online"></span>
            <span>Online</span>
          </div>
        </header>
        
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;