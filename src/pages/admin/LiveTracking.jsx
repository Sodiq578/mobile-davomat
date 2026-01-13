import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, 
  FaUserCheck, 
  FaUserTimes, 
  FaSearch, 
  FaFilter,
  FaSync,
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaLocationArrow,
  FaHistory,
  FaRocket
} from 'react-icons/fa';
import './LiveTracking.css';

const LiveTracking = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 41.3111, lng: 69.2797 });
  const [zoom, setZoom] = useState(12);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock employee locations
  const mockEmployees = [
    {
      id: 1,
      name: 'Aliyev Aziz',
      position: 'Senior Dasturchi',
      status: 'online',
      battery: 85,
      speed: '0 km/h',
      accuracy: '15m',
      lastUpdate: '2 daqiqa oldin',
      location: { lat: 41.3111, lng: 69.2797 },
      icon: '🚗',
      color: '#3498db'
    },
    {
      id: 2,
      name: 'Hasanova Malika',
      position: 'Moliya Menejeri',
      status: 'online',
      battery: 65,
      speed: '5 km/h',
      accuracy: '25m',
      lastUpdate: '5 daqiqa oldin',
      location: { lat: 41.3150, lng: 69.2800 },
      icon: '🚶',
      color: '#2ecc71'
    },
    {
      id: 3,
      name: 'Olimov Sardor',
      position: 'Marketing Direktori',
      status: 'offline',
      battery: 0,
      speed: '0 km/h',
      accuracy: 'N/A',
      lastUpdate: '1 soat oldin',
      location: { lat: 41.3120, lng: 69.2750 },
      icon: '🏢',
      color: '#e74c3c'
    },
    {
      id: 4,
      name: 'Karimova Nigora',
      position: 'HR Menejeri',
      status: 'online',
      battery: 95,
      speed: '45 km/h',
      accuracy: '10m',
      lastUpdate: '30 soniya oldin',
      location: { lat: 41.3200, lng: 69.2850 },
      icon: '🚕',
      color: '#9b59b6'
    },
    {
      id: 5,
      name: 'Temirov Jasur',
      position: 'Ishlab Chiqarish',
      status: 'away',
      battery: 45,
      speed: '0 km/h',
      accuracy: '50m',
      lastUpdate: '10 daqiqa oldin',
      location: { lat: 41.3050, lng: 69.2700 },
      icon: '🏭',
      color: '#f39c12'
    },
    {
      id: 6,
      name: 'Shukurova Dinara',
      position: 'Sotuv Menejeri',
      status: 'online',
      battery: 75,
      speed: '25 km/h',
      accuracy: '20m',
      lastUpdate: '1 daqiqa oldin',
      location: { lat: 41.3250, lng: 69.2900 },
      icon: '🚙',
      color: '#1abc9c'
    }
  ];

  useEffect(() => {
    setEmployees(mockEmployees);
    
    // Auto-refresh simulation
    if (isPlaying) {
      const interval = setInterval(() => {
        updateLocations();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const updateLocations = () => {
    setEmployees(prev => prev.map(emp => {
      if (emp.status === 'online') {
        // Simulate movement
        const latChange = (Math.random() - 0.5) * 0.001;
        const lngChange = (Math.random() - 0.5) * 0.001;
        
        return {
          ...emp,
          location: {
            lat: emp.location.lat + latChange,
            lng: emp.location.lng + lngChange
          },
          battery: Math.max(0, emp.battery - 1),
          lastUpdate: 'hozir',
          speed: `${Math.floor(Math.random() * 60)} km/h`
        };
      }
      return emp;
    }));
    
    setLastUpdate(new Date());
  };

  const handleRefresh = () => {
    updateLocations();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 8));
  };

  const handleCenterMap = () => {
    setMapCenter({ lat: 41.3111, lng: 69.2797 });
    setZoom(12);
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setMapCenter(employee.location);
    setZoom(15);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const onlineCount = employees.filter(e => e.status === 'online').length;
  const movingCount = employees.filter(e => e.speed !== '0 km/h').length;

  return (
    <div className={`live-tracking-page ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="tracking-header">
        <div className="header-left">
          <h1 className="page-title">
            <FaMapMarkerAlt className="title-icon" />
            Real Vaqt Kuzatuv
          </h1>
          <div className="header-stats">
            <div className="stat-badge online">
              <FaUserCheck /> {onlineCount} Online
            </div>
            <div className="stat-badge moving">
              <FaRocket /> {movingCount} Harakatlanmoqda
            </div>
            <div className="last-update">
              Oxirgi yangilanish: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="control-buttons">
            <button className="control-btn" onClick={handleRefresh} title="Yangilash">
              <FaSync />
            </button>
            <button className="control-btn" onClick={handlePlayPause} title={isPlaying ? 'Toxtatish' : 'Davom ettirish'}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button className="control-btn" onClick={handleFullscreen} title={isFullscreen ? 'Kichiklashtirish' : 'Kattalashtirish'}>
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      </div>

      <div className="tracking-content">
        {/* Map Section */}
        <div className="map-section">
          <div className="map-container">
            <div className="map-controls">
              <button className="map-control-btn" onClick={handleZoomIn}>+</button>
              <button className="map-control-btn" onClick={handleZoomOut}>-</button>
              <button className="map-control-btn" onClick={handleCenterMap} title="Markazlash">
                <FaLocationArrow />
              </button>
            </div>
            
            <div className="map-view">
              <div className="map-grid">
                {/* Simplified map grid for demo */}
                {Array.from({ length: 10 }).map((_, row) => (
                  <div key={row} className="map-row">
                    {Array.from({ length: 10 }).map((_, col) => (
                      <div key={col} className="map-cell"></div>
                    ))}
                  </div>
                ))}
                
                {/* Employee markers */}
                {employees.map(employee => (
                  <div
                    key={employee.id}
                    className={`map-marker ${employee.status} ${selectedEmployee?.id === employee.id ? 'selected' : ''}`}
                    style={{
                      left: `${(employee.location.lng - 69.27) * 1000}px`,
                      top: `${(employee.location.lat - 41.305) * 1000}px`,
                      backgroundColor: employee.color
                    }}
                    onClick={() => handleEmployeeSelect(employee)}
                    title={`${employee.name} - ${employee.position}`}
                  >
                    <span className="marker-icon">{employee.icon}</span>
                    {employee.speed !== '0 km/h' && <div className="moving-indicator"></div>}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="map-info">
              <div className="coordinates">
                <span>GPS: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</span>
                <span>Zoom: {zoom}x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="side-panel">
          <div className="panel-header">
            <h3>Xodimlar Holati</h3>
            <div className="panel-controls">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Xodim qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="status-filter"
              >
                <option value="all">Barchasi</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="away">Uzoq</option>
              </select>
            </div>
          </div>

          <div className="employees-list">
            {filteredEmployees.map(employee => (
              <div
                key={employee.id}
                className={`employee-item ${employee.status} ${selectedEmployee?.id === employee.id ? 'selected' : ''}`}
                onClick={() => handleEmployeeSelect(employee)}
              >
                <div className="employee-header">
                  <div className="employee-icon" style={{ backgroundColor: employee.color }}>
                    {employee.icon}
                  </div>
                  <div className="employee-info">
                    <h4 className="employee-name">{employee.name}</h4>
                    <p className="employee-position">{employee.position}</p>
                  </div>
                  <div className="employee-status">
                    <span className={`status-dot ${employee.status}`}></span>
                    <span className="status-text">
                      {employee.status === 'online' ? 'Online' : 
                       employee.status === 'offline' ? 'Offline' : 'Uzoq'}
                    </span>
                  </div>
                </div>

                <div className="employee-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Batareya</span>
                      <div className="battery-indicator">
                        <div 
                          className="battery-level"
                          style={{ width: `${employee.battery}%` }}
                        ></div>
                        <span className="battery-percent">{employee.battery}%</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tezlik</span>
                      <span className="detail-value">{employee.speed}</span>
                    </div>
                  </div>
                  
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Aniqlik</span>
                      <span className="detail-value">{employee.accuracy}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Oxirgi yangilanish</span>
                      <span className="detail-value">{employee.lastUpdate}</span>
                    </div>
                  </div>
                </div>

                <div className="employee-actions">
                  <button className="action-btn track-btn">
                    <FaLocationArrow /> Kuzatish
                  </button>
                  <button className="action-btn history-btn">
                    <FaHistory /> Tarix
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Employee Details */}
          {selectedEmployee && (
            <div className="selected-employee-card">
              <div className="selected-header">
                <h4>Tanlangan Xodim</h4>
                <button className="close-btn" onClick={() => setSelectedEmployee(null)}>×</button>
              </div>
              <div className="selected-content">
                <div className="selected-avatar" style={{ backgroundColor: selectedEmployee.color }}>
                  {selectedEmployee.icon}
                </div>
                <div className="selected-details">
                  <h3>{selectedEmployee.name}</h3>
                  <p>{selectedEmployee.position}</p>
                  <div className="selected-stats">
                    <div className="stat">
                      <span className="stat-label">Holati:</span>
                      <span className={`stat-value ${selectedEmployee.status}`}>
                        {selectedEmployee.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">GPS:</span>
                      <span className="stat-value">
                        {selectedEmployee.location.lat.toFixed(6)}, {selectedEmployee.location.lng.toFixed(6)}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Tezlik:</span>
                      <span className="stat-value">{selectedEmployee.speed}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Batareya:</span>
                      <span className="stat-value">{selectedEmployee.battery}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="selected-actions">
                <button className="btn primary-btn">
                  <FaLocationArrow /> Joylashuvni ko'rish
                </button>
                <button className="btn secondary-btn">
                  <FaHistory /> Faoliyat tarixi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-icon" style={{ color: '#2ecc71' }}>
            <FaUserCheck />
          </div>
          <div className="stat-content">
            <div className="stat-value">{onlineCount}</div>
            <div className="stat-label">Online xodimlar</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon" style={{ color: '#e74c3c' }}>
            <FaUserTimes />
          </div>
          <div className="stat-content">
            <div className="stat-value">{employees.length - onlineCount}</div>
            <div className="stat-label">Offline xodimlar</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon" style={{ color: '#3498db' }}>
            <FaRocket />
          </div>
          <div className="stat-content">
            <div className="stat-value">{movingCount}</div>
            <div className="stat-label">Harakatlanmoqda</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon" style={{ color: '#f39c12' }}>
            <FaHistory />
          </div>
          <div className="stat-content">
            <div className="stat-value">98.5%</div>
            <div className="stat-label">GPS aniqligi</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;