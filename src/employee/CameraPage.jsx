import React, { useEffect, useState } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { useEmployee } from '../../context/EmployeeContext';
import { useAuth } from '../../context/AuthContext';
import CameraBox from '../../components/employee/CameraBox';
import '../../styles/camera-page.css';

const CameraPage = () => {
  const {
    stream,
    photo,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto
  } = useCamera();

  const { checkIn } = useEmployee();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleCapture = async () => {
    try {
      setLoading(true);
      const photoData = capturePhoto();
      
      // Bu yerda real loyihada API orqali serverga yuborish kerak
      setMessage('Rasm muvaffaqiyatli olingan!');
      
      // Agar checkIn qilinmagan bo'lsa
      if (!user.checkedIn) {
        const result = await checkIn({
          snapshot: photoData,
          timestamp: new Date().toISOString()
        });
        if (result.success) {
          setMessage('Rasm olingan va kirish qayd etildi!');
        }
      }
    } catch (error) {
      setMessage('Xatolik yuz berdi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="camera-page">
      <div className="camera-header">
        <h2>Kamera</h2>
        <p>Ish joyingizni tasdiqlash uchun rasm oling</p>
      </div>

      <div className="camera-container">
        <CameraBox
          stream={stream}
          photo={photo}
          videoRef={videoRef}
          canvasRef={canvasRef}
        />

        <div className="camera-controls">
          <button
            onClick={handleCapture}
            disabled={loading || !stream}
            className="capture-btn"
          >
            {loading ? 'Ishlanmoqda...' : '📸 Rasm Ol'}
          </button>
          
          <button
            onClick={startCamera}
            className="restart-btn"
          >
            🔄 Kamerani qayta ishga tushirish
          </button>
        </div>

        {message && (
          <div className="camera-message">
            {message}
          </div>
        )}

        <div className="camera-instructions">
          <h3>Ko'rsatmalar:</h3>
          <ul>
            <li>1. Kamerani ish joyingizga qarating</li>
            <li>2. Yuzingiz aniq ko'rinsin</li>
            <li>3. "Rasm Ol" tugmasini bosing</li>
            <li>4. Tasdiqlangan rasm tizimga yuklanadi</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;