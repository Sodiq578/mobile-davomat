import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaDownload,
  FaPrint,
  FaIdCard,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaUserFriends,
  FaChartLine,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTimes,
  FaTimesCircle,
  FaSave,
  FaFileExport,
  FaFileImport,
  FaSync,
  FaCamera,
  FaImage,
  FaPassport,
  FaIdBadge,
  FaBirthdayCake,
  FaVenusMars,
  FaMapMarkerAlt,
  FaUniversity,
  FaGraduationCap,
  FaBriefcase,
  FaUserCheck,
  FaUserClock,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaChartBar,
  FaArrowUp,
  FaArrowDown,
  FaStar
} from 'react-icons/fa';
import './Employees.css';

// Boshlang'ich ma'lumotlar
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
    salary: '15000000',
    image: null,
    passport: {
      series: 'AA',
      number: '1234567',
      givenDate: '2015-06-20',
      givenBy: 'Toshkent shahar YUNUSOBOD tumani'
    },
    personal: {
      birthDate: '1990-05-15',
      gender: 'male',
      address: 'Toshkent shahar, Yunusobod tumani'
    },
    education: 'Toshkent Axborot Texnologiyalari Universiteti',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB']
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
    salary: '18000000',
    image: null,
    passport: {
      series: 'AB',
      number: '2345678',
      givenDate: '2016-07-25',
      givenBy: 'Toshkent shahar CHILONZOR tumani'
    },
    personal: {
      birthDate: '1988-11-20',
      gender: 'female',
      address: 'Toshkent shahar, Chilonzor tumani'
    },
    education: 'Toshkent Moliya Instituti',
    skills: ['Finance', 'Accounting', 'Taxation', 'Audit']
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
    salary: '20000000',
    image: null,
    passport: {
      series: 'AC',
      number: '3456789',
      givenDate: '2017-03-15',
      givenBy: 'Samarqand viloyati'
    },
    personal: {
      birthDate: '1985-02-28',
      gender: 'male',
      address: 'Samarqand shahri'
    },
    education: 'Marketing Universiteti',
    skills: ['Digital Marketing', 'SEO', 'Social Media', 'Content Strategy']
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
    salary: '12000000',
    image: null,
    passport: {
      series: 'AD',
      number: '4567890',
      givenDate: '2018-09-10',
      givenBy: 'Toshkent shahar MIRZO-ULUGBEK tumani'
    },
    personal: {
      birthDate: '1992-07-12',
      gender: 'female',
      address: 'Toshkent shahar, Mirzo-Ulug\'bek tumani'
    },
    education: 'Toshkent Davlat Universiteti',
    skills: ['Recruitment', 'Training', 'Employee Relations', 'HR Management']
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
    salary: '16000000',
    image: null,
    passport: {
      series: 'AE',
      number: '5678901',
      givenDate: '2019-01-30',
      givenBy: 'Farg\'ona viloyati'
    },
    personal: {
      birthDate: '1987-09-05',
      gender: 'male',
      address: 'Farg\'ona shahri'
    },
    education: 'Toshkent Texnika Universiteti',
    skills: ['Production', 'Quality Control', 'Supply Chain', 'Process Improvement']
  }
];

// Helper funksiyalar
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getStatusText = (status) => {
  switch(status) {
    case 'active': return 'Faol';
    case 'on_leave': return 'Ta\'tilda';
    case 'remote': return 'Uzoq ish';
    default: return status;
  }
};

const formatSalary = (salary) => {
  if (!salary) return 'Noma\'lum';
  const num = parseInt(salary);
  if (isNaN(num)) return salary;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' so\'m';
};

const calculateAge = (birthDate) => {
  if (!birthDate) return 'Noma\'lum';
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age + ' yosh';
};

const getGenderText = (gender) => {
  switch(gender) {
    case 'male': return 'Erkak';
    case 'female': return 'Ayol';
    default: return gender;
  }
};

// FaFilterCircleXmark o'rniga FaTimesCircle ishlatamiz
const FaFilterCircleXmark = FaTimesCircle;

// Xodim kartasi komponenti
const EmployeeCard = React.memo(({ employee, onView, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="employee-card" style={{ '--card-color': employee.avatarColor }}>
      <div className="card-header">
        <div className="avatar-container">
          {employee.image && !imageError ? (
            <img 
              src={employee.image} 
              alt={employee.name}
              className="employee-avatar"
              onError={() => setImageError(true)}
            />
          ) : (
            <div 
              className="employee-avatar"
              style={{ backgroundColor: employee.avatarColor }}
            >
              {getInitials(employee.name)}
            </div>
          )}
          <div className="avatar-overlay">
            <FaCamera />
          </div>
        </div>
        <div className="employee-info">
          <h3>{employee.name}</h3>
          <p className="position">{employee.position}</p>
          <p className="department">{employee.department}</p>
          <span className={`status-badge ${employee.status}`}>
            {getStatusText(employee.status)}
            {employee.status === 'active' && <span className="status-dot"></span>}
          </span>
        </div>
      </div>

      <div className="card-body">
        <div className="info-grid">
          <div className="info-item">
            <FaIdCard className="icon" />
            <div className="info-content">
              <span className="info-label">ID</span>
              <span className="info-value">EMP-{employee.id.toString().padStart(3, '0')}</span>
            </div>
          </div>
          <div className="info-item">
            <FaBuilding className="icon" />
            <div className="info-content">
              <span className="info-label">Bo'lim</span>
              <span className="info-value">{employee.department}</span>
            </div>
          </div>
          <div className="info-item">
            <FaPhone className="icon" />
            <div className="info-content">
              <span className="info-label">Telefon</span>
              <span className="info-value">{employee.phone}</span>
            </div>
          </div>
          <div className="info-item">
            <FaMoneyBillWave className="icon" />
            <div className="info-content">
              <span className="info-label">Maosh</span>
              <span className="info-value">{formatSalary(employee.salary)}</span>
            </div>
          </div>
        </div>
        
        <div className="skills-section">
          <div className="skills-label">
            <FaStar className="icon" /> Ko'nikmalar
          </div>
          <div className="skills-list">
            {employee.skills?.slice(0, 3).map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
            {employee.skills?.length > 3 && (
              <span className="skill-tag more">+{employee.skills.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="attendance-stat">
          <div className="stat-row">
            <span className="stat-label">
              <FaUserCheck /> Davomat
            </span>
            <span className="stat-value">{employee.attendance}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${employee.attendance}%` }}
            ></div>
            <span className="progress-text">{employee.attendance}%</span>
          </div>
          <div className="last-activity">
            <FaClock className="icon" />
            <span>{employee.lastActivity}</span>
          </div>
        </div>
        
        <div className="action-buttons">
          <button 
            className="action-btn view"
            onClick={() => onView(employee)}
            title="Ko'rish"
          >
            <FaEye />
            <span className="tooltip">Ko'rish</span>
          </button>
          <button 
            className="action-btn edit"
            onClick={() => onEdit(employee)}
            title="Tahrirlash"
          >
            <FaEdit />
            <span className="tooltip">Tahrirlash</span>
          </button>
          <button 
            className="action-btn delete"
            onClick={() => onDelete(employee)}
            title="O'chirish"
          >
            <FaTrash />
            <span className="tooltip">O'chirish</span>
          </button>
        </div>
      </div>
    </div>
  );
});

// Qidiruv komponenti
const SearchBar = React.memo(({ value, onChange, placeholder }) => {
  return (
    <div className="search-box">
      <FaSearch className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {value && (
        <button 
          className="clear-search" 
          onClick={() => onChange('')}
          title="Tozalash"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
});

// Rasm yuklash komponenti
const ImageUpload = ({ image, onChange, onRemove }) => {
  const [preview, setPreview] = useState(image);

  useEffect(() => {
    if (typeof image === 'string') {
      setPreview(image);
    }
  }, [image]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreview(base64String);
        onChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
  };

  return (
    <div className="image-upload-container">
      <div className="image-preview">
        {preview ? (
          <div className="image-wrapper">
            <img src={preview} alt="Preview" className="uploaded-image" />
            <button 
              type="button" 
              className="remove-image-btn"
              onClick={handleRemove}
              title="Rasmni o'chirish"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <div className="image-placeholder">
            <FaCamera size={40} />
            <span>Rasm yuklang</span>
          </div>
        )}
      </div>
      <label className="upload-btn">
        <FaImage /> Rasm tanlash
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>
      <p className="upload-hint">JPG, PNG yoki GIF. Maksimal 5MB</p>
    </div>
  );
};

// Xodim qo'shish modal oynasi
const AddEmployeeModal = ({ onClose, onAdd, departments }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: departments[0] || '',
    email: '',
    phone: '',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'active',
    salary: '',
    image: null,
    passport: {
      series: '',
      number: '',
      givenDate: '',
      givenBy: ''
    },
    personal: {
      birthDate: '',
      gender: 'male',
      address: ''
    },
    education: '',
    skills: []
  });

  const [errors, setErrors] = useState({});
  const [currentSkill, setCurrentSkill] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Ism familiya kiritilishi shart';
    if (!formData.position.trim()) newErrors.position = 'Lavozim kiritilishi shart';
    if (!formData.email.trim()) newErrors.email = 'Email kiritilishi shart';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Noto\'g\'ri email format';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon kiritilishi shart';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAdd(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Xatoni tozalash
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (image) => {
    setFormData(prev => ({ ...prev, image }));
  };

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, image: null }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>
            <FaPlus /> Yangi Xodim Qo'shish
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-section">
              <h4><FaUserFriends /> Asosiy ma'lumotlar</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Ism Familiya *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Aliyev Aziz"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <label>Lavozim *</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Senior Dasturchi"
                    className={errors.position ? 'error' : ''}
                  />
                  {errors.position && <span className="error-message">{errors.position}</span>}
                </div>
                
                <div className="form-group">
                  <label>Bo'lim *</label>
                  <select 
                    name="department" 
                    value={formData.department}
                    onChange={handleChange}
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="aziz@company.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label>Telefon *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+998 90 123 45 67"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                
                <div className="form-group">
                  <label>Ishga kirgan sana *</label>
                  <input
                    type="date"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Holati *</label>
                  <select 
                    name="status" 
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Faol</option>
                    <option value="on_leave">Ta'tilda</option>
                    <option value="remote">Uzoq ish</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Oylik maosh (so'm)</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="5000000"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><FaCamera /> Rasm</h4>
              <div className="form-grid">
                <div className="form-group full-width">
                  <ImageUpload 
                    image={formData.image}
                    onChange={handleImageChange}
                    onRemove={handleImageRemove}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><FaPassport /> Pasport ma'lumotlari (ixtiyoriy)</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Seriya</label>
                  <input
                    type="text"
                    name="passport.series"
                    value={formData.passport.series}
                    onChange={handleChange}
                    placeholder="AA"
                    maxLength="2"
                  />
                </div>
                
                <div className="form-group">
                  <label>Raqami</label>
                  <input
                    type="text"
                    name="passport.number"
                    value={formData.passport.number}
                    onChange={handleChange}
                    placeholder="1234567"
                    maxLength="7"
                  />
                </div>
                
                <div className="form-group">
                  <label>Berilgan sana</label>
                  <input
                    type="date"
                    name="passport.givenDate"
                    value={formData.passport.givenDate}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Kim tomonidan berilgan</label>
                  <input
                    type="text"
                    name="passport.givenBy"
                    value={formData.passport.givenBy}
                    onChange={handleChange}
                    placeholder="Toshkent shahar YUNUSOBOD tumani"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><FaIdBadge /> Shaxsiy ma'lumotlar (ixtiyoriy)</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label><FaBirthdayCake /> Tug'ilgan sana</label>
                  <input
                    type="date"
                    name="personal.birthDate"
                    value={formData.personal.birthDate}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label><FaVenusMars /> Jinsi</label>
                  <select 
                    name="personal.gender"
                    value={formData.personal.gender}
                    onChange={handleChange}
                  >
                    <option value="male">Erkak</option>
                    <option value="female">Ayol</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label><FaMapMarkerAlt /> Manzil</label>
                  <textarea
                    name="personal.address"
                    value={formData.personal.address}
                    onChange={handleChange}
                    placeholder="Toshkent shahar, Yunusobod tumani..."
                    rows="2"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label><FaGraduationCap /> Ta'lim</label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="Toshkent Davlat Universiteti"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><FaBriefcase /> Ko'nikmalar</h4>
              <div className="skills-input">
                <div className="skills-input-group">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ko'nikma qo'shing..."
                  />
                  <button type="button" className="btn btn-primary" onClick={addSkill}>
                    <FaPlus /> Qo'shish
                  </button>
                </div>
                <div className="skills-list">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              <FaTimes /> Bekor qilish
            </button>
            <button type="submit" className="btn btn-primary">
              <FaPlus /> Xodimni qo'shish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Xodimni tahrirlash modal oynasi
const EditEmployeeModal = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState(employee);
  const [currentSkill, setCurrentSkill] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (image) => {
    setFormData(prev => ({ ...prev, image }));
  };

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, image: null }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills?.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>
            <FaEdit /> Xodimni Tahrirlash
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-section">
              <h4><FaUserFriends /> Asosiy ma'lumotlar</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Ism Familiya *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
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
                  />
                </div>
                
                <div className="form-group">
                  <label>Bo'lim *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
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
                  />
                </div>
                
                <div className="form-group">
                  <label>Ishga kirgan sana *</label>
                  <input
                    type="date"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Holati *</label>
                  <select 
                    name="status" 
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="active">Faol</option>
                    <option value="on_leave">Ta'tilda</option>
                    <option value="remote">Uzoq ish</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Davomat %</label>
                  <input
                    type="number"
                    name="attendance"
                    value={formData.attendance}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                
                <div className="form-group">
                  <label>Oylik maosh (so'm)</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><FaCamera /> Rasm</h4>
              <div className="form-grid">
                <div className="form-group full-width">
                  <ImageUpload 
                    image={formData.image}
                    onChange={handleImageChange}
                    onRemove={handleImageRemove}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><FaBriefcase /> Ko'nikmalar</h4>
              <div className="skills-input">
                <div className="skills-input-group">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ko'nikma qo'shing..."
                  />
                  <button type="button" className="btn btn-primary" onClick={addSkill}>
                    <FaPlus /> Qo'shish
                  </button>
                </div>
                <div className="skills-list">
                  {formData.skills?.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Bekor qilish
            </button>
            <button type="submit" className="btn btn-primary">
              <FaSave /> Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// O'chirish tasdiqlash modal oynasi
const DeleteConfirmationModal = ({ employee, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal delete-modal">
        <div className="modal-header">
          <h3>
            <FaTrash /> Xodimni O'chirish
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="warning-message">
            <div className="warning-icon">
              <FaTrash size={48} />
            </div>
            <p>
              <strong>"{employee.name}"</strong> ismli xodimni rostdan ham o'chirishni xohlaysizmi?
            </p>
            <div className="employee-info-warning">
              <p><strong>Lavozim:</strong> {employee.position}</p>
              <p><strong>Bo'lim:</strong> {employee.department}</p>
              <p><strong>ID:</strong> EMP-{employee.id.toString().padStart(3, '0')}</p>
            </div>
            <p className="warning-text">
              ⚠️ Bu amalni bekor qilib bo'lmaydi!
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

// Xodimni ko'rish modal oynasi
const ViewEmployeeModal = ({ employee, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [imageError, setImageError] = useState(false);

  const tabs = [
    { id: 'general', label: 'Asosiy', icon: <FaUserFriends /> },
    { id: 'personal', label: 'Shaxsiy', icon: <FaIdBadge /> },
    { id: 'passport', label: 'Pasport', icon: <FaPassport /> },
    { id: 'skills', label: 'Ko\'nikmalar', icon: <FaBriefcase /> },
    { id: 'performance', label: 'Faoliyat', icon: <FaChartBar /> }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'general':
        return (
          <div className="tab-content">
            <div className="info-grid">
              <div className="info-item">
                <FaIdCard className="icon" />
                <div className="info-content">
                  <span className="info-label">Xodim ID</span>
                  <span className="info-value">EMP-{employee.id.toString().padStart(3, '0')}</span>
                </div>
              </div>
              <div className="info-item">
                <FaBuilding className="icon" />
                <div className="info-content">
                  <span className="info-label">Bo'lim</span>
                  <span className="info-value">{employee.department}</span>
                </div>
              </div>
              <div className="info-item">
                <FaEnvelope className="icon" />
                <div className="info-content">
                  <span className="info-label">Email</span>
                  <span className="info-value">{employee.email}</span>
                </div>
              </div>
              <div className="info-item">
                <FaPhone className="icon" />
                <div className="info-content">
                  <span className="info-label">Telefon</span>
                  <span className="info-value">{employee.phone}</span>
                </div>
              </div>
              <div className="info-item">
                <FaCalendar className="icon" />
                <div className="info-content">
                  <span className="info-label">Ishga kirgan</span>
                  <span className="info-value">{employee.hireDate}</span>
                </div>
              </div>
              <div className="info-item">
                <FaUserClock className="icon" />
                <div className="info-content">
                  <span className="info-label">Xizmat muddati</span>
                  <span className="info-value">
                    {(() => {
                      const hireDate = new Date(employee.hireDate);
                      const today = new Date();
                      const years = today.getFullYear() - hireDate.getFullYear();
                      const months = today.getMonth() - hireDate.getMonth();
                      return `${years} yil ${months} oy`;
                    })()}
                  </span>
                </div>
              </div>
              <div className="info-item">
                <FaMoneyBillWave className="icon" />
                <div className="info-content">
                  <span className="info-label">Oylik maosh</span>
                  <span className="info-value">{formatSalary(employee.salary)}</span>
                </div>
              </div>
              <div className="info-item">
                <FaUniversity className="icon" />
                <div className="info-content">
                  <span className="info-label">Ta'lim</span>
                  <span className="info-value">{employee.education || 'Noma\'lum'}</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'personal':
        return (
          <div className="tab-content">
            <div className="info-grid">
              <div className="info-item">
                <FaBirthdayCake className="icon" />
                <div className="info-content">
                  <span className="info-label">Tug'ilgan sana</span>
                  <span className="info-value">
                    {employee.personal?.birthDate ? (
                      <>
                        {employee.personal.birthDate}<br />
                        <small>({calculateAge(employee.personal.birthDate)})</small>
                      </>
                    ) : 'Noma\'lum'}
                  </span>
                </div>
              </div>
              <div className="info-item">
                <FaVenusMars className="icon" />
                <div className="info-content">
                  <span className="info-label">Jinsi</span>
                  <span className="info-value">{getGenderText(employee.personal?.gender)}</span>
                </div>
              </div>
              <div className="info-item full-width">
                <FaMapMarkerAlt className="icon" />
                <div className="info-content">
                  <span className="info-label">Manzil</span>
                  <span className="info-value">{employee.personal?.address || 'Noma\'lum'}</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'passport':
        return (
          <div className="tab-content">
            {employee.passport ? (
              <div className="info-grid">
                <div className="info-item">
                  <FaPassport className="icon" />
                  <div className="info-content">
                    <span className="info-label">Pasport seriya</span>
                    <span className="info-value">{employee.passport.series || 'Noma\'lum'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaIdCard className="icon" />
                  <div className="info-content">
                    <span className="info-label">Pasport raqami</span>
                    <span className="info-value">{employee.passport.number || 'Noma\'lum'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaCalendarAlt className="icon" />
                  <div className="info-content">
                    <span className="info-label">Berilgan sana</span>
                    <span className="info-value">{employee.passport.givenDate || 'Noma\'lum'}</span>
                  </div>
                </div>
                <div className="info-item full-width">
                  <FaBuilding className="icon" />
                  <div className="info-content">
                    <span className="info-label">Kim tomonidan berilgan</span>
                    <span className="info-value">{employee.passport.givenBy || 'Noma\'lum'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-data">
                <FaPassport size={48} />
                <p>Pasport ma'lumotlari kiritilmagan</p>
              </div>
            )}
          </div>
        );
      
      case 'skills':
        return (
          <div className="tab-content">
            {employee.skills?.length > 0 ? (
              <div className="skills-container">
                <h4>Kasbiy ko'nikmalar</h4>
                <div className="skills-grid">
                  {employee.skills.map((skill, index) => (
                    <div key={index} className="skill-item">
                      <FaStar className="skill-icon" />
                      <span className="skill-name">{skill}</span>
                      <div className="skill-level">
                        <div className="level-bar">
                          <div 
                            className="level-fill"
                            style={{ width: `${Math.floor(Math.random() * 60) + 40}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-data">
                <FaBriefcase size={48} />
                <p>Ko'nikmalar kiritilmagan</p>
              </div>
            )}
          </div>
        );
      
      case 'performance':
        return (
          <div className="tab-content">
            <div className="performance-stats">
              <div className="performance-item">
                <div className="performance-icon attendance">
                  <FaUserCheck />
                </div>
                <div className="performance-info">
                  <span className="performance-value">{employee.attendance}%</span>
                  <span className="performance-label">Davomat</span>
                </div>
              </div>
              
              <div className="performance-item">
                <div className="performance-icon efficiency">
                  <FaChartLine />
                </div>
                <div className="performance-info">
                  <span className="performance-value">
                    {Math.floor(Math.random() * 20) + 80}%
                  </span>
                  <span className="performance-label">Samaradorlik</span>
                </div>
              </div>
              
              <div className="performance-item">
                <div className="performance-icon projects">
                  <FaBriefcase />
                </div>
                <div className="performance-info">
                  <span className="performance-value">
                    {Math.floor(Math.random() * 10) + 5}
                  </span>
                  <span className="performance-label">Loyihalar</span>
                </div>
              </div>
              
              <div className="performance-item">
                <div className="performance-icon rating">
                  <FaStar />
                </div>
                <div className="performance-info">
                  <span className="performance-value">
                    {Math.random() * 2 + 3}.{Math.floor(Math.random() * 10)}
                  </span>
                  <span className="performance-label">Reyting</span>
                </div>
              </div>
            </div>
            
            <div className="attendance-chart">
              <h4>Oxirgi 7 kunlik davomat</h4>
              <div className="chart-bars">
                {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sha', 'Ya'].map((day, index) => (
                  <div key={day} className="chart-bar">
                    <div className="bar-label">{day}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{ 
                          height: `${Math.floor(Math.random() * 40) + 60}%`,
                          backgroundColor: employee.status === 'active' ? '#2ecc71' : 
                                         employee.status === 'on_leave' ? '#f39c12' : '#3498db'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal view-modal">
        <div className="modal-header">
          <h3>
            <FaEye /> Xodim Profili
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                {employee.image && !imageError ? (
                  <img 
                    src={employee.image} 
                    alt={employee.name}
                    className="profile-avatar"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div 
                    className="profile-avatar"
                    style={{ backgroundColor: employee.avatarColor }}
                  >
                    {getInitials(employee.name)}
                  </div>
                )}
                <div className="status-indicator">
                  <span className={`status-dot ${employee.status}`}></span>
                </div>
              </div>
              <div className="profile-badge">
                <span className={`status-badge ${employee.status}`}>
                  {getStatusText(employee.status)}
                </span>
              </div>
            </div>
            
            <div className="profile-info">
              <h2>{employee.name}</h2>
              <p className="profile-position">{employee.position}</p>
              <p className="profile-department">{employee.department}</p>
              
              <div className="profile-contacts">
                <div className="contact-item">
                  <FaEnvelope />
                  <span>{employee.email}</span>
                </div>
                <div className="contact-item">
                  <FaPhone />
                  <span>{employee.phone}</span>
                </div>
                <div className="contact-item">
                  <FaCalendar />
                  <span>Ishga kirgan: {employee.hireDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-tabs">
            <div className="tabs-header">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            <div className="tabs-content">
              {renderTabContent()}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Yopish
          </button>
          <button className="btn btn-primary" onClick={() => onEdit(employee)}>
            <FaEdit /> Tahrirlash
          </button>
        </div>
      </div>
    </div>
  );
};

// Asosiy Employees komponenti
const Employees = () => {
  // Local Storage'dan ma'lumotlarni o'qish
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('employees');
      return saved ? JSON.parse(saved) : initialEmployees;
    } catch (error) {
      console.error('Local Storage\'dan o\'qishda xato:', error);
      return initialEmployees;
    }
  };

  const [employees, setEmployees] = useState(loadFromLocalStorage);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' yoki 'list'

  // Local Storage'ga saqlash
  const saveToLocalStorage = useCallback((data) => {
    try {
      localStorage.setItem('employees', JSON.stringify(data));
    } catch (error) {
      console.error('Local Storage\'ga yozishda xato:', error);
    }
  }, []);

  // Ma'lumotlarni Local Storage'ga avtomatik saqlash
  useEffect(() => {
    saveToLocalStorage(employees);
  }, [employees, saveToLocalStorage]);

  // Statistikani hisoblash
  const statistics = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(emp => emp.status === 'active').length;
    const onLeave = employees.filter(emp => emp.status === 'on_leave').length;
    const remote = employees.filter(emp => emp.status === 'remote').length;
    
    const departments = [...new Set(employees.map(emp => emp.department))];
    const avgAttendance = employees.length > 0 
      ? Math.round(employees.reduce((sum, emp) => sum + emp.attendance, 0) / employees.length)
      : 0;
    
    const totalSalary = employees.reduce((sum, emp) => {
      return sum + (parseInt(emp.salary) || 0);
    }, 0);
    
    const avgSalary = employees.length > 0 ? Math.round(totalSalary / employees.length) : 0;
    
    // High attendance employees
    const highAttendance = employees.filter(emp => emp.attendance >= 95).length;
    
    // Average age
    let totalAge = 0;
    let countWithAge = 0;
    employees.forEach(emp => {
      if (emp.personal?.birthDate) {
        const age = calculateAge(emp.personal.birthDate).split(' ')[0];
        totalAge += parseInt(age);
        countWithAge++;
      }
    });
    const avgAge = countWithAge > 0 ? Math.round(totalAge / countWithAge) : 0;
    
    return { 
      total, 
      active, 
      onLeave, 
      remote, 
      departments, 
      avgAttendance,
      totalSalary,
      avgSalary,
      highAttendance,
      avgAge
    };
  }, [employees]);

  // Notification ko'rsatish
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Sort qilish
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Filter va sort qo'llash
  useEffect(() => {
    let result = [...employees];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(emp => 
        emp.name.toLowerCase().includes(term) ||
        emp.position.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.phone.toLowerCase().includes(term) ||
        emp.personal?.address?.toLowerCase().includes(term) ||
        emp.education?.toLowerCase().includes(term) ||
        emp.skills?.some(skill => skill.toLowerCase().includes(term))
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(emp => emp.status === statusFilter);
    }
    
    // Department filter
    if (departmentFilter !== 'all') {
      result = result.filter(emp => emp.department === departmentFilter);
    }
    
    // Attendance filter
    if (attendanceFilter !== 'all') {
      const [min, max] = attendanceFilter.split('-').map(Number);
      if (max) {
        result = result.filter(emp => emp.attendance >= min && emp.attendance <= max);
      } else {
        result = result.filter(emp => emp.attendance >= min);
      }
    }
    
    // Sort
    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Raqamli qiymatlar uchun
      if (sortConfig.key === 'attendance' || sortConfig.key === 'salary') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortConfig.key === 'name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredEmployees(result);
  }, [employees, searchTerm, statusFilter, departmentFilter, attendanceFilter, sortConfig]);

  // Xodim qo'shish
  const handleAddEmployee = useCallback((newEmployee) => {
    const id = employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
    const colors = [
      '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', 
      '#1abc9c', '#34495e', '#d35400', '#27ae60', '#8e44ad'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const employeeToAdd = {
      id,
      ...newEmployee,
      avatarColor: newEmployee.avatarColor || randomColor,
      attendance: newEmployee.attendance || 100,
      lastActivity: 'Bugun, 09:00',
      salary: newEmployee.salary || '0',
      skills: newEmployee.skills || [],
      passport: newEmployee.passport || {},
      personal: newEmployee.personal || {},
      education: newEmployee.education || ''
    };
    
    setEmployees(prev => [...prev, employeeToAdd]);
    setShowAddModal(false);
    showNotification('Xodim muvaffaqiyatli qo\'shildi!', 'success');
  }, [employees]);

  // Xodim o'chirish
  const handleDeleteEmployee = useCallback((id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setShowDeleteModal(false);
    setSelectedEmployee(null);
    showNotification('Xodim muvaffaqiyatli o\'chirildi!', 'success');
  }, []);

  // Xodim tahrirlash
  const handleEditEmployee = useCallback((updatedEmployee) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    setShowEditModal(false);
    setSelectedEmployee(null);
    showNotification('Xodim ma\'lumotlari muvaffaqiyatli yangilandi!', 'success');
  }, []);

  // Ma'lumotlarni export qilish
  const handleExportData = () => {
    const dataStr = JSON.stringify(employees, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `xodimlar_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Ma\'lumotlar muvaffaqiyatli yuklab olindi!', 'success');
  };

  // Ma'lumotlarni import qilish
  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showNotification('Fayl hajmi 5MB dan katta!', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          // Validate data structure
          const validatedData = importedData.map(emp => ({
            ...emp,
            id: emp.id || Math.random(),
            image: emp.image && emp.image.startsWith('data:image') ? emp.image : null
          }));
          
          setEmployees(validatedData);
          showNotification('Ma\'lumotlar muvaffaqiyatli yuklandi!', 'success');
        } else {
          showNotification('Noto\'g\'ri fayl formati!', 'error');
        }
      } catch (error) {
        showNotification('Faylni o\'qishda xato yuz berdi!', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Ma'lumotlarni tozalash (default holatga qaytarish)
  const handleResetData = () => {
    if (window.confirm('Barcha ma\'lumotlarni tozalashni xohlaysizmi? Bu barcha o\'zgarishlarni yo\'q qiladi.')) {
      setEmployees(initialEmployees);
      showNotification('Ma\'lumotlar tozalandi!', 'info');
    }
  };

  // Barcha filtrlarni tozalash
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDepartmentFilter('all');
    setAttendanceFilter('all');
    setSortConfig({ key: 'name', direction: 'asc' });
    showNotification('Barcha filtrlarda tozalandi!', 'info');
  };

  // Modalni ochish funksiyalari
  const openViewModal = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  // List view render
  const renderListView = () => {
    return (
      <div className="employees-list">
        <div className="list-header">
          <div className="list-row header-row">
            <div className="list-cell">Xodim</div>
            <div className="list-cell">Lavozim</div>
            <div className="list-cell">Bo'lim</div>
            <div className="list-cell">Davomat</div>
            <div className="list-cell">Maosh</div>
            <div className="list-cell">Holati</div>
            <div className="list-cell">Harakatlar</div>
          </div>
        </div>
        <div className="list-body">
          {filteredEmployees.map(employee => (
            <div key={employee.id} className="list-row">
              <div className="list-cell employee-cell">
                <div className="employee-list-info">
                  {employee.image ? (
                    <img 
                      src={employee.image} 
                      alt={employee.name}
                      className="list-avatar"
                    />
                  ) : (
                    <div 
                      className="list-avatar"
                      style={{ backgroundColor: employee.avatarColor }}
                    >
                      {getInitials(employee.name)}
                    </div>
                  )}
                  <div>
                    <div className="list-name">{employee.name}</div>
                    <div className="list-email">{employee.email}</div>
                  </div>
                </div>
              </div>
              <div className="list-cell">{employee.position}</div>
              <div className="list-cell">{employee.department}</div>
              <div className="list-cell">
                <div className="attendance-cell">
                  <span className="attendance-value">{employee.attendance}%</span>
                  <div className="mini-progress">
                    <div 
                      className="mini-progress-fill"
                      style={{ width: `${employee.attendance}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="list-cell">{formatSalary(employee.salary)}</div>
              <div className="list-cell">
                <span className={`status-badge ${employee.status}`}>
                  {getStatusText(employee.status)}
                </span>
              </div>
              <div className="list-cell">
                <div className="list-actions">
                  <button 
                    className="action-btn view"
                    onClick={() => openViewModal(employee)}
                    title="Ko'rish"
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="action-btn edit"
                    onClick={() => openEditModal(employee)}
                    title="Tahrirlash"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => openDeleteModal(employee)}
                    title="O'chirish"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="employees-page">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Sarlavha va statistikalar */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FaUserFriends /> Xodimlar Boshqaruvi
          </h1>
          <p>Jami {statistics.total} ta xodim • O'rtacha davomat: {statistics.avgAttendance}%</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-icon active">
              <FaUserCheck />
            </span>
            <div>
              <span className="stat-value">{statistics.active}</span>
              <span className="stat-label">Faol</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon high-attendance">
              <FaChartLine />
            </span>
            <div>
              <span className="stat-value">{statistics.highAttendance}</span>
              <span className="stat-label">Yuqori davomat</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon salary">
              <FaMoneyBillWave />
            </span>
            <div>
              <span className="stat-value">
                {(statistics.avgSalary / 1000000).toFixed(1)}M
              </span>
              <span className="stat-label">O'rtacha maosh</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon age">
              <FaUserFriends />
            </span>
            <div>
              <span className="stat-value">{statistics.avgAge}</span>
              <span className="stat-label">O'rtacha yosh</span>
            </div>
          </div>
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Yangi xodim
        </button>
      </div>

      {/* Qidiruv va filterlar */}
      <div className="search-section">
        <div className="search-header">
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Xodim ismi, lavozimi, bo'limi, ko'nikmalari bo'yicha qidiring..."
          />
          
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid ko'rinishi"
            >
              <div className="grid-icon"></div>
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List ko'rinishi"
            >
              <div className="list-icon"></div>
            </button>
          </div>
        </div>
        
        <div className="filters-row">
          <div className="filter-group">
            <label>
              <FaFilter /> Holati:
            </label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Barchasi</option>
              <option value="active">Faol</option>
              <option value="on_leave">Ta'tilda</option>
              <option value="remote">Uzoq ish</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>
              <FaBuilding /> Bo'lim:
            </label>
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Barcha bo'limlar</option>
              {statistics.departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>
              <FaChartLine /> Davomat:
            </label>
            <select 
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Barchasi</option>
              <option value="90-100">90-100% (Yuqori)</option>
              <option value="80-89">80-89% (Yaxshi)</option>
              <option value="70-79">70-79% (O'rtacha)</option>
              <option value="0-69">0-69% (Past)</option>
            </select>
          </div>
          
          <div className="sort-buttons">
            <button 
              className={`sort-btn ${sortConfig.key === 'name' ? 'active' : ''}`}
              onClick={() => handleSort('name')}
            >
              {sortConfig.key === 'name' && sortConfig.direction === 'asc' 
                ? <FaArrowUp /> 
                : <FaArrowDown />
              }
              Ism
            </button>
            
            <button 
              className={`sort-btn ${sortConfig.key === 'attendance' ? 'active' : ''}`}
              onClick={() => handleSort('attendance')}
            >
              {sortConfig.key === 'attendance' && sortConfig.direction === 'desc' 
                ? <FaArrowDown /> 
                : <FaArrowUp />
              }
              Davomat
            </button>
            
            <button 
              className={`sort-btn ${sortConfig.key === 'salary' ? 'active' : ''}`}
              onClick={() => handleSort('salary')}
            >
              {sortConfig.key === 'salary' && sortConfig.direction === 'desc' 
                ? <FaArrowDown /> 
                : <FaArrowUp />
              }
              Maosh
            </button>

            <button 
              className="sort-btn clear-filters"
              onClick={handleClearFilters}
              title="Barcha filtrlarni tozalash"
            >
              <FaTimesCircle />
              Tozalash
            </button>
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={handleExportData}>
            <FaFileExport /> Export
          </button>
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            <FaFileImport /> Import
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportData}
              style={{ display: 'none' }}
            />
          </label>
          <button className="btn btn-secondary" onClick={handleResetData}>
            <FaSync /> Tozalash
          </button>
          <button className="btn btn-secondary">
            <FaPrint /> Chop etish
          </button>
        </div>
      </div>

      {/* Xodimlar kartalari yoki list */}
      {filteredEmployees.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="employees-grid">
            {filteredEmployees.map(employee => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        ) : (
          renderListView()
        )
      ) : (
        <div className="no-results">
          <FaSearch size={48} />
          <h3>Xodim topilmadi</h3>
          <p>Qidiruvga mos keladigan xodim mavjud emas. Boshqa filterlarni sinab ko'ring.</p>
          <button 
            className="btn btn-primary" 
            onClick={handleClearFilters}
            style={{ marginTop: '20px' }}
          >
            <FaTimesCircle /> Filtrlarni tozalash
          </button>
        </div>
      )}

      {/* Modal oynalar */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEmployee}
          departments={statistics.departments}
        />
      )}

      {showEditModal && selectedEmployee && (
        <EditEmployeeModal
          employee={selectedEmployee}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEmployee(null);
          }}
          onSave={handleEditEmployee}
        />
      )}

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

      {showViewModal && selectedEmployee && (
        <ViewEmployeeModal
          employee={selectedEmployee}
          onClose={() => {
            setShowViewModal(false);
            setSelectedEmployee(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            setShowEditModal(true);
          }}
        />
      )}

      {/* Footer info */}
      <div className="footer-info">
        <p>
          <strong>📱 Rasm yuklash:</strong> Har bir xodim uchun rasm yuklashingiz mumkin (JPG, PNG, GIF).
          <strong>📄 Pasport ma'lumotlari:</strong> Ixtiyoriy ravishda pasport ma'lumotlarini kiritishingiz mumkin.
          <strong>💾 Local Storage:</strong> Barcha ma'lumotlar brauzeringizda saqlanadi.
        </p>
        <div className="footer-stats">
          <span>Jami xodimlar: {employees.length}</span>
          <span>Xotira: {(JSON.stringify(employees).length / 1024).toFixed(2)} KB</span>
          <span>Rasmlar: {employees.filter(e => e.image).length}</span>
        </div>
      </div>
    </div>
  );
};

export default Employees;