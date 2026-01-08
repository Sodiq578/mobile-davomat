import React, { useEffect, useState } from 'react';
import { api } from '../../api';

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
    return <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      fontSize: '1.125rem',
      color: '#64748b'
    }}>
      Yuklanmoqda...
    </div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '0.5rem' }}>
          Dashboard
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Real vaqt monitoring paneli
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Total Employees */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          borderTop: '4px solid #2563eb'
        }}>
          <div style={{ fontSize: '2rem', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', background: '#f8fafc' }}>
            👥
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>
              Jami Xodimlar
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>
              {stats.totalEmployees}
            </p>
          </div>
        </div>

        {/* Online */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          borderTop: '4px solid #10b981'
        }}>
          <div style={{ fontSize: '2rem', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', background: '#f8fafc' }}>
            🟢
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>
              Online
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>
              {stats.onlineEmployees}
            </p>
          </div>
        </div>

        {/* Working */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          borderTop: '4px solid #f59e0b'
        }}>
          <div style={{ fontSize: '2rem', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', background: '#f8fafc' }}>
            ⚡
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>
              Ishlayapti
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>
              {stats.workingEmployees}
            </p>
          </div>
        </div>

        {/* On Break */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          borderTop: '4px solid #64748b'
        }}>
          <div style={{ fontSize: '2rem', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', background: '#f8fafc' }}>
            ☕
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>
              Tanaffusda
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>
              {stats.onBreak}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem'
      }}>
        {/* Recent Activities */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1e293b' }}>
            So'nggi Harakatlar
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivities.map(activity => (
              <div key={activity.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: '#f8fafc',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#64748b', minWidth: '60px', fontWeight: '500' }}>
                  {activity.time}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{activity.employee}</span>
                  <span style={{ color: '#64748b', fontSize: '0.95rem' }}>{activity.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1e293b' }}>
            Tezkor Kirish
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href="/admin/employees" style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              background: '#f8fafc',
              color: '#1e293b',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              textAlign: 'center'
            }}>
              👥 Barcha Xodimlar
            </a>
            <a href="/admin/live" style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              background: '#f8fafc',
              color: '#1e293b',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              textAlign: 'center'
            }}>
              🗺️ Real Vaqtda Kuzatish
            </a>
            <a href="/admin/reports" style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              background: '#f8fafc',
              color: '#1e293b',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              textAlign: 'center'
            }}>
              📊 Hisobotlar
            </a>
            <a href="/admin/map" style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              background: '#f8fafc',
              color: '#1e293b',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              textAlign: 'center'
            }}>
              🗺️ Xaritada Ko'rish
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;