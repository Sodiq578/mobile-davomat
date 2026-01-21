// src/pages/admin/Reports.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaFilePdf, FaFileExcel, FaDownload, FaCalendarAlt,
  FaFilter, FaChartBar, FaPrint, FaFileArchive,
  FaClock, FaUsers, FaBuilding, FaChartLine,
  FaChartPie, FaUserCheck, FaMoneyBillWave, FaStar,
  FaCheckCircle, FaTimes, FaSpinner, FaExclamationTriangle,
  FaEye, FaSort, FaSortUp, FaSortDown, FaFileCsv,
  FaCalendar, FaChartArea, FaDatabase
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './reports.css';

// Ma'lumotlar - agar departments import qilinmasa
const departments = ['IT Department', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Development', 'Support'];

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [dateRange, setDateRange] = useState({ 
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 kun oldin
    end: new Date().toISOString().split('T')[0] // Bugun
  });
  const [reportType, setReportType] = useState('attendance');
  const [department, setDepartment] = useState('all');
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  // Hisobot turlari
  const reportTypes = [
    { 
      value: 'attendance', 
      label: 'Davomat hisoboti', 
      description: 'Xodimlarning davomat statistikasi',
      icon: <FaUserCheck />, 
      color: '#10b981' 
    },
    { 
      value: 'department', 
      label: 'Bo\'limlar hisoboti', 
      description: 'Bo\'limlar bo\'yicha xodimlar taqsimoti',
      icon: <FaBuilding />, 
      color: '#6366f1' 
    },
    { 
      value: 'salary', 
      label: 'Maosh hisoboti', 
      description: 'Xodimlar maoshlari va o\'rtacha maosh',
      icon: <FaMoneyBillWave />, 
      color: '#f59e0b' 
    },
    { 
      value: 'performance', 
      label: 'Samaradorlik hisoboti', 
      description: 'Xodimlar samaradorligi va baholari',
      icon: <FaChartLine />, 
      color: '#4f46e5' 
    },
    { 
      value: 'late', 
      label: 'Kechikishlar hisoboti', 
      description: 'Kechikkan xodimlar ro\'yxati',
      icon: <FaClock />, 
      color: '#ef4444' 
    },
    { 
      value: 'remote', 
      label: 'Uzoq ish hisoboti', 
      description: 'Uzoqdan ishlayotgan xodimlar',
      icon: <FaUsers />, 
      color: '#34d399' 
    }
  ];

  // Ma'lumotlarni yuklash
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        // localStorage dan ma'lumotlarni olish
        const savedEmployees = localStorage.getItem('hr_employees');
        
        if (savedEmployees) {
          const parsed = JSON.parse(savedEmployees);
          
          // Agar localStorage bo'sh bo'lsa, demo ma'lumotlar yaratish
          if (!parsed || parsed.length === 0) {
            const demoEmployees = generateDemoData();
            setEmployees(demoEmployees);
            localStorage.setItem('hr_employees', JSON.stringify(demoEmployees));
          } else {
            setEmployees(parsed);
          }
        } else {
          // Agar localStorage bo'sh bo'lsa, demo ma'lumotlar yaratish
          const demoEmployees = generateDemoData();
          setEmployees(demoEmployees);
          localStorage.setItem('hr_employees', JSON.stringify(demoEmployees));
        }
        
        setError('');
      } catch (err) {
        setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Demo ma'lumotlar yaratish
  const generateDemoData = () => {
    const names = [
      'Aliyev Aziz', 'Karimova Malika', 'Toshmatov Jamshid', 'Hasanova Gulnoza',
      'Yusupov Javohir', 'Sobirova Dilbar', 'Rahmonov Behruz', 'Qodirova Madina',
      'Ismoilov Shohruh', 'Saidova Ziyoda', 'Nazarov Sardor', 'Olimova Sabina'
    ];
    
    const positions = [
      'Senior Developer', 'Marketing Manager', 'Sales Executive', 'HR Specialist',
      'Financial Analyst', 'Operations Manager', 'Support Agent', 'Team Lead'
    ];
    
    return names.map((name, index) => ({
      id: index + 1,
      name,
      position: positions[Math.floor(Math.random() * positions.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@company.uz`,
      phone: `+9989${Math.floor(Math.random() * 90000000) + 10000000}`,
      salary: Math.floor(Math.random() * 10000000) + 5000000,
      attendance: Math.floor(Math.random() * 20) + 80, // 80-100% oralig'ida
      status: Math.random() > 0.2 ? 'active' : 'remote',
      performance: {
        efficiency: Math.floor(Math.random() * 20) + 80,
        rating: (Math.random() * 1 + 4).toFixed(1), // 4.0-5.0 oralig'ida
        lastReview: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      lastActivity: ['Bugun kelgan', 'Kechikdi 15 daqiqa', 'Uzoq ish rejimi', 'Ta\'tilda'][Math.floor(Math.random() * 4)],
      avatarColor: ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c'][index % 6]
    }));
  };

  // Sort qilish
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Joriy hisobot ma'lumotlari
  const getCurrentReportData = () => {
    let data = [];

    switch(reportType) {
      case 'attendance':
        data = employees.map(emp => ({
          name: emp.name,
          department: emp.department,
          position: emp.position,
          attendance: emp.attendance || 0,
          status: emp.attendance >= 90 ? 'Yaxshi' : emp.attendance >= 80 ? 'O\'rtacha' : 'Yomon',
          lastActivity: emp.lastActivity
        }));
        break;

      case 'department':
        const deptStats = {};
        employees.forEach(emp => {
          const dept = emp.department || 'Noma\'lum';
          if (!deptStats[dept]) {
            deptStats[dept] = {
              count: 0,
              totalSalary: 0,
              avgAttendance: 0,
              employees: []
            };
          }
          deptStats[dept].count++;
          deptStats[dept].totalSalary += Number(emp.salary) || 0;
          deptStats[dept].avgAttendance += Number(emp.attendance) || 0;
          deptStats[dept].employees.push(emp.name);
        });
        
        data = Object.entries(deptStats).map(([name, stats]) => ({
          name,
          employeesCount: stats.count,
          avgSalary: Math.round(stats.totalSalary / stats.count),
          avgAttendance: Math.round(stats.avgAttendance / stats.count),
          employees: stats.employees.join(', ')
        }));
        break;

      case 'salary':
        data = employees.map(emp => ({
          name: emp.name,
          department: emp.department,
          position: emp.position,
          salary: Number(emp.salary) || 0,
          formattedSalary: new Intl.NumberFormat('uz-UZ').format(emp.salary || 0) + ' so\'m',
          status: emp.status === 'active' ? 'Faol' : 'Uzoq ish'
        }));
        break;

      case 'performance':
        data = employees.map(emp => ({
          name: emp.name,
          department: emp.department,
          position: emp.position,
          efficiency: emp.performance?.efficiency || 85,
          rating: emp.performance?.rating || 4.0,
          performanceLevel: emp.performance?.efficiency >= 90 ? 'Yuqori' : 
                          emp.performance?.efficiency >= 80 ? 'O\'rtacha' : 'Past',
          lastReview: emp.performance?.lastReview || '2024-01-01'
        }));
        break;

      case 'late':
        data = employees
          .filter(emp => (emp.attendance || 100) < 90)
          .map(emp => ({
            name: emp.name,
            department: emp.department,
            position: emp.position,
            attendance: emp.attendance || 0,
            lateCount: Math.floor((100 - (emp.attendance || 0)) / 5), // Taxminiy kechikishlar soni
            status: emp.attendance >= 85 ? 'Yengil' : emp.attendance >= 75 ? 'O\'rtacha' : 'Qattiq'
          }));
        break;

      case 'remote':
        data = employees
          .filter(emp => emp.status === 'remote')
          .map(emp => ({
            name: emp.name,
            department: emp.department,
            position: emp.position,
            email: emp.email,
            phone: emp.phone,
            salary: Number(emp.salary) || 0,
            attendance: emp.attendance || 0,
            lastActivity: emp.lastActivity || 'Noma\'lum'
          }));
        break;

      default:
        data = [];
    }

    // Bo'lim bo'yicha filtr
    if (department !== 'all') {
      data = data.filter(item => 
        item.department === department || 
        (item.name && employees.find(e => e.name === item.name)?.department === department)
      );
    }

    // Sana oralig'i bo'yicha filtr (agar mavjud bo'lsa)
    if (dateRange.start && dateRange.end) {
      // Bu yerda soralar bo'yicha filtr qo'shishingiz mumkin
      // Hozircha faqat demo
    }

    // Qidiruv bo'yicha filtr
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter(item => 
        Object.values(item).some(value => 
          value?.toString().toLowerCase().includes(term)
        )
      );
    }

    // Sort qilish
    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  };

  const currentData = getCurrentReportData();

  // Umumiy statistika
  const calculateStats = () => {
    if (employees.length === 0) {
      return {
        totalEmployees: 0,
        avgSalary: 0,
        avgAttendance: 0,
        activeEmployees: 0,
        remoteEmployees: 0,
        totalSalary: 0
      };
    }

    const totalSalary = employees.reduce((sum, emp) => sum + Number(emp.salary || 0), 0);
    const totalAttendance = employees.reduce((sum, emp) => sum + Number(emp.attendance || 0), 0);
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const remoteEmployees = employees.filter(emp => emp.status === 'remote').length;

    return {
      totalEmployees: employees.length,
      avgSalary: Math.round(totalSalary / employees.length),
      avgAttendance: Math.round(totalAttendance / employees.length),
      activeEmployees,
      remoteEmployees,
      totalSalary
    };
  };

  const stats = calculateStats();

  // Yuklashni boshlash
  const startDownload = () => {
    if (currentData.length === 0) {
      setError('Hisobot uchun ma\'lumot mavjud emas!');
      return;
    }
    setShowFormatModal(true);
    setError('');
  };

  // Format tanlanganda yuklash
  const handleDownload = async (format) => {
    setShowFormatModal(false);
    setIsLoading(true);
    setError('');

    try {
      const reportName = reportTypes.find(r => r.value === reportType)?.label || 'Hisobot';
      const fileName = `hisobot_${reportType}_${new Date().toISOString().split('T')[0]}`;

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing

      switch(format) {
        case 'pdf':
          await downloadPDF(reportName, fileName);
          break;
        case 'csv':
          await downloadCSV(reportName, fileName);
          break;
        case 'excel':
          await downloadExcel(reportName, fileName);
          break;
        case 'json':
          await downloadJSON(reportName, fileName);
          break;
        default:
          throw new Error('Noto\'g\'ri format');
      }

      alert(`${reportName} hisoboti ${format.toUpperCase()} formatda yuklandi!`);
    } catch (err) {
      setError(`Yuklashda xatolik: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // PDF yuklash
  const downloadPDF = (reportName, fileName) => {
    return new Promise((resolve, reject) => {
      try {
        const doc = new jsPDF();
        
        // Sarlavha
        doc.setFontSize(20);
        doc.setTextColor(52, 152, 219);
        doc.text(reportName, 20, 20);
        
        // Ma'lumotlar
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Yaratilgan sana: ${new Date().toLocaleString('uz-UZ')}`, 20, 35);
        doc.text(`Bo'lim: ${department === 'all' ? 'Barchasi' : department}`, 20, 45);
        doc.text(`Jami yozuvlar: ${currentData.length}`, 20, 55);
        
        // Jadval
        const tableData = currentData.map((item, index) => {
          if (reportType === 'attendance') {
            return [index + 1, item.name, item.department, `${item.attendance}%`, item.status];
          } else if (reportType === 'department') {
            return [index + 1, item.name, item.employeesCount, item.avgSalary.toLocaleString('uz-UZ') + ' so\'m', `${item.avgAttendance}%`];
          } else if (reportType === 'salary') {
            return [index + 1, item.name, item.department, item.formattedSalary, item.status];
          }
          return [index + 1, JSON.stringify(item, null, 2)];
        });

        const headers = reportType === 'attendance' 
          ? ['#', 'Ism', 'Bo\'lim', 'Davomat', 'Holati']
          : reportType === 'department'
          ? ['#', 'Bo\'lim', 'Xodimlar', 'O\'rtacha maosh', 'O\'rtacha davomat']
          : reportType === 'salary'
          ? ['#', 'Ism', 'Bo\'lim', 'Maosh', 'Holati']
          : ['#', 'Ma\'lumot'];

        autoTable(doc, {
          startY: 65,
          head: [headers],
          body: tableData,
          theme: 'striped',
          headStyles: { 
            fillColor: [52, 152, 219],
            textColor: [255, 255, 255],
            fontSize: 10
          },
          bodyStyles: { fontSize: 9 },
          alternateRowStyles: { fillColor: [245, 247, 250] }
        });

        // Pastki qism
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(128, 128, 128);
          doc.text(`Sahifa ${i} / ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
          doc.text('HR Management System', 20, doc.internal.pageSize.height - 10);
        }

        doc.save(`${fileName}.pdf`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  // CSV yuklash
  const downloadCSV = (reportName, fileName) => {
    return new Promise((resolve, reject) => {
      try {
        let csvContent = '';
        let headers = [];
        let rows = [];

        switch(reportType) {
          case 'attendance':
            headers = ['Ism', 'Bo\'lim', 'Lavozim', 'Davomat (%)', 'Holati', 'Oxirgi faollik'];
            rows = currentData.map(d => [
              d.name,
              d.department || '',
              d.position || '',
              d.attendance,
              d.status,
              d.lastActivity || ''
            ]);
            break;
          case 'department':
            headers = ['Bo\'lim', 'Xodimlar soni', 'O\'rtacha maosh', 'O\'rtacha davomat (%)', 'Xodimlar'];
            rows = currentData.map(d => [
              d.name,
              d.employeesCount,
              d.avgSalary,
              d.avgAttendance,
              d.employees
            ]);
            break;
          case 'salary':
            headers = ['Ism', 'Bo\'lim', 'Lavozim', 'Maosh (so\'m)', 'Holati'];
            rows = currentData.map(d => [
              d.name,
              d.department || '',
              d.position || '',
              d.salary,
              d.status
            ]);
            break;
          default:
            headers = ['Ma\'lumot'];
            rows = currentData.map(d => [JSON.stringify(d)]);
        }

        // BOM for UTF-8
        csvContent = '\uFEFF';
        csvContent += headers.join(',') + '\n';
        rows.forEach(row => {
          csvContent += row.map(cell => 
            typeof cell === 'string' && cell.includes(',') 
              ? `"${cell.replace(/"/g, '""')}"`
              : cell
          ).join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  // Excel (CSV formatida)
  const downloadExcel = (reportName, fileName) => {
    return downloadCSV(reportName, fileName.replace('.csv', '.xlsx'));
  };

  // JSON yuklash
  const downloadJSON = (reportName, fileName) => {
    return new Promise((resolve, reject) => {
      try {
        const reportData = {
          metadata: {
            reportName,
            generatedAt: new Date().toLocaleString('uz-UZ'),
            department: department === 'all' ? 'Barchasi' : department,
            dateRange,
            totalRecords: currentData.length
          },
          data: currentData,
          summary: {
            averageSalary: stats.avgSalary,
            averageAttendance: stats.avgAttendance,
            totalEmployees: stats.totalEmployees
          }
        };

        const jsonString = JSON.stringify(reportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  // Jadval ustunlari
  const getTableColumns = () => {
    switch(reportType) {
      case 'attendance':
        return [
          { key: 'name', label: 'Ism' },
          { key: 'department', label: 'Bo\'lim' },
          { key: 'position', label: 'Lavozim' },
          { key: 'attendance', label: 'Davomat (%)' },
          { key: 'status', label: 'Holati' },
          { key: 'lastActivity', label: 'Oxirgi faollik' }
        ];
      case 'department':
        return [
          { key: 'name', label: 'Bo\'lim' },
          { key: 'employeesCount', label: 'Xodimlar soni' },
          { key: 'avgSalary', label: 'O\'rtacha maosh' },
          { key: 'avgAttendance', label: 'O\'rtacha davomat' },
          { key: 'employees', label: 'Xodimlar' }
        ];
      case 'salary':
        return [
          { key: 'name', label: 'Ism' },
          { key: 'department', label: 'Bo\'lim' },
          { key: 'position', label: 'Lavozim' },
          { key: 'salary', label: 'Maosh (so\'m)' },
          { key: 'status', label: 'Holati' }
        ];
      case 'performance':
        return [
          { key: 'name', label: 'Ism' },
          { key: 'department', label: 'Bo\'lim' },
          { key: 'position', label: 'Lavozim' },
          { key: 'efficiency', label: 'Samaradorlik (%)' },
          { key: 'rating', label: 'Bahosi (5.0)' },
          { key: 'performanceLevel', label: 'Darajasi' }
        ];
      case 'late':
        return [
          { key: 'name', label: 'Ism' },
          { key: 'department', label: 'Bo\'lim' },
          { key: 'position', label: 'Lavozim' },
          { key: 'attendance', label: 'Davomat (%)' },
          { key: 'lateCount', label: 'Kechikishlar' },
          { key: 'status', label: 'Darajasi' }
        ];
      case 'remote':
        return [
          { key: 'name', label: 'Ism' },
          { key: 'department', label: 'Bo\'lim' },
          { key: 'position', label: 'Lavozim' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Telefon' },
          { key: 'attendance', label: 'Davomat (%)' }
        ];
      default:
        return [];
    }
  };

  // Format qiymatini ko'rsatish
  const formatValue = (key, value) => {
    if (key.includes('Salary') || key === 'salary') {
      return new Intl.NumberFormat('uz-UZ').format(value) + ' so\'m';
    }
    if (key.includes('attendance') || key.includes('Attendance') || key === 'efficiency') {
      return `${value}%`;
    }
    if (key === 'rating') {
      return `${value}/5.0`;
    }
    return value;
  };

  return (
    <div className="reports-page">
      {/* Loading overlay */}
      {isLoading && (
        <div className="download-loading">
          <div className="loading-spinner"></div>
          <p>Hisobot yuklanmoqda...</p>
        </div>
      )}

      {/* Sarlavha qismi */}
      <div className="page-header">
        <div className="header-content">
          <h1><FaChartBar /> Hisobotlar</h1>
          <p>Tizim analitikasi va hisobotlari</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary" 
            onClick={startDownload}
            disabled={currentData.length === 0}
          >
            <FaDownload /> Hisobot yaratish
          </button>
        </div>
      </div>

      {/* Xatolik xabari */}
      {error && (
        <div className="error-message">
          <FaExclamationTriangle /> {error}
          <button className="close-btn" onClick={() => setError('')}><FaTimes /></button>
        </div>
      )}

      {/* Hisobot turi tugmalari */}
      <div className="report-type-buttons">
        {reportTypes.map((type) => (
          <button
            key={type.value}
            className={`report-type-btn ${reportType === type.value ? 'active' : ''}`}
            onClick={() => setReportType(type.value)}
            style={{ borderLeftColor: type.color }}
          >
            <span className="report-type-color" style={{ backgroundColor: type.color }}></span>
            {type.icon}
            {type.label}
          </button>
        ))}
      </div>

      {/* Filter qismi */}
      <div className="filter-section">
        <div className="filter-card">
          <h3><FaFilter /> Hisobot sozlamalari</h3>
          
          <div className="filter-grid">
            <div className="filter-group">
              <label><FaCalendarAlt /> Boshlanish sanasi</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                max={dateRange.end}
              />
            </div>

            <div className="filter-group">
              <label><FaCalendarAlt /> Tugash sanasi</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                min={dateRange.start}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="filter-group">
              <label><FaFilter /> Hisobot turi</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)}>
                {reportTypes.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label><FaBuilding /> Bo'lim</label>
              <select value={department} onChange={e => setDepartment(e.target.value)}>
                <option value="all">Barcha bo'limlar</option>
                {departments.map((d, idx) => <option key={idx} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Qidiruv */}
          <div className="search-box" style={{ marginTop: '20px' }}>
            <input
              type="text"
              placeholder="Hisobot ichida qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Joriy ma'lumotlar haqida */}
      <div className="report-summary">
        <div className="summary-card">
          <div className="summary-header">
            <h3>
              {reportTypes.find(r => r.value === reportType)?.icon}
              {reportTypes.find(r => r.value === reportType)?.label}
            </h3>
            <div className="data-count">{currentData.length} ta yozuv</div>
          </div>
          <div className="summary-stats">
            <div>
              <strong>Hisobot turi:</strong> {reportTypes.find(r => r.value === reportType)?.label}
            </div>
            <div>
              <strong>Tanlangan bo'lim:</strong> {department === 'all' ? 'Barchasi' : department}
            </div>
            <div>
              <strong>Sana oralig'i:</strong> {dateRange.start} dan {dateRange.end} gacha
            </div>
            {reportType === 'salary' && (
              <div>
                <strong>O'rtacha maosh:</strong> {new Intl.NumberFormat('uz-UZ').format(stats.avgSalary)} so'm
              </div>
            )}
            {reportType === 'attendance' && (
              <div>
                <strong>O'rtacha davomat:</strong> {stats.avgAttendance}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ma'lumotlar jadvali */}
      {currentData.length > 0 ? (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                {getTableColumns().map((column) => (
                  <th key={column.key} onClick={() => handleSort(column.key)}>
                    <div className="sort-header">
                      {column.label}
                      {sortConfig.key === column.key ? (
                        sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index}>
                  {getTableColumns().map((column) => (
                    <td key={column.key}>
                      {formatValue(column.key, item[column.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <FaDatabase size={48} />
          <h3>Ma'lumot topilmadi</h3>
          <p>Tanlangan filterlar bo'yicha hech qanday ma'lumot topilmadi</p>
        </div>
      )}

      {/* Format tanlash modal */}
      {showFormatModal && (
        <div className="modal-overlay">
          <div className="modal format-modal">
            <div className="modal-header">
              <h3><FaDownload /> Hisobotni qaysi formatda yuklab olasiz?</h3>
              <button className="close-btn" onClick={() => setShowFormatModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Tanlangan hisobot: <strong>{reportTypes.find(r => r.value === reportType)?.label}</strong><br />
                Ma'lumotlar soni: <strong>{currentData.length} ta</strong>
              </p>
              <div className="format-options">
                <button className="format-btn pdf" onClick={() => handleDownload('pdf')}>
                  <FaFilePdf /> PDF formatda
                  <small>Chop etish va hujjat uchun</small>
                </button>

                <button className="format-btn csv" onClick={() => handleDownload('excel')}>
                  <FaFileExcel /> Excel formatda
                  <small>Excelda tahlil qilish uchun</small>
                </button>

                <button className="format-btn json" onClick={() => handleDownload('json')}>
                  <FaFileArchive /> JSON formatda
                  <small>Dasturlash va tahlil uchun</small>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Umumiy statistika */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.totalEmployees}</h3>
            <p>Jami xodimlar</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <FaUserCheck />
          </div>
          <div className="stat-content">
            <h3>{stats.activeEmployees}</h3>
            <p>Faol xodimlar</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>
              {stats.avgSalary ? (stats.avgSalary / 1000000).toFixed(1) + ' mln' : '0'}
            </h3>
            <p>O'rtacha maosh</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>{stats.avgAttendance}%</h3>
            <p>O'rtacha davomat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;