import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEmployee } from '../../context/EmployeeContext';
import { useRealtime } from '../../context/RealtimeContext';
import { useAuth } from '../../context/AuthContext';
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
    }, 1000); // Har soniyada yangilash

    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = async (newStatus) => {
    if (user?.id) {
      await emitStatus(user.id, newStatus);
      console.log('Status yangilandi:', newStatus);
      
      // Agar ish boshlansa, checkIn qilish
      if (newStatus === 'ishlayapti' && !currentSession) {
        await checkIn({
          timestamp: new Date().toISOString(),
          location: { lat: 41.3111, lng: 69.2797 }
        });
      }
      
      // Agar ish tugasa, checkOut qilish
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
    <div style={{
      padding: '1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: '#1e293b', marginBottom: '0.5rem' }}>
          Xush kelibsiz, {user?.name || 'Xodim'}!
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          {formatDate(currentTime)}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Status Card */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            color: '#1e293b',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            Joriy Holat
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: currentSession?.status === 'ishlayapti' ? '#10b981' : 
                         currentSession?.status === 'tanaffus' ? '#f59e0b' : '#94a3b8',
              animation: currentSession?.status === 'ishlayapti' ? 'pulse 2s infinite' : 'none'
            }}></div>
            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '1.125rem' }}>
              {currentSession?.status === 'ishlayapti' ? 'Ishlayapti' : 
               currentSession?.status === 'tanaffus' ? 'Tanaffusda' : 'Chiqib ketdi'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              onClick={() => handleStatusChange('ishlayapti')}
              disabled={currentSession?.status === 'ishlayapti'}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                cursor: currentSession?.status === 'ishlayapti' ? 'not-allowed' : 'pointer',
                opacity: currentSession?.status === 'ishlayapti' ? 0.6 : 1
              }}
            >
              {currentSession?.status === 'ishlayapti' ? '✅ Ish boshlangan' : 'Ish boshlash'}
            </button>
            <button 
              onClick={() => handleStatusChange('tanaffus')}
              disabled={!currentSession}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                cursor: !currentSession ? 'not-allowed' : 'pointer',
                opacity: !currentSession ? 0.6 : 1
              }}
            >
              Tanaffus
            </button>
            <button 
              onClick={() => handleStatusChange('chiqib ketdi')}
              disabled={!currentSession}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                background: '#f8fafc',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                cursor: !currentSession ? 'not-allowed' : 'pointer',
                opacity: !currentSession ? 0.6 : 1
              }}
            >
              Ishni tugatish
            </button>
          </div>
        </div>

        {/* Time Card */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            color: '#1e293b',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            Bugungi Vaqt
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', fontFamily: 'monospace' }}>
                {currentTime.toLocaleTimeString('uz-UZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: '#f8fafc',
                borderRadius: '0.5rem'
              }}>
                <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Kirish:</span>
                <span style={{ fontWeight: '600', color: '#1e293b', fontFamily: 'monospace', fontSize: '1.125rem' }}>
                  {currentSession?.checkIn || '00:00'}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: '#f8fafc',
                borderRadius: '0.5rem'
              }}>
                <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Chiqish:</span>
                <span style={{ fontWeight: '600', color: '#1e293b', fontFamily: 'monospace', fontSize: '1.125rem' }}>
                  {currentSession?.checkOut || '00:00'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            color: '#1e293b',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            Shaxsiy Ma'lumotlar
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              background: '#f8fafc',
              borderRadius: '0.5rem'
            }}>
              <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Lavozim:</span>
              <span style={{ fontWeight: '600', color: '#1e293b' }}>{user?.position || 'Xodim'}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              background: '#f8fafc',
              borderRadius: '0.5rem'
            }}>
              <span style={{ color: '#64748b', fontSize: '0.95rem' }}>ID:</span>
              <span style={{ fontWeight: '600', color: '#1e293b' }}>{user?.id || 'N/A'}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              background: '#f8fafc',
              borderRadius: '0.5rem'
            }}>
              <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Holat:</span>
              <span style={{ fontWeight: '600', color: '#1e293b' }}>
                {currentSession ? 'Ish joyida' : 'Ish joyida emas'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          color: '#1e293b',
          marginBottom: '1rem'
        }}>
          Tezkor Harakatlar
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <Link to="/employee/camera" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontWeight: '500',
            background: '#f8fafc',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}>
            📸 Rasm olish
          </Link>
          <Link to="/employee/location" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontWeight: '500',
            background: '#f8fafc',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}>
            📍 Lokatsiyani yuborish
          </Link>
          <Link to="/employee/attendance" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontWeight: '500',
            background: '#f8fafc',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}>
            📝 Davomatni ko'rish
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;