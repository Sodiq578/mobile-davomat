import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import EmployeeCard from '../../components/admin/EmployeeCard';
import './EmployeeDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    onlineEmployees: 0,
    workingEmployees: 0,
    onBreak: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const employees = await api.getAllEmployees();
      
      setStats({
        totalEmployees: employees.length,
        onlineEmployees: employees.filter(e => e.isOnline).length,
        workingEmployees: employees.filter(e => e.currentStatus === 'ishlayapti').length,
        onBreak: employees.filter(e => e.currentStatus === 'tanaffus').length
      });

      // Recent activities (fake data)
      setRecentActivities([
        { id: 1, employee: 'Ali Valiyev', action: 'Ishni boshladi', time: '09:00' },
        { id: 2, employee: 'Hasan Hasanov', action: 'Chiqib ketdi', time: '10:30' },
        { id: 3, employee: 'Dilshod Rajabov', action: 'Tanaffusga chiqdi', time: '12:00' }
      ]);
    } catch (error) {
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Yuklanmoqda...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Real vaqt monitoring paneli</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Jami Xodimlar</h3>
            <p className="stat-number">{stats.totalEmployees}</p>
          </div>
        </div>

        <div className="stat-card online">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <h3>Online</h3>
            <p className="stat-number">{stats.onlineEmployees}</p>
          </div>
        </div>

        <div className="stat-card working">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <h3>Ishlayapti</h3>
            <p className="stat-number">{stats.workingEmployees}</p>
          </div>
        </div>

        <div className="stat-card break">
          <div className="stat-icon">☕</div>
          <div className="stat-info">
            <h3>Tanaffusda</h3>
            <p className="stat-number">{stats.onBreak}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-activities">
          <h2>So'nggi Harakatlar</h2>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-time">{activity.time}</div>
                <div className="activity-details">
                  <span className="employee-name">{activity.employee}</span>
                  <span className="activity-action">{activity.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-access">
          <h2>Tezkor Kirish</h2>
          <div className="access-buttons">
            <a href="/admin/employees" className="access-btn">
              👥 Barcha Xodimlar
            </a>
            <a href="/admin/live" className="access-btn">
              🗺️ Real Vaqtda Kuzatish
            </a>
            <a href="/admin/reports" className="access-btn">
              📊 Hisobotlar
            </a>
            <a href="/admin/map" className="access-btn">
              🗺️ Xaritada Ko'rish
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;