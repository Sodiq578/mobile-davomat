import React, { useState, useEffect, useRef } from 'react';
import {
  FaSearch,
  FaFilter,
  FaLayerGroup,
  FaRuler,
  FaDrawPolygon,
  FaDrawCircle,
  FaRoute,
  FaDownload,
  FaPrint,
  FaExpand,
  FaLocationArrow,
  FaMapPin,
  FaHistory,
  FaSatellite,
  FaRoad,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import './MapView.css';

const MapView = () => {
  const [mapLayers, setMapLayers] = useState({
    employees: true,
    routes: true,
    zones: true,
    poi: false,
    traffic: false,
    heatmap: false
  });
  const [drawMode, setDrawMode] = useState(null); // 'polygon', 'circle', 'route'
  const [measureMode, setMeasureMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);
  const [zones, setZones] = useState([]);
  const [employees, setEmployees] = useState([]);
  const mapRef = useRef(null);

  // Demo zonalar
  const demoZones = [
    {
      id: 1,
      name: 'Asosiy ofis',
      type: 'work',
      color: '#3498db',
      coordinates: [
        { lat: 41.3110, lng: 69.2405 },
        { lat: 41.3115, lng: 69.2415 },
        { lat: 41.3105, lng: 69.2420 },
        { lat: 41.3100, lng: 69.2410 }
      ],
      area: '5000 m²',
      employees: 45,
      status: 'active'
    },
    {
      id: 2,
      name: 'Parking zonasi',
      type: 'parking',
      color: '#2ecc71',
      coordinates: [
        { lat: 41.3120, lng: 69.2395 },
        { lat: 41.3125, lng: 69.2405 },
        { lat: 41.3115, lng: 69.2410 },
        { lat: 41.3110, lng: 69.2400 }
      ],
      area: '3000 m²',
      employees: 20,
      status: 'active'
    },
    {
      id: 3,
      name: 'Tanaffus zonasi',
      type: 'break',
      color: '#f39c12',
      coordinates: [
        { lat: 41.3100, lng: 69.2390 },
        { lat: 41.3105, lng: 69.2395 },
        { lat: 41.3095, lng: 69.2400 },
        { lat: 41.3090, lng: 69.2395 }
      ],
      area: '1500 m²',
      employees: 15,
      status: 'active'
    },
    {
      id: 4,
      name: 'Kirish taqiqlangan zona',
      type: 'restricted',
      color: '#e74c3c',
      coordinates: [
        { lat: 41.3130, lng: 69.2415 },
        { lat: 41.3135, lng: 69.2425 },
        { lat: 41.3125, lng: 69.2430 },
        { lat: 41.3120, lng: 69.2420 }
      ],
      area: '2500 m²',
      employees: 0,
      status: 'restricted'
    }
  ];

  // Demo xodimlar
  const demoEmployees = [
    {
      id: 1,
      name: 'Aliyev Aziz',
      position: 'Senior Dasturchi',
      location: { lat: 41.3112, lng: 69.2410 },
      zone: 'Asosiy ofis',
      status: 'working',
      lastSeen: '2 daqiqa oldin'
    },
    {
      id: 2,
      name: 'Hasanova Malika',
      position: 'Moliya Menejeri',
      location: { lat: 41.3122, lng: 69.2400 },
      zone: 'Parking zonasi',
      status: 'break',
      lastSeen: '5 daqiqa oldin'
    },
    {
      id: 3,
      name: 'Olimov Sardor',
      position: 'Marketing Direktori',
      location: { lat: 41.3102, lng: 69.2392 },
      zone: 'Tanaffus zonasi',
      status: 'working',
      lastSeen: '10 daqiqa oldin'
    },
    {
      id: 4,
      name: 'Karimova Nigora',
      position: 'HR Menejeri',
      location: { lat: 41.3118, lng: 69.2418 },
      zone: 'Asosiy ofis',
      status: 'working',
      lastSeen: '1 daqiqa oldin'
    }
  ];

  useEffect(() => {
    setZones(demoZones);
    setEmployees(demoEmployees);
  }, []);

  const handleLayerToggle = (layer) => {
    setMapLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const handleDrawMode = (mode) => {
    setDrawMode(drawMode === mode ? null : mode);
    setMeasureMode(false);
  };

  const handleMeasureToggle = () => {
    setMeasureMode(!measureMode);
    setDrawMode(null);
  };

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality here
  };

  const handleExportMap = (format) => {
    alert(`Xarita ${format} formatida eksport qilindi`);
  };

  const getZoneTypeInfo = (type) => {
    const types = {
      work: { label: 'Ish zonasi', icon: '🏢' },
      parking: { label: 'Parking', icon: '🅿️' },
      break: { label: 'Tanaffus zonasi', icon: '☕' },
      restricted: { label: 'Cheklangan zona', icon: '🚫' }
    };
    return types[type] || { label: 'Boshqa', icon: '📍' };
  };

  return (
    <div className="map-view-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Xaritada Ko'rish</h1>
          <p className="page-subtitle">
            Xodimlarning joylashuvi va xizmat zonalarini monitoring qilish
          </p>
        </div>
        <div className="header-right">
          <div className="header-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => handleExportMap('PNG')}
            >
              <FaDownload /> Rasm sifatida
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleExportMap('PDF')}
            >
              <FaPrint /> PDF
            </button>
            <button className="btn btn-primary">
              <FaExpand /> To'liq ekran
            </button>
          </div>
        </div>
      </div>

      <div className="map-view-container">
        {/* Map Controls Sidebar */}
        <div className="map-controls-sidebar">
          {/* Search */}
          <div className="control-section">
            <h3>
              <FaSearch /> Qidirish
            </h3>
            <form onSubmit={handleSearch} className="map-search-form">
              <input
                type="text"
                placeholder="Manzil, xodim yoki zona nomi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Layers */}
          <div className="control-section">
            <h3>
              <FaLayerGroup /> Qatlamlar
            </h3>
            <div className="layer-controls">
              {Object.entries(mapLayers).map(([layer, isActive]) => (
                <div key={layer} className="layer-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => handleLayerToggle(layer)}
                    />
                    <span className="layer-name">
                      {layer === 'employees' && '👥 Xodimlar'}
                      {layer === 'routes' && '🛣️ Marshrutlar'}
                      {layer === 'zones' && '📍 Zonalar'}
                      {layer === 'poi' && '🏛️ Diqqatga sazovor joylar'}
                      {layer === 'traffic' && '🚦 Transport'}
                      {layer === 'heatmap' && '🔥 Issiqlik xaritasi'}
                    </span>
                  </label>
                  <span className="layer-count">
                    {layer === 'employees' && employees.length}
                    {layer === 'zones' && zones.length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Drawing Tools */}
          <div className="control-section">
            <h3>Chizish Vositalari</h3>
            <div className="drawing-tools">
              <button
                className={`tool-btn ${drawMode === 'polygon' ? 'active' : ''}`}
                onClick={() => handleDrawMode('polygon')}
              >
                <FaDrawPolygon /> Poligon
              </button>
              <button
                className={`tool-btn ${drawMode === 'circle' ? 'active' : ''}`}
                onClick={() => handleDrawMode('circle')}
              >
                <FaDrawCircle /> Doira
              </button>
              <button
                className={`tool-btn ${drawMode === 'route' ? 'active' : ''}`}
                onClick={() => handleDrawMode('route')}
              >
                <FaRoute /> Marshrut
              </button>
              <button
                className={`tool-btn ${measureMode ? 'active' : ''}`}
                onClick={handleMeasureToggle}
              >
                <FaRuler /> O'lchash
              </button>
            </div>
          </div>

          {/* Zones List */}
          <div className="control-section">
            <h3>
              <FaMapPin /> Zonalar ({zones.length})
            </h3>
            <div className="zones-list">
              {zones.map(zone => {
                const zoneInfo = getZoneTypeInfo(zone.type);
                return (
                  <div
                    key={zone.id}
                    className={`zone-item ${selectedZone?.id === zone.id ? 'selected' : ''}`}
                    onClick={() => handleZoneClick(zone)}
                  >
                    <div className="zone-header">
                      <div 
                        className="zone-color"
                        style={{ backgroundColor: zone.color }}
                      ></div>
                      <div className="zone-info">
                        <div className="zone-name">{zone.name}</div>
                        <div className="zone-type">
                          {zoneInfo.icon} {zoneInfo.label}
                        </div>
                      </div>
                      <div className={`zone-status ${zone.status}`}>
                        {zone.status === 'active' ? '●' : '○'}
                      </div>
                    </div>
                    <div className="zone-details">
                      <div className="zone-stat">
                        <span>Maydoni:</span>
                        <strong>{zone.area}</strong>
                      </div>
                      <div className="zone-stat">
                        <span>Xodimlar:</span>
                        <strong>{zone.employees}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="main-map-area">
          <div className="map-header">
            <div className="map-view-selector">
              <button className="view-btn active">
                <FaSatellite /> Satellite
              </button>
              <button className="view-btn">
                <FaRoad /> Street
              </button>
              <button className="view-btn">
                <FaLayerGroup /> Hybrid
              </button>
            </div>

            <div className="map-coordinates">
              <div className="coordinate-display">
                <span>41.311081° N, 69.240562° E</span>
                <small>Toshkent markazi</small>
              </div>
            </div>
          </div>

          <div className="map-container-large">
            <div className="map-placeholder-large">
              {/* In a real app, this would be a Google Maps or Leaflet component */}
              <div className="map-grid-large">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className="map-grid-cell-large"></div>
                ))}
              </div>

              {/* Zones on map */}
              {mapLayers.zones && zones.map(zone => (
                <div
                  key={zone.id}
                  className={`map-zone ${zone.type} ${selectedZone?.id === zone.id ? 'selected' : ''}`}
                  style={{
                    clipPath: `polygon(${zone.coordinates.map((coord, index) => 
                      `${((coord.lng - 69.235) / 0.02) * 100}% ${((41.32 - coord.lat) / 0.02) * 100}%`
                    ).join(', ')})`
                  }}
                  onClick={() => handleZoneClick(zone)}
                >
                  <div className="zone-label">
                    {zone.name}
                    <small>{zone.area}</small>
                  </div>
                </div>
              ))}

              {/* Employees on map */}
              {mapLayers.employees && employees.map(employee => (
                <div
                  key={employee.id}
                  className={`map-employee ${employee.status}`}
                  style={{
                    left: `${((employee.location.lng - 69.235) / 0.02) * 100}%`,
                    top: `${((41.32 - employee.location.lat) / 0.02) * 100}%`
                  }}
                >
                  <div className="employee-marker">
                    <div className="marker-dot"></div>
                    <div className="marker-label">{employee.name.split(' ')[0]}</div>
                  </div>
                  <div className="employee-tooltip">
                    <strong>{employee.name}</strong>
                    <small>{employee.position}</small>
                    <div className="tooltip-info">
                      <span>Zona: {employee.zone}</span>
                      <span>Status: {employee.status}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Drawing tools indicators */}
              {drawMode && (
                <div className="drawing-overlay">
                  <div className="drawing-instruction">
                    {drawMode === 'polygon' && 'Poligon chizish uchun xaritada nuqtalarni bosing'}
                    {drawMode === 'circle' && 'Doira chizish uchun markazni tanlang va radiusni o\'lchang'}
                    {drawMode === 'route' && 'Marshrut chizish uchun boshlang\'ich va yakuniy nuqtalarni tanlang'}
                  </div>
                </div>
              )}

              {measureMode && (
                <div className="measure-overlay">
                  <div className="measure-instruction">
                    <FaRuler /> Masofa o'lchash rejimi
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="map-stats-bar">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Jami zonalar</div>
                <div className="stat-value">{zones.length}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Xodimlar xaritada</div>
                <div className="stat-value">
                  {employees.filter(e => mapLayers.employees).length}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Umumiy maydon</div>
                <div className="stat-value">12,000 m²</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Qoplangan hudud</div>
                <div className="stat-value">85%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Zone Panel */}
        {selectedZone && (
          <div className="selected-zone-panel">
            <div className="panel-header">
              <h3>
                <div 
                  className="zone-icon"
                  style={{ backgroundColor: selectedZone.color }}
                >
                  {getZoneTypeInfo(selectedZone.type).icon}
                </div>
                {selectedZone.name}
                <span className="zone-subtitle">
                  {getZoneTypeInfo(selectedZone.type).label}
                </span>
              </h3>
              <button 
                className="panel-close"
                onClick={() => setSelectedZone(null)}
              >
                ×
              </button>
            </div>

            <div className="panel-content">
              <div className="zone-details-grid">
                <div className="detail-item">
                  <div className="detail-label">ID:</div>
                  <div className="detail-value">{selectedZone.id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Status:</div>
                  <div className="detail-value">
                    <span className={`status-badge ${selectedZone.status}`}>
                      {selectedZone.status === 'active' ? 'Faol' : 'Cheklangan'}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Maydoni:</div>
                  <div className="detail-value">{selectedZone.area}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Xodimlar soni:</div>
                  <div className="detail-value">{selectedZone.employees}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Yaratilgan sana:</div>
                  <div className="detail-value">2024-01-15</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Oxirgi yangilanish:</div>
                  <div className="detail-value">2024-01-20</div>
                </div>
              </div>

              <div className="zone-employees">
                <h4>Zonadagi Xodimlar</h4>
                <div className="employees-mini-list">
                  {employees
                    .filter(emp => emp.zone === selectedZone.name)
                    .slice(0, 3)
                    .map(emp => (
                      <div key={emp.id} className="mini-employee">
                        <div className="mini-avatar">{emp.name.charAt(0)}</div>
                        <div className="mini-info">
                          <div className="mini-name">{emp.name}</div>
                          <div className="mini-position">{emp.position}</div>
                        </div>
                        <div className={`mini-status ${emp.status}`}>
                          {emp.status === 'working' ? '⚡' : '☕'}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="zone-actions">
                <button className="btn btn-secondary">
                  <FaEye /> Ko'rish
                </button>
                <button className="btn btn-secondary">
                  <FaHistory /> Tarix
                </button>
                <button className="btn btn-primary">
                  <FaLocationArrow /> Navigatsiya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;