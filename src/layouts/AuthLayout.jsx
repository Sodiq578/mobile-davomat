import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo-placeholder">
            <div className="logo-circle">👥</div>
          </div>
          <h1>Xodim Monitoring Tizimi</h1>
          <p>Ish joyingizni kuzatish va boshqarish tizimi</p>
        </div>
        
        <div className="auth-content">
          <Outlet />
        </div>
        
        <div className="auth-footer">
          <p>© 2024 Xodim Monitoring. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;