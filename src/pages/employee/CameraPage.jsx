import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../../context/EmployeeContext';
import { useAuth } from '../../context/AuthContext';
import BurgerMenu from './BurgerMenu';
import './CameraPage.css';

const CameraPage = () => {
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [photoCount, setPhotoCount] = useState(0);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  
  const { checkIn, currentSession } = useEmployee();
  const { user } = useAuth();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setError('');
      } else {
        setError('Kamera qo\'llab-quvvatlanmaydi');
      }
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Kameraga ruxsat berilmagan. Iltimos, brauzer sozlamalaridan ruxsat bering.');
      } else if (err.name === 'NotFoundError') {
        setError('Kamera topilmadi. Iltimos, kamera qurilmangiz ulanganligiga ishonch hosil qiling.');
      } else {
        setError('Kamerani ochishda xatolik: ' + err.message);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      throw new Error('Kamera elementlari topilmadi');
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgba(0, 0, 0, 0.4)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = 'white';
    context.font = '20px Arial';
    const now = new Date();
    const dateStr = now.toLocaleDateString('uz-UZ');
    const timeStr = now.toLocaleTimeString('uz-UZ');
    context.fillText(`${dateStr} ${timeStr}`, 20, canvas.height - 40);
    context.fillText(`${user?.name || 'Xodim'} - ${user?.position || 'Lavozim'}`, 20, canvas.height - 15);

    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleCapture = async () => {
    try {
      setLoading(true);
      setError('');
      
      const photoData = capturePhoto();
      setPhoto(photoData);
      setPhotoCount(prev => prev + 1);
      
      const savedPhotos = JSON.parse(localStorage.getItem('employee_photos') || '[]');
      savedPhotos.unshift({
        id: Date.now(),
        data: photoData,
        timestamp: new Date().toISOString(),
        employeeId: user?.id,
        employeeName: user?.name
      });
      
      if (savedPhotos.length > 10) {
        savedPhotos.pop();
      }
      
      localStorage.setItem('employee_photos', JSON.stringify(savedPhotos));
      
      if (!currentSession) {
        const result = await checkIn({
          snapshot: photoData,
          timestamp: new Date().toISOString(),
          location: getFakeLocation(),
          status: 'ishlayapti'
        });
        
        if (result.success) {
          setMessage('✅ Rasm muvaffaqiyatli olingan va ishga kirish qayd etildi!');
          
          setTimeout(() => {
            navigate('/employee');
          }, 3000);
        } else {
          setMessage('⚠️ Rasm olindi, lekin kirish qayd etilmadi. ' + (result.message || ''));
        }
      } else {
        setMessage('✅ Rasm muvaffaqiyatli olingan! Ishga allaqachon kirgansiz.');
        
        setTimeout(() => {
          setMessage('');
        }, 2000);
      }
    } catch (err) {
      console.error('Capture error:', err);
      setError('Rasm olishda xatolik: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFakeLocation = () => {
    return {
      lat: 41.3111 + (Math.random() - 0.5) * 0.01,
      lng: 69.2797 + (Math.random() - 0.5) * 0.01,
      accuracy: Math.random() * 50 + 10
    };
  };

  const handleGoBack = () => {
    navigate('/employee');
  };

  return (
    <>
      <BurgerMenu />
      <div className="camera-container">
        <div className="page-header">
          <div className="header-content">
            <button className="back-btn" onClick={handleGoBack}>
              ← Orqaga
            </button>
            <h2 className="page-title">Kamera</h2>
          </div>
          <p className="page-subtitle">
            Ish joyingizni tasdiqlash uchun rasm oling
          </p>
        </div>

        {error && (
          <div className="error-alert">
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div className={`message-alert ${message.includes('✅') ? 'success' : 'warning'}`}>
            {message.includes('✅') ? '✅' : '⚠️'} {message}
          </div>
        )}

        {/* Camera Preview */}
        <div className="camera-preview">
          <div className="camera-view">
            {stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
              />
            ) : (
              <div className="camera-empty">
                <div className="empty-icon">📷</div>
                <div className="empty-title">Kamera ochilmoqda...</div>
                <button
                  onClick={startCamera}
                  className="btn-primary"
                >
                  Kamerani yoqish
                </button>
              </div>
            )}
            
            {/* Camera Overlay */}
            <div className="camera-overlay">
              <span>📷 Ish joyi tekshiruvi</span>
              <span className="camera-time">
                {new Date().toLocaleTimeString('uz-UZ')}
              </span>
            </div>

            {/* Capture Frame */}
            <div className="capture-frame"></div>
          </div>

          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />

          {/* Camera Controls */}
          <div className="camera-controls">
            <div className="controls-row">
              <button
                onClick={handleCapture}
                disabled={loading || !stream}
                className="btn-capture"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner">⏳</span>
                    Olinmoqda...
                  </>
                ) : (
                  <>
                    📸 Rasm Ol
                    {currentSession && ' (Kirish qayd etilgan)'}
                  </>
                )}
              </button>
              
              <button
                onClick={startCamera}
                className="btn-refresh"
              >
                🔄 Yangilash
              </button>
            </div>

            <div className="camera-stats">
              <span>📊 Bugungi rasmlar: {photoCount}</span>
              <span>👤 {user?.name || 'Xodim'}</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions-section">
          <h3 className="section-title">📋 Kamera ko'rsatmasi:</h3>
          <div className="instructions-grid">
            <div className="instruction-card">
              <div className="instruction-icon">1️⃣</div>
              <h4 className="instruction-title">Kamerani yoqing</h4>
              <p className="instruction-text">
                Brauzer so'rovi paytida "Ruxsat berish" tugmasini bosing
              </p>
            </div>
            
            <div className="instruction-card">
              <div className="instruction-icon">2️⃣</div>
              <h4 className="instruction-title">O'zingizni joylashtiring</h4>
              <p className="instruction-text">
                Oq ramka ichida ko'rinishingizga ishonch hosil qiling
              </p>
            </div>
            
            <div className="instruction-card">
              <div className="instruction-icon">3️⃣</div>
              <h4 className="instruction-title">Rasm oling</h4>
              <p className="instruction-text">
                "Rasm Ol" tugmasini bosing. Avtomatik ishga kirish qayd etiladi
              </p>
            </div>
          </div>
        </div>

        {/* Captured Photo Preview */}
        {photo && (
          <div className="photo-preview">
            <h3 className="section-title">🖼️ Oxirgi olingan rasm:</h3>
            <div className="photo-container">
              <img
                src={photo}
                alt="Captured"
                className="photo-image"
              />
              <p className="photo-note">
                Rasm tizimga saqlandi. {currentSession ? 'Ishga kirish allaqachon qayd etilgan.' : 'Ishga kirish muvaffaqiyatli qayd etildi.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CameraPage;