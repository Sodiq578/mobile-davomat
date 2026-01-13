import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './admin-layout.css';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  MonitorOutlined, 
  BarChartOutlined, 
  LogoutOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  HomeOutlined,
  GlobalOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock notifications
  useEffect(() => {
    const mockNotifications = [
      { id: 1, title: "Yangi xodim qo'shildi", time: "5 daqiqa oldin", unread: true },
      { id: 2, title: "Sizga yangi vazifa berildi", time: "1 soat oldin", unread: true },
      { id: 3, title: "Tizim yangilandi", time: "Kecha, 14:30", unread: false },
      { id: 4, title: "Hisobot tayyor", time: "3 kun oldin", unread: false },
    ];
    setNotifications(mockNotifications);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('uz-UZ', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('uz-UZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">
              <GlobalOutlined />
            </div>
            <h2 className={sidebarCollapsed ? 'hidden' : ''}>Monitoring</h2>
          </div>
          
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        <div className="user-profile">
          <div className="avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} />
            ) : (
              <UserOutlined />
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="user-details">
              <h3 className="user-name">{user?.name || 'Administrator'}</h3>
              <p className="user-role">{user?.position || 'Admin'}</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/admin" 
            end 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <DashboardOutlined />
            <span className={sidebarCollapsed ? 'hidden' : ''}>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/admin/employees" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <TeamOutlined />
            <span className={sidebarCollapsed ? 'hidden' : ''}>Xodimlar</span>
            <span className="badge">45</span>
          </NavLink>

          <NavLink 
            to="/admin/live" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <MonitorOutlined />
            <span className={sidebarCollapsed ? 'hidden' : ''}>Real vaqtda</span>
            <span className="live-indicator"></span>
          </NavLink>

          <NavLink 
            to="/admin/reports" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <BarChartOutlined />
            <span className={sidebarCollapsed ? 'hidden' : ''}>Hisobotlar</span>
          </NavLink>

          {/* Map sahifasi uchun NavLink qo'shish */}
          <NavLink 
            to="/admin/map" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <AppstoreOutlined />
            <span className={sidebarCollapsed ? 'hidden' : ''}>Xaritada</span>
          </NavLink>

          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <SettingOutlined />
            <span className={sidebarCollapsed ? 'hidden' : ''}>Sozlamalar</span>
          </NavLink>

          <div className="nav-divider"></div>

          <button onClick={handleLogout} className="logout-btn">
            <LogoutOutlined />
            <span className={sidebarCollapsed ? 'hidden' : ''}>Chiqish</span>
          </button>
        </nav>

        {!sidebarCollapsed && (
          <div className="sidebar-footer">
            <div className="system-status">
              <div className="status-item">
                <span className="status-label">Tizim holati:</span>
                <span className="status-value active">Faol</span>
              </div>
              <div className="status-item">
                <span className="status-label">Xodimlar:</span>
                <span className="status-value">45/50</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <h1>Xodim Monitoring Tizimi</h1>
            <div className="breadcrumb">
              <HomeOutlined />
              <span>Asosiy sahifa</span>
              <span className="separator">/</span>
              <span>Admin panel</span>
            </div>
          </div>

          <div className="header-right">
            <div className="datetime-display">
              <div className="time">{formatTime(currentTime)}</div>
              <div className="date">{formatDate(currentTime)}</div>
            </div>

            <div className="header-actions">
              <div className="notification-dropdown">
                <button 
                  className="notification-btn" 
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <BellOutlined />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="notification-badge">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="notification-popup">
                    <div className="notification-header">
                      <h3>Bildirishnomalar</h3>
                      <button className="mark-read-btn" onClick={markAllAsRead}>
                        Barchasini o'qilgan deb belgilash
                      </button>
                    </div>
                    <div className="notification-list">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${notification.unread ? 'unread' : ''}`}
                        >
                          <div className="notification-content">
                            <p className="notification-title">{notification.title}</p>
                            <span className="notification-time">{notification.time}</span>
                          </div>
                          {notification.unread && <div className="unread-dot"></div>}
                        </div>
                      ))}
                    </div>
                    <div className="notification-footer">
                      <NavLink to="/admin/notifications" onClick={() => setShowNotifications(false)}>
                        Barchasini ko'rish
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>

              <div className="user-menu">
                <div className="user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name} />
                  ) : (
                    <UserOutlined />
                  )}
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.name || 'Admin'}</span>
                  <span className="user-role">{user?.position || 'Administrator'}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-content">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="admin-footer">
          <div className="footer-content">
            <div className="footer-left">
              <p>© {new Date().getFullYear()} Xodim Monitoring Tizimi. Barcha huquqlar himoyalangan.</p>
            </div>
            <div className="footer-right">
              <div className="system-info">
                <span className="version">Versiya: 2.1.0</span>
                <div className="status-indicator">
                  <span className="indicator-dot"></span>
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;


