import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/employee-layout.css';

const EmployeeLayout = () => {
  const { user, logout } = useAuth();
  const currentTime = new Date().toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="employee-layout">
      <header className="employee-header">
        <div className="header-left">
          <h1>Xodim Kabineti</h1>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-position">{user?.position}</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="current-time">
            <span>🕐 {currentTime}</span>
          </div>
          <button onClick={logout} className="logout-btn">
            Chiqish
          </button>
        </div>
      </header>

      <nav className="employee-nav">
        <NavLink to="/employee" end className={({ isActive }) => 
          isActive ? 'nav-item active' : 'nav-item'
        }>
          🏠 Dashboard
        </NavLink>
        <NavLink to="/employee/camera" className={({ isActive }) => 
          isActive ? 'nav-item active' : 'nav-item'
        }>
          📸 Kamera
        </NavLink>
        <NavLink to="/employee/location" className={({ isActive }) => 
          isActive ? 'nav-item active' : 'nav-item'
        }>
          📍 Lokatsiya
        </NavLink>
        <NavLink to="/employee/attendance" className={({ isActive }) => 
          isActive ? 'nav-item active' : 'nav-item'
        }>
          📝 Davomat
        </NavLink>
      </nav>

      <main className="employee-main">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;