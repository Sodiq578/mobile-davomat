import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../../context/EmployeeContext';
import { useAuth } from '../../context/AuthContext';

const AttendancePage = () => {
  const { attendance, getMyAttendance, currentSession } = useEmployee();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      await getMyAttendance();
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('uz-UZ', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString || timeString === '00:00') return '-';
    return timeString;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ishlayapti': return '#10b981';
      case 'tanaffus': return '#f59e0b';
      case 'chiqib ketdi': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'ishlayapti': return 'Ishlayapti';
      case 'tanaffus': return 'Tanaffus';
      case 'chiqib ketdi': return 'Chiqib ketdi';
      default: return 'Noma\'lum';
    }
  };

  const calculateWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut || checkIn === '00:00' || checkOut === '00:00') return '-';
    
    try {
      const [inHour, inMinute] = checkIn.split(':').map(Number);
      const [outHour, outMinute] = checkOut.split(':').map(Number);
      
      const totalMinutes = (outHour * 60 + outMinute) - (inHour * 60 + inMinute);
      if (totalMinutes < 0) return '-';
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      return `${hours}h ${minutes}m`;
    } catch {
      return '-';
    }
  };

  const handleGoBack = () => {
    navigate('/employee');
  };

  const filteredAttendance = attendance.filter(record => {
    try {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === selectedMonth && 
             recordDate.getFullYear() === selectedYear;
    } catch (e) {
      return false;
    }
  });

  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const calculateStats = () => {
    const totalDays = filteredAttendance.length;
    const workedDays = filteredAttendance.filter(a => 
      a.status === 'ishlayapti' || a.status === 'chiqib ketdi'
    ).length;
    const breakDays = filteredAttendance.filter(a => a.status === 'tanaffus').length;
    
    return { totalDays, workedDays, breakDays };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        fontSize: '1.125rem',
        color: '#64748b'
      }}>
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <button 
            onClick={handleGoBack}
            style={{
              padding: '0.5rem 1rem',
              background: '#f8fafc',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            ← Orqaga
          </button>
          <h2 style={{ fontSize: '1.5rem', color: '#1e293b' }}>
            Davomat jadvali
          </h2>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Ish vaqti yozuvlari va davomat statistikasi
        </p>
      </div>

      {/* Current Session Info */}
      {currentSession && (
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          color: 'white',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎯 Bugungi ish kuni
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Kirish vaqti</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                {currentSession.checkIn || '00:00'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Chiqish vaqti</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                {currentSession.checkOut || 'Ishlamoqda...'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Holat</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                {getStatusText(currentSession.status)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Ish kuni</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                {currentSession.checkOut ? calculateWorkHours(currentSession.checkIn, currentSession.checkOut) : 'Ishlamoqda...'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{
        background: 'white',
        borderRadius: '0.75rem',
        padding: '1rem',
        marginBottom: '1.5rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
            Oyni tanlang:
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              background: 'white',
              color: '#1e293b',
              fontSize: '0.95rem',
              minWidth: '150px',
              cursor: 'pointer'
            }}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
            Yilni tanlang:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              background: 'white',
              color: '#1e293b',
              fontSize: '0.95rem',
              minWidth: '150px',
              cursor: 'pointer'
            }}
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={loadAttendance}
          style={{
            marginLeft: 'auto',
            padding: '0.5rem 1rem',
            background: '#f8fafc',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🔄 Yangilash
        </button>
      </div>

      {/* Stats Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2563eb', marginBottom: '0.5rem' }}>
            {stats.totalDays}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Ish kuni
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}>
            {stats.workedDays}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
            To'liq ishlagan kunlar
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b', marginBottom: '0.5rem' }}>
            {stats.breakDays}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Tanaffus kunlari
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div style={{
        background: 'white',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1rem 1.5rem',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontWeight: '600',
          color: '#1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Davomat jadvali</span>
          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>
            {filteredAttendance.length} ta yozuv
          </span>
        </div>

        {filteredAttendance.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
              Bu oy uchun davomat ma'lumotlari mavjud emas
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              Boshqa oy yoki yilni tanlang
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '600px'
            }}>
              <thead>
                <tr style={{
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#64748b',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>
                    Sana
                  </th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#64748b',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>
                    Kirish
                  </th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#64748b',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>
                    Chiqish
                  </th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#64748b',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>
                    Ish vaqti
                  </th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#64748b',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>
                    Holat
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record, index) => (
                  <tr 
                    key={index}
                    style={{
                      borderBottom: index < filteredAttendance.length - 1 ? '1px solid #e2e8f0' : 'none',
                      background: index % 2 === 0 ? 'white' : '#fafafa'
                    }}
                  >
                    <td style={{
                      padding: '1rem',
                      color: '#1e293b',
                      fontWeight: '500'
                    }}>
                      {formatDate(record.date)}
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#1e293b',
                      fontFamily: 'monospace',
                      fontWeight: '600'
                    }}>
                      {formatTime(record.checkIn)}
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#1e293b',
                      fontFamily: 'monospace',
                      fontWeight: '600'
                    }}>
                      {formatTime(record.checkOut)}
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#1e293b',
                      fontWeight: '500'
                    }}>
                      {calculateWorkHours(record.checkIn, record.checkOut)}
                    </td>
                    <td style={{
                      padding: '1rem'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        background: getStatusColor(record.status) + '20',
                        color: getStatusColor(record.status),
                        fontWeight: '500',
                        fontSize: '0.875rem'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: getStatusColor(record.status)
                        }}></div>
                        {getStatusText(record.status)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '1.125rem', color: '#1e293b', marginBottom: '1rem' }}>
          📋 Davomat tushuntirishi:
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#10b981'
              }}></div>
              <h4 style={{ color: '#1e293b' }}>Ishlayapti</h4>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Ish vaqtida bo'lgan holat. To'liq ish kuni hisoblanadi.
            </p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#f59e0b'
              }}></div>
              <h4 style={{ color: '#1e293b' }}>Tanaffus</h4>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Ovqatlanish yoki boshqa tanaffus vaqtidagi holat.
            </p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#ef4444'
              }}></div>
              <h4 style={{ color: '#1e293b' }}>Chiqib ketdi</h4>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Ishni tugatgan holat. Ish kuni yakunlangan deb hisoblanadi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;