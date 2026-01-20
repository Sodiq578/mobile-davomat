import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css'; // CSS faylini import qilamiz

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        
        
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