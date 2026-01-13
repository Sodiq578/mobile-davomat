import React, { useState, useEffect, useRef } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt,
  FaRoute,
  FaPlay,
  FaPause,
  FaUndo,
  FaExpand,
  FaCompress,
  FaLocationArrow,
  FaHistory,
  FaUser,
  FaClock,
  FaMapPin,
  FaRuler
} from 'react-icons/fa';
import './MapView.css';

const MapView = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [employeePaths, setEmployeePaths] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 41.3111, lng: 69.2797 });
  const [zoom, setZoom] = useState(12);
  const [timeRange, setTimeRange] = useState({ start: '09:00', end: '18:00' });
  const [currentTime, setCurrentTime] = useState('09:00');
  const playIntervalRef = useRef(null);

  // Mock employees data
  const mockEmployees = [
    {
      id: 1,
      name: 'Aliyev Aziz',
      position: 'Senior Dasturchi',
      avatarColor: '#3498db',
      icon: '👨‍💻'
    },
    {
      id: 2,
      name: 'Hasanova Malika',
      position: 'Moliya Menejeri',
      avatarColor: '#2ecc71',
      icon: '👩‍💼'
    },
    {
      id: 3,
      name: 'Olimov Sardor',
      position: 'Marketing Direktori',
      avatarColor: '#e74c3c',
      icon: '👨‍💼'
    },
    {
      id: 4,
      name: 'Karimova Nigora',
      position: 'HR Menejeri',
      avatarColor: '#9b59b6',
      icon: '👩‍💼'
    }
  ];

  // Generate mock paths for employees
  const generateMockPath = (employeeId) => {
    const baseLat = 41.3111 + (employeeId * 0.002);
    const baseLng = 69.2797 + (employeeId * 0.003);
    
    const path = [];
    for (let i = 0; i < 8; i++) {
      const time = `${9 + i}:00`;
      path.push({
        time,
        lat: baseLat + (Math.random() * 0.01 - 0.005),
        lng: baseLng + (Math.random() * 0.01 - 0.005),
        activity: i === 0 ? 'Ishga keldi' : 
                  i === 4 ? 'Tushlikka chiqdi' :
                  i === 5 ? 'Tushlikdan qaytdi' :
                  i === 7 ? 'Ishdan ketdi' : 'Ish jarayonida'
      });
    }
    return path;
  };

  useEffect(() => {
    setEmployees(mockEmployees);
    
    const paths = {};
    mockEmployees.forEach(emp => {
      paths[emp.id] = generateMockPath(emp.id);
    });
    setEmployeePaths(paths);
    
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        advanceTime();
      }, 1000);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }
    
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const advanceTime = () => {
    const [hours, minutes] = currentTime.split(':').map(Number);
    let newHours = hours;
    let newMinutes = minutes + 30;
    
    if (newMinutes >= 60) {
      newHours += 1;
      newMinutes = 0;
    }
    
    if (newHours > 18) {
      newHours = 9;
      newMinutes = 0;
    }
    
    const newTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    setCurrentTime(newTime);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentTime('09:00');
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
    setIsPlaying(false);
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    if (employeePaths[employee.id] && employeePaths[employee.id].length > 0) {
      const firstPoint = employeePaths[employee.id][0];
      setMapCenter({ lat: firstPoint.lat, lng: firstPoint.lng });
    }
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

  const getCurrentPosition = (path) => {
    if (!path || path.length === 0) return null;
    
    for (let i = 0; i < path.length; i++) {
      if (path[i].time >= currentTime) {
        return path[i];
      }
    }
    
    return path[path.length - 1];
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2);
  };

  const getTotalDistance = (path) => {
    if (!path || path.length < 2) return 0;
    
    let total = 0;
    for (let i = 1; i < path.length; i++) {
      total += parseFloat(calculateDistance(
        path[i-1].lat, path[i-1].lng,
        path[i].lat, path[i].lng
      ));
    }
    return total.toFixed(2);
  };

  return (
    <div className={`map-view-page ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="map-view-header">
        <div className="header-left">
          <h1 className="page-title">
            <FaRoute className="title-icon" />
            GPS Trek Xaritasi
          </h1>
          <div className="header-info">
            <div className="date-selector">
              <FaCalendarAlt className="info-icon" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="date-input"
              />
            </div>
            <div className="time-range">
              <span className="time-label">Vaqt oralig'i:</span>
              <div className="time-inputs">
                <input
                  type="time"
                  value={timeRange.start}
                  onChange={(e) => setTimeRange({ ...timeRange, start: e.target.value })}
                  className="time-input"
                />
                <span className="time-separator">-</span>
                <input
                  type="time"
                  value={timeRange.end}
                  onChange={(e) => setTimeRange({ ...timeRange, end: e.target.value })}
                  className="time-input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="time-controls">
            <div className="current-time-display">
              <FaClock className="time-icon" />
              <span className="current-time">{currentTime}</span>
            </div>
            <div className="control-buttons">
              <button className="control-btn" onClick={handleReset} title="Qayta boshlash">
                <FaUndo />
              </button>
              <button className="control-btn" onClick={handlePlayPause} title={isPlaying ? 'To\'xtatish' : 'Ijro etish'}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button className="control-btn" onClick={handleFullscreen} title={isFullscreen ? 'Kichiklashtirish' : 'Kattalashtirish'}>
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="map-view-content">
        {/* Map Section */}
        <div className="map-container-large">
          <div className="map-controls-panel">
            <div className="map-controls-group">
              <button className="map-btn" onClick={handleZoomIn}>
                +
              </button>
              <button className="map-btn" onClick={handleZoomOut}>
                -
              </button>
              <button className="map-btn" onClick={handleCenterMap}>
                <FaLocationArrow />
              </button>
            </div>
            <div className="map-info-panel">
              <div className="map-info-item">
                <FaRuler />
                <span>Zoom: {zoom}x</span>
              </div>
              <div className="map-info-item">
                <FaMapPin />
                <span>GPS: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="map-area">
            <div className="map-background">
              {/* Simplified map representation */}
              <div className="map-grid-large">
                {Array.from({ length: 15 }).map((_, row) => (
                  <div key={row} className="map-row-large">
                    {Array.from({ length: 15 }).map((_, col) => (
                      <div key={col} className="map-cell-large"></div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Draw paths */}
              {Object.entries(employeePaths).map(([empId, path]) => {
                const employee = employees.find(e => e.id === parseInt(empId));
                if (!employee || path.length < 2) return null;

                return (
                  <svg key={empId} className="path-svg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <path
                      d={path.map((point, index) => {
                        const x = (point.lng - 69.27) * 1000;
                        const y = (point.lat - 41.305) * 1000;
                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      stroke={employee.avatarColor}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      opacity="0.6"
                    />
                    
                    {/* Path points */}
                    {path.map((point, index) => (
                      <circle
                        key={index}
                        cx={(point.lng - 69.27) * 1000}
                        cy={(point.lat - 41.305) * 1000}
                        r="4"
                        fill={employee.avatarColor}
                        stroke="white"
                        strokeWidth="2"
                      />
                    ))}
                  </svg>
                );
              })}

              {/* Employee markers */}
              {employees.map(employee => {
                const path = employeePaths[employee.id];
                const currentPos = getCurrentPosition(path);
                
                if (!currentPos) return null;

                return (
                  <div
                    key={employee.id}
                    className={`employee-marker ${selectedEmployee?.id === employee.id ? 'selected' : ''}`}
                    style={{
                      left: `${(currentPos.lng - 69.27) * 1000}px`,
                      top: `${(currentPos.lat - 41.305) * 1000}px`,
                      backgroundColor: employee.avatarColor
                    }}
                    onClick={() => handleEmployeeSelect(employee)}
                    title={`${employee.name} - ${currentTime}`}
                  >
                    <span className="marker-content">
                      {employee.icon}
                    </span>
                    {selectedEmployee?.id === employee.id && (
                      <div className="marker-pulse"></div>
                    )}
                  </div>
                );
              })}

              {/* Legend */}
              <div className="map-legend">
                <div className="legend-title">Afsona</div>
                <div className="legend-items">
                  {employees.map(emp => (
                    <div key={emp.id} className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: emp.avatarColor }}></div>
                      <span className="legend-name">{emp.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="side-panel">
          <div className="panel-section">
            <h3 className="panel-title">
              <FaUser className="title-icon" />
              Xodimlar Treklari
            </h3>
            
            <div className="employees-list">
              {employees.map(employee => (
                <div
                  key={employee.id}
                  className={`employee-path-card ${selectedEmployee?.id === employee.id ? 'selected' : ''}`}
                  onClick={() => handleEmployeeSelect(employee)}
                >
                  <div className="employee-header">
                    <div className="employee-avatar" style={{ backgroundColor: employee.avatarColor }}>
                      {employee.icon}
                    </div>
                    <div className="employee-info">
                      <h4 className="employee-name">{employee.name}</h4>
                      <p className="employee-position">{employee.position}</p>
                    </div>
                  </div>

                  {employeePaths[employee.id] && (
                    <div className="path-stats">
                      <div className="stat-row">
                        <div className="stat-item">
                          <span className="stat-label">Jami masofa</span>
                          <span className="stat-value">{getTotalDistance(employeePaths[employee.id])} km</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Nuqtalar soni</span>
                          <span className="stat-value">{employeePaths[employee.id].length}</span>
                        </div>
                      </div>
                      <div className="stat-row">
                        <div className="stat-item">
                          <span className="stat-label">Joriy vaqt</span>
                          <span className="stat-value">{currentTime}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Faoliyat</span>
                          <span className="stat-value activity">
                            {getCurrentPosition(employeePaths[employee.id])?.activity || 'Noma\'lum'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="path-timeline">
                    <div className="timeline-header">
                      <span className="timeline-title">Vaqt chizig'i</span>
                      <span className="timeline-current">{currentTime}</span>
                    </div>
                    <div className="timeline-track">
                      {employeePaths[employee.id]?.map((point, index) => (
                        <div
                          key={index}
                          className={`timeline-point ${point.time <= currentTime ? 'passed' : ''} ${point.time === currentTime ? 'current' : ''}`}
                          title={`${point.time} - ${point.activity}`}
                        >
                          <div className="point-time">{point.time}</div>
                          <div className="point-marker"></div>
                          <div className="point-activity">{point.activity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Employee Details */}
          {selectedEmployee && employeePaths[selectedEmployee.id] && (
            <div className="selected-employee-section">
              <div className="section-header">
                <h4>Tanlangan Xodim Tafsilotlari</h4>
                <button className="close-btn" onClick={() => setSelectedEmployee(null)}>×</button>
              </div>
              
              <div className="selected-details">
                <div className="selected-summary">
                  <div className="summary-avatar" style={{ backgroundColor: selectedEmployee.avatarColor }}>
                    {selectedEmployee.icon}
                  </div>
                  <div className="summary-info">
                    <h3>{selectedEmployee.name}</h3>
                    <p>{selectedEmployee.position}</p>
                    <div className="summary-stats">
                      <div className="summary-stat">
                        <span className="stat-label">Masofa:</span>
                        <span className="stat-value">{getTotalDistance(employeePaths[selectedEmployee.id])} km</span>
                      </div>
                      <div className="summary-stat">
                        <span className="stat-label">Vaqt oralig'i:</span>
                        <span className="stat-value">{timeRange.start} - {timeRange.end}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="path-details">
                  <h5>GPS Nuqtalar Ro'yxati</h5>
                  <div className="points-table">
                    <div className="table-header">
                      <div className="table-cell">Vaqt</div>
                      <div className="table-cell">GPS Joylashuv</div>
                      <div className="table-cell">Faoliyat</div>
                    </div>
                    <div className="table-body">
                      {employeePaths[selectedEmployee.id].map((point, index) => (
                        <div key={index} className={`table-row ${point.time === currentTime ? 'current' : ''}`}>
                          <div className="table-cell">{point.time}</div>
                          <div className="table-cell">
                            {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                          </div>
                          <div className="table-cell">
                            <span className="activity-badge">{point.activity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="analysis-section">
                  <h5>Tahlil</h5>
                  <div className="analysis-grid">
                    <div className="analysis-item">
                      <span className="analysis-label">O'rtacha tezlik</span>
                      <span className="analysis-value">4.5 km/soat</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">To'xtash joylari</span>
                      <span className="analysis-value">3 ta</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">Ish vaqti</span>
                      <span className="analysis-value">8 soat</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">Samaradorlik</span>
                      <span className="analysis-value">92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Time Slider */}
      <div className="time-slider-section">
        <div className="slider-header">
          <FaHistory className="slider-icon" />
          <span>Vaqt Slider</span>
        </div>
        <div className="slider-container">
          <input
            type="range"
            min="9"
            max="18"
            step="0.5"
            value={parseFloat(currentTime)}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              const hours = Math.floor(value);
              const minutes = (value - hours) * 60;
              setCurrentTime(`${hours.toString().padStart(2, '0')}:${minutes === 0 ? '00' : '30'}`);
            }}
            className="time-slider"
          />
          <div className="slider-labels">
            <span>09:00</span>
            <span>12:00</span>
            <span>15:00</span>
            <span>18:00</span>
          </div>
        </div>
        <div className="slider-actions">
          <button className="slider-btn" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <FaPause /> : <FaPlay />}
            {isPlaying ? 'To\'xtatish' : 'Ijro etish'}
          </button>
          <button className="slider-btn" onClick={handleReset}>
            <FaUndo />
            Qayta boshlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapView;