import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt,
  FaCompass,
  FaLocationArrow,
  FaCrosshairs,
  FaHistory,
  FaMapPin,
  FaRoute,
  FaSync,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaShieldAlt,
  FaClock,
  FaRuler,
  FaSatellite,
  FaMobileAlt
} from 'react-icons/fa';
import './LocationPage.css';

const LocationPage = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accuracy, setAccuracy] = useState(0);
  const [history, setHistory] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [mapView, setMapView] = useState('satellite');
  const [lastUpdate, setLastUpdate] = useState('');

  // Demo lokatsiya ma'lumotlari
  const demoHistory = [
    { id: 1, lat: 41.311081, lng: 69.240562, time: '09:00', accuracy: 25 },
    { id: 2, lat: 41.311122, lng: 69.240598, time: '09:15', accuracy: 30 },
    { id: 3, lat: 41.311095, lng: 69.240572, time: '09:30', accuracy: 22 },
    { id: 4, lat: 41.311088, lng: 69.240565, time: '09:45', accuracy: 18 },
    { id: 5, lat: 41.311082, lng: 69.240560, time: '10:00', accuracy: 15 }
  ];

  useEffect(() => {
    getCurrentLocation();
    
    // Har 30 soniyada avtomatik yangilash
    const interval = setInterval(() => {
      if (autoUpdate) {
        getCurrentLocation();
      }
    }, 30000);

    setHistory(demoHistory);
    
    return () => clearInterval(interval);
  }, [autoUpdate]);

  const getCurrentLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Brauzeringiz GPS ni qo\'llab-quvvatlamaydi');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || 0,
          timestamp: new Date(position.timestamp)
        };

        setLocation(newLocation);
        setAccuracy(newLocation.accuracy);
        
        // Tarixga qo'shish
        const historyItem = {
          id: Date.now(),
          lat: newLocation.latitude,
          lng: newLocation.longitude,
          time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
          accuracy: newLocation.accuracy
        };
        
        setHistory(prev => [historyItem, ...prev.slice(0, 9)]);
        setLastUpdate(new Date().toLocaleTimeString('uz-UZ'));
        
        // Ma'lumotlarni serverga yuborish (demo)
        sendToServer(newLocation);
        
        setLoading(false);
      },
      (err) => {
        console.error('GPS xatosi:', err);
        
        let errorMessage = 'Lokatsiyani aniqlashda xatolik yuz berdi';
        
        switch(err.code) {
          case 1:
            errorMessage = 'GPS ruxsat berilmagan. Iltimos, brauzer sozlamalaridan ruxsat bering';
            break;
          case 2:
            errorMessage = 'Lokatsiya ma\'lumotlari mavjud emas';
            break;
          case 3:
            errorMessage = 'Lokatsiya olish vaqti tugadi';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
        
        // Demo ma'lumotlar
        if (autoUpdate) {
          const demoLocation = {
            latitude: 41.311081 + (Math.random() - 0.5) * 0.001,
            longitude: 69.240562 + (Math.random() - 0.5) * 0.001,
            accuracy: 50 + Math.random() * 50,
            speed: Math.random() * 5,
            heading: Math.random() * 360,
            timestamp: new Date()
          };
          
          setLocation(demoLocation);
          setAccuracy(demoLocation.accuracy);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const sendToServer = async (locationData) => {
    try {
      // Bu yerda haqiqiy API chaqiruvi bo'ladi
      const payload = {
        employeeId: 12345,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
        timestamp: new Date().toISOString(),
        deviceInfo: navigator.userAgent
      };
      
      console.log('Lokatsiya yuborildi:', payload);
      
      // Demo: Ma'lumotlar muvaffaqiyatli yuborildi
      return { success: true, message: 'Lokatsiya yangilandi' };
      
    } catch (error) {
      console.error('Server xatosi:', error);
      return { success: false, message: 'Server xatosi' };
    }
  };

  const getAccuracyStatus = (accuracy) => {
    if (accuracy < 20) return { label: 'Yuqori', color: '#2ecc71' };
    if (accuracy < 50) return { label: 'Yaxshi', color: '#f39c12' };
    return { label: 'O\'rtacha', color: '#e74c3c' };
  };

  const getAccuracyIcon = (accuracy) => {
    if (accuracy < 20) return <FaCheckCircle />;
    if (accuracy < 50) return <FaInfoCircle />;
    return <FaExclamationTriangle />;
  };

  const formatCoordinate = (coord) => {
    return coord.toFixed(6);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c * 1000).toFixed(0); // Distance in meters
  };

  const getNearestOffice = () => {
    const offices = [
      { name: 'Asosiy Ofis', lat: 41.311081, lng: 69.240562 },
      { name: 'Filial 1', lat: 41.315000, lng: 69.245000 },
      { name: 'Filial 2', lat: 41.305000, lng: 69.235000 }
    ];
    
    if (!location) return null;
    
    let nearest = offices[0];
    let minDistance = calculateDistance(location.latitude, location.longitude, offices[0].lat, offices[0].lng);
    
    for (let i = 1; i < offices.length; i++) {
      const distance = calculateDistance(location.latitude, location.longitude, offices[i].lat, offices[i].lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = offices[i];
      }
    }
    
    return { ...nearest, distance: minDistance };
  };

  const nearestOffice = getNearestOffice();
  const accuracyStatus = getAccuracyStatus(accuracy);

  return (
    <div className="location-page">
      {/* Header */}
      <div className="location-header">
        <h1>
          <FaMapMarkerAlt className="header-icon" />
          Lokatsiya
        </h1>
        <p className="location-subtitle">
          GPS orqali joylashuvingizni kuzating va yuboring
        </p>
      </div>

      {/* Stats Cards */}
      <div className="location-stats">
        <div className="stat-card">
          <div className="stat-icon accuracy">
            {getAccuracyIcon(accuracy)}
          </div>
          <div className="stat-content">
            <h3 style={{ color: accuracyStatus.color }}>
              {accuracyStatus.label}
            </h3>
            <p>Aniqlik darajasi</p>
            <div className="stat-detail">
              <FaRuler /> {accuracy?.toFixed(1)} metr
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon distance">
            <FaRoute />
          </div>
          <div className="stat-content">
            <h3>
              {nearestOffice ? `${nearestOffice.distance}m` : '0m'}
            </h3>
            <p>Ofisgacha masofa</p>
            <div className="stat-detail">
              <FaMapPin /> {nearestOffice?.name || 'Noma\'lum'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon time">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>{lastUpdate || '00:00'}</h3>
            <p>Oxirgi yangilanish</p>
            <div className="stat-detail">
              <FaSync /> {autoUpdate ? 'Avtomatik' : 'Qolda'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon signal">
            <FaSatellite />
          </div>
          <div className="stat-content">
            <h3>{history.length}</h3>
            <p>Yozib olingan</p>
            <div className="stat-detail">
              <FaHistory /> Bugungi yozuvlar
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="location-container">
        {/* Left Column - Lokatsiya ma'lumotlari */}
        <div className="location-info">
          <div className="info-card">
            <h3>
              <FaCrosshairs /> Joriy Lokatsiya
            </h3>
            
            {error ? (
              <div className="location-error">
                <FaExclamationTriangle className="error-icon" />
                <div className="error-content">
                  <h4>Xatolik</h4>
                  <p>{error}</p>
                </div>
              </div>
            ) : location ? (
              <div className="coordinates-display">
                <div className="coordinate-row">
                  <div className="coordinate-item">
                    <span className="coord-label">Kenglik:</span>
                    <span className="coord-value">
                      {formatCoordinate(location.latitude)}°
                    </span>
                  </div>
                  <div className="coordinate-item">
                    <span className="coord-label">Uzunlik:</span>
                    <span className="coord-value">
                      {formatCoordinate(location.longitude)}°
                    </span>
                  </div>
                </div>
                
                <div className="location-details">
                  <div className="detail-item">
                    <FaCompass className="detail-icon" />
                    <div className="detail-content">
                      <div className="detail-label">Yo'nalish</div>
                      <div className="detail-value">
                        {location.heading?.toFixed(0) || '0'}°
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FaRoute className="detail-icon" />
                    <div className="detail-content">
                      <div className="detail-label">Tezlik</div>
                      <div className="detail-value">
                        {(location.speed * 3.6)?.toFixed(1) || '0'} km/h
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FaShieldAlt className="detail-icon" />
                    <div className="detail-content">
                      <div className="detail-label">Aniqlik</div>
                      <div className="detail-value">
                        <span className={`accuracy-badge ${accuracyStatus.label.toLowerCase()}`}>
                          {accuracy?.toFixed(1)} m
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FaMobileAlt className="detail-icon" />
                    <div className="detail-content">
                      <div className="detail-label">Qurilma</div>
                      <div className="detail-value">
                        {navigator.platform}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="location-loading">
                <div className="loading-spinner"></div>
                <p>Lokatsiya yuklanmoqda...</p>
              </div>
            )}

            <div className="location-actions">
              <button
                onClick={getCurrentLocation}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Aniqlanmoqda...
                  </>
                ) : (
                  <>
                    <FaLocationArrow /> Lokatsiyani Yangilash
                  </>
                )}
              </button>
              
              <button
                onClick={() => setAutoUpdate(!autoUpdate)}
                className={`btn ${autoUpdate ? 'btn-success' : 'btn-secondary'}`}
              >
                <FaSync /> {autoUpdate ? 'Avtomatik Yoqilgan' : 'Avtomatik O\'chirilgan'}
              </button>
            </div>
          </div>

          {/* Yuborish sozlamalari */}
          <div className="settings-card">
            <h3>
              <FaShieldAlt /> Sozlamalar
            </h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={autoUpdate}
                    onChange={(e) => setAutoUpdate(e.target.checked)}
                  />
                  <span>Avtomatik yangilash</span>
                </label>
              </div>
              
              <div className="setting-item">
                <label>Xarita ko'rinishi</label>
                <div className="map-view-selector">
                  <button
                    className={`view-btn ${mapView === 'satellite' ? 'active' : ''}`}
                    onClick={() => setMapView('satellite')}
                  >
                    <FaSatellite /> Satellite
                  </button>
                  <button
                    className={`view-btn ${mapView === 'street' ? 'active' : ''}`}
                    onClick={() => setMapView('street')}
                  >
                    <FaMapMarkerAlt /> Street
                  </button>
                </div>
              </div>
              
              <div className="setting-item">
                <label>GPS rejimi</label>
                <select className="gps-mode-select">
                  <option>Yuqori aniqlik</option>
                  <option>Batareya tejamkor</option>
                  <option>Faqat WiFi</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Xarita va tarix */}
        <div className="location-map-history">
          {/* Xarita ko'rinishi */}
          <div className="map-card">
            <h3>
              <FaMapMarkerAlt /> Xaritada Ko'rinish
            </h3>
            <div className="map-container">
              <div className="map-placeholder">
                {/* Real loyihada bu Google Maps yoki Leaflet bo'ladi */}
                <div className="map-grid">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="map-cell"></div>
                  ))}
                </div>
                
                {/* Lokatsiya markeri */}
                {location && (
                  <div className="location-marker">
                    <div className="marker-pin">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="marker-accuracy" style={{ 
                      width: `${accuracy * 2}px`, 
                      height: `${accuracy * 2}px` 
                    }}></div>
                  </div>
                )}
                
                {/* Ofis markerlari */}
                <div className="office-marker">
                  <div className="marker-pin office">
                    <FaBuilding />
                  </div>
                  <div className="marker-label">Asosiy Ofis</div>
                </div>
                
                {/* Masofa chizig'i */}
                {location && nearestOffice && (
                  <div className="distance-line">
                    <div className="distance-label">
                      {nearestOffice.distance} metr
                    </div>
                  </div>
                )}
              </div>
              
              <div className="map-controls">
                <button className="map-btn">
                  <FaCompass /> Yo'nalish
                </button>
                <button className="map-btn">
                  <FaRoute /> Marshrut
                </button>
                <button className="map-btn">
                  <FaCrosshairs /> Markazlash
                </button>
              </div>
            </div>
          </div>

          {/* Lokatsiya tarixi */}
          <div className="history-card">
            <h3>
              <FaHistory /> Lokatsiya Tarixi
            </h3>
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-time">{item.time}</div>
                  <div className="history-coords">
                    <span className="coord">{item.lat.toFixed(6)}°</span>
                    <span className="coord">{item.lng.toFixed(6)}°</span>
                  </div>
                  <div className={`history-accuracy ${item.accuracy < 30 ? 'good' : item.accuracy < 60 ? 'average' : 'poor'}`}>
                    {item.accuracy.toFixed(0)}m
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-btn">
              Barcha tarixni ko'rish
            </button>
          </div>
        </div>
      </div>

      {/* Pastki qism - Qo'shimcha ma'lumotlar */}
      <div className="additional-info">
        <div className="info-section">
          <h4>
            <FaInfoCircle /> GPS haqida
          </h4>
          <p>
            GPS signali qurilmaning joylashishiga va atrof-muhitga bog'liq. 
            Ichki xonalarda aniqlik past bo'lishi mumkin.
          </p>
        </div>
        
        <div className="info-section">
          <h4>
            <FaShieldAlt /> Maxfiylik
          </h4>
          <p>
            Sizning lokatsiya ma'lumotlaringiz faqat ish vaqtida va 
            maqsadli monitoring uchun ishlatiladi.
          </p>
        </div>
        
        <div className="info-section">
          <h4>
            <FaClock /> Avtomatik yangilash
          </h4>
          <p>
            Avtomatik rejimda lokatsiya har 30 soniyada yangilanadi.
            Batareya tejamkorligi uchun o'chirishingiz mumkin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;