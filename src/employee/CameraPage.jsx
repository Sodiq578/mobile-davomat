import React, { useEffect, useRef, useState } from 'react';
import { 
  FaCamera, 
  FaSync, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
  FaDownload,
  FaUpload,
  FaLightbulb,
  FaUser,
  FaVideo,
  FaStop,
  FaPlay
} from 'react-icons/fa';
import './cameraPage.css';

const CameraPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [cameraError, setCameraError] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setLoading(true);
      setCameraError(false);
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setMessage('Kamera ishga tushirildi');
      setMessageType('success');
      
    } catch (error) {
      console.error('Kamera xatosi:', error);
      setCameraError(true);
      setMessage('Kamerani ishga tushirib bo\'lmadi. Ruxsatni tekshiring.');
      setMessageType('error');
      
      // Demo rasm olish rejimi
      setPhoto('/api/placeholder/400/300');
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!canvas) return;

    const context = canvas.getContext('2d');
    
    // Canvas o'lchamlarini videoga moslashtirish
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Rasmni chizish
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Rasm ma'lumotlarini olish
    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    setPhoto(photoData);
    
    // Captured photos ro'yxatiga qo'shish
    const newPhoto = {
      id: Date.now(),
      data: photoData,
      timestamp: new Date().toISOString(),
      size: `${canvas.width}x${canvas.height}`
    };
    
    setCapturedPhotos(prev => [newPhoto, ...prev.slice(0, 4)]);
    
    // Flash effekti
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
    
    setMessage('Rasm muvaffaqiyatli olindi!');
    setMessageType('success');
    
    return photoData;
  };

  const handleSubmitPhoto = async () => {
    if (!photo) {
      setMessage('Avval rasm oling!');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      
      // Bu yerda haqiqiy API chaqiruvi bo'ladi
      // Demo ma'lumotlar
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Muvaffaqiyatli yuborildi
      setMessage('Rasm muvaffaqiyatli yuborildi va tasdiqlandi!');
      setMessageType('success');
      
      // Demo: Kirish qayd etildi
      const checkInData = {
        employeeId: 12345,
        timestamp: new Date().toISOString(),
        location: 'Toshkent, Yunusobod',
        status: 'checked_in',
        photo: photo
      };
      
      console.log('Kirish qayd etildi:', checkInData);
      
    } catch (error) {
      setMessage(`Xatolik: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPhoto = () => {
    if (!photo) return;
    
    const link = document.createElement('a');
    link.href = photo;
    link.download = `attendance_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setMessage('Rasm yuklab olindi!');
    setMessageType('info');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    setMessage(isRecording ? 'Video yozish to\'xtatildi' : 'Video yozish boshlandi');
    setMessageType('info');
  };

  const getCameraStatus = () => {
    if (loading) return 'Kamera yuklanmoqda...';
    if (cameraError) return 'Kamera xatosi';
    if (stream) return 'Kamera faol';
    return 'Kamera o\'chirilgan';
  };

  return (
    <div className="camera-page">
      {/* Header */}
      <div className="camera-header">
        <h1>
          <FaCamera className="header-icon" />
          Kamera
        </h1>
        <p className="camera-subtitle">
          Ish joyingizni tasdiqlash uchun rasm oling
        </p>
        <div className="camera-status">
          <span className={`status-badge ${stream ? 'active' : 'inactive'}`}>
            {getCameraStatus()}
          </span>
        </div>
      </div>

      <div className="camera-container">
        {/* Kamera va ko'rish paneli */}
        <div className="camera-preview">
          <div className={`camera-view ${flash ? 'flash' : ''}`}>
            {stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
              />
            ) : cameraError ? (
              <div className="camera-error-view">
                <FaExclamationTriangle className="error-icon" />
                <h3>Kamera topilmadi</h3>
                <p>Kamerangizni yoqib qo'ying yoki ruxsat bering</p>
                <button className="btn btn-primary" onClick={startCamera}>
                  <FaSync /> Qayta urinib ko'rish
                </button>
              </div>
            ) : (
              <div className="camera-loading">
                <div className="loading-spinner"></div>
                <p>Kamera yuklanmoqda...</p>
              </div>
            )}
            
            {/* Capture effekti */}
            {flash && <div className="flash-effect"></div>}
          </div>

          {/* Canvas (yashirin) */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Rasm natijasi */}
        <div className="photo-result">
          <h3>
            <FaCheckCircle /> Olingan Rasm
          </h3>
          <div className="photo-preview">
            {photo ? (
              <img src={photo} alt="Captured" className="captured-photo" />
            ) : (
              <div className="no-photo">
                <FaCamera className="no-photo-icon" />
                <p>Hali rasm olinmagan</p>
              </div>
            )}
          </div>
          
          <div className="photo-actions">
            <button
              onClick={capturePhoto}
              disabled={!stream || loading}
              className="btn btn-primary capture-btn"
            >
              <FaCamera /> Rasm Ol
            </button>
            
            <button
              onClick={handleSubmitPhoto}
              disabled={!photo || loading}
              className="btn btn-success submit-btn"
            >
              {loading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Yuklanmoqda...
                </>
              ) : (
                <>
                  <FaUpload /> Yuborish
                </>
              )}
            </button>
            
            <button
              onClick={handleDownloadPhoto}
              disabled={!photo}
              className="btn btn-secondary download-btn"
            >
              <FaDownload /> Yuklab olish
            </button>
          </div>
        </div>
      </div>

      {/* Kamera boshqaruvi */}
      <div className="camera-controls">
        <div className="controls-left">
          <button
            onClick={startCamera}
            className="btn btn-secondary"
          >
            <FaSync /> Kamera Yangilash
          </button>
          
          <button
            onClick={stopCamera}
            disabled={!stream}
            className="btn btn-secondary"
          >
            <FaTimes /> Kamera O'chirish
          </button>
          
          <button
            onClick={toggleRecording}
            className={`btn ${isRecording ? 'btn-danger' : 'btn-secondary'}`}
            disabled={!stream}
          >
            {isRecording ? (
              <>
                <FaStop /> To'xtatish
              </>
            ) : (
              <>
                <FaPlay /> Video Yozish
              </>
            )}
          </button>
        </div>
        
        <div className="controls-right">
          <div className="camera-info">
            <span className="info-item">
              <FaVideo /> {stream ? 'Faol' : 'O\'chirilgan'}
            </span>
            <span className="info-item">
              <FaUser /> {capturedPhotos.length} rasm
            </span>
            {isRecording && (
              <span className="info-item recording">
                <div className="recording-dot"></div>
                Yozilmoqda...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Xabar ko'rsatgichi */}
      {message && (
        <div className={`camera-message ${messageType}`}>
          <div className="message-content">
            {messageType === 'success' && <FaCheckCircle />}
            {messageType === 'error' && <FaExclamationTriangle />}
            {messageType === 'info' && <FaInfoCircle />}
            <span>{message}</span>
          </div>
          <button
            onClick={() => setMessage('')}
            className="message-close"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Ko'rsatmalar */}
      <div className="instructions-section">
        <h3>
          <FaLightbulb /> Ko'rsatmalar
        </h3>
        <div className="instructions-grid">
          <div className="instruction-card">
            <div className="instruction-number">1</div>
            <div className="instruction-content">
              <h4>Kamerani yoqing</h4>
              <p>"Kamera Yangilash" tugmasini bosing va kamerangizga ruxsat bering</p>
            </div>
          </div>
          
          <div className="instruction-card">
            <div className="instruction-number">2</div>
            <div className="instruction-content">
              <h4>O'zingizni joylashtiring</h4>
              <p>Yuzingiz to'liq va yorug'likda aniq ko'rinsin</p>
            </div>
          </div>
          
          <div className="instruction-card">
            <div className="instruction-number">3</div>
            <div className="instruction-content">
              <h4>Rasm oling</h4>
              <p>"Rasm Ol" tugmasini bosib, ish joyingizni tasdiqlang</p>
            </div>
          </div>
          
          <div className="instruction-card">
            <div className="instruction-number">4</div>
            <div className="instruction-content">
              <h4>Yuborish</h4>
              <p>"Yuborish" tugmasi orqali rasmni tizimga yuklang</p>
            </div>
          </div>
        </div>
      </div>

      {/* Olingan rasmlar tarixi */}
      {capturedPhotos.length > 0 && (
        <div className="photos-history">
          <h3>Olingan Rasmlar</h3>
          <div className="photos-grid">
            {capturedPhotos.map(photoItem => (
              <div key={photoItem.id} className="photo-thumbnail">
                <img src={photoItem.data} alt="Captured" />
                <div className="photo-info">
                  <span className="photo-time">
                    {new Date(photoItem.timestamp).toLocaleTimeString('uz-UZ', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="photo-size">{photoItem.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraPage;