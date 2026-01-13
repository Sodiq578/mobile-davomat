import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useRealtime } from '../../context/RealtimeContext';
import { useAuth } from '../../context/AuthContext';
import { useEmployee } from '../../context/EmployeeContext';
import 'leaflet/dist/leaflet.css';

// Marker ikonini to'g'rilash (MUHIM QISMI)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Leaflet ikonalarini to'g'rilash
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icon yaratish
const createCustomIcon = (color = 'red') => {
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 20px;
          height: 20px;
          background-color: ${color};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
        <div style="
          position: absolute;
          top: -5px;
          right: -5px;
          width: 12px;
          height: 12px;
          background-color: #10b981;
          border-radius: 50%;
          border: 2px solid white;
          animation: pulse 2s infinite;
        "></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Map centering komponenti
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 1
    });
  }, [center, zoom, map]);
  
  return null;
};

 
// Yangi koordinatalar: latitude va longitude
const OFFICE_LOCATION = [41.202953, 69.218059];


const LocationPage = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [lastSentTime, setLastSentTime] = useState(null);
  const [mapCenter, setMapCenter] = useState(OFFICE_LOCATION);
  const [mapZoom, setMapZoom] = useState(12);
  const [showAccuracyCircle, setShowAccuracyCircle] = useState(true);
  const [showOfficeMarker, setShowOfficeMarker] = useState(true);
  const [mapType, setMapType] = useState('street');
  const [isMapReady, setIsMapReady] = useState(false);
  
  const navigate = useNavigate();
  const { emitLocation } = useRealtime();
  const { user } = useAuth();
  const { currentSession } = useEmployee();

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Load location history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem('location_history') || '[]');
    setLocationHistory(savedHistory);

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Xarita tayyor bo'lganda
  useEffect(() => {
    if (mapRef.current) {
      setIsMapReady(true);
    }
  }, [mapRef.current]);

  // Xarita yangilanishi
  useEffect(() => {
    if (location && isMapReady) {
      setMapCenter([location.lat, location.lng]);
      setMapZoom(16);
    }
  }, [location, isMapReady]);

  // Marker position o'zgarganda
  useEffect(() => {
    if (markerRef.current && location && isMapReady) {
      markerRef.current.setLatLng([location.lat, location.lng]);
    }
  }, [location, isMapReady]);

  const getCurrentLocation = useCallback(() => {
    setLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolokatsiya brauzeringiz tomonidan qo\'llab-quvvatlanmaydi');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || 0,
          altitude: position.coords.altitude || null,
          timestamp: new Date().toISOString()
        };
        
        setLocation(newLocation);
        saveLocationToHistory(newLocation);
        sendLocationToServer(newLocation);
        setError('');
        setLoading(false);
        
        // Xarita markazini yangilash
        if (mapRef.current) {
          mapRef.current.flyTo([newLocation.lat, newLocation.lng], 16, {
            duration: 1
          });
        }
      },
      (error) => {
        let errorMessage = '';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Lokatsiya ruxsati rad etildi. Iltimos, brauzer sozlamalaridan ruxsat bering.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Lokatsiya ma\'lumotlari mavjud emas. GPS qurilmangiz yoqilganligiga ishonch hosil qiling.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Lokatsiya so\'rovi muddati tugadi. Internet aloqasini tekshiring.';
            break;
          default:
            errorMessage = 'Noma\'lum xatolik: ' + error.message;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }, []);

  const startWatchingLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolokatsiya brauzeringiz tomonidan qo\'llab-quvvatlanmaydi');
      return;
    }

    if (isWatching) {
      stopWatchingLocation();
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || 0,
          timestamp: new Date().toISOString()
        };
        
        setLocation(newLocation);
        saveLocationToHistory(newLocation);
        
        // Har 10 soniyada serverga yuborish
        const now = new Date();
        if (!lastSentTime || (now - new Date(lastSentTime)) > 10000) {
          sendLocationToServer(newLocation);
          setLastSentTime(now.toISOString());
        }
        
        setError('');
      },
      (error) => {
        setError('Kuzatishda xatolik: ' + error.message);
        setIsWatching(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
      }
    );

    setWatchId(id);
    setIsWatching(true);
  }, [isWatching, lastSentTime]);

  const stopWatchingLocation = useCallback(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsWatching(false);
  }, [watchId]);

  const saveLocationToHistory = useCallback((loc) => {
    const newHistory = [loc, ...locationHistory.slice(0, 49)];
    setLocationHistory(newHistory);
    localStorage.setItem('location_history', JSON.stringify(newHistory));
  }, [locationHistory]);

  const sendLocationToServer = async (loc) => {
    if (user?.id) {
      try {
        await emitLocation(user.id, loc);
        console.log('Lokatsiya yuborildi:', loc);
      } catch (err) {
        console.error('Lokatsiya yuborishda xatolik:', err);
      }
    }
  };

  const formatCoordinate = (coord) => {
    return coord ? coord.toFixed(6) : 'N/A';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getAccuracyColor = (accuracy) => {
    if (!accuracy) return '#94a3b8';
    if (accuracy < 10) return '#10b981';
    if (accuracy < 50) return '#f59e0b';
    return '#ef4444';
  };

  const handleGoBack = () => {
    navigate('/employee');
  };

  const clearHistory = () => {
    setLocationHistory([]);
    localStorage.removeItem('location_history');
  };

  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  const getMapTileUrl = useCallback(() => {
    switch(mapType) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'topo':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      case 'street':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  }, [mapType]);

  const getMapAttribution = useCallback(() => {
    switch(mapType) {
      case 'satellite':
        return 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      case 'topo':
        return 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
      case 'street':
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  }, [mapType]);

  const distanceToOffice = location 
    ? calculateDistance(location.lat, location.lng, OFFICE_LOCATION[0], OFFICE_LOCATION[1]).toFixed(2)
    : null;

  // Marker uchun ref function
  const markerRefCallback = useCallback((node) => {
    if (node) {
      markerRef.current = node;
    }
  }, []);

  return (
    <div style={{
      padding: '1rem',
      maxWidth: '1400px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 200px)'
    }}>
      {/* Header */}
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
            📍 Joylashuv (Leaflet Map)
          </h2>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Hozirgi joylashuvingizni yuboring va xaritada ko'ring
        </p>
      </div>

      {/* Error Display */}
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

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Leaflet Map */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '0',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          height: '500px',
          position: 'relative'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontWeight: '600',
            color: '#1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>🗺️ Xarita ({mapType === 'street' ? 'Ko\'cha' : mapType === 'satellite' ? 'Sun\'iy yo\'ldosh' : 'Topografik'})</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                value={mapType}
                onChange={(e) => setMapType(e.target.value)}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  color: '#1e293b',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <option value="street">Ko'cha xaritasi</option>
                <option value="satellite">Sun'iy yo'ldosh</option>
                <option value="topo">Topografik</option>
              </select>
              <button
                onClick={() => setShowAccuracyCircle(!showAccuracyCircle)}
                style={{
                  padding: '0.25rem 0.5rem',
                  background: showAccuracyCircle ? '#2563eb' : '#f8fafc',
                  color: showAccuracyCircle ? 'white' : '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {showAccuracyCircle ? '⭕ Aniqlikni yashirish' : '⭕ Aniqlikni ko\'rsatish'}
              </button>
            </div>
          </div>
          
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: 'calc(100% - 50px)', width: '100%' }}
            scrollWheelZoom={true}
            ref={mapRef}
            whenReady={() => setIsMapReady(true)}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution={getMapAttribution()}
              url={getMapTileUrl()}
            />
            
            {/* Office marker */}
            {showOfficeMarker && (
              <Marker 
                position={OFFICE_LOCATION} 
                icon={createCustomIcon('#2563eb')}
              >
                <Popup>
                  <div style={{ padding: '10px', minWidth: '200px' }}>
                    <strong>🏢 Ish joyi (Ofis)</strong><br/>
                    <hr style={{ margin: '5px 0' }} />
                    <strong>Manzil:</strong> Toshkent shahri<br/>
                    <strong>Koordinatalar:</strong><br/>
                    • Kenglik: {OFFICE_LOCATION[0].toFixed(6)}<br/>
                    • Uzunlik: {OFFICE_LOCATION[1].toFixed(6)}<br/>
                    {distanceToOffice && (
                      <>
                        <strong>Masofa:</strong> {distanceToOffice} km
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* User location marker */}
            {location && isMapReady && (
              <>
                <Marker
                  position={[location.lat, location.lng]}
                  icon={createCustomIcon('#ef4444')}
                  ref={markerRefCallback}
                >
                  <Popup>
                    <div style={{ padding: '10px', minWidth: '250px' }}>
                      <strong>👤 {user?.name || 'Xodim'}</strong>
                      <br />
                      <hr style={{ margin: '5px 0' }} />
                      <strong>Joylashuv:</strong>
                      <br />
                      • Kenglik: {location.lat.toFixed(6)}
                      <br />
                      • Uzunlik: {location.lng.toFixed(6)}
                      <br />
                      <strong>Aniqlik:</strong> ±{location.accuracy ? location.accuracy.toFixed(1) : 'N/A'} m
                      <br />
                      <strong>Vaqt:</strong> {formatTime(location.timestamp)}
                      <br />
                      {location.speed > 0 && (
                        <>
                          <strong>Tezlik:</strong> {(location.speed * 3.6).toFixed(1)} km/h
                          <br />
                        </>
                      )}
                      {distanceToOffice && (
                        <>
                          <strong>Ofisgacha:</strong> {distanceToOffice} km
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
                
                {/* Accuracy circle */}
                {showAccuracyCircle && location.accuracy && (
                  <Circle
                    center={[location.lat, location.lng]}
                    radius={location.accuracy}
                    pathOptions={{
                      fillColor: getAccuracyColor(location.accuracy),
                      color: getAccuracyColor(location.accuracy),
                      fillOpacity: 0.2,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div style={{ padding: '10px' }}>
                        <strong>📡 Aniqlik doiyasi</strong><br/>
                        Radius: {location.accuracy?.toFixed(1)} metr<br/>
                        Joylashuv ±{location.accuracy?.toFixed(1)} m aniqlikda
                      </div>
                    </Popup>
                  </Circle>
                )}
              </>
            )}
          </MapContainer>
          
          {/* Map overlay controls */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            zIndex: 1000
          }}>
            <button
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.flyTo(OFFICE_LOCATION, 12, {
                    duration: 1
                  });
                }
              }}
              style={{
                padding: '0.5rem',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Ofisni ko'rish"
            >
              🏢
            </button>
            {location && (
              <button
                onClick={() => {
                  if (mapRef.current) {
                    mapRef.current.flyTo([location.lat, location.lng], 16, {
                      duration: 1
                    });
                  }
                }}
                style={{
                  padding: '0.5rem',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Joylashuvga o'tish"
              >
                📍
              </button>
            )}
            <button
              onClick={() => {
                if (mapRef.current) {
                  const bounds = mapRef.current.getBounds();
                  mapRef.current.fitBounds(bounds);
                }
              }}
              style={{
                padding: '0.5rem',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Zoom to fit"
            >
              🔍
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Location Info Card */}
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '1.125rem', color: '#1e293b', marginBottom: '1rem' }}>
              📍 Hozirgi Joylashuv
            </h3>
            
            {location ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: '#f8fafc',
                  borderRadius: '0.5rem'
                }}>
                  <span style={{ color: '#64748b' }}>Kenglik:</span>
                  <span style={{ fontWeight: '600', color: '#1e293b', fontFamily: 'monospace' }}>
                    {formatCoordinate(location.lat)}
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
                  <span style={{ color: '#64748b' }}>Uzunlik:</span>
                  <span style={{ fontWeight: '600', color: '#1e293b', fontFamily: 'monospace' }}>
                    {formatCoordinate(location.lng)}
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
                  <span style={{ color: '#64748b' }}>Aniqlik:</span>
                  <span style={{ 
                    fontWeight: '600', 
                    color: getAccuracyColor(location.accuracy),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getAccuracyColor(location.accuracy)
                    }}></div>
                    ±{location.accuracy?.toFixed(1) || 'N/A'} m
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
                  <span style={{ color: '#64748b' }}>Oxirgi yangilanish:</span>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>
                    {formatTime(location.timestamp)}
                  </span>
                </div>

                {location.speed > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: '#f8fafc',
                    borderRadius: '0.5rem'
                  }}>
                    <span style={{ color: '#64748b' }}>Tezlik:</span>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>
                      {(location.speed * 3.6).toFixed(1)} km/h
                    </span>
                  </div>
                )}

                {distanceToOffice && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: '#dbeafe',
                    borderRadius: '0.5rem',
                    border: '1px solid #93c5fd'
                  }}>
                    <span style={{ color: '#1e40af', fontWeight: '500' }}>🏢 Ofisgacha masofa:</span>
                    <span style={{ fontWeight: '700', color: '#1e40af', fontSize: '1.125rem' }}>
                      {distanceToOffice} km
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                background: '#f8fafc',
                borderRadius: '0.5rem',
                color: '#64748b',
                gap: '0.5rem'
              }}>
                <div style={{ fontSize: '2rem' }}>📍</div>
                <div>Joylashuv ma'lumotlari mavjud emas</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                  "Hozirgi joylashuvni olish" tugmasini bosing
                </div>
              </div>
            )}
          </div>

          {/* Controls Card */}
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '1.125rem', color: '#1e293b', marginBottom: '1rem' }}>
              🎮 Boshqaruv
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={getCurrentLocation}
                disabled={loading}
                style={{
                  padding: '1rem',
                  background: loading ? '#94a3b8' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                    Aniqlanmoqda...
                  </>
                ) : (
                  <>
                    📡 Hozirgi joylashuvni olish
                  </>
                )}
              </button>
              
              <button
                onClick={startWatchingLocation}
                style={{
                  padding: '1rem',
                  background: isWatching ? '#ef4444' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isWatching ? (
                  <>
                    ⏹️ Kuzatishni to'xtatish
                  </>
                ) : (
                  <>
                    🔄 Real vaqtda kuzatishni boshlash
                  </>
                )}
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setShowOfficeMarker(!showOfficeMarker)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: showOfficeMarker ? '#2563eb' : '#f8fafc',
                    color: showOfficeMarker ? 'white' : '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  {showOfficeMarker ? '🏢 Ofisni yashirish' : '🏢 Ofisni ko\'rsatish'}
                </button>
                <button
                  onClick={() => {
                    if (mapRef.current) {
                      const bounds = mapRef.current.getBounds();
                      mapRef.current.fitBounds(bounds);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#f8fafc',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  🔍 Barchasini ko'rish
                </button>
              </div>
            </div>

            {/* Status Indicator */}
            <div style={{ 
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: isWatching ? '#10b981' : location ? '#f59e0b' : '#94a3b8',
                  animation: isWatching ? 'pulse 2s infinite' : 'none'
                }}></div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1e293b' }}>
                    {isWatching ? 'Real vaqtda kuzatilmoqda' : 
                     location ? 'Joylashuv mavjud' : 'Joylashuv mavjud emas'}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {currentSession ? '✅ Ish vaqtida' : '⚠️ Ish vaqtida emas'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                <strong>ℹ️ Ma'lumot:</strong> {isWatching 
                  ? 'Joylashuvingiz har 10 soniyada yangilanadi va serverga yuboriladi.' 
                  : 'Real vaqtda kuzatish ish vaqtida yoqib qo\'yilishi tavsiya etiladi.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location History */}
      <div style={{
        background: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        border: '1px solid #e2e8f0',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', color: '#1e293b' }}>
            📊 Joylashuv tarixi (Oxirgi 10 ta)
          </h3>
          {locationHistory.length > 0 && (
            <button
              onClick={clearHistory}
              style={{
                padding: '0.25rem 0.5rem',
                background: '#f8fafc',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Tozalash
            </button>
          )}
        </div>
        
        {locationHistory.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {locationHistory.slice(0, 10).map((loc, index) => (
              <div 
                key={index} 
                style={{
                  padding: '1rem',
                  background: index === 0 ? '#f0f9ff' : '#f8fafc',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  setMapCenter([loc.lat, loc.lng]);
                  setMapZoom(16);
                  if (mapRef.current) {
                    mapRef.current.flyTo([loc.lat, loc.lng], 16, {
                      duration: 1
                    });
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: index === 0 ? '#2563eb' : '#94a3b8'
                    }}></div>
                    <span style={{ fontWeight: index === 0 ? '600' : '500', color: '#1e293b' }}>
                      {formatTime(loc.timestamp)}
                    </span>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    ±{loc.accuracy?.toFixed(1) || 'N/A'} m
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    {formatCoordinate(loc.lat)}, {formatCoordinate(loc.lng)}
                  </span>
                  {loc.speed > 0 && (
                    <span style={{ 
                      background: '#dbeafe', 
                      color: '#1e40af',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {(loc.speed * 3.6).toFixed(1)} km/h
                    </span>
                  )}
                </div>
                <div style={{ 
                  marginTop: '0.5rem', 
                  fontSize: '0.75rem', 
                  color: '#94a3b8',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  Xaritada ko'rish →
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: '#f8fafc',
            borderRadius: '0.5rem',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <div>Tarix ma'lumotlari mavjud emas</div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
};

export default LocationPage;