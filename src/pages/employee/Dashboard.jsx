// src/pages/employee/EmployeeDashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaUser, FaCalendarAlt, FaChartBar, FaCamera, FaMapMarkerAlt, FaFileAlt, FaPowerOff, FaBell, FaRegClock, FaCheckCircle, FaPauseCircle, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './EmployeeDashboard.css';

// Telegram Bot token
const TELEGRAM_BOT_TOKEN = '8333268410:AAHvRKa_JrbutKHXt3QLx4NWeQ2R7ShFYOM';
// Chat ID ni o'zingiznikiga o'zgartiring
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Ma'lumotlarni yuklash
  useEffect(() => {
    loadEmployeeData();
    loadAttendanceStatus();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      // Komponent unmount bo'lganda kamerani to'xtatish
      if (cameraStream) {
        stopCamera();
      }
    };
  }, []);

  // Kamerani to'xtatish
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        track.stop();
      });
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Kamera modalini yopish
  const closeCameraModal = () => {
    stopCamera();
    setShowCamera(false);
  };

  const loadEmployeeData = () => {
    // localStorage dan xodim ma'lumotlarini olish
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setEmployee(user);
      } catch (error) {
        console.error('User data parse error:', error);
        setDefaultEmployee();
      }
    } else {
      setDefaultEmployee();
    }
  };

  const setDefaultEmployee = () => {
    const defaultEmployee = {
      id: 1,
      name: 'Aliyev Aziz',
      position: 'Senior Dasturchi',
      department: 'IT Bo\'limi',
      email: 'aziz@company.com',
      phone: '+998 90 123 45 67',
      avatarColor: '#3498db'
    };
    setEmployee(defaultEmployee);
    localStorage.setItem('current_user', JSON.stringify(defaultEmployee));
  };

  const loadAttendanceStatus = () => {
    // Bugungi davomat holatini olish
    const today = new Date().toDateString();
    const savedAttendance = localStorage.getItem(`attendance_${today}`);
    if (savedAttendance) {
      try {
        setAttendanceStatus(JSON.parse(savedAttendance));
      } catch (error) {
        console.error('Attendance data parse error:', error);
      }
    }
  };

  // Status o'zgartirish
  const handleStatusChange = async (status) => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const timestamp = new Date();
      const dateString = timestamp.toDateString();
      
      // Rasm olish kerakmi?
      let capturedPhoto = photo;
      if (status === 'check_in' && !photo) {
        setShowCamera(true);
        setLoading(false);
        return; // Rasm olish uchun kamerani ochish
      }

      const attendanceData = {
        employeeId: employee?.id,
        employeeName: employee?.name,
        status,
        timestamp: timestamp.toISOString(),
        date: dateString,
        checkInTime: status === 'check_in' ? timestamp.toLocaleTimeString('uz-UZ') : attendanceStatus?.checkInTime,
        checkOutTime: status === 'check_out' ? timestamp.toLocaleTimeString('uz-UZ') : null,
        photo: capturedPhoto,
        location: await getCurrentLocation()
      };

      // localStorage ga saqlash
      localStorage.setItem(`attendance_${dateString}`, JSON.stringify(attendanceData));
      
      // Barcha davomatlar ro'yxatiga qo'shish
      const allAttendance = JSON.parse(localStorage.getItem('all_attendance') || '[]');
      allAttendance.push(attendanceData);
      localStorage.setItem('all_attendance', JSON.stringify(allAttendance));
      
      // Telegram botga xabar yuborish
      await sendToTelegram(attendanceData);

      setAttendanceStatus(attendanceData);
      
      // Agar check_out bo'lsa, rasmni tozalash
      if (status === 'check_out') {
        setPhoto(null);
      }
      
    } catch (error) {
      console.error('Status yangilashda xatolik:', error);
      alert('Status yangilanmadi. Internet aloqasini tekshiring.');
    } finally {
      setLoading(false);
    }
  };

  // Joriy lokatsiyani olish
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6),
              accuracy: position.coords.accuracy
            });
          },
          (error) => {
            console.warn('Geolocation error:', error.message);
            // Mock location for testing
            resolve({
              lat: 41.311081,
              lng: 69.240562,
              accuracy: 100,
              note: 'Mock location (Tashkent)'
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        resolve({
          lat: 41.311081,
          lng: 69.240562,
          note: 'Geolocation not supported'
        });
      }
    });
  };

  // Telegram botga yuborish
  const sendToTelegram = async (data) => {
    try {
      let message = `🎯 *Yangi Davomat*\n\n`;
      message += `👤 Xodim: *${data.employeeName}*\n`;
      message += `📅 Sana: ${new Date(data.timestamp).toLocaleDateString('uz-UZ')}\n`;
      message += `🕒 Vaqt: ${new Date(data.timestamp).toLocaleTimeString('uz-UZ')}\n`;
      message += `📊 Holat: *${getStatusText(data.status)}*\n`;
      
      if (data.location) {
        message += `📍 Lokatsiya: [Google Maps](https://maps.google.com/?q=${data.location.lat},${data.location.lng})\n`;
        message += `📍 Koordinatalar: ${data.location.lat}, ${data.location.lng}\n`;
      }

      const response = await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: false
        }
      );

      console.log('Telegram message sent:', response.data);

    } catch (error) {
      console.error('Telegramga yuborishda xatolik:', error);
      // Xatoni ignore qilish, chunki offline ishlashi mumkin
    }
  };

  // Status matnini olish
  const getStatusText = (status) => {
    switch(status) {
      case 'check_in': return '✅ Ish boshladi';
      case 'break': return '⏸️ Tanaffusda';
      case 'check_out': return '🏁 Ishni tugatdi';
      default: return '❓ Noma\'lum';
    }
  };

  // Kamera ochish
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraStream(stream);
      }
    } catch (error) {
      console.error('Kamera ochishda xatolik:', error);
      alert('Kameraga ruxsat bering! Agar ruxsat bermagan bo\'lsangiz, browser sozlamalaridan ruxsat bering.');
    }
  };

  // Rasm olish
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && cameraStream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Canvas o'lchamlarini video o'lchamlariga moslashtirish
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Rasmni dataURL formatida olish
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      setPhoto(photoData);
      
      // Kamerani to'xtatish
      stopCamera();
      
      // Modalni yopish
      setShowCamera(false);
      
      // Statusni yangilash
      setTimeout(() => {
        handleStatusChange('check_in');
      }, 100);
    } else {
      alert('Kamera ishlamayapti. Iltimos, kamera yoqilganligiga ishonch hosil qiling.');
    }
  };

  // Chiqish
  const handleLogout = () => {
    // Kamerani to'xtatish
    if (cameraStream) {
      stopCamera();
    }
    
    localStorage.removeItem('current_user');
    navigate('/login');
  };

  // Format vaqt
  const formatTime = (date) => {
    return date.toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="employee-dashboard">
      {/* Yuklanish indikatori */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Yuklanmoqda...</p>
        </div>
      )}

      {/* Kamera modal */}
      {showCamera && (
        <div className="camera-modal">
          <div className="camera-content">
            <div className="camera-header">
              <h3><FaCamera /> O'zingizning rasmingizni oling</h3>
              <button onClick={closeCameraModal} className="close-btn">
                <FaTimes />
              </button>
            </div>
            <div className="camera-body">
              {cameraStream ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  className="camera-view"
                />
              ) : (
                <div className="camera-placeholder">
                  <FaCamera size={64} />
                  <p>Kamera tayyorlanmoqda...</p>
                  <button onClick={startCamera} className="btn btn-primary">
                    Kamerani yoqish
                  </button>
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            <div className="camera-footer">
              <button onClick={closeCameraModal} className="btn btn-secondary">
                Bekor qilish
              </button>
              {cameraStream && (
                <button onClick={capturePhoto} className="btn btn-primary">
                  📸 Rasm olish
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sarlavha */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>
            <FaUser /> Xush kelibsiz, {employee?.name}!
          </h1>
          <p className="date-display">
            <FaCalendarAlt /> {currentTime.toLocaleDateString('uz-UZ', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <FaPowerOff /> Chiqish
        </button>
      </div>

      {/* Asosiy kontent */}
      <div className="dashboard-content">
        
        {/* Vaqt va status kartalari */}
        <div className="main-cards">
          {/* Vaqt kartasi */}
          <div className="card time-card">
            <div className="card-header">
              <FaClock className="card-icon" />
              <h3>Joriy Vaqt</h3>
            </div>
            <div className="card-body">
              <div className="time-display">
                <span className="time">{formatTime(currentTime)}</span>
                <span className="time-label">Toshkent vaqti</span>
              </div>
              <div className="time-stats">
                <div className="time-stat">
                  <span className="label">Kirish:</span>
                  <span className="value">{attendanceStatus?.checkInTime || '--:--'}</span>
                </div>
                <div className="time-stat">
                  <span className="label">Chiqish:</span>
                  <span className="value">{attendanceStatus?.checkOutTime || '--:--'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status kartasi */}
          <div className="card status-card">
            <div className="card-header">
              <FaChartBar className="card-icon" />
              <h3>Joriy Holat</h3>
            </div>
            <div className="card-body">
              <div className={`status-indicator ${attendanceStatus?.status || 'inactive'}`}>
                <div className="status-dot"></div>
                <span className="status-text">
                  {attendanceStatus ? getStatusText(attendanceStatus.status) : 'Kelmagan'}
                </span>
              </div>
              <div className="status-actions">
                {!attendanceStatus || attendanceStatus.status === 'check_out' ? (
                  <button 
                    onClick={() => handleStatusChange('check_in')}
                    className="btn btn-success"
                    disabled={loading}
                  >
                    <FaCheckCircle /> Ishni boshlash
                  </button>
                ) : attendanceStatus.status === 'check_in' ? (
                  <>
                    <button 
                      onClick={() => handleStatusChange('break')}
                      className="btn btn-warning"
                      disabled={loading}
                    >
                      <FaPauseCircle /> Tanaffus
                    </button>
                    <button 
                      onClick={() => handleStatusChange('check_out')}
                      className="btn btn-danger"
                      disabled={loading}
                    >
                      <FaSignOutAlt /> Ishni tugatish
                    </button>
                  </>
                ) : attendanceStatus.status === 'break' ? (
                  <button 
                    onClick={() => handleStatusChange('check_in')}
                    className="btn btn-success"
                    disabled={loading}
                  >
                    <FaCheckCircle /> Davom etish
                  </button>
                ) : null}
              </div>
              {photo && (
                <div className="photo-preview">
                  <p>Oxirgi rasm:</p>
                  <img 
                    src={photo} 
                    alt="Oxirgi olingan rasm" 
                    className="preview-image"
                    onClick={() => window.open(photo, '_blank')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tezkor harakatlar */}
        <div className="quick-actions">
          <h2><FaBell /> Tezkor Harakatlar</h2>
          <div className="action-grid">
            <button 
              onClick={() => setShowCamera(true)}
              className="action-card"
            >
              <FaCamera className="action-icon" />
              <span className="action-title">Rasm olish</span>
              <span className="action-desc">O'z rasmingizni yuboring</span>
            </button>

            {(!attendanceStatus || attendanceStatus.status === 'check_out') && (
              <button 
                onClick={() => handleStatusChange('check_in')}
                className="action-card"
                disabled={loading}
              >
                <FaRegClock className="action-icon" />
                <span className="action-title">Ishni boshlash</span>
                <span className="action-desc">Davomatni boshlash</span>
              </button>
            )}

            <button 
              onClick={async () => {
                const location = await getCurrentLocation();
                alert(`Sizning lokatsiyangiz: ${location.lat}, ${location.lng}`);
              }}
              className="action-card"
            >
              <FaMapMarkerAlt className="action-icon" />
              <span className="action-title">Lokatsiya</span>
              <span className="action-desc">Joylashuvni ko'rish</span>
            </button>

            <Link to="/employee/attendance" className="action-card">
              <FaFileAlt className="action-icon" />
              <span className="action-title">Davomat</span>
              <span className="action-desc">Tarixni ko'rish</span>
            </Link>
          </div>
        </div>

        {/* Xodim ma'lumotlari */}
        <div className="employee-info">
          <div className="card info-card">
            <div className="card-header">
              <h3>Shaxsiy Ma'lumotlar</h3>
            </div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Ism:</span>
                  <span className="info-value">{employee?.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Lavozim:</span>
                  <span className="info-value">{employee?.position}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Bo'lim:</span>
                  <span className="info-value">{employee?.department}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">ID:</span>
                  <span className="info-value">{employee?.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Telefon:</span>
                  <span className="info-value">{employee?.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{employee?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Oxirgi faollik */}
          <div className="card activity-card">
            <div className="card-header">
              <h3>Oxirgi Faollik</h3>
            </div>
            <div className="card-body">
              {attendanceStatus ? (
                <div className="activity-item">
                  <div className="activity-icon">
                    {attendanceStatus.status === 'check_in' ? '✅' : 
                     attendanceStatus.status === 'break' ? '⏸️' : 
                     attendanceStatus.status === 'check_out' ? '🏁' : '❓'}
                  </div>
                  <div className="activity-details">
                    <div className="activity-title">
                      {getStatusText(attendanceStatus.status)}
                    </div>
                    <div className="activity-time">
                      {new Date(attendanceStatus.timestamp).toLocaleString('uz-UZ')}
                    </div>
                    {attendanceStatus.location && (
                      <div className="activity-location">
                        📍 {attendanceStatus.location.lat}, {attendanceStatus.location.lng}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="no-activity">Hozircha faollik yo'q</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;