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
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './dashboard.css';

// Modal komponenti
const StatModal = ({ isOpen, onClose, cardData, stats }) => {
  if (!isOpen) return null;

  const getModalContent = () => {
    switch(cardData.title) {
      case 'Jami Xodimlar':
        return {
          title: 'Xodimlar Statistikasi',
          data: [
            { label: 'Jami xodimlar', value: stats.totalEmployees, color: '#4a90e2' },
            { label: 'Faol xodimlar', value: stats.activeEmployees, color: '#2e7d32' },
            { label: 'Faol emas', value: stats.inactiveEmployees, color: '#757575' },
            { label: 'Erkaklar', value: 28, color: '#1976d2' },
            { label: 'Ayollar', value: 17, color: '#d81b60' },
          ]
        };
      case 'Faol Xodimlar':
        return {
          title: 'Faol Xodimlar Tafsilotlari',
          data: [
            { label: 'Ofisda ishlayotganlar', value: 25, color: '#4caf50' },
            { label: 'Uzoq ish rejimida', value: 8, color: '#ff9800' },
            { label: 'Ta\'tilda', value: 5, color: '#2196f3' },
            { label: 'Ish safari', value: 3, color: '#9c27b0' },
          ]
        };
      case 'Bugungi Davomat':
        return {
          title: 'Bugungi Davomat Tafsilotlari',
          data: [
            { label: 'O\'z vaqtida kelganlar', value: 32, color: '#4caf50' },
            { label: 'Kechikkanlar', value: stats.lateToday, color: '#ff9800' },
            { label: 'Kelishmaganlar', value: 3, color: '#f44336' },
            { label: 'Ruxsat olganlar', value: 4, color: '#2196f3' },
            { label: 'Kasallik ta\'tili', value: 3, color: '#9c27b0' },
          ]
        };
      case 'Kechikkanlar':
        return {
          title: 'Kechikkan Xodimlar',
          data: [
            { label: 'Olimov Sardor', value: '25 daqiqa', time: '09:25' },
            { label: 'Karimova Nigora', value: '15 daqiqa', time: '09:15' },
            { label: 'Temirov Jasur', value: '45 daqiqa', time: '09:45' },
          ]
        };
      case 'Uzoq Ish':
        return {
          title: 'Uzoq Ish Rejimi',
          data: [
            { label: 'Husanov Bobur', value: 'Toshkent shahri', device: 'Mobil' },
            { label: 'Yuldasheva Malika', value: 'Yunusobod tumani', device: 'Kompyuter' },
            { label: 'Rahimov Sherzod', value: 'Chilonzor tumani', device: 'Mobil' },
            { label: 'Abdullayeva Zilola', value: 'Mirzo Ulug\'bek', device: 'Kompyuter' },
            { label: 'Ismoilov Jamshid', value: 'Yashnabod tumani', device: 'Mobil' },
          ]
        };
      case 'Faol Emas':
        return {
          title: 'Faol Emas Xodimlar',
          data: [
            { label: 'Ta\'tilda', value: 4, color: '#ff9800' },
            { label: 'Kasallik ta\'tili', value: 2, color: '#f44336' },
            { label: 'Ish safari', value: 1, color: '#2196f3' },
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
                  {item.label}
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
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('hafta');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Mock attendance data
    const mockAttendance = [
      { name: 'Dush', attendance: 95, late: 2 },
      { name: 'Sesh', attendance: 92, late: 3 },
      { name: 'Chor', attendance: 88, late: 5 },
      { name: 'Pay', attendance: 96, late: 1 },
      { name: 'Jum', attendance: 90, late: 4 },
      { name: 'Shan', attendance: 85, late: 6 },
      { name: 'Yak', attendance: 82, late: 7 }
    ];

    // Mock department data
    const mockDepartments = [
      { name: 'IT', value: 12, color: '#1976d2' },
      { name: 'Marketing', value: 8, color: '#d32f2f' },
      { name: 'Moliya', value: 6, color: '#388e3c' },
      { name: 'HR', value: 5, color: '#f57c00' },
      { name: 'Sotuv', value: 9, color: '#7b1fa2' },
      { name: 'Logistika', value: 5, color: '#00796b' }
    ];

    // Mock recent activities
    const mockActivities = [
      { 
        id: 1, 
        employee: 'Aliyev Aziz', 
        action: 'Davomat qayd etdi', 
        time: '5 daqiqa oldin', 
        status: 'success',
        details: 'Ofis: 09:00 da'
      },
      { 
        id: 2, 
        employee: 'Hasanova Malika', 
        action: 'GPS joylashuv yangilandi', 
        time: '15 daqiqa oldin', 
        status: 'info',
        details: 'Uzoq ish rejimi'
      },
      { 
        id: 3, 
        employee: 'Olimov Sardor', 
        action: 'Kechikdi', 
        time: '30 daqiqa oldin', 
        status: 'warning',
        details: 'Kechikish: 25 daqiqa'
      },
      { 
        id: 4, 
        employee: 'Karimova Nigora', 
        action: 'Ta\'tilga chiqdi', 
        time: '2 soat oldin', 
        status: 'info',
        details: 'Kasallik ta\'tili'
      },
      { 
        id: 5, 
        employee: 'Temirov Jasur', 
        action: 'Uzoq ish rejimi', 
        time: '3 soat oldin', 
        status: 'info',
        details: 'Manzil: Toshkent sh.'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setAttendanceData(mockAttendance);
      setDepartmentData(mockDepartments);
      setRecentActivities(mockActivities);
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
    // Here you would normally fetch new data based on the selected period
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
            <FaClock /> Oxirgi yangilanish: 09:45
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
            <div className="chart-summary">
              <p>Eng ko'p xodim: IT bo'limi (12 ta)</p>
              <p>Eng kam xodim: HR bo'limi (5 ta)</p>
            </div>
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

        {/* Quick Stats */}
        <div className="quick-stats-card">
          <div className="quick-stats-header">
            <h3>Tezkor Statistika</h3>
            <div className="period-selector">
              <button 
                className={`period-btn ${selectedPeriod === 'bugun' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('bugun')}
              >
                Bugun
              </button>
              <button 
                className={`period-btn ${selectedPeriod === 'hafta' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('hafta')}
              >
                Hafta
              </button>
              <button 
                className={`period-btn ${selectedPeriod === 'oy' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('oy')}
              >
                Oy
              </button>
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
            <div className="status-item">
              <span className="status-label">Foydalanuvchilar online:</span>
              <span className="status-value">42</span>
            </div>
          </div>
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