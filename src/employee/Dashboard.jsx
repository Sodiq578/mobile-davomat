import React, { useEffect, useState } from 'react';
import { useEmployee } from '../../context/EmployeeContext';
import { useRealtime } from '../../context/RealtimeContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/employee/StatusBadge';
import '../../styles/employee-dashboard.css';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { currentSession, getMyAttendance } = useEmployee();
  const { emitStatus } = useRealtime();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    getMyAttendance();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = async (newStatus) => {
    await emitStatus(user.id, newStatus);
    // Bu yerda API orqali status yangilash kerak
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
    <div className="employee-dashboard">
      <div className="dashboard-header">
        <h2>Xush kelibsiz, {user?.name}!</h2>
        <p className="current-date">{formatDate(currentTime)}</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card status-card">
          <h3>Joriy Holat</h3>
          <StatusBadge status={currentSession?.status || 'chiqib ketdi'} />
          <div className="status-actions">
            <button 
              onClick={() => handleStatusChange('ishlayapti')}
              className="status-btn active"
            >
              Ish boshlash
            </button>
            <button 
              onClick={() => handleStatusChange('tanaffus')}
              className="status-btn break"
            >
              Tanaffus
            </button>
            <button 
              onClick={() => handleStatusChange('chiqib ketdi')}
              className="status-btn offline"
            >
              Ishni tugatish
            </button>
          </div>
        </div>

        <div className="dashboard-card time-card">
          <h3>Bugungi Vaqt</h3>
          <div className="time-display">
            <div className="current-time">
              <span className="time-text">
                {currentTime.toLocaleTimeString('uz-UZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
            <div className="work-hours">
              <div className="work-hour">
                <span className="hour-label">Kirish:</span>
                <span className="hour-value">
                  {currentSession?.checkIn || '00:00'}
                </span>
              </div>
              <div className="work-hour">
                <span className="hour-label">Chiqish:</span>
                <span className="hour-value">
                  {currentSession?.checkOut || '00:00'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card info-card">
          <h3>Shaxsiy Ma'lumotlar</h3>
          <div className="personal-info">
            <div className="info-item">
              <span className="info-label">Lavozim:</span>
              <span className="info-value">{user?.position}</span>
            </div>
            <div className="info-item">
              <span className="info-label">ID:</span>
              <span className="info-value">{user?.id}</span>
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

      <div className="quick-actions">
        <h3>Tezkor Harakatlar</h3>
        <div className="action-buttons">
          <a href="/employee/camera" className="action-btn camera-btn">
            📸 Rasm olish
          </a>
          <a href="/employee/location" className="action-btn location-btn">
            📍 Lokatsiyani yuborish
          </a>
          <a href="/employee/attendance" className="action-btn attendance-btn">
            📝 Davomatni ko'rish
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;