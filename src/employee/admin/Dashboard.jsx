// src/pages/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaUserCheck, 
  FaUserTimes, 
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChartLine,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaBuilding,
  FaTimes,
  FaChevronRight,
  FaUser,
  FaMobileAlt,
  FaDesktop
} from 'react-icons/fa';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  employees,
  getStatistics,
  getWeeklyAttendance,
  getDepartmentDistribution,
  getRecentActivities,
  departments,
  getEmployeesByDepartment,
  getActiveEmployees,
  getRemoteEmployees,
  getOnLeaveEmployees,
  getLateEmployees
} from '../../data';
import './dashboard.css';

// Modal komponenti
const StatModal = ({ isOpen, onClose, cardData, stats }) => {
  if (!isOpen) return null;

  const getModalContent = () => {
    const activeEmps = getActiveEmployees();
    const remoteEmps = getRemoteEmployees();
    const lateEmps = getLateEmployees();
    const onLeaveEmps = getOnLeaveEmployees();

    switch(cardData.title) {
      case 'Jami Xodimlar':
        return {
          title: 'Xodimlar Statistikasi',
          data: [
            { 
              label: 'Jami xodimlar', 
              value: stats.totalEmployees, 
              color: '#4a90e2',
              employees: employees.map(emp => emp.name)
            },
            { 
              label: 'Faol xodimlar', 
              value: stats.activeEmployees, 
              color: '#2e7d32',
              employees: activeEmps.map(emp => emp.name)
            },
            { 
              label: 'Faol emas', 
              value: stats.inactiveEmployees, 
              color: '#757575',
              employees: employees.filter(emp => emp.status !== 'active').map(emp => emp.name)
            },
            { 
              label: 'Erkaklar', 
              value: stats.genderStats.male, 
              color: '#1976d2',
              employees: employees.filter(emp => emp.personal?.gender === 'male').map(emp => emp.name)
            },
            { 
              label: 'Ayollar', 
              value: stats.genderStats.female, 
              color: '#d81b60',
              employees: employees.filter(emp => emp.personal?.gender === 'female').map(emp => emp.name)
            },
          ]
        };
      case 'Faol Xodimlar':
        return {
          title: 'Faol Xodimlar Tafsilotlari',
          data: [
            { 
              label: 'Ofisda ishlayotganlar', 
              value: activeEmps.filter(emp => emp.status === 'active' && emp.device === 'Kompyuter').length, 
              color: '#4caf50',
              employees: activeEmps.filter(emp => emp.device === 'Kompyuter').map(emp => emp.name)
            },
            { 
              label: 'Uzoq ish rejimida', 
              value: remoteEmps.length, 
              color: '#ff9800',
              employees: remoteEmps.map(emp => emp.name)
            },
            { 
              label: 'Ta\'tilda', 
              value: onLeaveEmps.length, 
              color: '#2196f3',
              employees: onLeaveEmps.map(emp => emp.name)
            },
            { 
              label: 'Ish safari', 
              value: activeEmps.filter(emp => emp.location.includes('shahri')).length, 
              color: '#9c27b0',
              employees: activeEmps.filter(emp => emp.location.includes('shahri')).map(emp => emp.name)
            },
          ]
        };
      case 'Bugungi Davomat':
        const presentEmps = employees.slice(0, stats.presentToday);
        const lateEmpsToday = employees.slice(0, stats.lateToday);
        
        return {
          title: 'Bugungi Davomat Tafsilotlari',
          data: [
            { 
              label: 'O\'z vaqtida kelganlar', 
              value: stats.presentToday - stats.lateToday, 
              color: '#4caf50',
              employees: presentEmps.filter(emp => !lateEmpsToday.includes(emp)).map(emp => emp.name)
            },
            { 
              label: 'Kechikkanlar', 
              value: stats.lateToday, 
              color: '#ff9800',
              employees: lateEmpsToday.map(emp => emp.name)
            },
            { 
              label: 'Kelishmaganlar', 
              value: stats.totalEmployees - stats.presentToday, 
              color: '#f44336',
              employees: employees.slice(stats.presentToday).map(emp => emp.name)
            },
            { 
              label: 'Ruxsat olganlar', 
              value: onLeaveEmps.length, 
              color: '#2196f3',
              employees: onLeaveEmps.map(emp => emp.name)
            },
            { 
              label: 'Kasallik ta\'tili', 
              value: onLeaveEmps.filter(emp => emp.status === 'on_leave').length, 
              color: '#9c27b0',
              employees: onLeaveEmps.filter(emp => emp.status === 'on_leave').map(emp => emp.name)
            },
          ]
        };
      case 'Kechikkanlar':
        const lateEmployeesList = getLateEmployees().slice(0, 3);
        
        return {
          title: 'Kechikkan Xodimlar',
          data: lateEmployeesList.map((emp, index) => ({
            label: emp.name,
            value: `${Math.floor(Math.random() * 45) + 5} daqiqa`,
            time: `09:${Math.floor(Math.random() * 30) + 5}`,
            department: emp.department
          }))
        };
      case 'Uzoq Ish':
        return {
          title: 'Uzoq Ish Rejimi',
          data: remoteEmps.slice(0, 5).map(emp => ({
            label: emp.name,
            value: emp.location,
            device: emp.device,
            department: emp.department
          }))
        };
      case 'Faol Emas':
        return {
          title: 'Faol Emas Xodimlar',
          data: [
            { 
              label: 'Ta\'tilda', 
              value: onLeaveEmps.length, 
              color: '#ff9800',
              employees: onLeaveEmps.map(emp => emp.name)
            },
            { 
              label: 'Kasallik ta\'tili', 
              value: onLeaveEmps.filter(emp => emp.status === 'on_leave').length, 
              color: '#f44336',
              employees: onLeaveEmps.filter(emp => emp.status === 'on_leave').map(emp => emp.name)
            },
            { 
              label: 'Ish safari', 
              value: remoteEmps.length, 
              color: '#2196f3',
              employees: remoteEmps.map(emp => emp.name)
            },
          ]
        };
      default:
        return { title: 'Statistika', data: [] };
    }
  };

  const content = getModalContent();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{content.title}</h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-stats">
            {content.data.map((item, index) => (
              <div key={index} className="modal-stat-item">
                <div className="modal-stat-label">
                  {item.color && (
                    <span 
                      className="modal-stat-color" 
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                  <div>
                    {item.label}
                    {item.department && (
                      <div className="modal-stat-department">{item.department}</div>
                    )}
                  </div>
                </div>
                <div className="modal-stat-value">
                  {item.value}
                  {item.time && <span className="modal-stat-time">{item.time}</span>}
                  {item.device && (
                    <span className="modal-stat-device">
                      {item.device === 'Mobil' ? <FaMobileAlt /> : <FaDesktop />}
                      {item.device}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn" onClick={onClose}>
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(getStatistics());
  const [attendanceData, setAttendanceData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('hafta');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Ma'lumotlarni data.js dan olish
    const weeklyAttendance = getWeeklyAttendance();
    const departmentDistribution = getDepartmentDistribution();
    const recentActivitiesList = getRecentActivities();

    // Simulate API call
    setTimeout(() => {
      setAttendanceData(weeklyAttendance);
      setDepartmentData(departmentDistribution);
      setRecentActivities(recentActivitiesList);
      setLoading(false);
    }, 500);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCard(null);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // Ma'lumotlarni yangi davr bo'yicha yangilash
    fetchDashboardData();
  };

  const statCards = [
    {
      id: 1,
      title: 'Jami Xodimlar',
      value: stats.totalEmployees,
      icon: <FaUsers />,
      color: '#4a90e2',
      change: '+3',
      changeType: 'up',
      description: 'Jami ro\'yxatdan o\'tgan xodimlar'
    },
    {
      id: 2,
      title: 'Faol Xodimlar',
      value: stats.activeEmployees,
      icon: <FaUserCheck />,
      color: '#2e7d32',
      change: '+2',
      changeType: 'up',
      description: 'Faol ishlayotgan xodimlar'
    },
    {
      id: 3,
      title: 'Bugungi Davomat',
      value: stats.presentToday,
      icon: <FaCalendarAlt />,
      color: '#ff9800',
      change: `${((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)}%`,
      changeType: 'up',
      description: 'Bugungi kelgan xodimlar'
    },
    {
      id: 4,
      title: 'Kechikkanlar',
      value: stats.lateToday,
      icon: <FaExclamationTriangle />,
      color: '#f44336',
      change: '-1',
      changeType: 'down',
      description: 'Bugun kechikkanlar'
    },
    {
      id: 5,
      title: 'Uzoq Ish',
      value: stats.remoteToday,
      icon: <FaMapMarkerAlt />,
      color: '#9c27b0',
      change: '+2',
      changeType: 'up',
      description: 'Uzoq ish rejimidagilar'
    },
    {
      id: 6,
      title: 'Faol Emas',
      value: stats.inactiveEmployees,
      icon: <FaUserTimes />,
      color: '#757575',
      change: '0',
      changeType: 'neutral',
      description: 'Ishlamayotgan xodimlar'
    }
  ];

  // Bo'limlar bo'yicha statistikani hisoblash
  const departmentStats = departments.map(dept => {
    const deptEmployees = getEmployeesByDepartment(dept);
    const avgAttendance = deptEmployees.length > 0 
      ? deptEmployees.reduce((sum, emp) => sum + emp.attendance, 0) / deptEmployees.length
      : 0;
    
    return {
      department: dept,
      count: deptEmployees.length,
      avgAttendance: Math.round(avgAttendance)
    };
  });

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Dashboard yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-subtitle">
          <FaChartLine className="subtitle-icon" />
          <span>Real vaqt monitoring tizimi</span>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchDashboardData}>
            <FaChartLine /> Yangilash
          </button>
          <div className="last-updated">
            <FaClock /> Oxirgi yangilanish: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div 
            key={card.id} 
            className="stat-card" 
            onClick={() => handleCardClick(card)}
            style={{ cursor: 'pointer', animationDelay: `${index * 0.1}s` }}
          >
            <div className="stat-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{card.value}</h3>
              <p className="stat-title">{card.title}</p>
              <p className="stat-description">{card.description}</p>
            </div>
            <div className={`stat-change ${card.changeType}`}>
              {card.changeType === 'up' && <FaArrowUp />}
              {card.changeType === 'down' && <FaArrowDown />}
              <span>{card.change}</span>
            </div>
            <div className="stat-arrow">
              <FaChevronRight />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Attendance Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Haftalik Davomat Statistikasi</h3>
            <div className="chart-controls">
              <select 
                className="chart-period"
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
              >
                <option value="hafta">Oxirgi 7 kun</option>
                <option value="oy">Oxirgi 30 kun</option>
                <option value="chorak">Oxirgi 3 oy</option>
              </select>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'attendance') return [`${value}%`, 'Davomat'];
                    if (name === 'late') return [`${value} ta`, 'Kechikkanlar'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Kun: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="attendance" 
                  name="Davomat foizi" 
                  fill="#4a90e2" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="late" 
                  name="Kechikkanlar" 
                  fill="#f44336" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Bo'limlar Bo'yicha Xodimlar</h3>
            <div className="chart-info">
              <FaBuilding className="info-icon" />
              <span>{departments.length} ta bo'lim</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} ta`, 
                    `${props.payload.name} bo'limi`
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-summary">
              <p>Eng ko'p xodim: {departmentData.sort((a, b) => b.value - a.value)[0]?.name} ({departmentData.sort((a, b) => b.value - a.value)[0]?.value} ta)</p>
              <p>Eng kam xodim: {departmentData.sort((a, b) => a.value - b.value)[0]?.name} ({departmentData.sort((a, b) => a.value - b.value)[0]?.value} ta)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        {/* Recent Activities */}
        <div className="activities-card">
          <div className="activities-header">
            <h3>So'nggi Faoliyatlar</h3>
            <FaClock className="header-icon" />
          </div>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.status}`}>
                  {activity.status === 'success' && '✓'}
                  {activity.status === 'warning' && '⚠'}
                  {activity.status === 'info' && 'i'}
                </div>
                <div className="activity-content">
                  <div className="activity-main">
                    <span className="activity-employee">{activity.employee}</span>
                    <span className="activity-action">{activity.action}</span>
                  </div>
                  <div className="activity-details">
                    <span className="activity-time">{activity.time}</span>
                    {activity.details && (
                      <span className="activity-extra">{activity.details}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">Barchasini ko'rish →</button>
        </div>

        {/* Department Statistics */}
        <div className="department-stats-card">
          <div className="department-stats-header">
            <h3>Bo'limlar Statistikasi</h3>
            <FaBuilding className="header-icon" />
          </div>
          <div className="department-stats-list">
            {departmentStats.map((stat, index) => (
              <div key={index} className="department-stat-item">
                <div className="department-name">
                  <FaBuilding className="department-icon" />
                  {stat.department}
                </div>
                <div className="department-info">
                  <span className="employee-count">{stat.count} xodim</span>
                  <div className="attendance-bar">
                    <div 
                      className="attendance-fill"
                      style={{ width: `${stat.avgAttendance}%` }}
                    />
                    <span className="attendance-percent">{stat.avgAttendance}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div className="system-stats">
        <div className="system-stat">
          <h4>O'rtacha Maosh</h4>
          <p className="stat-value">{(stats.avgSalary / 1000000).toFixed(1)}M so'm</p>
        </div>
        <div className="system-stat">
          <h4>O'rtacha Davomat</h4>
          <p className="stat-value">{stats.avgAttendance.toFixed(1)}%</p>
        </div>
        <div className="system-stat">
          <h4>Jami Maosh</h4>
          <p className="stat-value">{(stats.totalSalary / 1000000).toFixed(1)}M so'm</p>
        </div>
        <div className="system-stat">
          <h4>Erkak:Ayol</h4>
          <p className="stat-value">{stats.genderStats.male}:{stats.genderStats.female}</p>
        </div>
      </div>

      {/* Modal */}
      <StatModal 
        isOpen={modalOpen}
        onClose={closeModal}
        cardData={selectedCard}
        stats={stats}
      />
    </div>
  );
};

export default Dashboard;