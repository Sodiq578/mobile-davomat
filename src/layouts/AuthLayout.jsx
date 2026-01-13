import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css'; // CSS faylini import qilamiz

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo-placeholder">
            <div className="logo-circle">
              <span className="logo-icon">👥</span>
            </div>
            <div className="logo-text">
              <div className="logo-title">XMT</div>
              <div className="logo-subtitle">Monitoring</div>
            </div>
          </div>
          <div className="auth-header-content">
            <h1 className="auth-title">Xodim Monitoring Tizimi</h1>
            <p className="auth-subtitle">Ish joyingizni kuzatish va boshqarish tizimi</p>
          </div>
        </div>
        
        <div className="auth-content">
          <div className="auth-form-wrapper">
            <Outlet />
          </div>
        </div>
        
        <div className="auth-footer">
          <p>© 2024 Xodim Monitoring. Barcha huquqlar himoyalangan.</p>
          <p className="footer-links">
            <a href="/privacy">Maxfiylik siyosati</a> | 
            <a href="/terms">Foydalanish shartlari</a> | 
            <a href="/contact">Aloqa</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;