// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaUserCheck, FaUserTimes, FaMapMarkerAlt,
  FaCalendarAlt, FaChartLine, FaExclamationTriangle,
  FaArrowUp, FaArrowDown, FaClock, FaBuilding
} from 'react-icons/fa';
import { 
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './dashboard.css';

// data.js dan faqat kerakli statik ma'lumotlar va yordamchi funksiyalarni olamiz
import { departments } from '../../data';

const Dashboard = () => {
  // localStorage'dan xodimlarni o'qiymiz (Employees sahifasida qo'shilganlar shu yerda ko'rinadi)
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('hr_employees');
    return saved ? JSON.parse(saved) : [];
  });

  const [stats, setStats] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // localStorage'dagi employees dan barcha hisob-kitoblarni yangilaymiz
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const inactiveEmployees = totalEmployees - activeEmployees;
    const presentToday = Math.floor(totalEmployees * 0.93) || 0;
    const lateToday = Math.floor(totalEmployees * 0.07) || 0;
    const remoteToday = employees.filter(emp => emp.status === 'remote').length;

    // Bo'limlar bo'yicha statistika
    const departmentStats = {};
    employees.forEach(emp => {
      const dept = emp.department || 'Noma\'lum';
      if (!departmentStats[dept]) {
        departmentStats[dept] = { count: 0, totalAttendance: 0, totalSalary: 0 };
      }
      departmentStats[dept].count++;
      departmentStats[dept].totalAttendance += Number(emp.attendance) || 0;
      departmentStats[dept].totalSalary += Number(emp.salary) || 0;
    });

    // O'rtacha qiymatlar
    const avgSalary = totalEmployees 
      ? Math.round(employees.reduce((sum, e) => sum + Number(e.salary || 0), 0) / totalEmployees) 
      : 0;

    const avgAttendance = totalEmployees 
      ? Math.round(employees.reduce((sum, e) => sum + Number(e.attendance || 0), 0) / totalEmployees) 
      : 0;

    setStats({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      presentToday,
      lateToday,
      remoteToday,
      avgSalary,
      avgAttendance
    });

    // Haftalik davomat (random generatsiya, real loyihada backenddan keladi)
    const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sha', 'Ya'];
    const weekly = days.map(day => ({
      name: day,
      attendance: Math.floor(Math.random() * 15) + 80
    }));
    setAttendanceData(weekly);

    // Bo'limlar taqsimoti (local employees dan)
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#a4de6c', '#d0ed57'];
    const dist = Object.keys(departmentStats).map((dept, i) => ({
      name: dept,
      value: departmentStats[dept].count,
      color: colors[i % colors.length]
    }));
    setDepartmentData(dist);

    // So'nggi faoliyatlar (local employees dan generatsiya)
    const actions = [
      'Davomat qayd etdi', 'Kechikdi', 'Uzoq ish rejimi', 
      'GPS joylashuv yangilandi', 'Ishni boshladi'
    ];
    const activities = employees.slice(0, 6).map(emp => ({
      id: emp.id,
      employee: emp.name,
      action: actions[Math.floor(Math.random() * actions.length)],
      time: ['5 daqiqa oldin', '15 daqiqa oldin', '30 daqiqa oldin', '1 soat oldin'][Math.floor(Math.random() * 4)],
      status: Math.random() > 0.6 ? 'success' : Math.random() > 0.3 ? 'warning' : 'info'
    }));
    setRecentActivities(activities);
  }, [employees]);

  // Statistik kartalar
  const statCards = stats.totalEmployees ? [
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
  ] : [];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-subtitle">
          <FaChartLine className="subtitle-icon" />
          <span>Real vaqt monitoring tizimi</span>
        </div>
      </div>

      {/* Statistika kartalari */}
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

      {/* Grafiklar */}
      <div className="charts-section">
        {/* Haftalik davomat */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Haftalik Davomat Statistikasi</h3>
            <select className="chart-period">
              <option>Oxirgi 7 kun</option>
              <option>Oxirgi 30 kun</option>
            </select>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis domain={[70, 100]} stroke="#666" />
                <Tooltip formatter={(value) => [`${value}%`, 'Davomat']} />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke="#3498db" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bo'limlar taqsimoti */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Bo'limlar Bo'yicha Xodimlar</h3>
            <div className="chart-info">
              <FaBuilding className="info-icon" />
              <span>{departmentData.length} ta bo'lim</span>
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

      {/* So'nggi faoliyatlar */}
      <div className="bottom-section">
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

        {/* Tezkor statistika */}
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
              <div className="stat-value">8.4 soat</div>
              <div className="stat-trend up">+0.2 soat</div>
            </div>
            <div className="quick-stat">
              <div className="stat-label">O'rtacha Kechikish</div>
              <div className="stat-value">14 daqiqa</div>
              <div className="stat-trend down">-2 daqiqa</div>
            </div>
            <div className="quick-stat">
              <div className="stat-label">O'rtacha Davomat</div>
              <div className="stat-value">{stats.avgAttendance?.toFixed(1) || 0}%</div>
              <div className="stat-trend up">+1.2%</div>
            </div>
            <div className="quick-stat">
              <div className="stat-label">O'rtacha Maosh</div>
              <div className="stat-value">
                {stats.avgSalary ? (stats.avgSalary / 1000000).toFixed(1) + ' mln so‘m' : '—'}
              </div>
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
              <span className="status-value">Hozir</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;