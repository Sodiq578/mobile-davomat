import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaChartBar,
  FaDownload,
  FaFilter,
  FaSearch,
  FaCalendar,
  FaUser,
  FaBuilding,
  FaChartLine,
  FaHistory,
  FaFileExport,
  FaPrint,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarMonth
} from 'react-icons/fa';
import './Attendance.css';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [stats, setStats] = useState({});
  const [activeView, setActiveView] = useState('month'); // 'day', 'week', 'month'

  // Oylar ro'yxati
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];

  // Demo davomat ma'lumotlari
  const demoAttendance = [
    { 
      id: 1, 
      date: '2024-01-15', 
      day: 'Dushanba',
      checkIn: '09:15', 
      checkOut: '18:30', 
      status: 'on_time',
      workHours: '9.25',
      lateMinutes: 15,
      earlyLeave: 0,
      location: 'Toshkent, Yunusobod',
      notes: ''
    },
    { 
      id: 2, 
      date: '2024-01-16', 
      day: 'Seshanba',
      checkIn: '09:00', 
      checkOut: '18:00', 
      status: 'on_time',
      workHours: '9.00',
      lateMinutes: 0,
      earlyLeave: 0,
      location: 'Toshkent, Yunusobod',
      notes: ''
    },
    { 
      id: 3, 
      date: '2024-01-17', 
      day: 'Chorshanba',
      checkIn: '08:45', 
      checkOut: '17:45', 
      status: 'early',
      workHours: '9.00',
      lateMinutes: 0,
      earlyLeave: 15,
      location: 'Toshkent, Yunusobod',
      notes: 'Doktorga borish'
    },
    { 
      id: 4, 
      date: '2024-01-18', 
      day: 'Payshanba',
      checkIn: '09:30', 
      checkOut: '18:15', 
      status: 'late',
      workHours: '8.75',
      lateMinutes: 30,
      earlyLeave: 0,
      location: 'Uyda ish',
      notes: ''
    },
    { 
      id: 5, 
      date: '2024-01-19', 
      day: 'Juma',
      checkIn: '09:00', 
      checkOut: '16:00', 
      status: 'early_leave',
      workHours: '7.00',
      lateMinutes: 0,
      earlyLeave: 120,
      location: 'Toshkent, Yunusobod',
      notes: 'Ish tashrifi'
    },
    { 
      id: 6, 
      date: '2024-01-22', 
      day: 'Dushanba',
      checkIn: '09:00', 
      checkOut: '18:00', 
      status: 'on_time',
      workHours: '9.00',
      lateMinutes: 0,
      earlyLeave: 0,
      location: 'Toshkent, Yunusobod',
      notes: ''
    },
    { 
      id: 7, 
      date: '2024-01-23', 
      day: 'Seshanba',
      checkIn: '10:00', 
      checkOut: '19:00', 
      status: 'late',
      workHours: '9.00',
      lateMinutes: 60,
      earlyLeave: 0,
      location: 'Toshkent, Yunusobod',
      notes: 'Transport muammosi'
    },
    { 
      id: 8, 
      date: '2024-01-24', 
      day: 'Chorshanba',
      checkIn: '09:00', 
      checkOut: '18:00', 
      status: 'on_time',
      workHours: '9.00',
      lateMinutes: 0,
      earlyLeave: 0,
      location: 'Toshkent, Yunusobod',
      notes: ''
    }
  ];

  useEffect(() => {
    loadAttendanceData();
  }, [selectedMonth, selectedYear]);

  const loadAttendanceData = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filtrlangan ma'lumotlar
      const filtered = demoAttendance.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() === selectedMonth && 
               itemDate.getFullYear() === selectedYear;
      });
      
      // Saralash
      const sorted = sortData(filtered);
      
      setAttendanceData(sorted);
      setFilteredData(sorted);
      calculateStats(sorted);
      
    } catch (error) {
      console.error('Attendance data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'date':
          comparison = new Date(b.date) - new Date(a.date);
          break;
        case 'checkIn':
          const aTime = a.checkIn.split(':').map(Number);
          const bTime = b.checkIn.split(':').map(Number);
          comparison = (bTime[0] * 60 + bTime[1]) - (aTime[0] * 60 + aTime[1]);
          break;
        case 'workHours':
          comparison = parseFloat(b.workHours) - parseFloat(a.workHours);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  };

  const calculateStats = (data) => {
    const totalDays = data.length;
    const presentDays = data.filter(d => d.status !== 'absent').length;
    const lateDays = data.filter(d => d.status === 'late').length;
    const earlyLeaveDays = data.filter(d => d.status === 'early_leave').length;
    const absentDays = data.filter(d => d.status === 'absent').length;
    
    const totalWorkHours = data.reduce((sum, d) => sum + parseFloat(d.workHours || 0), 0);
    const avgWorkHours = totalDays > 0 ? (totalWorkHours / totalDays).toFixed(2) : 0;
    const avgLateMinutes = lateDays > 0 ? 
      data.filter(d => d.status === 'late')
          .reduce((sum, d) => sum + (d.lateMinutes || 0), 0) / lateDays : 0;
    
    const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;
    
    setStats({
      totalDays,
      presentDays,
      lateDays,
      earlyLeaveDays,
      absentDays,
      totalWorkHours,
      avgWorkHours,
      avgLateMinutes,
      attendanceRate
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setFilteredData(attendanceData);
      return;
    }
    
    const filtered = attendanceData.filter(item => 
      item.day.toLowerCase().includes(value.toLowerCase()) ||
      item.date.includes(value) ||
      item.location.toLowerCase().includes(value.toLowerCase()) ||
      item.notes.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredData(filtered);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'on_time': return <FaCheckCircle className="success" />;
      case 'late': return <FaExclamationTriangle className="warning" />;
      case 'early': return <FaCheckCircle className="success" />;
      case 'early_leave': return <FaTimesCircle className="error" />;
      case 'absent': return <FaTimesCircle className="error" />;
      default: return <FaExclamationTriangle className="info" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'on_time': return 'O\'z vaqtida';
      case 'late': return 'Kechikdi';
      case 'early': return 'Erkak keldi';
      case 'early_leave': return 'Erkak ketdi';
      case 'absent': return 'Kelmay qoldi';
      default: return 'Noma\'lum';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'on_time': return '#2ecc71';
      case 'late': return '#f39c12';
      case 'early': return '#3498db';
      case 'early_leave': return '#e74c3c';
      case 'absent': return '#95a5a6';
      default: return '#7f8c8d';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const exportToCSV = () => {
    // CSV export logikasi
    alert('CSV fayli yuklab olindi');
  };

  const exportToPDF = () => {
    // PDF export logikasi
    alert('PDF fayli yaratildi');
  };

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="attendance-loading">
        <div className="loading-spinner"></div>
        <p>Davomat ma'lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="attendance-page">
      {/* Header */}
      <div className="attendance-header">
        <div className="header-left">
          <h1>
            <FaCalendarAlt className="header-icon" />
            Davomat Tarixi
          </h1>
          <p className="header-subtitle">
            Ish vaqti va davomat statistikangiz
          </p>
        </div>
        
        <div className="header-right">
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={exportToCSV}>
              <FaDownload /> CSV
            </button>
            <button className="btn btn-secondary" onClick={exportToPDF}>
              <FaFileExport /> PDF
            </button>
            <button className="btn btn-secondary" onClick={printReport}>
              <FaPrint /> Chop etish
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card attendance-rate">
          <div className="stat-icon">
            <FaChartBar />
          </div>
          <div className="stat-content">
            <h3>{stats.attendanceRate}%</h3>
            <p>Davomat darajasi</p>
            <div className="stat-trend up">
              <FaArrowUp /> +2.1% o'tgan oyga nisbatan
            </div>
          </div>
        </div>

        <div className="stat-card work-hours">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>{stats.totalWorkHours?.toFixed(1)}</h3>
            <p>Jami ish soati</p>
            <div className="stat-trend neutral">
              <FaMinus /> O'rtacha: {stats.avgWorkHours} soat/kun
            </div>
          </div>
        </div>

        <div className="stat-card present-days">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.presentDays}/{stats.totalDays}</h3>
            <p>Ish kunlari</p>
            <div className="stat-detail">
              {stats.lateDays} kechikish, {stats.earlyLeaveDays} erta ketish
            </div>
          </div>
        </div>

        <div className="stat-card late-stats">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>{stats.avgLateMinutes?.toFixed(0)} daq</h3>
            <p>O'rtacha kechikish</p>
            <div className="stat-trend down">
              <FaArrowDown /> -5 daqiqa o'tgan oyga nisbatan
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="attendance-controls">
        {/* View Selector */}
        <div className="view-selector">
          <button 
            className={`view-btn ${activeView === 'day' ? 'active' : ''}`}
            onClick={() => setActiveView('day')}
          >
            <FaCalendarDay /> Kunlik
          </button>
          <button 
            className={`view-btn ${activeView === 'week' ? 'active' : ''}`}
            onClick={() => setActiveView('week')}
          >
            <FaCalendarWeek /> Haftalik
          </button>
          <button 
            className={`view-btn ${activeView === 'month' ? 'active' : ''}`}
            onClick={() => setActiveView('month')}
          >
            <FaCalendarMonth /> Oylik
          </button>
        </div>

        {/* Date Selector */}
        <div className="date-selector">
          <div className="month-selector">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="month-select"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
            
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="year-select"
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className="btn btn-secondary"
            onClick={loadAttendanceData}
          >
            <FaSync /> Yangilash
          </button>
        </div>

        {/* Search and Filter */}
        <div className="search-filter">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Sanani yoki joyni qidirish..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          
          <div className="filter-options">
            <FaFilter className="filter-icon" />
            <select 
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="filter-select"
            >
              <option value="date">Sana bo'yicha</option>
              <option value="checkIn">Kirish vaqti</option>
              <option value="workHours">Ish soati</option>
              <option value="status">Holat bo'yicha</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="attendance-chart">
        <h3>
          <FaChartLine /> Davomat Statistikasi
        </h3>
        <div className="chart-container">
          <div className="chart-bars">
            {filteredData.slice(0, 10).map((item, index) => {
              const workHours = parseFloat(item.workHours);
              const maxHours = 10; // Maksimum ko'rsatkich
              const height = (workHours / maxHours) * 100;
              
              return (
                <div key={index} className="chart-bar-group">
                  <div className="bar-container">
                    <div 
                      className="bar"
                      style={{ 
                        height: `${height}%`,
                        backgroundColor: getStatusColor(item.status)
                      }}
                    >
                      <span className="bar-value">{workHours}h</span>
                    </div>
                  </div>
                  <div className="bar-label">
                    {item.date.split('-')[2]} {months[new Date(item.date).getMonth()].slice(0, 3)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="attendance-table">
        <h3>
          <FaHistory /> Davomat Jadvali
        </h3>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('date')}>
                  Sana {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Kun</th>
                <th onClick={() => handleSort('checkIn')}>
                  Kirish {sortBy === 'checkIn' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Chiqish</th>
                <th onClick={() => handleSort('workHours')}>
                  Ish vaqti {sortBy === 'workHours' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('status')}>
                  Holat {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Joylashuv</th>
                <th>Izohlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td className="date-cell">
                    <div className="date-display">
                      <FaCalendar className="date-icon" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </td>
                  <td className="day-cell">{item.day}</td>
                  <td className="time-cell">
                    <div className="time-display">
                      <FaClock className="time-icon" />
                      <span>{item.checkIn}</span>
                      {item.lateMinutes > 0 && (
                        <span className="late-badge">+{item.lateMinutes} daq</span>
                      )}
                    </div>
                  </td>
                  <td className="time-cell">
                    <div className="time-display">
                      <FaClock className="time-icon" />
                      <span>{item.checkOut}</span>
                      {item.earlyLeave > 0 && (
                        <span className="early-badge">-{item.earlyLeave} daq</span>
                      )}
                    </div>
                  </td>
                  <td className="hours-cell">
                    <div className="hours-display">
                      <strong>{item.workHours} soat</strong>
                      <div className="hours-progress">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(parseFloat(item.workHours) / 9) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="status-cell">
                    <div 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getStatusColor(item.status) + '20',
                        color: getStatusColor(item.status),
                        borderColor: getStatusColor(item.status)
                      }}
                    >
                      {getStatusIcon(item.status)}
                      {getStatusText(item.status)}
                    </div>
                  </td>
                  <td className="location-cell">
                    <div className="location-display">
                      <FaBuilding className="location-icon" />
                      <span>{item.location}</span>
                    </div>
                  </td>
                  <td className="notes-cell">
                    {item.notes ? (
                      <div className="notes-display">
                        <FaExclamationTriangle className="notes-icon" />
                        <span>{item.notes}</span>
                      </div>
                    ) : (
                      <span className="no-notes">-</span>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="8" className="no-data">
                    <FaCalendar className="no-data-icon" />
                    <p>Tanlangan davrda ma'lumot topilmadi</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-card">
          <h4>
            <FaChartBar /> Oylik Xulosa
          </h4>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-label">Ish kunlari</div>
              <div className="summary-value">{stats.presentDays} kun</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">O'rtacha ish vaqti</div>
              <div className="summary-value">{stats.avgWorkHours} soat</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Jami kechikish</div>
              <div className="summary-value">{stats.lateDays} kun</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Davomat darajasi</div>
              <div className="summary-value">{stats.attendanceRate}%</div>
            </div>
          </div>
        </div>

        <div className="status-breakdown">
          <h4>Holatlar Bo'yicha</h4>
          <div className="breakdown-chart">
            {['on_time', 'late', 'early_leave', 'absent'].map(status => {
              const count = attendanceData.filter(d => d.status === status).length;
              const percentage = attendanceData.length > 0 ? 
                ((count / attendanceData.length) * 100).toFixed(1) : 0;
              
              return (
                <div key={status} className="breakdown-item">
                  <div className="breakdown-label">
                    <div 
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(status) }}
                    ></div>
                    {getStatusText(status)}
                  </div>
                  <div className="breakdown-bar">
                    <div 
                      className="bar-fill"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: getStatusColor(status)
                      }}
                    ></div>
                  </div>
                  <div className="breakdown-value">
                    {count} kun ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;