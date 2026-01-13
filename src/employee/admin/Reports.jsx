import React, { useState, useEffect } from 'react';
import {
  FaFilter,
  FaCalendarAlt,
  FaDownload,
  FaPrint,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaTable,
  FaUser,
  FaClock,
  FaMapMarkerAlt,
  FaBuilding,
  FaFileExcel,
  FaFilePdf,
  FaFileCsv,
  FaEye,
  FaShare,
  FaCog,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import './Reports.css';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('attendance');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31'
  });
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState('bar'); // 'bar', 'line', 'pie'

  const reportTypes = [
    { id: 'attendance', label: 'Davomat Hisoboti', icon: <FaUser /> },
    { id: 'working_hours', label: 'Ish Vaqti', icon: <FaClock /> },
    { id: 'location', label: 'Joylashuv Hisoboti', icon: <FaMapMarkerAlt /> },
    { id: 'department', label: 'Bo\'limlar Hisoboti', icon: <FaBuilding /> },
    { id: 'overtime', label: 'Qo\'shimcha Ish', icon: <FaChartLine /> },
    { id: 'summary', label: 'Umumiy Hisobot', icon: <FaChartBar /> }
  ];

  const departments = [
    'Barchasi',
    'IT Bo\'limi',
    'Moliya',
    'Marketing',
    'HR',
    'Ishlab chiqarish',
    'Logistika',
    'Sotuv'
  ];

  useEffect(() => {
    loadReportData();
  }, [activeReport, dateRange, selectedDepartment]);

  const loadReportData = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let data = {};
      
      switch (activeReport) {
        case 'attendance':
          data = generateAttendanceData();
          break;
        case 'working_hours':
          data = generateWorkingHoursData();
          break;
        case 'location':
          data = generateLocationData();
          break;
        case 'department':
          data = generateDepartmentData();
          break;
        case 'overtime':
          data = generateOvertimeData();
          break;
        case 'summary':
          data = generateSummaryData();
          break;
        default:
          data = {};
      }
      
      setReportData(data);
      setLoading(false);
    }, 500);
  };

  const generateAttendanceData = () => ({
    title: 'Davomat Hisoboti',
    summary: {
      totalEmployees: 45,
      averageAttendance: 96.5,
      lateCount: 12,
      absentCount: 3,
      earlyLeaveCount: 8
    },
    chartData: {
      labels: ['1-5 Yan', '8-12 Yan', '15-19 Yan', '22-26 Yan', '29-31 Yan'],
      datasets: [
        {
          label: 'Davomat (%)',
          data: [95, 97, 96, 98, 99],
          backgroundColor: '#3498db'
        },
        {
          label: 'Kechikishlar',
          data: [5, 3, 4, 2, 1],
          backgroundColor: '#e74c3c'
        }
      ]
    },
    tableData: [
      { id: 1, employee: 'Aliyev Aziz', department: 'IT', attendance: 99, late: 1, absent: 0 },
      { id: 2, employee: 'Hasanova Malika', department: 'Moliya', attendance: 98, late: 2, absent: 0 },
      { id: 3, employee: 'Olimov Sardor', department: 'Marketing', attendance: 95, late: 5, absent: 0 },
      { id: 4, employee: 'Karimova Nigora', department: 'HR', attendance: 100, late: 0, absent: 0 },
      { id: 5, employee: 'Temirov Jasur', department: 'Ishlab chiqarish', attendance: 92, late: 8, absent: 0 },
      { id: 6, employee: 'Shukurova Dinara', department: 'Sotuv', attendance: 97, late: 3, absent: 0 },
      { id: 7, employee: 'Rahimov Bahodir', department: 'Logistika', attendance: 94, late: 6, absent: 0 },
      { id: 8, employee: 'Yusupova Madina', department: 'IT', attendance: 99, late: 1, absent: 0 }
    ]
  });

  const generateWorkingHoursData = () => ({
    title: 'Ish Vaqti Hisoboti',
    summary: {
      totalHours: 1760,
      averageHours: 176,
      overtimeHours: 145,
      shortHours: 65
    },
    chartData: {
      labels: ['Hafta 1', 'Hafta 2', 'Hafta 3', 'Hafta 4'],
      datasets: [
        {
          label: 'Oʻrtacha ish vaqti (soat)',
          data: [42, 44, 43, 45],
          backgroundColor: '#2ecc71'
        }
      ]
    },
    tableData: [
      { id: 1, employee: 'Aliyev Aziz', totalHours: 176, regular: 160, overtime: 16 },
      { id: 2, employee: 'Hasanova Malika', totalHours: 172, regular: 160, overtime: 12 },
      { id: 3, employee: 'Olimov Sardor', totalHours: 168, regular: 160, overtime: 8 },
      { id: 4, employee: 'Karimova Nigora', totalHours: 180, regular: 160, overtime: 20 },
      { id: 5, employee: 'Temirov Jasur', totalHours: 165, regular: 160, overtime: 5 },
      { id: 6, employee: 'Shukurova Dinara', totalHours: 175, regular: 160, overtime: 15 },
      { id: 7, employee: 'Rahimov Bahodir', totalHours: 170, regular: 160, overtime: 10 },
      { id: 8, employee: 'Yusupova Madina', totalHours: 178, regular: 160, overtime: 18 }
    ]
  });

  const generateLocationData = () => ({
    title: 'Joylashuv Hisoboti',
    summary: {
      totalLocations: 25,
      averageAccuracy: 42,
      zoneViolations: 8,
      distanceTraveled: 1250
    },
    chartData: {
      labels: ['Ofis', 'Uyda ish', 'Sayohat', 'Mijozlar', 'Boshqa'],
      datasets: [
        {
          label: 'Vaqt ulushi (%)',
          data: [65, 20, 10, 4, 1],
          backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e74c3c']
        }
      ]
    },
    tableData: [
      { id: 1, employee: 'Aliyev Aziz', location: 'Ofis', time: '85%', accuracy: '25m' },
      { id: 2, employee: 'Hasanova Malika', location: 'Ofis', time: '90%', accuracy: '35m' },
      { id: 3, employee: 'Olimov Sardor', location: 'Sayohat', time: '40%', accuracy: '150m' },
      { id: 4, employee: 'Karimova Nigora', location: 'Ofis', time: '95%', accuracy: '20m' },
      { id: 5, employee: 'Temirov Jasur', location: 'Mijozlar', time: '60%', accuracy: '75m' },
      { id: 6, employee: 'Shukurova Dinara', location: 'Ofis', time: '88%', accuracy: '30m' },
      { id: 7, employee: 'Rahimov Bahodir', location: 'Logistika', time: '70%', accuracy: '50m' },
      { id: 8, employee: 'Yusupova Madina', location: 'Ofis', time: '92%', accuracy: '28m' }
    ]
  });

  const generateDepartmentData = () => ({
    title: 'Bo\'limlar Hisoboti',
    summary: {
      totalDepartments: 8,
      bestDepartment: 'IT Bo\'limi',
      worstDepartment: 'Logistika',
      overallScore: 88.5
    },
    chartData: {
      labels: ['IT', 'Moliya', 'Marketing', 'HR', 'Ishlab chiqarish', 'Logistika', 'Sotuv'],
      datasets: [
        {
          label: 'Ish samaradorligi (%)',
          data: [95, 92, 88, 90, 85, 82, 87],
          backgroundColor: '#9b59b6'
        }
      ]
    },
    tableData: [
      { id: 1, department: 'IT Bo\'limi', employees: 12, attendance: 96, productivity: 95 },
      { id: 2, department: 'Moliya', employees: 8, attendance: 94, productivity: 92 },
      { id: 3, department: 'Marketing', employees: 10, attendance: 91, productivity: 88 },
      { id: 4, department: 'HR', employees: 6, attendance: 98, productivity: 90 },
      { id: 5, department: 'Ishlab chiqarish', employees: 15, attendance: 89, productivity: 85 },
      { id: 6, department: 'Logistika', employees: 7, attendance: 86, productivity: 82 },
      { id: 7, department: 'Sotuv', employees: 9, attendance: 92, productivity: 87 }
    ]
  });

  const generateOvertimeData = () => ({
    title: 'Qo\'shimcha Ish Hisoboti',
    summary: {
      totalOvertime: 145,
      averageOvertime: 12.1,
      highestOvertime: 28,
      overtimeCost: 4500000
    },
    chartData: {
      labels: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
      datasets: [
        {
          label: 'Qo\'shimcha ish vaqti (soat)',
          data: [15, 20, 25, 30, 35, 20],
          backgroundColor: '#f39c12'
        }
      ]
    },
    tableData: [
      { id: 1, employee: 'Aliyev Aziz', overtime: 16, rate: '1.5x', amount: '480,000' },
      { id: 2, employee: 'Hasanova Malika', overtime: 12, rate: '1.5x', amount: '360,000' },
      { id: 3, employee: 'Olimov Sardor', overtime: 8, rate: '1.5x', amount: '240,000' },
      { id: 4, employee: 'Karimova Nigora', overtime: 20, rate: '2.0x', amount: '800,000' },
      { id: 5, employee: 'Temirov Jasur', overtime: 5, rate: '1.5x', amount: '150,000' },
      { id: 6, employee: 'Shukurova Dinara', overtime: 15, rate: '1.5x', amount: '450,000' },
      { id: 7, employee: 'Rahimov Bahodir', overtime: 10, rate: '1.5x', amount: '300,000' },
      { id: 8, employee: 'Yusupova Madina', overtime: 18, rate: '2.0x', amount: '720,000' }
    ]
  });

  const generateSummaryData = () => ({
    title: 'Umumiy Hisobot',
    summary: {
      overallScore: 88.5,
      monthTrend: '+2.5%',
      bestMetric: 'Davomat (96.5%)',
      worstMetric: 'Zona buzilishlari (8)'
    },
    chartData: {
      labels: ['Davomat', 'Ish vaqti', 'Mahsuldorlik', 'Xavfsizlik', 'Moliyaviy'],
      datasets: [
        {
          label: 'Koʻrsatkichlar',
          data: [96.5, 88, 85, 92, 81],
          backgroundColor: '#1abc9c'
        }
      ]
    },
    tableData: [
      { id: 1, metric: 'Davomat', value: '96.5%', trend: '+1.2%', status: 'yaxshi' },
      { id: 2, metric: 'Ish vaqti', value: '176 soat', trend: '+3.5%', status: 'yaxshi' },
      { id: 3, metric: 'Mahsuldorlik', value: '85%', trend: '-0.5%', status: 'o\'rtacha' },
      { id: 4, metric: 'Xavfsizlik', value: '92%', trend: '+2.1%', status: 'yaxshi' },
      { id: 5, metric: 'Moliyaviy', value: '81%', trend: '-1.8%', status: 'o\'rtacha' },
      { id: 6, metric: 'Mijozlar', value: '89%', trend: '+0.9%', status: 'yaxshi' },
      { id: 7, metric: 'Innovatsiya', value: '78%', trend: '+4.2%', status: 'o\'rtacha' },
      { id: 8, metric: 'Jamoa', value: '94%', trend: '+1.5%', status: 'yaxshi' }
    ]
  });

  const handleExport = (format) => {
    alert(`Hisobot ${format} formatida yuklab olindi`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return <FaSort />;
    return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  if (loading) {
    return (
      <div className="reports-loading">
        <div className="loading-spinner"></div>
        <p>Hisobot yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="reports-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Hisobotlar</h1>
          <p className="page-subtitle">
            Tizim hisobotlari va statistik tahlillar
          </p>
        </div>
        <div className="header-right">
          <div className="report-actions">
            <button className="btn btn-secondary" onClick={handlePrint}>
              <FaPrint /> Chop etish
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleExport('PDF')}
            >
              <FaFilePdf /> PDF
            </button>
            <button className="btn btn-primary">
              <FaShare /> Ulashish
            </button>
          </div>
        </div>
      </div>

      <div className="reports-container">
        {/* Report Type Selector */}
        <div className="report-types">
          {reportTypes.map(report => (
            <button
              key={report.id}
              className={`report-type-btn ${activeReport === report.id ? 'active' : ''}`}
              onClick={() => setActiveReport(report.id)}
            >
              {report.icon}
              <span>{report.label}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="report-filters">
          <div className="filter-group">
            <label>
              <FaCalendarAlt /> Sana oralig'i
            </label>
            <div className="date-inputs">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>
              <FaBuilding /> Bo'lim
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept} value={dept === 'Barchasi' ? 'all' : dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <FaChartBar /> Diagramma turi
            </label>
            <div className="chart-type-selector">
              <button
                className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
                onClick={() => setChartType('bar')}
              >
                <FaChartBar /> Bar
              </button>
              <button
                className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
                onClick={() => setChartType('line')}
              >
                <FaChartLine /> Line
              </button>
              <button
                className={`chart-type-btn ${chartType === 'pie' ? 'active' : ''}`}
                onClick={() => setChartType('pie')}
              >
                <FaChartPie /> Pie
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label>
              <FaFilter /> Boshqa filtrlari
            </label>
            <button className="btn btn-secondary">
              <FaCog /> Batafsil sozlamalar
            </button>
          </div>
        </div>

        {/* Report Content */}
        {reportData && (
          <>
            {/* Summary Cards */}
            <div className="report-summary">
              <h2>{reportData.title}</h2>
              <div className="summary-cards">
                {Object.entries(reportData.summary).map(([key, value], index) => (
                  <div key={key} className="summary-card">
                    <div className="summary-value">{value}</div>
                    <div className="summary-label">
                      {key === 'totalEmployees' && 'Jami xodimlar'}
                      {key === 'averageAttendance' && 'Oʻrtacha davomat'}
                      {key === 'lateCount' && 'Kechikishlar'}
                      {key === 'absentCount' && 'Davomatsizliklar'}
                      {key === 'earlyLeaveCount' && 'Erkin ketishlar'}
                      {key === 'totalHours' && 'Jami ish vaqti'}
                      {key === 'averageHours' && 'Oʻrtacha ish vaqti'}
                      {key === 'overtimeHours' && 'Qoʻshimcha ish'}
                      {key === 'shortHours' && 'Kam ish vaqti'}
                      {key === 'totalLocations' && 'Joylashuvlar'}
                      {key === 'averageAccuracy' && 'Oʻrtacha aniqlik'}
                      {key === 'zoneViolations' && 'Zona buzilishlari'}
                      {key === 'distanceTraveled' && 'Bosib o\'tilgan masofa (km)'}
                      {key === 'totalDepartments' && 'Bo\'limlar'}
                      {key === 'bestDepartment' && 'Eng yaxshi bo\'lim'}
                      {key === 'worstDepartment' && 'Eng yomon bo\'lim'}
                      {key === 'overallScore' && 'Umumiy baho'}
                      {key === 'totalOvertime' && 'Jami qo\'shimcha ish'}
                      {key === 'averageOvertime' && 'Oʻrtacha qo\'shimcha ish'}
                      {key === 'highestOvertime' && 'Eng ko\'p qo\'shimcha ish'}
                      {key === 'overtimeCost' && 'Qo\'shimcha ish xarajati'}
                      {key === 'monthTrend' && 'Oy trendi'}
                      {key === 'bestMetric' && 'Eng yaxshi ko\'rsatkich'}
                      {key === 'worstMetric' && 'Eng yomon ko\'rsatkich'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Section */}
            <div className="report-chart">
              <div className="chart-header">
                <h3>Statistika</h3>
                <div className="chart-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleExport('PNG')}
                  >
                    <FaDownload /> Diagrammani yuklash
                  </button>
                </div>
              </div>
              <div className="chart-container">
                <div className="chart-placeholder">
                  {/* In a real app, this would be a Chart.js or similar chart */}
                  <div className="chart-simulation">
                    {chartType === 'bar' && (
                      <div className="bar-chart">
                        {reportData.chartData.datasets[0].data.map((value, index) => (
                          <div key={index} className="bar-container">
                            <div
                              className="bar"
                              style={{
                                height: `${value}%`,
                                backgroundColor: Array.isArray(reportData.chartData.datasets[0].backgroundColor) 
                                  ? reportData.chartData.datasets[0].backgroundColor[index]
                                  : reportData.chartData.datasets[0].backgroundColor
                              }}
                            ></div>
                            <div className="bar-label">{reportData.chartData.labels[index]}</div>
                            <div className="bar-value">{value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {chartType === 'line' && (
                      <div className="line-chart">
                        <div className="line-graph">
                          {reportData.chartData.datasets[0].data.map((value, index, arr) => {
                            const nextValue = arr[index + 1];
                            if (!nextValue) return null;
                            return (
                              <div key={index} className="line-segment">
                                <div className="line-dot"></div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="line-labels">
                          {reportData.chartData.labels.map((label, index) => (
                            <div key={index} className="line-label">{label}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {chartType === 'pie' && (
                      <div className="pie-chart">
                        <div className="pie-circle">
                          {reportData.chartData.datasets[0].data.map((value, index) => (
                            <div
                              key={index}
                              className="pie-slice"
                              style={{
                                backgroundColor: reportData.chartData.datasets[0].backgroundColor[index],
                                transform: `rotate(${index * 45}deg)`
                              }}
                            ></div>
                          ))}
                        </div>
                        <div className="pie-legend">
                          {reportData.chartData.labels.map((label, index) => (
                            <div key={index} className="legend-item">
                              <span 
                                className="legend-color"
                                style={{ 
                                  backgroundColor: reportData.chartData.datasets[0].backgroundColor[index] 
                                }}
                              ></span>
                              <span className="legend-label">{label}</span>
                              <span className="legend-value">
                                {reportData.chartData.datasets[0].data[index]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="report-table">
              <div className="table-header">
                <h3>
                  <FaTable /> Ma'lumotlar Jadvali
                </h3>
                <div className="table-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleExport('Excel')}
                  >
                    <FaFileExcel /> Excel
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleExport('CSV')}
                  >
                    <FaFileCsv /> CSV
                  </button>
                </div>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('id')}>
                        ID {getSortIcon('id')}
                      </th>
                      {activeReport === 'attendance' && (
                        <>
                          <th onClick={() => handleSort('employee')}>
                            Xodim {getSortIcon('employee')}
                          </th>
                          <th onClick={() => handleSort('department')}>
                            Bo'lim {getSortIcon('department')}
                          </th>
                          <th onClick={() => handleSort('attendance')}>
                            Davomat (%) {getSortIcon('attendance')}
                          </th>
                          <th onClick={() => handleSort('late')}>
                            Kechikish {getSortIcon('late')}
                          </th>
                          <th onClick={() => handleSort('absent')}>
                            Davomatsiz {getSortIcon('absent')}
                          </th>
                        </>
                      )}
                      {activeReport === 'working_hours' && (
                        <>
                          <th onClick={() => handleSort('employee')}>
                            Xodim {getSortIcon('employee')}
                          </th>
                          <th onClick={() => handleSort('totalHours')}>
                            Jami soat {getSortIcon('totalHours')}
                          </th>
                          <th onClick={() => handleSort('regular')}>
                            Oddiy ish {getSortIcon('regular')}
                          </th>
                          <th onClick={() => handleSort('overtime')}>
                            Qo'shimcha ish {getSortIcon('overtime')}
                          </th>
                        </>
                      )}
                      {activeReport === 'location' && (
                        <>
                          <th onClick={() => handleSort('employee')}>
                            Xodim {getSortIcon('employee')}
                          </th>
                          <th onClick={() => handleSort('location')}>
                            Joylashuv {getSortIcon('location')}
                          </th>
                          <th onClick={() => handleSort('time')}>
                            Vaqt ulushi {getSortIcon('time')}
                          </th>
                          <th onClick={() => handleSort('accuracy')}>
                            Aniqlik {getSortIcon('accuracy')}
                          </th>
                        </>
                      )}
                      {activeReport === 'department' && (
                        <>
                          <th onClick={() => handleSort('department')}>
                            Bo'lim {getSortIcon('department')}
                          </th>
                          <th onClick={() => handleSort('employees')}>
                            Xodimlar {getSortIcon('employees')}
                          </th>
                          <th onClick={() => handleSort('attendance')}>
                            Davomat {getSortIcon('attendance')}
                          </th>
                          <th onClick={() => handleSort('productivity')}>
                            Samaradorlik {getSortIcon('productivity')}
                          </th>
                        </>
                      )}
                      {activeReport === 'overtime' && (
                        <>
                          <th onClick={() => handleSort('employee')}>
                            Xodim {getSortIcon('employee')}
                          </th>
                          <th onClick={() => handleSort('overtime')}>
                            Qo'shimcha ish {getSortIcon('overtime')}
                          </th>
                          <th onClick={() => handleSort('rate')}>
                            Daraja {getSortIcon('rate')}
                          </th>
                          <th onClick={() => handleSort('amount')}>
                            Miqdori {getSortIcon('amount')}
                          </th>
                        </>
                      )}
                      {activeReport === 'summary' && (
                        <>
                          <th onClick={() => handleSort('metric')}>
                            Ko'rsatkich {getSortIcon('metric')}
                          </th>
                          <th onClick={() => handleSort('value')}>
                            Qiymat {getSortIcon('value')}
                          </th>
                          <th onClick={() => handleSort('trend')}>
                            Trend {getSortIcon('trend')}
                          </th>
                          <th onClick={() => handleSort('status')}>
                            Status {getSortIcon('status')}
                          </th>
                        </>
                      )}
                      <th>Harakatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.tableData.map((row, index) => (
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        {activeReport === 'attendance' && (
                          <>
                            <td>{row.employee}</td>
                            <td>{row.department}</td>
                            <td>
                              <div className="progress-cell">
                                <span>{row.attendance}%</span>
                                <div className="cell-progress">
                                  <div 
                                    className="progress-fill"
                                    style={{ width: `${row.attendance}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${row.late <= 2 ? 'success' : row.late <= 5 ? 'warning' : 'danger'}`}>
                                {row.late}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${row.absent === 0 ? 'success' : 'danger'}`}>
                                {row.absent}
                              </span>
                            </td>
                          </>
                        )}
                        {activeReport === 'working_hours' && (
                          <>
                            <td>{row.employee}</td>
                            <td>
                              <strong>{row.totalHours}</strong> soat
                            </td>
                            <td>{row.regular} soat</td>
                            <td>
                              <span className="badge warning">{row.overtime} soat</span>
                            </td>
                          </>
                        )}
                        {activeReport === 'location' && (
                          <>
                            <td>{row.employee}</td>
                            <td>{row.location}</td>
                            <td>
                              <div className="progress-cell">
                                <span>{row.time}</span>
                                <div className="cell-progress">
                                  <div 
                                    className="progress-fill"
                                    style={{ width: parseInt(row.time) }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${parseInt(row.accuracy) <= 50 ? 'success' : 'warning'}`}>
                                {row.accuracy}
                              </span>
                            </td>
                          </>
                        )}
                        {activeReport === 'department' && (
                          <>
                            <td>{row.department}</td>
                            <td>{row.employees}</td>
                            <td>{row.attendance}%</td>
                            <td>
                              <div className="progress-cell">
                                <span>{row.productivity}%</span>
                                <div className="cell-progress">
                                  <div 
                                    className="progress-fill"
                                    style={{ width: `${row.productivity}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </>
                        )}
                        {activeReport === 'overtime' && (
                          <>
                            <td>{row.employee}</td>
                            <td>
                              <span className="badge warning">{row.overtime} soat</span>
                            </td>
                            <td>{row.rate}</td>
                            <td>
                              <strong>{row.amount} so'm</strong>
                            </td>
                          </>
                        )}
                        {activeReport === 'summary' && (
                          <>
                            <td>{row.metric}</td>
                            <td>{row.value}</td>
                            <td>
                              <span className={`trend ${row.trend.startsWith('+') ? 'up' : 'down'}`}>
                                {row.trend}
                              </span>
                            </td>
                            <td>
                              <span className={`status-badge ${row.status}`}>
                                {row.status === 'yaxshi' ? '✓' : row.status === 'o\'rtacha' ? '~' : '✗'} {row.status}
                              </span>
                            </td>
                          </>
                        )}
                        <td>
                          <button className="table-action-btn">
                            <FaEye /> Ko'rish
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;