import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../../context/EmployeeContext';
import { useAuth } from '../../context/AuthContext';

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

    // Canvas o'lchamlarini videoga moslashtirish
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Rasmni olish
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Qo'shimcha effektlar
    context.fillStyle = 'rgba(0, 0, 0, 0.4)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Sana va vaqtni qo'shish
    context.fillStyle = 'white';
    context.font = '20px Arial';
    const now = new Date();
    const dateStr = now.toLocaleDateString('uz-UZ');
    const timeStr = now.toLocaleTimeString('uz-UZ');
    context.fillText(`${dateStr} ${timeStr}`, 20, canvas.height - 40);
    context.fillText(`${user?.name || 'Xodim'} - ${user?.position || 'Lavozim'}`, 20, canvas.height - 15);

    const photoData = canvas.toDataURL('image/jpeg', 0.8);
    return photoData;
  };

  const handleCapture = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Rasmni olish
      const photoData = capturePhoto();
      setPhoto(photoData);
      setPhotoCount(prev => prev + 1);
      
      // Rasmni saqlash (localStorage)
      const savedPhotos = JSON.parse(localStorage.getItem('employee_photos') || '[]');
      savedPhotos.unshift({
        id: Date.now(),
        data: photoData,
        timestamp: new Date().toISOString(),
        employeeId: user?.id,
        employeeName: user?.name
      });
      
      // Faqat oxirgi 10 ta rasmni saqlash
      if (savedPhotos.length > 10) {
        savedPhotos.pop();
      }
      
      localStorage.setItem('employee_photos', JSON.stringify(savedPhotos));
      
      // Check-in qilish (agar hali check-in qilmagan bo'lsa)
      if (!currentSession) {
        const result = await checkIn({
          snapshot: photoData,
          timestamp: new Date().toISOString(),
          location: getFakeLocation(),
          status: 'ishlayapti'
        });
        
        if (result.success) {
          setMessage('✅ Rasm muvaffaqiyatli olingan va ishga kirish qayd etildi!');
          
          // 3 soniyadan keyin dashboardga qaytish
          setTimeout(() => {
            navigate('/employee');
          }, 3000);
        } else {
          setMessage('⚠️ Rasm olindi, lekin kirish qayd etilmadi. ' + (result.message || ''));
        }
      } else {
        setMessage('✅ Rasm muvaffaqiyatli olingan! Ishga allaqachon kirgansiz.');
        
        // 2 soniyadan keyin xabarni o'chirish
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
    // Fake location for demo (Toshkent)
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
    <div style={{
      padding: '1rem',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <button 
            onClick={handleGoBack}
            style={{
              padding: '0.5rem 1rem',
              background: '#f8fafc',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            ← Orqaga
          </button>
          <h2 style={{ fontSize: '1.5rem', color: '#1e293b' }}>
            Kamera
          </h2>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Ish joyingizni tasdiqlash uchun rasm oling
        </p>
      </div>

      {error && (
        <div style={{
          background: '#fee',
          border: '1px solid #fcc',
          color: '#c00',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {message && (
        <div style={{
          background: message.includes('✅') ? '#d1fae5' : '#fef3c7',
          border: `1px solid ${message.includes('✅') ? '#a7f3d0' : '#fde68a'}`,
          color: message.includes('✅') ? '#065f46' : '#92400e',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {message.includes('✅') ? '✅' : '⚠️'} {message}
        </div>
      )}

      {/* Camera Preview */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div style={{
          flex: 1,
          position: 'relative',
          background: '#000',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          minHeight: '400px'
        }}>
          {stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)' // Mirror effect
              }}
            />
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'white',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '3rem' }}>📷</div>
              <div style={{ fontSize: '1.125rem' }}>Kamera ochilmoqda...</div>
              <button
                onClick={startCamera}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Kamerani yoqish
              </button>
            </div>
          )}
          
          {/* Camera Overlay */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            right: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
            fontSize: '0.875rem',
            pointerEvents: 'none'
          }}>
            <span>📷 Ish joyi tekshiruvi</span>
            <span style={{
              background: 'rgba(0,0,0,0.5)',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem'
            }}>
              {new Date().toLocaleTimeString('uz-UZ')}
            </span>
          </div>

          {/* Capture Frame */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '250px',
            height: '250px',
            border: '2px solid white',
            borderRadius: '0.5rem',
            boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)',
            pointerEvents: 'none'
          }}></div>
        </div>

        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />

        {/* Camera Controls */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleCapture}
              disabled={loading || !stream}
              style={{
                flex: 1,
                padding: '1rem',
                background: loading ? '#94a3b8' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: loading || !stream ? 'not-allowed' : 'pointer',
                opacity: loading || !stream ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
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
              style={{
                padding: '1rem',
                background: '#f8fafc',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              🔄 Yangilash
            </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#64748b',
            fontSize: '0.875rem'
          }}>
            <span>📊 Bugungi rasmlar: {photoCount}</span>
            <span>👤 {user?.name || 'Xodim'}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: '2rem',
        background: '#f8fafc',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '1.125rem', color: '#1e293b', marginBottom: '1rem' }}>
          📋 Kamera ko'rsatmasi:
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>1️⃣</div>
            <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Kamerani yoqing</h4>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Brauzer so'rovi paytida "Ruxsat berish" tugmasini bosing
            </p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>2️⃣</div>
            <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>O'zingizni joylashtiring</h4>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Oq ramka ichida ko'rinishingizga ishonch hosil qiling
            </p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>3️⃣</div>
            <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Rasm oling</h4>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              "Rasm Ol" tugmasini bosing. Avtomatik ishga kirish qayd etiladi
            </p>
          </div>
        </div>
      </div>

      {/* Captured Photo Preview */}
      {photo && (
        <div style={{
          marginTop: '1.5rem',
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.125rem', color: '#1e293b', marginBottom: '1rem' }}>
            🖼️ Oxirgi olingan rasm:
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <img
              src={photo}
              alt="Captured"
              style={{
                width: '100%',
                maxWidth: '300px',
                borderRadius: '0.5rem',
                border: '2px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <p style={{ color: '#64748b', fontSize: '0.875rem', textAlign: 'center' }}>
              Rasm tizimga saqlandi. {currentSession ? 'Ishga kirish allaqachon qayd etilgan.' : 'Ishga kirish muvaffaqiyatli qayd etildi.'}
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default CameraPage;