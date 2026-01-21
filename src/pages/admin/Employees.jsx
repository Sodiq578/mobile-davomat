// src/pages/admin/Employees.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  FaUserFriends, FaPlus, FaEye, FaEdit, FaTrash,
  FaSearch, FaFilter, FaEnvelope, FaPhone, FaMoneyBillWave,
  FaChartLine, FaBuilding, FaTimes
} from 'react-icons/fa';
import data from '../../data'; // ./data.js dan import
import './Employees.css';

const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatSalary = (salary) => {
  if (!salary) return '—';
  const num = parseInt(salary, 10);
  return isNaN(num) ? salary : num.toLocaleString('uz-UZ') + ' so‘m';
};

const Employees = () => {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('hr_employees');
    return saved ? JSON.parse(saved) : [...data.employees];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' yoki 'list'
  const [showAddModal, setShowAddModal] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    department: data.departments[0] || '',
    email: '',
    phone: '',
    salary: '',
    attendance: 92,
    status: 'active'
  });

  useEffect(() => {
    localStorage.setItem('hr_employees', JSON.stringify(employees));
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;

    const term = searchTerm.toLowerCase();
    return employees.filter(emp =>
      emp.name?.toLowerCase().includes(term) ||
      emp.position?.toLowerCase().includes(term) ||
      emp.department?.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.phone?.includes(term)
    );
  }, [employees, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployee.name.trim() || !newEmployee.position.trim()) {
      alert("Ism va lavozim maydonlari majburiy!");
      return;
    }

    const colors = [
      '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12',
      '#1abc9c', '#34495e', '#d35400', '#27ae60', '#8e44ad'
    ];

    const newEmp = {
      id: employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1,
      ...newEmployee,
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
      lastActivity: 'Yangi qo‘shildi',
    };

    setEmployees(prev => [...prev, newEmp]);
    setShowAddModal(false);
    setNewEmployee({
      name: '', position: '', department: data.departments[0] || '',
      email: '', phone: '', salary: '', attendance: 92, status: 'active'
    });
  };

  return (
    <div className="employees-page">

      {/* Sarlavha qismi */}
      <div className="page-header">
        <div className="header-content">
          <h1><FaUserFriends /> Xodimlar</h1>
          <p>Jami {employees.length} nafar xodim</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Yangi xodim
        </button>
      </div>

      {/* Qidiruv va ko'rinish tanlash */}
      <div className="search-section">
        <div className="search-header">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Xodim ismi, lavozimi, bo'limi bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Xodimlar ro'yxati */}
      {filteredEmployees.length === 0 ? (
        <div className="no-results">
          <FaSearch size={48} />
          <h3>Hech narsa topilmadi</h3>
          <p>Qidiruv so'roviga mos xodim yo'q</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="employees-grid">
          {filteredEmployees.map(emp => (
            <div key={emp.id} className="employee-card">
              <div className="card-header">
                <div
                  className="employee-avatar"
                  style={{ backgroundColor: emp.avatarColor || '#3498db' }}
                >
                  {getInitials(emp.name)}
                </div>

                <div className="employee-info">
                  <h3>{emp.name}</h3>
                  <p className="position">{emp.position}</p>
                  <p className="department">{emp.department}</p>
                  <span className={`status-badge ${emp.status || 'active'}`}>
                    {emp.status === 'active' ? 'Faol' :
                     emp.status === 'remote' ? 'Uzoqdan ishlaydi' : 'Nomaʼlum'}
                  </span>
                </div>
              </div>

              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <FaEnvelope className="icon" />
                    <div>
                      <span className="info-label">Email</span>
                      <span className="info-value">{emp.email || '—'}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaPhone className="icon" />
                    <div>
                      <span className="info-label">Telefon</span>
                      <span className="info-value">{emp.phone || '—'}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaMoneyBillWave className="icon" />
                    <div>
                      <span className="info-label">Maosh</span>
                      <span className="info-value">{formatSalary(emp.salary)}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaChartLine className="icon" />
                    <div>
                      <span className="info-label">Davomat</span>
                      <span className="info-value">{emp.attendance || 0}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="attendance-stat">
                  Oxirgi faollik: <strong>{emp.lastActivity || '—'}</strong>
                </div>

                <div className="action-buttons">
                  <button className="action-btn view" title="Batafsil ko'rish">
                    <FaEye />
                  </button>
                  <button className="action-btn edit" title="Tahrirlash">
                    <FaEdit />
                  </button>
                  <button className="action-btn delete" title="O'chirish">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="employees-list">
          <div className="list-header">
            <div className="list-row header-row">
              <div>Xodim</div>
              <div>Lavozim</div>
              <div>Bo'lim</div>
              <div>Davomat</div>
              <div>Maosh</div>
              <div>Harakatlar</div>
            </div>
          </div>

          {filteredEmployees.map(emp => (
            <div key={emp.id} className="list-row">
              <div className="employee-cell">
                <div className="employee-list-info">
                  <div
                    className="list-avatar"
                    style={{ backgroundColor: emp.avatarColor || '#3498db' }}
                  >
                    {getInitials(emp.name)}
                  </div>
                  <div>
                    <div className="list-name">{emp.name}</div>
                    <div className="list-email">{emp.email || '—'}</div>
                  </div>
                </div>
              </div>
              <div>{emp.position}</div>
              <div>{emp.department}</div>
              <div>{emp.attendance || 0}%</div>
              <div>{formatSalary(emp.salary)}</div>
              <div className="list-actions">
                <button className="action-btn view"><FaEye /></button>
                <button className="action-btn edit"><FaEdit /></button>
                <button className="action-btn delete"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Qo'shish modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3><FaPlus /> Yangi xodim qo'shish</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleAddEmployee}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Ism familiya *</label>
                    <input
                      required
                      name="name"
                      value={newEmployee.name}
                      onChange={handleInputChange}
                      placeholder="Aliyev Aziz"
                    />
                  </div>

                  <div className="form-group">
                    <label>Lavozim *</label>
                    <input
                      required
                      name="position"
                      value={newEmployee.position}
                      onChange={handleInputChange}
                      placeholder="Senior Developer"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bo'lim</label>
                    <select name="department" value={newEmployee.department} onChange={handleInputChange}>
                      {data.departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={newEmployee.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={newEmployee.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Maosh (so'm)</label>
                    <input
                      type="number"
                      name="salary"
                      value={newEmployee.salary}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Davomat (%)</label>
                    <input
                      type="number"
                      name="attendance"
                      min="0"
                      max="100"
                      value={newEmployee.attendance}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Bekor qilish
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Qo'shish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;