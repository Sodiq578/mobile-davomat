import React, { useState } from 'react';
import { 
  FaFilePdf, 
  FaFileExcel, 
  FaDownload, 
  FaCalendarAlt,
  FaFilter,
  FaChartBar,
  FaPrint,
  FaFileArchive,
  FaClock,
  FaUsers,
  FaBuilding,
  FaChartLine,
  FaChartPie
} from 'react-icons/fa';
import './reports.css';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [reportType, setReportType] = useState('attendance');
  const [department, setDepartment] = useState('all');

  const reports = [
    {
      id: 1,
      name: 'Oylik Davomat Hisobot',
      type: 'attendance',
      date: '2024-01',
      size: '2.4 MB',
      downloads: 45,
      lastDownload: '2024-01-15'
    },
    {
      id: 2,
      name: 'Kechikishlar Hisobot',
      type: 'late',
      date: '2024-01',
      size: '1.2 MB',
      downloads: 28,
      lastDownload: '2024-01-14'
    },
    {
      id: 3,
      name: 'GPS Faoliyat Hisobot',
      type: 'gps',
      date: '2023-12',
      size: '3.1 MB',
      downloads: 32,
      lastDownload: '2024-01-10'
    },
    {
      id: 4,
      name: 'Xodimlar Faolligi',
      type: 'activity',
      date: '2023-12',
      size: '1.8 MB',
      downloads: 38,
      lastDownload: '2024-01-05'
    },
    {
      id: 5,
      name: 'Bo\'limlar Hisobot',
      type: 'department',
      date: '2023-12',
      size: '2.1 MB',
      downloads: 24,
      lastDownload: '2024-01-03'
    },
    {
      id: 6,
      name: 'Ish Vaqti Analizi',
      type: 'work_hours',
      date: '2023-11',
      size: '2.7 MB',
      downloads: 19,
      lastDownload: '2023-12-28'
    }
  ];

  const departments = [
    'Barcha Bo\'limlar',
    'IT Bo\'limi',
    'Moliya',
    'Marketing',
    'HR',
    'Ishlab chiqarish',
    'Logistika',
    'Sotuv'
  ];

  const reportTypes = [
    { value: 'attendance', label: 'Davomat', icon: <FaUsers /> },
    { value: 'late', label: 'Kechikishlar', icon: <FaClock /> },
    { value: 'gps', label: 'GPS Faoliyat', icon: <FaChartLine /> },
    { value: 'department', label: 'Bo\'limlar', icon: <FaBuilding /> },
    { value: 'activity', label: 'Faollik', icon: <FaChartBar /> },
    { value: 'work_hours', label: 'Ish Vaqti', icon: <FaClock /> }
  ];

  const handleGenerateReport = () => {
    alert('Hisobot yaratilmoqda...');
  };

  const handleDownload = (report) => {
    alert(`${report.name} yuklanmoqda...`);
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1>Hisobotlar</h1>
          <p>Tizim hisobotlari va analitika</p>
        </div>
        <button className="btn btn-primary" onClick={handleGenerateReport}>
          <FaChartBar /> Yangi Hisobot
        </button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-card">
          <h3>Hisobot Parametrlari</h3>
          
          <div className="filter-grid">
            <div className="filter-group">
              <label>
                <FaCalendarAlt /> Boshlanish sanasi
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            
            <div className="filter-group">
              <label>
                <FaCalendarAlt /> Tugash sanasi
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            
            <div className="filter-group">
              <label>
                <FaFilter /> Hisobot turi
              </label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>
                <FaBuilding /> Bo'lim
              </label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="filter-actions">
            <button className="btn btn-secondary">
              <FaFilter /> Filtrlash
            </button>
            <button className="btn btn-primary" onClick={handleGenerateReport}>
              <FaChartBar /> Hisobot Yaratish
            </button>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="report-types-section">
        <h3>Hisobot Turlari</h3>
        <div className="types-grid">
          {reportTypes.map(type => (
            <div 
              key={type.value}
              className={`type-card ${reportType === type.value ? 'active' : ''}`}
              onClick={() => setReportType(type.value)}
            >
              <div className="type-icon">
                {type.icon}
              </div>
              <div className="type-info">
                <h4>{type.label}</h4>
                <p>Detalli statistika</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="reports-section">
        <div className="section-header">
          <h3>Mavjud Hisobotlar</h3>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <FaPrint /> Chop etish
            </button>
            <button className="btn btn-secondary">
              <FaFileArchive /> Arxiv
            </button>
          </div>
        </div>

        <div className="reports-grid">
          {reports.map(report => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <div className="report-icon">
                  {reportType === 'attendance' ? <FaUsers /> :
                   reportType === 'late' ? <FaClock /> :
                   reportType === 'gps' ? <FaChartLine /> :
                   reportType === 'department' ? <FaBuilding /> :
                   reportType === 'activity' ? <FaChartBar /> : <FaChartPie />}
                </div>
                <div className="report-info">
                  <h4>{report.name}</h4>
                  <p className="report-date">{report.date}</p>
                  <div className="report-meta">
                    <span>{report.size}</span>
                    <span>•</span>
                    <span>{report.downloads} yuklama</span>
                  </div>
                </div>
              </div>

              <div className="report-body">
                <p className="report-desc">
                  {report.type === 'attendance' && 'Xodimlarning davomat statistikasi'}
                  {report.type === 'late' && 'Kechikishlar va sabablari'}
                  {report.type === 'gps' && 'GPS faoliyat va joylashuv treklari'}
                  {report.type === 'department' && 'Bo\'limlar bo\'yicha faoliyat'}
                  {report.type === 'activity' && 'Xodimlarning ish faolligi'}
                  {report.type === 'work_hours' && 'Ish vaqti va samaradorlik'}
                </p>
                
                <div className="report-stats">
                  <div className="stat-item">
                    <span className="stat-label">Oxirgi yuklama:</span>
                    <span className="stat-value">{report.lastDownload}</span>
                  </div>
                </div>
              </div>

              <div className="report-footer">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleDownload(report)}
                >
                  <FaDownload /> Yuklash
                </button>
                <div className="format-buttons">
                  <button className="format-btn" title="PDF formatda">
                    <FaFilePdf />
                  </button>
                  <button className="format-btn" title="Excel formatda">
                    <FaFileExcel />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">
            <FaFilePdf />
          </div>
          <div className="stat-content">
            <h3>{reports.length}</h3>
            <p>Jami Hisobotlar</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaDownload />
          </div>
          <div className="stat-content">
            <h3>{reports.reduce((acc, report) => acc + report.downloads, 0)}</h3>
            <p>Yuklab Olishlar</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaChartBar />
          </div>
          <div className="stat-content">
            <h3>98%</h3>
            <p>Ma'lumot Aniqlik</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>24/7</h3>
            <p>Hisobot Mavjudligi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;