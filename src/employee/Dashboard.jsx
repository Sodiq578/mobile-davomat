import React, { useEffect, useState } from 'react';
import { 
  FaUser, 
  FaClock, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaPlayCircle,
  FaPauseCircle,
  FaStopCircle,
  FaCamera,
  FaLocationArrow,
  FaClipboardCheck,
  FaBell,
  FaChartBar,
  FaHistory,
  FaUserCircle,
  FaIdCard,
  FaBuilding,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle
} from 'react-icons/fa';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentStatus, setCurrentStatus] = useState('offline');
  const [workTime, setWorkTime] = useState({ hours: 0, minutes: 0 });
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [locationData, setLocationData] = useState(null);

  // Demo foydalanuvchi ma'lumotlari
  const user = {
    id: 12345,
    name: 'Aliyev Aziz',
    position: 'Senior Dasturchi',
    department: 'IT Bo\'limi',
    email: 'aziz@company.com',
    avatar: 'AA',
    checkInTime: '09:00',
    checkOutTime: '18:00',
    attendanceRate: 95
  };

  // Demo attendance ma'lumotlari
  const demoAttendance = {
    checkIn: '09:15',
    checkOut: '17:45',
    totalHours: '8.5',
    status: 'working',
    location: 'Toshkent, Yunusobod',
    lastUpdate: '10 daqiqa oldin'
  };

  // Demo notificationlar
  const demoNotifications = [
    { id: 1, message: 'Ish boshlash vaqti', time: '08:45', type: 'info' },
    { id: 2, message: 'Davomat tasdiqlandi', time: '09:30', type: 'success' },
    { id: 3, message: 'GPS signali zaif', time: '10:15', type: 'warning' },
    { id: 4, message: 'Tanaffus vaqti', time: '13:00', type: 'info' }
  ];

  useEffect(() => {
    // Real vaqtni yangilash
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Ish vaqtini hisoblash
      if (demoAttendance.checkIn) {
        const [hours, minutes] = demoAttendance.checkIn.split(':').map(Number);
        const startTime = new Date();
        startTime.setHours(hours, minutes, 0);
        
        const diffMs = new Date() - startTime;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        setWorkTime({ hours: diffHours, minutes: diffMinutes });
      }
    }, 1000);

    // Ma'lumotlarni yuklash
    setTodayAttendance(demoAttendance);
    setNotifications(demoNotifications);
    setCurrentStatus(demoAttendance.status);
    
    // GPS ma'lumotlarini olish
    getLocation();
    
    return () => clearInterval(timeInterval);
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error('GPS xatosi:', error);
          setLocationData({
            latitude: 41.311081,
            longitude: 69.240562,
            accuracy: 100,
            error: 'GPS o\'chirilgan'
          });
        }
      );
    }
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    
    // Bu yerda API ga so'rov yuboriladi
    console.log(`Status o'zgartirildi: ${newStatus}`);
    
    // Notification qo'shish
    const statusMessages = {
      working: 'Ish boshlash tasdiqlandi',
      break: 'Tanaffusga chiqildi',
      offline: 'Ish tugatildi'
    };
    
    const newNotification = {
      id: Date.now(),
      message: statusMessages[newStatus] || 'Status o\'zgartirildi',
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      type: 'success'
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  };

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('uz-UZ', options);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'working': return <FaPlayCircle />;
      case 'break': return <FaPauseCircle />;
      case 'offline': return <FaStopCircle />;
      default: return <FaUserCircle />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'working': return '#2ecc71';
      case 'break': return '#f39c12';
      case 'offline': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'working': return 'Ishlayapti';
      case 'break': return 'Tanaffusda';
      case 'offline': return 'Ishlamayapti';
      default: return 'Noma\'lum';
    }
  };

  return (
    <div className="employee-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>
            <FaUserCircle className="header-icon" />
            Xush kelibsiz, <span className="user-name">{user.name}</span>
          </h1>
          <p className="current-date">
            <FaCalendarAlt /> {formatDate(currentTime)}
          </p>
        </div>
        <div className="header-right">
          <div className="notifications-badge">
            <FaBell />
            <span className="notification-count">{notifications.length}</span>
          </div>
          <div className="user-avatar">
            {user.avatar}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {/* Holat karti */}
        <div className="stat-card status-card">
          <div className="stat-icon" style={{ backgroundColor: getStatusColor(currentStatus) + '20', color: getStatusColor(currentStatus) }}>
            {getStatusIcon(currentStatus)}
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{getStatusText(currentStatus)}</h3>
            <p className="stat-title">Joriy holat</p>
            <div className="stat-actions">
              <button 
                onClick={() => handleStatusChange('working')}
                className={`status-btn ${currentStatus === 'working' ? 'active' : ''}`}
              >
                <FaPlayCircle /> Ish boshlash
              </button>
              <button 
                onClick={() => handleStatusChange('break')}
                className={`status-btn ${currentStatus === 'break' ? 'active' : ''}`}
              >
                <FaPauseCircle /> Tanaffus
              </button>
              <button 
                onClick={() => handleStatusChange('offline')}
                className={`status-btn ${currentStatus === 'offline' ? 'active' : ''}`}
              >
                <FaStopCircle /> Ish tugatish
              </button>
            </div>
          </div>
        </div>

        {/* Vaqt karti */}
        <div className="stat-card time-card">
          <div className="stat-icon" style={{ backgroundColor: '#3498db20', color: '#3498db' }}>
            <FaClock />
          </div>
          <div className="stat-content">
            <div className="time-display">
              <div className="current-time">
                {currentTime.toLocaleTimeString('uz-UZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className="elapsed-time">
                Bugungi ish vaqti: <strong>{workTime.hours} soat {workTime.minutes} daqiqa</strong>
              </div>
            </div>
            <div className="time-details">
              <div className="time-item">
                <span className="time-label">Kirish:</span>
                <span className="time-value">{demoAttendance.checkIn}</span>
              </div>
              <div className="time-item">
                <span className="time-label">Chiqish:</span>
                <span className="time-value">{demoAttendance.checkOut || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Davomat karti */}
        <div className="stat-card attendance-card">
          <div className="stat-icon" style={{ backgroundColor: '#2ecc7120', color: '#2ecc71' }}>
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{user.attendanceRate}%</h3>
            <p className="stat-title">Davomat darajasi</p>
            <div className="attendance-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${user.attendanceRate}%` }}
                ></div>
              </div>
              <span className="progress-text">{user.attendanceRate}%</span>
            </div>
            <div className="attendance-stats">
              <div className="attendance-stat">
                <span className="stat-label">Bu oy:</span>
                <span className="stat-value">96%</span>
              </div>
              <div className="attendance-stat">
                <span className="stat-label">Bu yil:</span>
                <span className="stat-value">94%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Column */}
        <div className="content-left">
          {/* Shaxsiy ma'lumotlar */}
          <div className="info-card">
            <h3><FaUser /> Shaxsiy Ma'lumotlar</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <FaIdCard />
                </div>
                <div className="info-content">
                  <div className="info-label">ID Raqam</div>
                  <div className="info-value">{user.id}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <FaUser />
                </div>
                <div className="info-content">
                  <div className="info-label">Lavozim</div>
                  <div className="info-value">{user.position}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <FaBuilding />
                </div>
                <div className="info-content">
                  <div className="info-label">Bo'lim</div>
                  <div className="info-value">{user.department}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <FaChartBar />
                </div>
                <div className="info-content">
                  <div className="info-label">Email</div>
                  <div className="info-value">{user.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Lokatsiya ma'lumotlari */}
          <div className="info-card">
            <h3><FaMapMarkerAlt /> Lokatsiya</h3>
            {locationData ? (
              <div className="location-info">
                <div className="location-coordinates">
                  <div className="coordinate">
                    <span className="coord-label">Kenglik:</span>
                    <span className="coord-value">{locationData.latitude?.toFixed(6)}°</span>
                  </div>
                  <div className="coordinate">
                    <span className="coord-label">Uzunlik:</span>
                    <span className="coord-value">{locationData.longitude?.toFixed(6)}°</span>
                  </div>
                </div>
                <div className="location-accuracy">
                  <span className="accuracy-label">Aniqlik:</span>
                  <span className={`accuracy-value ${locationData.accuracy < 50 ? 'good' : locationData.accuracy < 100 ? 'average' : 'poor'}`}>
                    {locationData.accuracy?.toFixed(1)} metr
                  </span>
                </div>
                {locationData.error && (
                  <div className="location-error">
                    <FaExclamationCircle /> {locationData.error}
                  </div>
                )}
              </div>
            ) : (
              <div className="location-loading">
                Lokatsiya yuklanmoqda...
              </div>
            )}
            <button className="btn btn-primary" onClick={getLocation}>
              <FaLocationArrow /> Lokatsiyani yangilash
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="content-right">
          {/* Tezkor harakatlar */}
          <div className="quick-actions-card">
            <h3><FaClipboardCheck /> Tezkor Harakatlar</h3>
            <div className="action-buttons">
              <a href="/employee/camera" className="action-btn camera">
                <FaCamera /> Rasm Olish
              </a>
              <a href="/employee/location" className="action-btn location">
                <FaMapMarkerAlt /> Lokatsiya Yuborish
              </a>
              <a href="/employee/attendance" className="action-btn attendance">
                <FaHistory /> Davomat Tarixi
              </a>
              <button className="action-btn notify">
                <FaBell /> Xabar Qoldirish
              </button>
            </div>
          </div>

          {/* So'nggi bildirishnomalar */}
          <div className="notifications-card">
            <h3><FaBell /> So'nggi Bildirishnomalar</h3>
            <div className="notifications-list">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification-item ${notification.type}`}>
                  <div className="notification-icon">
                    {notification.type === 'success' && <FaCheckCircle />}
                    {notification.type === 'warning' && <FaExclamationCircle />}
                    {notification.type === 'info' && <FaInfoCircle />}
                  </div>
                  <div className="notification-content">
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href="/employee/notifications" className="view-all-link">
              Barchasini ko'rish
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;