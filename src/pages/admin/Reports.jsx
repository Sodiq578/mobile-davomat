// src/pages/admin/Reports.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaFilePdf, FaFileExcel, FaDownload, FaCalendarAlt,
  FaFilter, FaChartBar, FaPrint, FaFileArchive,
  FaClock, FaUsers, FaBuilding, FaChartLine,
  FaChartPie, FaUserCheck, FaMoneyBillWave, FaStar,
  FaCheckCircle, FaTimes
} from 'react-icons/fa';
import { departments } from '../../data'; // faqat departments kerak
import jsPDF from 'jspdf'; // npm install jspdf
import autoTable from 'jspdf-autotable'; // npm install jspdf-autotable
import './reports.css';

const Reports = () => {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('hr_employees');
    return saved ? JSON.parse(saved) : [];
  });

  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportType, setReportType] = useState('attendance');
  const [department, setDepartment] = useState('all');
  const [showFormatModal, setShowFormatModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hr_employees');
    if (saved) setEmployees(JSON.parse(saved));
  }, []);

  // Hisobot turlari
  const reportTypes = [
    { value: 'attendance', label: 'Davomat', icon: <FaUserCheck />, color: '#10b981' },
    { value: 'department', label: 'Bo\'limlar', icon: <FaBuilding />, color: '#6366f1' },
    { value: 'salary', label: 'Maoshlar', icon: <FaMoneyBillWave />, color: '#f59e0b' },
    { value: 'performance', label: 'Samaradorlik', icon: <FaChartLine />, color: '#4f46e5' },
    { value: 'late', label: 'Kechikishlar', icon: <FaClock />, color: '#ef4444' },
    { value: 'remote', label: 'Uzoq Ish', icon: <FaUsers />, color: '#34d399' }
  ];

  // Joriy hisobot ma'lumotlari
  const getCurrentReportData = () => {
    let data = [];

    switch(reportType) {
      case 'attendance':
        const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sha', 'Ya'];
        data = days.map(day => ({
          name: day,
          attendance: Math.floor(Math.random() * 15) + 80
        }));
        break;

      case 'department':
        const deptStats = {};
        employees.forEach(emp => {
          const dept = emp.department || 'Noma\'lum';
          deptStats[dept] = (deptStats[dept] || 0) + 1;
        });
        data = Object.entries(deptStats).map(([name, value]) => ({ name, value }));
        break;

      case 'salary':
        data = employees.map(emp => ({
          name: emp.name,
          salary: Number(emp.salary) || 0
        }));
        break;

      case 'performance':
        data = employees.map(emp => ({
          name: emp.name,
          efficiency: emp.performance?.efficiency || 85,
          rating: emp.performance?.rating || 4.0
        }));
        break;

      case 'late':
        data = employees.filter(emp => (emp.attendance || 100) < 90);
        break;

      case 'remote':
        data = employees.filter(emp => emp.status === 'remote');
        break;

      default:
        data = [];
    }

    if (department !== 'all') {
      data = data.filter(item => 
        item.department === department ||
        employees.find(e => e.name === item.name)?.department === department
      );
    }

    return data;
  };

  const currentData = getCurrentReportData();

  // Yuklashni boshlash
  const startDownload = () => {
    setShowFormatModal(true);
  };

  // Format tanlanganda yuklash
  const handleDownload = (format) => {
    setShowFormatModal(false);

    if (!currentData.length) {
      alert("Ma'lumot mavjud emas!");
      return;
    }

    const reportName = reportTypes.find(r => r.value === reportType)?.label || 'Hisobot';
    const fileName = `hisobot_${reportType}_${new Date().toISOString().split('T')[0]}`;

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(reportName, 20, 20);
      doc.setFontSize(12);
      doc.text(`Yaratilgan sana: ${new Date().toLocaleString('uz-UZ')}`, 20, 30);
      doc.text(`Bo'lim: ${department === 'all' ? 'Barchasi' : department}`, 20, 40);
      doc.text(`Jami yozuvlar: ${currentData.length}`, 20, 50);

      autoTable(doc, {
        startY: 60,
        head: [['#', 'Ma\'lumot']],
        body: currentData.map((item, i) => [i+1, JSON.stringify(item)]),
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [99, 102, 241] } // #6366f1
      });

      doc.save(`${fileName}.pdf`);
    } 
    else if (format === 'csv') {
      let headers = '';
      let rows = '';

      if (reportType === 'attendance') {
        headers = 'Kun,Davomat\n';
        rows = currentData.map(d => `${d.name},${d.attendance}`).join('\n');
      } else if (reportType === 'department') {
        headers = 'Bo\'lim,Xodimlar soni\n';
        rows = currentData.map(d => `${d.name},${d.value}`).join('\n');
      } else if (reportType === 'salary') {
        headers = 'Ism,Maosh\n';
        rows = currentData.map(d => `${d.name},${d.salary}`).join('\n');
      } else {
        headers = 'Ma\'lumot\n';
        rows = currentData.map(item => JSON.stringify(item)).join('\n');
      }

      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.csv`;
      link.click();
    } 
    else {
      // JSON
      const blob = new Blob([JSON.stringify({
        type: reportName,
        generatedAt: new Date().toLocaleString('uz-UZ'),
        department: department === 'all' ? 'Barchasi' : department,
        data: currentData
      }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.json`;
      link.click();
    }

    alert(`${reportName} hisoboti ${format.toUpperCase()} formatda yuklandi!`);
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1>Hisobotlar</h1>
          <p>Tizim analitikasi va hisobotlari</p>
        </div>
        <button className="btn btn-primary" onClick={startDownload}>
          <FaChartBar /> Hisobot yaratish
        </button>
      </div>

      {/* Filter qismi */}
      <div className="filter-section">
        <div className="filter-card">
          <h3>Hisobot sozlamalari</h3>
          
          <div className="filter-grid">
            <div className="filter-group">
              <label><FaCalendarAlt /> Boshlanish sanasi</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>

            <div className="filter-group">
              <label><FaCalendarAlt /> Tugash sanasi</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
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
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Joriy ma'lumotlar haqida */}
      <div className="report-summary">
        <div className="summary-card">
          <h3>Joriy holat</h3>
          <div className="summary-stats">
            <div>Jami yozuvlar: <strong>{currentData.length}</strong></div>
            {reportType === 'salary' && (
              <div>O'rtacha maosh: <strong>
                {employees.length ? Math.round(employees.reduce((s,e)=>s+Number(e.salary||0),0)/employees.length).toLocaleString('uz-UZ') + ' so‘m' : '—'}
              </strong></div>
            )}
            {reportType === 'attendance' && (
              <div>O'rtacha davomat: <strong>{Math.round(currentData.reduce((s,d)=>s+(d.attendance||0),0)/currentData.length || 0)}%</strong></div>
            )}
          </div>
        </div>
      </div>

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
              <div className="format-options">
                <button className="format-btn pdf" onClick={() => handleDownload('pdf')}>
                  <FaFilePdf /> PDF (chiroyli hujjat)
                </button>

                <button className="format-btn csv" onClick={() => handleDownload('csv')}>
                  <FaFileExcel /> CSV (Excel uchun)
                </button>

                <button className="format-btn json" onClick={() => handleDownload('json')}>
                  <FaFileArchive /> JSON (dasturchilar uchun)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pastki statistika */}
      <div className="stats-section">
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div>
            <h3>{employees.length}</h3>
            <p>Jami xodimlar</p>
          </div>
        </div>

        <div className="stat-card">
          <FaUserCheck className="stat-icon success" />
          <div>
            <h3>{employees.filter(e => e.status === 'active').length}</h3>
            <p>Faol xodimlar</p>
          </div>
        </div>

        <div className="stat-card">
          <FaMoneyBillWave className="stat-icon warning" />
          <div>
            <h3>
              {employees.length 
                ? Math.round(employees.reduce((s,e)=>s+Number(e.salary||0),0)/employees.length / 1000000) + ' mln' 
                : '—'}
            </h3>
            <p>O'rtacha maosh</p>
          </div>
        </div>

        <div className="stat-card">
          <FaChartLine className="stat-icon primary" />
          <div>
            <h3>{Math.round(employees.reduce((s,e)=>s+Number(e.attendance||0),0)/employees.length || 0)}%</h3>
            <p>O'rtacha davomat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;