import React, { useState, useEffect, useRef } from 'react';
import { 
  FaPlay, 
  FaPause, 
  FaMapMarkerAlt, 
  FaStreetView,
  FaSearchLocation,
  FaFilter,
  FaDownload,
  FaExpand,
  FaUser,
  FaClock,
  FaMap,
  FaLocationArrow,
  FaHistory
} from 'react-icons/fa';
import './liveTracking.css';

const LiveTracking = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('satellite'); // 'satellite', 'street', 'hybrid'
  const [zoomLevel, setZoomLevel] = useState(15);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'online', 'offline'
  const [employees, setEmployees] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 41.311081, lng: 69.240562 }); // Toshkent markazi
  const mapRef = useRef(null);

  // Demo xodimlar ma'lumotlari
  const demoEmployees = [
    {
      id: 1,
      name: 'Aliyev Aziz',
      position: 'Senior Dasturchi',
      avatarColor: '#3498db',
      status: 'online',
      currentLocation: { lat: 41.3115, lng: 69.2408 },
      accuracy: 25,
      speed: 0,
      lastUpdate: '2 daqiqa oldin',
      address: 'Toshkent, Yunusobod, 4-kvartal',
      battery: 85,
      movement: 'stationary',
      workingHours: '8h 15m'
    },
    {
      id: 2,
      name: 'Hasanova Malika',
      position: 'Moliya Menejeri',
      avatarColor: '#e74c3c',
      status: 'online',
      currentLocation: { lat: 41.3102, lng: 69.2421 },
      accuracy: 50,
      speed: 5.2,
      lastUpdate: '1 daqiqa oldin',
      address: 'Toshkent, Chilonzor, 8-mavze',
      battery: 65,
      movement: 'moving',
      workingHours: '7h 45m'
    },
    {
      id: 3,
      name: 'Olimov Sardor',
      position: 'Marketing Direktori',
      avatarColor: '#2ecc71',
      status: 'offline',
      currentLocation: { lat: 41.3123, lng: 69.2391 },
      accuracy: 100,
      speed: 0,
      lastUpdate: '1 soat oldin',
      address: 'Toshkent, Mirzo Ulug\'bek, 12-uy',
      battery: 20,
      movement: 'stationary',
      workingHours: '5h 30m'
    },
    {
      id: 4,
      name: 'Karimova Nigora',
      position: 'HR Menejeri',
      avatarColor: '#9b59b6',
      status: 'online',
      currentLocation: { lat: 41.3098, lng: 69.2415 },
      accuracy: 30,
      speed: 2.1,
      lastUpdate: '30 soniya oldin',
      address: 'Toshkent, Yakkasaroy, 25-ko\'cha',
      battery: 90,
      movement: 'slow-moving',
      workingHours: '8h 00m'
    },
    {
      id: 5,
      name: 'Temirov Jasur',
      position: 'Ishlab Chiqarish Menejeri',
      avatarColor: '#f39c12',
      status: 'online',
      currentLocation: { lat: 41.3132, lng: 69.2433 },
      accuracy: 75,
      speed: 15.5,
      lastUpdate: '3 daqiqa oldin',
      address: 'Samarqand, Registon',
      battery: 45,
      movement: 'fast-moving',
      workingHours: '6h 50m'
    }
  ];

  useEffect(() => {
    setEmployees(demoEmployees);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isPlaying) {
        updateLocations();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const updateLocations = () => {
    setEmployees(prev => prev.map(emp => {
      if (emp.status === 'online') {
        // Small random movement for online employees
        const latChange = (Math.random() - 0.5) * 0.001;
        const lngChange = (Math.random() - 0.5) * 0.001;
        
        return {
          ...emp,
          currentLocation: {
            lat: emp.currentLocation.lat + latChange,
            lng: emp.currentLocation.lng + lngChange
          },
          lastUpdate: 'hozir',
          speed: emp.movement === 'stationary' ? 0 : Math.random() * 20,
          battery: Math.max(10, emp.battery - Math.random() * 2)
        };
      }
      return emp;
    }));
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setMapCenter(employee.currentLocation);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 5));
  };

  const handleCenterMap = () => {
    if (selectedEmployee) {
      setMapCenter(selectedEmployee.currentLocation);
    } else {
      // Default to Tashkent center
      setMapCenter({ lat: 41.311081, lng: 69.240562 });
    }
  };

  const filteredEmployees = employees.filter(emp => {
    if (filterStatus === 'all') return true;
    return emp.status === filterStatus;
  });

  const onlineCount = employees.filter(emp => emp.status === 'online').length;

  return (
    <div className="live-tracking-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Real Vaqt Monitoring</h1>
          <p className="page-subtitle">
            <span className="online-count">{onlineCount}</span> ta xodim onlayn, oxirgi yangilanish: <span className="update-time">hozir</span>
          </p>
        </div>
        <div className="header-right">
          <div className="tracking-controls">
            <button className="btn btn-secondary" onClick={handlePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
              {isPlaying ? ' Pauza' : ' Davom ettir'}
            </button>
            <button className="btn btn-secondary">
              <FaHistory /> Tarix
            </button>
            <button className="btn btn-primary">
              <FaDownload /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="tracking-container">
        {/* Map Section */}
        <div className="map-section">
          <div className="map-header">
            <div className="map-controls">
              <button className="map-btn" onClick={handleZoomIn}>
                +
              </button>
              <button className="map-btn" onClick={handleZoomOut}>
                -
              </button>
              <button className="map-btn" onClick={handleCenterMap}>
                <FaStreetView />
              </button>
            </div>
            
            <div className="view-mode-selector">
              <button 
                className={`view-mode-btn ${viewMode === 'satellite' ? 'active' : ''}`}
                onClick={() => setViewMode('satellite')}
              >
                <FaMap /> Satellite
              </button>
              <button 
                className={`view-mode-btn ${viewMode === 'street' ? 'active' : ''}`}
                onClick={() => setViewMode('street')}
              >
                <FaStreetView /> Street
              </button>
              <button 
                className={`view-mode-btn ${viewMode === 'hybrid' ? 'active' : ''}`}
                onClick={() => setViewMode('hybrid')}
              >
                <FaSearchLocation /> Hybrid
              </button>
            </div>
          </div>

          <div className="map-container">
            <div className="map-placeholder">
              {/* In a real app, this would be a Google Maps or Leaflet component */}
              <div className="map-grid">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="map-grid-cell"></div>
                ))}
              </div>
              
              {/* Employee markers on map */}
              {filteredEmployees.map(employee => (
                <div
                  key={employee.id}
                  className={`map-marker ${employee.status} ${employee.movement} ${
                    selectedEmployee?.id === employee.id ? 'selected' : ''
                  }`}
                  style={{
                    left: `${((employee.currentLocation.lng - 69.235) / 0.015) * 100}%`,
                    top: `${((41.315 - employee.currentLocation.lat) / 0.01) * 100}%`
                  }}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <div className="marker-pin">
                    <div 
                      className="marker-avatar"
                      style={{ backgroundColor: employee.avatarColor }}
                    >
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="marker-status"></div>
                  </div>
                  <div className="marker-tooltip">
                    <strong>{employee.name}</strong>
                    <small>{employee.position}</small>
                    <div className="marker-info">
                      <FaClock /> {employee.lastUpdate}
                      <FaLocationArrow /> {employee.speed.toFixed(1)} km/h
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Map center indicator */}
              <div className="map-center" style={{ left: '50%', top: '50%' }}>
                <div className="center-cross"></div>
              </div>
            </div>
          </div>

          <div className="map-stats">
            <div className="stat-item">
              <div className="stat-label">Zoom darajasi</div>
              <div className="stat-value">{zoomLevel}x</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Koordinatalar</div>
              <div className="stat-value">
                {mapCenter.lat.toFixed(6)}, {mapCenter.lng.toFixed(6)}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Ko'rsatilganlar</div>
              <div className="stat-value">{filteredEmployees.length}/{employees.length}</div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="tracking-sidebar">
          {/* Filters */}
          <div className="sidebar-section">
            <h3>
              <FaFilter /> Filtrlar
            </h3>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                Barchasi ({employees.length})
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'online' ? 'active' : ''}`}
                onClick={() => setFilterStatus('online')}
              >
                Onlayn ({onlineCount})
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'offline' ? 'active' : ''}`}
                onClick={() => setFilterStatus('offline')}
              >
                Offlayn ({employees.length - onlineCount})
              </button>
            </div>
          </div>

          {/* Employees List */}
          <div className="sidebar-section">
            <h3>
              <FaUser /> Xodimlar
            </h3>
            <div className="employees-list">
              {filteredEmployees.map(employee => (
                <div
                  key={employee.id}
                  className={`employee-list-item ${
                    selectedEmployee?.id === employee.id ? 'selected' : ''
                  }`}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <div className="list-item-header">
                    <div className="list-avatar" style={{ backgroundColor: employee.avatarColor }}>
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="list-info">
                      <div className="list-name">{employee.name}</div>
                      <div className="list-position">{employee.position}</div>
                    </div>
                    <div className={`list-status ${employee.status}`}>
                      {employee.status === 'online' ? '●' : '○'}
                    </div>
                  </div>
                  
                  <div className="list-item-details">
                    <div className="detail-row">
                      <FaClock className="detail-icon" />
                      <span className="detail-text">{employee.lastUpdate}</span>
                    </div>
                    <div className="detail-row">
                      <FaMapMarkerAlt className="detail-icon" />
                      <span className="detail-text">{employee.address}</span>
                    </div>
                    <div className="detail-row">
                      <div className="detail-item">
                        <small>Tezlik:</small>
                        <span>{employee.speed.toFixed(1)} km/h</span>
                      </div>
                      <div className="detail-item">
                        <small>Batareya:</small>
                        <span className={`battery-${Math.floor(employee.battery / 25)}`}>
                          {employee.battery}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Employee Panel */}
      {selectedEmployee && (
        <div className="selected-panel">
          <div className="panel-header">
            <h3>
              <div 
                className="panel-avatar"
                style={{ backgroundColor: selectedEmployee.avatarColor }}
              >
                {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
              </div>
              {selectedEmployee.name}
              <span className="panel-position">{selectedEmployee.position}</span>
            </h3>
            <button className="panel-close" onClick={() => setSelectedEmployee(null)}>
              ×
            </button>
          </div>
          
          <div className="panel-content">
            <div className="location-info">
              <div className="info-row">
                <div className="info-label">Manzil:</div>
                <div className="info-value">{selectedEmployee.address}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Koordinatalar:</div>
                <div className="info-value">
                  {selectedEmployee.currentLocation.lat.toFixed(6)}, 
                  {selectedEmployee.currentLocation.lng.toFixed(6)}
                </div>
              </div>
              <div className="info-row">
                <div className="info-label">Aniqlik:</div>
                <div className="info-value">{selectedEmployee.accuracy} metr</div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaClock />
                </div>
                <div className="stat-info">
                  <h4>Oxirgi yangilanish</h4>
                  <p>{selectedEmployee.lastUpdate}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaLocationArrow />
                </div>
                <div className="stat-info">
                  <h4>Tezlik</h4>
                  <p>{selectedEmployee.speed.toFixed(1)} km/h</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <div className="battery-icon">
                    <div 
                      className="battery-level"
                      style={{ width: `${selectedEmployee.battery}%` }}
                    ></div>
                  </div>
                </div>
                <div className="stat-info">
                  <h4>Batareya</h4>
                  <p>{selectedEmployee.battery}%</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaClock />
                </div>
                <div className="stat-info">
                  <h4>Ish vaqti</h4>
                  <p>{selectedEmployee.workingHours}</p>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn btn-secondary">
                <FaHistory /> Harakat tarixi
              </button>
              <button className="btn btn-secondary">
                <FaMapMarkerAlt /> Manzilga borish
              </button>
              <button className="btn btn-primary">
                <FaStreetView /> Kuzatishni boshlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;