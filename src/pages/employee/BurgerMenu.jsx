import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './BurgerMenu.css';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <>
      <div className="burger-menu">
        <button className="burger-btn" onClick={toggleMenu}>
          <div className={`burger-line ${isOpen ? 'open' : ''}`}></div>
          <div className={`burger-line ${isOpen ? 'open' : ''}`}></div>
          <div className={`burger-line ${isOpen ? 'open' : ''}`}></div>
        </button>
      </div>

      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={closeMenu}></div>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
            <div>
              <h3 className="user-name">{user?.name || 'Foydalanuvchi'}</h3>
              <p className="user-position">{user?.position || 'Xodim'}</p>
            </div>
          </div>
          <button className="close-btn" onClick={closeMenu}>×</button>
        </div>

        <div className="menu-items">
          <Link to="/employee" className="menu-item" onClick={closeMenu}>
            <span className="menu-icon">🏠</span>
            <span>Bosh sahifa</span>
          </Link>
          
          <Link to="/employee/camera" className="menu-item" onClick={closeMenu}>
            <span className="menu-icon">📸</span>
            <span>Rasm olish</span>
          </Link>
          
          <Link to="/employee/location" className="menu-item" onClick={closeMenu}>
            <span className="menu-icon">📍</span>
            <span>Joylashuv</span>
          </Link>
          
          <Link to="/employee/attendance" className="menu-item" onClick={closeMenu}>
            <span className="menu-icon">📝</span>
            <span>Davomat</span>
          </Link>
          
          <div className="menu-divider"></div>
          
          <Link to="/profile" className="menu-item" onClick={closeMenu}>
            <span className="menu-icon">👤</span>
            <span>Profil</span>
          </Link>
          
          <Link to="/settings" className="menu-item" onClick={closeMenu}>
            <span className="menu-icon">⚙️</span>
            <span>Sozlamalar</span>
          </Link>
          
          <button className="menu-item logout-btn" onClick={handleLogout}>
            <span className="menu-icon">🚪</span>
            <span>Chiqish</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <p className="version">v1.0.0</p>
        </div>
      </div>
    </>
  );
};

export default BurgerMenu;