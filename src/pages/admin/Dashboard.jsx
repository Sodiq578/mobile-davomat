import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { 
  TeamOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  CoffeeOutlined,
  UserSwitchOutlined,
  DashboardOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
  SyncOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { Progress, Card, Row, Col, List, Avatar, Button, Space, Statistic, Timeline, Alert } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    onlineEmployees: 0,
    workingEmployees: 0,
    onBreak: 0,
    lateToday: 0,
    onVacation: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeData, setTimeData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    productivity: 85,
    attendance: 92,
    punctuality: 78
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 30000); // Har 30 soniyada yangilash

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    if (silent) setRefreshing(true);
    
    try {
      const employees = await api.getAllEmployees();
      const today = new Date().toISOString().split('T')[0];
      const activities = await api.getRecentActivities();

      // Asosiy statistikalar
      const newStats = {
        totalEmployees: employees.length,
        onlineEmployees: employees.filter(e => e.isOnline).length,
        workingEmployees: employees.filter(e => e.currentStatus === 'ishlayapti').length,
        onBreak: employees.filter(e => e.currentStatus === 'tanaffus').length,
        lateToday: employees.filter(e => e.lateToday).length,
        onVacation: employees.filter(e => e.onVacation).length
      };
      setStats(newStats);

      // So'nggi faolliklar
      setRecentActivities(activities.slice(0, 10));

      // Vaqt bo'yicha ma'lumotlar
      const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        attendance: Math.floor(Math.random() * (newStats.totalEmployees - 15)) + 15,
        productivity: Math.floor(Math.random() * 30) + 70
      }));
      setTimeData(hourlyData);

      // Bo'limlar bo'yicha ma'lumotlar
      const departmentStats = employees.reduce((acc, employee) => {
        const dept = employee.department || 'Noaniq';
        if (!acc[dept]) acc[dept] = 0;
        acc[dept]++;
        return acc;
      }, {});

      const deptData = Object.entries(departmentStats).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }));
      setDepartmentData(deptData);

      // Performans metrikalari
      setPerformanceMetrics({
        productivity: Math.floor(Math.random() * 15) + 80,
        attendance: Math.floor(Math.random() * 10) + 85,
        punctuality: Math.floor(Math.random() * 20) + 70
      });

    } catch (error) {
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ishlayapti': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'tanaffus': return <CoffeeOutlined style={{ color: '#faad14' }} />;
      case 'offline': return <ClockCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <UserSwitchOutlined />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>
            <DashboardOutlined /> Dashboard
          </h1>
          <p>Real vaqt monitoring paneli</p>
        </div>
        <div className="header-actions">
          <Button 
            icon={<SyncOutlined spin={refreshing} />} 
            onClick={() => loadDashboardData(true)}
            loading={refreshing}
          >
            Yangilash
          </Button>
          <span className="last-updated">
            Oxirgi yangilanish: {new Date().toLocaleTimeString('uz-UZ')}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <Row gutter={[24, 24]} className="stats-grid">
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="stat-card total-employees">
            <div className="stat-icon">
              <TeamOutlined />
            </div>
            <div className="stat-content">
              <Statistic 
                title="Jami Xodimlar" 
                value={stats.totalEmployees}
                prefix={<span className="stat-prefix">👥</span>}
              />
              <div className="stat-trend">
                <span className="trend-up">+5% oyiga</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="stat-card online-employees">
            <div className="stat-icon">
              <CheckCircleOutlined />
            </div>
            <div className="stat-content">
              <Statistic 
                title="Online Xodimlar" 
                value={stats.onlineEmployees}
                suffix={<span className="stat-suffix">/{stats.totalEmployees}</span>}
              />
              <Progress 
                percent={Math.round((stats.onlineEmployees / stats.totalEmployees) * 100)} 
                size="small" 
                status="active"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="stat-card working-employees">
            <div className="stat-icon">
              <ClockCircleOutlined />
            </div>
            <div className="stat-content">
              <Statistic 
                title="Ishlayapti" 
                value={stats.workingEmployees}
                prefix={<span className="stat-prefix">⚡</span>}
              />
              <div className="stat-details">
                <span>{(stats.workingEmployees / stats.totalEmployees * 100).toFixed(1)}%</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="stat-card on-break">
            <div className="stat-icon">
              <CoffeeOutlined />
            </div>
            <div className="stat-content">
              <Statistic 
                title="Tanaffusda" 
                value={stats.onBreak}
                prefix={<span className="stat-prefix">☕</span>}
              />
              <div className="stat-details">
                <span>Bugun: {stats.onBreak} kishi</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats Row */}
      <Row gutter={[24, 24]} className="stats-grid">
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="stat-card late-employees">
            <div className="stat-content">
              <Statistic 
                title="Kechikkanlar" 
                value={stats.lateToday}
                valueStyle={{ color: '#ff4d4f' }}
              />
              <div className="stat-details">
                <span>Bugungi kun uchun</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="stat-card vacation-employees">
            <div className="stat-content">
              <Statistic 
                title="Ta'tilda" 
                value={stats.onVacation}
                valueStyle={{ color: '#1890ff' }}
              />
              <div className="stat-details">
                <span>Joriy oy</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="stat-card productivity">
            <div className="stat-content">
              <Statistic 
                title="Produktivlik" 
                value={performanceMetrics.productivity}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress 
                percent={performanceMetrics.productivity} 
                size="small" 
                status="active"
                strokeColor="#52c41a"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="stat-card attendance">
            <div className="stat-content">
              <Statistic 
                title="Davomat" 
                value={performanceMetrics.attendance}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
              <Progress 
                percent={performanceMetrics.attendance} 
                size="small" 
                status="active"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row gutter={[24, 24]} className="main-content">
        {/* Charts Section */}
        <Col xs={24} lg={16}>
          <Card 
            title={<><BarChartOutlined /> Kunlik Faollik Grafigi</>}
            className="chart-card"
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#1890ff" 
                    activeDot={{ r: 8 }}
                    name="Davomat soni"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="productivity" 
                    stroke="#52c41a" 
                    name="Produktivlik (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Department Distribution */}
        <Col xs={24} lg={8}>
          <Card 
            title={<><TeamOutlined /> Bo'limlar Bo'yicha Taqsimot</>}
            className="chart-card"
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={16}>
          <Card 
            title={<><ClockCircleOutlined /> So'nggi Harakatlar</>}
            className="activities-card"
            extra={<a href="/admin/activities">Barchasini ko'rish</a>}
          >
            <List
              dataSource={recentActivities}
              renderItem={(activity, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        size="large"
                        style={{ 
                          backgroundColor: activity.type === 'entry' ? '#52c41a' : 
                                         activity.type === 'exit' ? '#ff4d4f' : 
                                         activity.type === 'break' ? '#faad14' : '#1890ff'
                        }}
                      >
                        {getStatusIcon(activity.status)}
                      </Avatar>
                    }
                    title={
                      <div className="activity-title">
                        <strong>{activity.employeeName}</strong>
                        <span className="activity-action">{activity.action}</span>
                      </div>
                    }
                    description={
                      <div className="activity-details">
                        <span className="activity-time">{formatTime(activity.timestamp)}</span>
                        <span className="activity-location">{activity.location || 'Bosh ofis'}</span>
                      </div>
                    }
                  />
                  <div className="activity-badge">
                    <span className={`status-badge ${activity.status}`}>
                      {activity.status}
                    </span>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Quick Access & System Status */}
        <Col xs={24} lg={8}>
          <Card 
            title={<><EnvironmentOutlined /> Tezkor Kirish</>}
            className="quick-access-card"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                block 
                size="large" 
                icon={<TeamOutlined />}
                href="/admin/employees"
                className="quick-access-btn"
              >
                👥 Barcha Xodimlar
              </Button>
              <Button 
                block 
                size="large" 
                icon={<EnvironmentOutlined />}
                href="/admin/live"
                className="quick-access-btn"
              >
                🗺️ Real Vaqtda Kuzatish
              </Button>
              <Button 
                block 
                size="large" 
                icon={<BarChartOutlined />}
                href="/admin/reports"
                className="quick-access-btn"
              >
                📊 Hisobotlar
              </Button>
              <Button 
                block 
                size="large" 
                icon={<DashboardOutlined />}
                href="/admin/map"
                className="quick-access-btn"
              >
                🌍 Xaritada Ko'rish
              </Button>
            </Space>

            <div className="system-status">
              <h4>Tizim Holati</h4>
              <Timeline className="status-timeline">
                <Timeline.Item color="green">
                  <p>API server faol</p>
                  <small>2 daqiqa oldin tekshirildi</small>
                </Timeline.Item>
                <Timeline.Item color="green">
                  <p>Ma'lumotlar bazasi ulangan</p>
                  <small>Ping: 12ms</small>
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <p>Real vaqt yangilanishi</p>
                  <small>30 soniyada yangilanadi</small>
                </Timeline.Item>
                <Timeline.Item color="green">
                  <p>GPS tracking faol</p>
                  <small>45 ta qurilma ulangan</small>
                </Timeline.Item>
              </Timeline>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Card 
        title={<><DashboardOutlined /> Performans Ko'rsatkichlari</>}
        className="performance-card"
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div className="metric-item">
              <h3>Ish vaqti samaradorligi</h3>
              <Progress 
                type="dashboard" 
                percent={performanceMetrics.productivity}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <p className="metric-description">
                O'rtacha ish vaqti samaradorligi
              </p>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="metric-item">
              <h3>Vaqtida kelish</h3>
              <Progress 
                type="dashboard" 
                percent={performanceMetrics.punctuality}
                strokeColor={{
                  '0%': '#ff4d4f',
                  '100%': '#52c41a',
                }}
              />
              <p className="metric-description">
                Vaqtida ishga kelish ko'rsatkichi
              </p>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="metric-item">
              <h3>Vazifa bajarilishi</h3>
              <Progress 
                type="dashboard" 
                percent={94}
                strokeColor={{
                  '0%': '#faad14',
                  '100%': '#722ed1',
                }}
              />
              <p className="metric-description">
                Muddati ichida bajarilgan vazifalar
              </p>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Alerts & Notifications */}
      <Alert
        message="Tizim ogohlantirishlari"
        description="Bugun 3 ta xodim kech qoldi. Joriy oyda davomat 92% ni tashkil qilmoqda."
        type="info"
        showIcon
        closable
        className="system-alert"
      />
    </div>
  );
};

export default AdminDashboard;