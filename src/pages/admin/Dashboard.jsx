import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
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
  FaBuilding
} from 'react-icons/fa';
import './dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 45,
    activeEmployees: 38,
    inactiveEmployees: 7,
    presentToday: 42,
    lateToday: 3,
    remoteToday: 5
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Mock attendance data
    const mockAttendance = [
      { name: 'Dush', attendance: 95 },
      { name: 'Sesh', attendance: 92 },
      { name: 'Chor', attendance: 88 },
      { name: 'Pay', attendance: 96 },
      { name: 'Jum', attendance: 90 },
      { name: 'Shan', attendance: 85 },
      { name: 'Yak', attendance: 82 }
    ];

    // Mock department data
    const mockDepartments = [
      { name: 'IT', value: 12, color: '#0088FE' },
      { name: 'Marketing', value: 8, color: '#00C49F' },
      { name: 'Moliya', value: 6, color: '#FFBB28' },
      { name: 'HR', value: 5, color: '#FF8042' },
      { name: 'Sotuv', value: 9, color: '#8884D8' },
      { name: 'Logistika', value: 5, color: '#82CA9D' }
    ];

    // Mock recent activities
    const mockActivities = [
      { id: 1, employee: 'Aliyev Aziz', action: 'Davomat qayd etdi', time: '5 daqiqa oldin', status: 'success' },
      { id: 2, employee: 'Hasanova Malika', action: 'GPS joylashuv yangilandi', time: '15 daqiqa oldin', status: 'info' },
      { id: 3, employee: 'Olimov Sardor', action: 'Kechikdi', time: '30 daqiqa oldin', status: 'warning' },
      { id: 4, employee: 'Karimova Nigora', action: 'Ta\'tilga chiqdi', time: '2 soat oldin', status: 'info' },
      { id: 5, employee: 'Temirov Jasur', action: 'Uzoq ish rejimi', time: '3 soat oldin', status: 'info' }
    ];

    setAttendanceData(mockAttendance);
    setDepartmentData(mockDepartments);
    setRecentActivities(mockActivities);
  }, []);

  const statCards = [
    {
      title: 'Jami Xodimlar',
      value: stats.totalEmployees,
      icon: <FaUsers />,
      color: '#3498db',
      change: '+3',
      changeType: 'up'
    },
    {
      title: 'Faol Xodimlar',
      value: stats.activeEmployees,
      icon: <FaUserCheck />,
      color: '#2ecc71',
      change: '+2',
      changeType: 'up'
    },
    {
      title: 'Bugungi Davomat',
      value: stats.presentToday,
      icon: <FaCalendarAlt />,
      color: '#9b59b6',
      change: `${((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)}%`,
      changeType: 'up'
    },
    {
      title: 'Kechikkanlar',
      value: stats.lateToday,
      icon: <FaExclamationTriangle />,
      color: '#e74c3c',
      change: '-1',
      changeType: 'down'
    },
    {
      title: 'Uzoq Ish',
      value: stats.remoteToday,
      icon: <FaMapMarkerAlt />,
      color: '#f39c12',
      change: '+2',
      changeType: 'up'
    },
    {
      title: 'Faol Emas',
      value: stats.inactiveEmployees,
      icon: <FaUserTimes />,
      color: '#95a5a6',
      change: '0',
      changeType: 'neutral'
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-subtitle">
          <FaChartLine className="subtitle-icon" />
          <span>Real vaqt monitoring tizimi</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card" style={{ borderTopColor: card.color }}>
            <div className="stat-icon" style={{ backgroundColor: card.color + '20', color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{card.value}</h3>
              <p className="stat-title">{card.title}</p>
            </div>
            <div className={`stat-change ${card.changeType}`}>
              {card.changeType === 'up' && <FaArrowUp />}
              {card.changeType === 'down' && <FaArrowDown />}
              <span>{card.change}</span>
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
            <select className="chart-period">
              <option>Oxirgi 7 kun</option>
              <option>Oxirgi 30 kun</option>
              <option>Oxirgi 3 oy</option>
            </select>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Davomat']}
                  labelFormatter={(label) => `Kun: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#3498db" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Bo'limlar Bo'yicha Xodimlar</h3>
            <div className="chart-info">
              <FaBuilding className="info-icon" />
              <span>6 ta bo'lim</span>
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
                <Tooltip formatter={(value) => [`${value} ta`, 'Xodimlar']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities and Quick Stats */}
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
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">Barchasini ko'rish →</button>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats-card">
          <div className="quick-stats-header">
            <h3>Tezkor Statistika</h3>
            <div className="period-selector">
              <button className="period-btn active">Bugun</button>
              <button className="period-btn">Hafta</button>
              <button className="period-btn">Oy</button>
            </div>
          </div>
          <div className="quick-stats-grid">
            <div className="quick-stat">
              <div className="stat-label">O'rtacha Ish vaqti</div>
              <div className="stat-value">8.5 soat</div>
              <div className="stat-trend up">+0.3 soat</div>
            </div>
            <div className="quick-stat">
              <div className="stat-label">O'rtacha Kechikish</div>
              <div className="stat-value">12 daqiqa</div>
              <div className="stat-trend down">-3 daqiqa</div>
            </div>
            <div className="quick-stat">
              <div className="stat-label">GPS Aniqlik</div>
              <div className="stat-value">98.5%</div>
              <div className="stat-trend up">+0.5%</div>
            </div>
            <div className="quick-stat">
              <div className="stat-label">Tizim Foydalanish</div>
              <div className="stat-value">94%</div>
              <div className="stat-trend neutral">0%</div>
            </div>
          </div>
          <div className="system-status">
            <div className="status-item">
              <span className="status-label">Tizim holati:</span>
              <span className="status-value active">✅ Faol</span>
            </div>
            <div className="status-item">
              <span className="status-label">Oxirgi yangilanish:</span>
              <span className="status-value">Bugun, 09:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;