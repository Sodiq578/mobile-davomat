import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaUserCheck,
  FaUserTimes,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaMapMarkerAlt,
  FaDownload,
  FaPrint,
  FaUserTie,
  FaIdCard,
  FaBuilding,
  FaClock
} from 'react-icons/fa';
import './Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    // Mock data
    const mockData = [
      {
        id: 1,
        name: 'Aliyev Aziz',
        position: 'Senior Dasturchi',
        department: 'IT Bo\'limi',
        email: 'aziz@company.com',
        phone: '+998 90 123 45 67',
        hireDate: '2022-03-15',
        status: 'active',
        avatarColor: '#3498db',
        attendance: 95,
        lastActivity: 'Bugun, 09:15'
      },
      {
        id: 2,
        name: 'Hasanova Malika',
        position: 'Moliya Menejeri',
        department: 'Moliya',
        email: 'malika@company.com',
        phone: '+998 91 234 56 78',
        hireDate: '2021-08-20',
        status: 'active',
        avatarColor: '#e74c3c',
        attendance: 98,
        lastActivity: 'Bugun, 08:45'
      },
      {
        id: 3,
        name: 'Olimov Sardor',
        position: 'Marketing Direktori',
        department: 'Marketing',
        email: 'sardor@company.com',
        phone: '+998 93 345 67 89',
        hireDate: '2020-11-10',
        status: 'on_leave',
        avatarColor: '#2ecc71',
        attendance: 88,
        lastActivity: '1 kun oldin'
      },
      {
        id: 4,
        name: 'Karimova Nigora',
        position: 'HR Menejeri',
        department: 'HR',
        email: 'nigora@company.com',
        phone: '+998 94 456 78 90',
        hireDate: '2023-01-05',
        status: 'active',
        avatarColor: '#9b59b6',
        attendance: 92,
        lastActivity: 'Bugun, 09:00'
      },
      {
        id: 5,
        name: 'Temirov Jasur',
        position: 'Ishlab Chiqarish Menejeri',
        department: 'Ishlab chiqarish',
        email: 'jasur@company.com',
        phone: '+998 95 567 89 01',
        hireDate: '2019-05-30',
        status: 'remote',
        avatarColor: '#f39c12',
        attendance: 85,
        lastActivity: '2 kun oldin'
      }
    ];
    
    setEmployees(mockData);
    setFilteredEmployees(mockData);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(value) ||
        emp.position.toLowerCase().includes(value) ||
        emp.department.toLowerCase().includes(value) ||
        emp.email.toLowerCase().includes(value)
      );
      setFilteredEmployees(filtered);
    }
  };

  const handleDelete = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setFilteredEmployees(prev => prev.filter(emp => emp.id !== id));
    setShowDeleteModal(false);
  };

  const handleAddEmployee = (newEmployee) => {
    const id = employees.length + 1;
    const employeeToAdd = {
      id,
      ...newEmployee,
      attendance: 100,
      lastActivity: 'Bugun, 09:00'
    };
    
    setEmployees(prev => [...prev, employeeToAdd]);
    setFilteredEmployees(prev => [...prev, employeeToAdd]);
    setShowAddModal(false);
  };

  return (
    <div className="employees-page">
      <div className="page-header">
        <div>
          <h1>Xodimlar</h1>
          <p>Jami {employees.length} ta xodim</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Yangi xodim
        </button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Xodim qidirish..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button className="btn btn-secondary">
          <FaFilter /> Filtrlash
        </button>
        <button className="btn btn-secondary">
          <FaDownload /> Export
        </button>
        <button className="btn btn-secondary">
          <FaPrint /> Chop etish
        </button>
      </div>

      <div className="employees-grid">
        {filteredEmployees.map(employee => (
          <div key={employee.id} className="employee-card">
            <div className="card-header">
              <div 
                className="employee-avatar"
                style={{ backgroundColor: employee.avatarColor }}
              >
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="employee-info">
                <h3>{employee.name}</h3>
                <p>{employee.position}</p>
                <span className={`status-badge ${employee.status}`}>
                  {employee.status === 'active' ? 'Faol' : 
                   employee.status === 'on_leave' ? 'Ta\'tilda' : 'Uzoq'}
                </span>
              </div>
            </div>

            <div className="card-body">
              <div className="info-row">
                <FaIdCard />
                <span>ID: {employee.id}</span>
              </div>
              <div className="info-row">
                <FaBuilding />
                <span>{employee.department}</span>
              </div>
              <div className="info-row">
                <FaEnvelope />
                <span>{employee.email}</span>
              </div>
              <div className="info-row">
                <FaPhone />
                <span>{employee.phone}</span>
              </div>
              <div className="info-row">
                <FaCalendar />
                <span>{employee.hireDate}</span>
              </div>
            </div>

            <div className="card-footer">
              <div className="attendance-stat">
                <div className="stat-label">Davomat</div>
                <div className="stat-value">{employee.attendance}%</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${employee.attendance}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="action-buttons">
                <button 
                  className="action-btn view"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <FaEye />
                </button>
                <button className="action-btn edit">
                  <FaEdit />
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setShowDeleteModal(true);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEmployee}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEmployee && (
        <DeleteConfirmationModal
          employee={selectedEmployee}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedEmployee(null);
          }}
          onConfirm={() => handleDelete(selectedEmployee.id)}
        />
      )}
    </div>
  );
};

// Add Employee Modal Component
const AddEmployeeModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Yangi Xodim Qo'shish</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Ism Familiya</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Aliyev Aziz"
              />
            </div>
            <div className="form-group">
              <label>Lavozim</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="Senior Dasturchi"
              />
            </div>
            <div className="form-group">
              <label>Bo'lim</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                placeholder="IT Bo'limi"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="aziz@company.com"
              />
            </div>
            <div className="form-group">
              <label>Telefon</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+998 90 123 45 67"
              />
            </div>
            <div className="form-group">
              <label>Holati</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="active">Faol</option>
                <option value="on_leave">Ta'tilda</option>
                <option value="remote">Uzoq ish</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Bekor qilish
            </button>
            <button type="submit" className="btn btn-primary">
              <FaPlus /> Qo'shish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ employee, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal delete-modal">
        <div className="modal-header">
          <h3>Xodimni O'chirish</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="warning-message">
            <FaTrash className="warning-icon" />
            <p>
              <strong>{employee.name}</strong> ismli xodimni rostdan ham o'chirishni xohlaysizmi?
            </p>
            <p className="warning-text">
              Bu amalni bekor qilib bo'lmaydi.
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Bekor qilish
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            <FaTrash /> O'chirish
          </button>
        </div>
      </div>
    </div>
  );
};

export default Employees;