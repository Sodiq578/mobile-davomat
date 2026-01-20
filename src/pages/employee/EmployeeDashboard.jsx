import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEmployee } from '../../context/EmployeeContext';
import { useRealtime } from '../../context/RealtimeContext';
import { useAuth } from '../../context/AuthContext';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { currentSession, getMyAttendance, checkIn, checkOut } = useEmployee();
  const { emitStatus } = useRealtime();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    getMyAttendance();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = async (newStatus) => {
    if (user?.id) {
      await emitStatus(user.id, newStatus);
      
      if (newStatus === 'ishlayapti' && !currentSession) {
        await checkIn({
          timestamp: new Date().toISOString(),
          location: { lat: 41.3111, lng: 69.2797 }
        });
      }
      
      if (newStatus === 'chiqib ketdi' && currentSession) {
        await checkOut();
      }
    }
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
    <>
      <BurgerMenu />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">
            Xush kelibsiz, {user?.name || 'Xodim'}!
          </h2>
          <p className="dashboard-subtitle">
            {formatDate(currentTime)}
          </p>
        </div>

        <div className="cards-grid">
          {/* Status Card */}
          <div className="card">
            <h3 className="card-header">Joriy Holat</h3>
            <div className="status-indicator">
              <div className={`status-dot ${
                currentSession?.status === 'ishlayapti' ? 'active' : 
                currentSession?.status === 'tanaffus' ? 'break' : 'away'
              }`}></div>
              <span className="status-text">
                {currentSession?.status === 'ishlayapti' ? 'Ishlayapti' : 
                 currentSession?.status === 'tanaffus' ? 'Tanaffusda' : 'Chiqib ketdi'}
              </span>
            </div>
            <div className="btn-group">
              <button 
                onClick={() => handleStatusChange('ishlayapti')}
                disabled={currentSession?.status === 'ishlayapti'}
                className="btn-primary"
              >
                {currentSession?.status === 'ishlayapti' ? '✅ Ish boshlangan' : 'Ish boshlash'}
              </button>
              <button 
                onClick={() => handleStatusChange('tanaffus')}
                disabled={!currentSession}
                className="btn-secondary"
              >
                Tanaffus
              </button>
              <button 
                onClick={() => handleStatusChange('chiqib ketdi')}
                disabled={!currentSession}
                className="btn-outline"
              >
                Ishni tugatish
              </button>
            </div>
          </div>

          {/* Time Card */}
          <div className="card">
            <h3 className="card-header">Bugungi Vaqt</h3>
            <div className="time-display">
              <span className="current-time">
                {currentTime.toLocaleTimeString('uz-UZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
            <div className="info-group">
              <div className="info-item">
                <span className="info-label">Kirish:</span>
                <span className="info-value time-value">
                  {currentSession?.checkIn || '00:00'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Chiqish:</span>
                <span className="info-value time-value">
                  {currentSession?.checkOut || '00:00'}
                </span>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="card">
            <h3 className="card-header">Shaxsiy Ma'lumotlar</h3>
            <div className="info-group">
              <div className="info-item">
                <span className="info-label">Lavozim:</span>
                <span className="info-value">{user?.position || 'Xodim'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">ID:</span>
                <span className="info-value">{user?.id || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Holat:</span>
                <span className="info-value">
                  {currentSession ? 'Ish joyida' : 'Ish joyida emas'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3 className="card-header">Tezkor Harakatlar</h3>
          <div className="actions-grid">
            <Link to="/employee/camera" className="action-link">
              📸 Rasm olish
            </Link>
            <Link to="/employee/location" className="action-link">
              📍 Lokatsiyani yuborish
            </Link>
            <Link to="/employee/attendance" className="action-link">
              📝 Davomatni ko'rish
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;