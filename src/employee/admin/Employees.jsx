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
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Departments list
  const departments = [
    'Barchasi',
    'IT Bo\'limi',
    'Moliya',
    'Marketing',
    'HR',
    'Ishlab chiqarish',
    'Logistika',
    'Sotuv'
  ];

  // Status options
  const statusOptions = [
    { value: 'all', label: 'Barchasi', color: '#6c757d' },
    { value: 'active', label: 'Faol', color: '#28a745' },
    { value: 'inactive', label: 'Faol emas', color: '#dc3545' },
    { value: 'on_leave', label: 'Ta\'tilda', color: '#ffc107' },
    { value: 'remote', label: 'Uzoq ish', color: '#17a2b8' }
  ];

  // Initial employees data
const initialEmployees = [
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
    lastActivity: 'Bugun, 09:15',
    location: 'Toshkent, Yunusobod'
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
    lastActivity: 'Bugun, 08:45',
    location: 'Toshkent, Chilonzor'
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
    lastActivity: '1 kun oldin',
    location: 'Toshkent, Mirzo Ulug\'bek'
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
    lastActivity: 'Bugun, 09:00',
    location: 'Toshkent, Yakkasaroy'
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
    lastActivity: '2 kun oldin',
    location: 'Samarqand'
  },
  {
    id: 6,
    name: 'Shukurova Dinara',
    position: 'Sotuv Menejeri',
    department: 'Sotuv',
    email: 'dinara@company.com',
    phone: '+998 97 678 90 12',
    hireDate: '2022-09-12',
    status: 'active',
    avatarColor: '#1abc9c',
    attendance: 96,
    lastActivity: 'Bugun, 08:30',
    location: 'Toshkent, Shayxontohur'
  },
  {
    id: 7,
    name: 'Rahimov Bahodir',
    position: 'Logistika Menejeri',
    department: 'Logistika',
    email: 'bahodir@company.com',
    phone: '+998 98 789 01 23',
    hireDate: '2021-12-01',
    status: 'inactive',
    avatarColor: '#34495e',
    attendance: 75,
    lastActivity: '1 hafta oldin',
    location: 'Toshkent, Olmazor'
  },
  {
    id: 8,
    name: 'Yusupova Madina',
    position: 'IT Menejeri',
    department: 'IT Bo\'limi',
    email: 'madina@company.com',
    phone: '+998 99 890 12 34',
    hireDate: '2023-03-20',
    status: 'active',
    avatarColor: '#e67e22',
    attendance: 99,
    lastActivity: 'Bugun, 08:45',
    location: 'Toshkent, Uchtepa'
  },
  {
    id: 9,
    name: 'Qodirov Jamshid',
    position: 'Moliya Mutaxassisi',
    department: 'Moliya',
    email: 'jamshid@company.com',
    phone: '+998 90 901 23 45',
    hireDate: '2022-07-10',
    status: 'active',
    avatarColor: '#16a085',
    attendance: 94,
    lastActivity: 'Bugun, 09:05',
    location: 'Toshkent, Yangihayot'
  },
  {
    id: 10,
    name: 'G\'aniyeva Shahnoza',
    position: 'Marketing Mutaxassisi',
    department: 'Marketing',
    email: 'shahnoza@company.com',
    phone: '+998 91 012 34 56',
    hireDate: '2023-05-15',
    status: 'remote',
    avatarColor: '#8e44ad',
    attendance: 87,
    lastActivity: '3 kun oldin',
    location: 'Buxoro'
  },

  // Qo‘shimcha xodimlar
  {
    id: 11,
    name: 'Abdullayev Bekzod',
    position: 'Frontend Dasturchi',
    department: 'IT Bo\'limi',
    email: 'bekzod@company.com',
    phone: '+998 93 111 22 33',
    hireDate: '2022-02-18',
    status: 'active',
    avatarColor: '#2980b9',
    attendance: 93,
    lastActivity: 'Bugun, 09:10',
    location: 'Toshkent, Sergeli'
  },
  {
    id: 12,
    name: 'To\'xtayeva Mohira',
    position: 'UX/UI Dizayner',
    department: 'IT Bo\'limi',
    email: 'mohira@company.com',
    phone: '+998 94 222 33 44',
    hireDate: '2021-06-01',
    status: 'active',
    avatarColor: '#c0392b',
    attendance: 97,
    lastActivity: 'Bugun, 08:40',
    location: 'Toshkent, Yashnobod'
  },
  {
    id: 13,
    name: 'Ismoilov Akmal',
    position: 'Backend Dasturchi',
    department: 'IT Bo\'limi',
    email: 'akmal@company.com',
    phone: '+998 95 333 44 55',
    hireDate: '2020-04-12',
    status: 'active',
    avatarColor: '#27ae60',
    attendance: 91,
    lastActivity: 'Bugun, 09:00',
    location: 'Toshkent, Bektemir'
  },
  {
    id: 14,
    name: 'Saidova Gulnoza',
    position: 'Buxgalter',
    department: 'Moliya',
    email: 'gulnoza@company.com',
    phone: '+998 97 444 55 66',
    hireDate: '2019-09-09',
    status: 'active',
    avatarColor: '#d35400',
    attendance: 96,
    lastActivity: 'Bugun, 08:50',
    location: 'Toshkent, Shayxontohur'
  },
  {
    id: 15,
    name: 'Nurmatov Dilshod',
    position: 'Ombor Nazoratchisi',
    department: 'Logistika',
    email: 'dilshod@company.com',
    phone: '+998 98 555 66 77',
    hireDate: '2021-01-25',
    status: 'inactive',
    avatarColor: '#7f8c8d',
    attendance: 70,
    lastActivity: '2 hafta oldin',
    location: 'Andijon'
  }
];


  useEffect(() => {
    // Load initial data
    setEmployees(initialEmployees);
    setFilteredEmployees(initialEmployees);
  }, []);

  // Filter and search employees
  useEffect(() => {
    let result = [...employees];

    // Search filter
    if (searchTerm) {
      result = result.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone.includes(searchTerm)
      );
    }

    // Department filter
    if (selectedDepartment !== 'all') {
      result = result.filter(emp => emp.department === selectedDepartment);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(emp => emp.status === selectedStatus);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.hireDate) - new Date(a.hireDate);
        case 'attendance':
          return b.attendance - a.attendance;
        default:
          return 0;
      }
    });

    setFilteredEmployees(result);
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedStatus, sortBy, employees]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  // Add new employee
  const handleAddEmployee = (newEmployee) => {
    const employeeToAdd = {
      id: employees.length + 1,
      ...newEmployee,
      avatarColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      attendance: 100,
      lastActivity: 'Bugun, 09:00'
    };
    
    setEmployees([...employees, employeeToAdd]);
    setShowAddModal(false);
  };

  // Delete employee
  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    const statusInfo = statusOptions.find(opt => opt.value === status);
    return {
      ...statusInfo,
      icon: status === 'active' ? <FaUserCheck /> : 
            status === 'inactive' ? <FaUserTimes /> :
            status === 'on_leave' ? <FaCalendar /> : <FaMapMarkerAlt />
    };
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('uz-UZ', options);
  };

  return (
    <div className="employees-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Xodimlar Boshqaruvi</h1>
          <p className="page-subtitle">Jami {employees.length} ta xodim, {employees.filter(e => e.status === 'active').length} ta faol</p>
        </div>
        <div className="header-right">
          <button className="btn btn-secondary">
            <FaPrint /> Chop etish
          </button>
          <button className="btn btn-secondary">
            <FaDownload /> Export
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus /> Yangi xodim
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaUserTie />
          </div>
          <div className="stat-info">
            <h3>{employees.length}</h3>
            <p>Jami Xodimlar</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">
            <FaUserCheck />
          </div>
          <div className="stat-info">
            <h3>{employees.filter(e => e.status === 'active').length}</h3>
            <p>Faol Xodimlar</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon attendance">
            <FaClock />
          </div>
          <div className="stat-info">
            <h3>96%</h3>
            <p>O'rtacha Davomat</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon departments">
            <FaBuilding />
          </div>
          <div className="stat-info">
            <h3>{new Set(employees.map(e => e.department)).size}</h3>
            <p>Bo'limlar</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Xodim qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="filter-select"
            >
              {departments.map(dept => (
                <option key={dept} value={dept === 'Barchasi' ? 'all' : dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Ism bo'yicha</option>
              <option value="date">Sana bo'yicha</option>
              <option value="attendance">Davomat bo'yicha</option>
            </select>
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

      {/* Employees Display */}
      <div className="employees-display">
        {viewMode === 'grid' ? (
          <div className="employees-grid">
            {currentEmployees.map(employee => {
              const statusInfo = getStatusInfo(employee.status);
              return (
                <div key={employee.id} className="employee-card">
                  <div className="card-header">
                    <div 
                      className="employee-avatar"
                      style={{ backgroundColor: employee.avatarColor }}
                    >
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="employee-basic">
                      <h3 className="employee-name">{employee.name}</h3>
                      <p className="employee-position">{employee.position}</p>
                      <span className={`employee-status ${employee.status}`}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="employee-info">
                      <div className="info-item">
                        <FaIdCard className="info-icon" />
                        <span>ID: {employee.id.toString().padStart(4, '0')}</span>
                      </div>
                      <div className="info-item">
                        <FaBuilding className="info-icon" />
                        <span>{employee.department}</span>
                      </div>
                      <div className="info-item">
                        <FaEnvelope className="info-icon" />
                        <span>{employee.email}</span>
                      </div>
                      <div className="info-item">
                        <FaPhone className="info-icon" />
                        <span>{employee.phone}</span>
                      </div>
                      <div className="info-item">
                        <FaCalendar className="info-icon" />
                        <span>{formatDate(employee.hireDate)}</span>
                      </div>
                      <div className="info-item">
                        <FaMapMarkerAlt className="info-icon" />
                        <span>{employee.location}</span>
                      </div>
                    </div>

                    <div className="employee-stats">
                      <div className="stat-item">
                        <div className="stat-label">Davomat</div>
                        <div className="stat-value">{employee.attendance}%</div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${employee.attendance}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-label">Oxirgi faollik</div>
                        <div className="stat-value">{employee.lastActivity}</div>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <FaEye /> Ko'rish
                    </button>
                    <button className="action-btn edit-btn">
                      <FaEdit /> Tahrirlash
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash /> O'chirish
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="employees-table">
            <table>
              <thead>
                <tr>
                  <th>Xodim</th>
                  <th>Lavozim</th>
                  <th>Bo'lim</th>
                  <th>Telefon</th>
                  <th>Status</th>
                  <th>Davomat</th>
                  <th>Harakatlar</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map(employee => {
                  const statusInfo = getStatusInfo(employee.status);
                  return (
                    <tr key={employee.id}>
                      <td>
                        <div className="table-employee">
                          <div 
                            className="table-avatar"
                            style={{ backgroundColor: employee.avatarColor }}
                          >
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="table-name">{employee.name}</div>
                            <div className="table-email">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{employee.position}</td>
                      <td>{employee.department}</td>
                      <td>{employee.phone}</td>
                      <td>
                        <span 
                          className="table-status"
                          style={{ color: statusInfo.color, borderColor: statusInfo.color }}
                        >
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <div className="table-attendance">
                          <span>{employee.attendance}%</span>
                          <div className="table-progress">
                            <div 
                              className="table-progress-fill"
                              style={{ width: `${employee.attendance}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="table-action-btn view">
                            <FaEye />
                          </button>
                          <button className="table-action-btn edit">
                            <FaEdit />
                          </button>
                          <button 
                            className="table-action-btn delete"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowDeleteModal(true);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Oldingi
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Keyingi
            </button>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEmployee}
          departments={departments.filter(d => d !== 'Barchasi')}
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
          onConfirm={() => handleDeleteEmployee(selectedEmployee.id)}
        />
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && !showDeleteModal && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          getStatusInfo={getStatusInfo}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

// Add Employee Modal Component
const AddEmployeeModal = ({ onClose, onAdd, departments }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: departments[0],
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
      <div className="modal-content">
        <div className="modal-header">
          <h2>Yangi Xodim Qo'shish</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>To'liq Ism *</label>
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
                <label>Lavozim *</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  placeholder="Senior Dasturchi"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bo'lim *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Faol</option>
                  <option value="inactive">Faol emas</option>
                  <option value="on_leave">Ta'tilda</option>
                  <option value="remote">Uzoq ish</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
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
                <label>Telefon *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+998 90 123 45 67"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Ishga qabul qilingan sana</label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Bekor qilish
            </button>
            <button type="submit" className="btn btn-primary">
              <FaPlus /> Xodim Qo'shish
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
      <div className="modal-content delete-modal">
        <div className="modal-header">
          <h2>Xodimni O'chirish</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="delete-warning">
            <FaTrash className="warning-icon" />
            <h3>Diqqat!</h3>
            <p>
              <strong>{employee.name}</strong> ismli xodimni rostdan ham o'chirishni xohlaysizmi?
            </p>
            <p className="warning-text">
              Bu amalni bekor qilib bo'lmaydi. Xodimning barcha ma'lumotlari o'chiriladi.
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

// Employee Detail Modal
const EmployeeDetailModal = ({ employee, onClose, getStatusInfo, formatDate }) => {
  const statusInfo = getStatusInfo(employee.status);

  return (
    <div className="modal-overlay">
      <div className="modal-content detail-modal">
        <div className="modal-header">
          <h2>Xodim Tafsilotlari</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="detail-header">
            <div 
              className="detail-avatar"
              style={{ backgroundColor: employee.avatarColor }}
            >
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="detail-info">
              <h3>{employee.name}</h3>
              <p className="detail-position">{employee.position}</p>
              <span className={`detail-status ${employee.status}`}>
                {statusInfo.icon} {statusInfo.label}
              </span>
            </div>
          </div>

          <div className="detail-content">
            <div className="detail-section">
              <h4>Asosiy Ma'lumotlar</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">{employee.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{employee.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Telefon:</span>
                  <span className="detail-value">{employee.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Bo'lim:</span>
                  <span className="detail-value">{employee.department}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ishga kirgan sana:</span>
                  <span className="detail-value">{formatDate(employee.hireDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Joylashuv:</span>
                  <span className="detail-value">{employee.location}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Ish Faoliyati</h4>
              <div className="performance-stats">
                <div className="performance-item">
                  <div className="performance-label">Davomat</div>
                  <div className="performance-value">{employee.attendance}%</div>
                  <div className="performance-progress">
                    <div 
                      className="progress-fill"
                      style={{ width: `${employee.attendance}%` }}
                    ></div>
                  </div>
                </div>
                <div className="performance-item">
                  <div className="performance-label">Ish tajribasi</div>
                  <div className="performance-value">
                    {Math.floor((new Date() - new Date(employee.hireDate)) / (1000 * 60 * 60 * 24 * 30))} oy
                  </div>
                </div>
                <div className="performance-item">
                  <div className="performance-label">Oxirgi faollik</div>
                  <div className="performance-value">{employee.lastActivity}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={() => {/* Edit functionality */}}>
            <FaEdit /> Tahrirlash
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};

export default Employees;