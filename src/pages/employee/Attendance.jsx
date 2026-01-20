import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../../context/EmployeeContext';
import { useAuth } from '../../context/AuthContext';
import BurgerMenu from './BurgerMenu';
import './AttendancePage.css';

const AttendancePage = () => {
  const { attendance, getMyAttendance, currentSession } = useEmployee();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      await getMyAttendance();
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('uz-UZ', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString || timeString === '00:00') return '-';
    return timeString;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ishlayapti': return '#10b981';
      case 'tanaffus': return '#f59e0b';
      case 'chiqib ketdi': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'ishlayapti': return 'Ishlayapti';
      case 'tanaffus': return 'Tanaffus';
      case 'chiqib ketdi': return 'Chiqib ketdi';
      default: return 'Noma\'lum';
    }
  };

  const calculateWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut || checkIn === '00:00' || checkOut === '00:00') return '-';
    
    try {
      const [inHour, inMinute] = checkIn.split(':').map(Number);
      const [outHour, outMinute] = checkOut.split(':').map(Number);
      
      const totalMinutes = (outHour * 60 + outMinute) - (inHour * 60 + inMinute);
      if (totalMinutes < 0) return '-';
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      return `${hours}h ${minutes}m`;
    } catch {
      return '-';
    }
  };

  const handleGoBack = () => {
    navigate('/employee');
  };

  const filteredAttendance = attendance.filter(record => {
    try {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === selectedMonth && 
             recordDate.getFullYear() === selectedYear;
    } catch (e) {
      return false;
    }
  });

  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const calculateStats = () => {
    const totalDays = filteredAttendance.length;
    const workedDays = filteredAttendance.filter(a => 
      a.status === 'ishlayapti' || a.status === 'chiqib ketdi'
    ).length;
    const breakDays = filteredAttendance.filter(a => a.status === 'tanaffus').length;
    
    return { totalDays, workedDays, breakDays };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="loading-state">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <>
      <BurgerMenu />
      <div className="attendance-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <button className="back-btn" onClick={handleGoBack}>
              ← Orqaga
            </button>
            <h2 className="page-title">Davomat jadvali</h2>
          </div>
          <p className="page-subtitle">
            Ish vaqti yozuvlari va davomat statistikasi
          </p>
        </div>

        {/* Current Session Info */}
        {currentSession && (
          <div className="current-session">
            <h3 className="session-title">🎯 Bugungi ish kuni</h3>
            <div className="session-grid">
              <div className="session-item">
                <div className="session-label">Kirish vaqti</div>
                <div className="session-value">
                  {currentSession.checkIn || '00:00'}
                </div>
              </div>
              <div className="session-item">
                <div className="session-label">Chiqish vaqti</div>
                <div className="session-value">
                  {currentSession.checkOut || 'Ishlamoqda...'}
                </div>
              </div>
              <div className="session-item">
                <div className="session-label">Holat</div>
                <div className="session-value">
                  {getStatusText(currentSession.status)}
                </div>
              </div>
              <div className="session-item">
                <div className="session-label">Ish kuni</div>
                <div className="session-value">
                  {currentSession.checkOut ? calculateWorkHours(currentSession.checkIn, currentSession.checkOut) : 'Ishlamoqda...'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label className="filter-label">Oyni tanlang:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="filter-select"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Yilni tanlang:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="filter-select"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={loadAttendance}
            className="refresh-btn"
          >
            🔄 Yangilash
          </button>
        </div>

        {/* Stats Summary */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#2563eb' }}>
              {stats.totalDays}
            </div>
            <div className="stat-label">Ish kuni</div>
          </div>

          <div className="stat-card">
            <div className="stat-value" style={{ color: '#10b981' }}>
              {stats.workedDays}
            </div>
            <div className="stat-label">To'liq ishlagan kunlar</div>
          </div>

          <div className="stat-card">
            <div className="stat-value" style={{ color: '#f59e0b' }}>
              {stats.breakDays}
            </div>
            <div className="stat-label">Tanaffus kunlari</div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="attendance-table">
          <div className="table-header">
            <span>Davomat jadvali</span>
            <span className="table-count">
              {filteredAttendance.length} ta yozuv
            </span>
          </div>

          {filteredAttendance.length === 0 ? (
            <div className="empty-table">
              <div className="empty-icon">📅</div>
              <div className="empty-title">
                Bu oy uchun davomat ma'lumotlari mavjud emas
              </div>
              <div className="empty-subtitle">
                Boshqa oy yoki yilni tanlang
              </div>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Kirish</th>
                    <th>Chiqish</th>
                    <th>Ish vaqti</th>
                    <th>Holat</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((record, index) => (
                    <tr key={index}>
                      <td>
                        {formatDate(record.date)}
                      </td>
                      <td className="time-cell">
                        {formatTime(record.checkIn)}
                      </td>
                      <td className="time-cell">
                        {formatTime(record.checkOut)}
                      </td>
                      <td>
                        {calculateWorkHours(record.checkIn, record.checkOut)}
                      </td>
                      <td>
                        <div className={`status-badge ${
                          record.status === 'ishlayapti' ? 'status-working' :
                          record.status === 'tanaffus' ? 'status-break' : 'status-away'
                        }`}>
                          <div className="status-dot"></div>
                          {getStatusText(record.status)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="instructions-section">
          <h3 className="section-title">📋 Davomat tushuntirishi:</h3>
          <div className="instructions-grid">
            <div className="instruction-card">
              <div className="instruction-header">
                <div className="status-dot" style={{ background: '#10b981' }}></div>
                <h4 className="instruction-title">Ishlayapti</h4>
              </div>
              <p className="instruction-text">
                Ish vaqtida bo'lgan holat. To'liq ish kuni hisoblanadi.
              </p>
            </div>
            
            <div className="instruction-card">
              <div className="instruction-header">
                <div className="status-dot" style={{ background: '#f59e0b' }}></div>
                <h4 className="instruction-title">Tanaffus</h4>
              </div>
              <p className="instruction-text">
                Ovqatlanish yoki boshqa tanaffus vaqtidagi holat.
              </p>
            </div>
            
            <div className="instruction-card">
              <div className="instruction-header">
                <div className="status-dot" style={{ background: '#ef4444' }}></div>
                <h4 className="instruction-title">Chiqib ketdi</h4>
              </div>
              <p className="instruction-text">
                Ishni tugatgan holat. Ish kuni yakunlangan deb hisoblanadi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendancePage;