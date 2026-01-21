// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaEnvelope, 
  FaPhone, 
  FaUserTag,
  FaCrown,
  FaBriefcase,
  FaRocket,
  FaCheck,
  FaGoogle,
  FaShieldAlt,
  FaHeadset,
  FaMobileAlt,
  FaInfinity,
  FaBuilding,
  FaWifi,
  FaDatabase
} from 'react-icons/fa';   
import { loginWithEmail, loginWithGoogle, registerWithEmail, isFirebaseAvailable, initDemoAccounts } from '../../utils/firebaseAuth.api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [usingFirebase, setUsingFirebase] = useState(true);
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    password: '',
    confirmPassword: '',
    role: 'employee'
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Internet holatini kuzatish
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Firebase mavjudligini tekshirish
    setUsingFirebase(isFirebaseAvailable());
    
    // Demo hisoblarni yaratish
    initDemoAccounts();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginWithEmail(email, password);
      
      if (result.success) {
        // Ma'lumotlarni saqlash
        localStorage.setItem('current_user', JSON.stringify(result.user));
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('auth_source', result.source || 'local');
        
        // Rolga qarab yo'naltirish
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/employee');
        }
      } else {
        setError(result.message || 'Email yoki parol noto\'g\'ri');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Kirish muvaffaqiyatsiz. Qayta urinib ko\'ring');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await loginWithGoogle();
      
      if (result.success) {
        localStorage.setItem('current_user', JSON.stringify(result.user));
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('auth_source', result.source || 'local');
        
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/employee');
        }
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google bilan kirish muvaffaqiyatsiz. Demo hisob bilan kirildi');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validatsiya
    if (registerData.password !== registerData.confirmPassword) {
      setError('Parollar bir-biriga mos kelmadi');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      setLoading(false);
      return;
    }

    try {
      const result = await registerWithEmail({
        email: registerData.email,
        password: registerData.password,
        name: registerData.fullName,
        role: registerData.role,
        position: registerData.position,
        department: registerData.department,
        phone: registerData.phone
      });

      if (result.success) {
        setError(`✅ Ro'yxatdan o'tish muvaffaqiyatli! (${result.source === 'firebase' ? 'Firebase' : 'Local'})`);
        setActiveTab('login');
        setRegisterData({
          fullName: '',
          email: '',
          phone: '',
          position: '',
          department: '',
          password: '',
          confirmPassword: '',
          role: 'employee'
        });
        
        // Auto login
        setEmail(registerData.email);
        setPassword(registerData.password);
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Ro\'yxatdan o\'tish muvaffaqiyatsiz');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    // Auto submit
    setTimeout(() => {
      const submitBtn = document.querySelector('.login-btn');
      if (submitBtn) submitBtn.click();
    }, 100);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="left-panel">
          <div className="brand-section">
            <div className="brand-logo">
              <FaShieldAlt className="logo-icon" />
              <span className="brand-name">HR Tizimi</span>
              <span className="brand-badge">PRO</span>
            </div>
            
            {/* Connection Status */}
            <div className="connection-status">
              <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
                <div className="status-dot"></div>
                <span className="status-text">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="database-status">
                <FaDatabase className={`db-icon ${usingFirebase ? 'firebase' : 'local'}`} />
                <span className="db-text">
                  {usingFirebase ? 'Firebase' : 'Local Storage'}
                </span>
              </div>
            </div>

            <h1 className="brand-tagline">
              {usingFirebase ? 'Cloud' : 'Offline'} <span className="highlight">Boshqaruv</span>
            </h1>
            <p className="brand-description">
              {usingFirebase 
                ? 'Firebase asosida ishlaydigan zamonaviy HR tizimi'
                : 'Offline rejimda ishlaydigan HR tizimi. Ma\'lumotlar LocalStorage da saqlanadi'}
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon blue-gradient">
                {usingFirebase ? <FaWifi /> : <FaDatabase />}
              </div>
              <h4>{usingFirebase ? 'Cloud' : 'Offline'}</h4>
              <p>{usingFirebase ? 'Hamma joydan kirish' : 'Offline ishlash'}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue-gradient">
                <FaHeadset />
              </div>
              <h4>Auto Backup</h4>
              <p>Internet yo'q bo'lsa ham ishlaydi</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue-gradient">
                <FaMobileAlt />
              </div>
              <h4>Mobil</h4>
              <p>Har qayerdan kirish imkoniyati</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue-gradient">
                <FaCheck />
              </div>
              <h4>Xavfsiz</h4>
              <p>Ma'lumotlaringiz himoyalangan</p>
            </div>
          </div>

          <div className="testimonial">
            <div className="testimonial-content">
              <p className="quote">
                "Internet yo'q bo'lganda ham ishlay olishi juda qulay. Offline rejimda ham ma'lumotlar saqlanadi!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div>
                  <h5>Aziz Aliyev</h5>
                  <p>TechCorp IT Direktori</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="auth-tabs">
            <button 
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              <FaUser className="tab-icon" />
              Kirish
            </button>
            <button 
              className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              <FaUserTag className="tab-icon" />
              Ro'yxatdan o'tish
            </button>
          </div>

          {error && (
            <div className={`error-message ${error.includes('muvaffaqiyatli') ? 'success' : ''}`}>
              <div className="message-icon">
                {error.includes('muvaffaqiyatli') ? '✅' : '⚠️'}
              </div>
              {error}
            </div>
          )}

          {!isOnline && (
            <div className="warning-message">
              <div className="message-icon">⚠️</div>
              <div>
                <strong>Offline rejim</strong>
                <p>Internet aloqasi yo'q. Faqat Local Storage bilan ishlay olasiz</p>
              </div>
            </div>
          )}

          {activeTab === 'login' ? (
            <>
              <div className="form-header">
                <h2 className="form-title">Xush kelibsiz!</h2>
                <p className="form-subtitle">
                  {usingFirebase 
                    ? 'Firebase bilan tizimga kiring' 
                    : 'Local Storage bilan tizimga kiring'}
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <FaEnvelope className="input-icon" />
                    Email manzil
                  </label>
                  <div className="input-container">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      required
                      disabled={loading}
                      autoComplete="email"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <FaLock className="input-icon" />
                    Parol
                  </label>
                  <div className="input-container password-input">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Parolingizni kiriting"
                      required
                      disabled={loading}
                      autoComplete="current-password"
                      className="form-input"
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-container">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    Eslab qolish
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    Parolni unutdingizmi?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  className="submit-button login-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Kirilmoqda...
                    </>
                  ) : (
                    <>
                      <FaLock className="button-icon" />
                      Tizimga Kirish
                    </>
                  )}
                </button>

                <div className="divider">
                  <span className="divider-text">yoki</span>
                </div>

                <div className="social-login">
                  <button 
                    type="button" 
                    className="social-btn google-btn"
                    onClick={handleGoogleLogin}
                    disabled={loading || !isOnline}
                    title={!isOnline ? "Internet aloqasi yo'q" : ""}
                  >
                    <FaGoogle className="social-icon" />
                    Google bilan kirish
                  </button>
                </div>
              </form>

              <div className="demo-section">
                <div className="section-header">
                  <FaRocket className="section-icon" />
                  <h4 className="section-title">Demo hisoblar</h4>
                </div>
                <div className="demo-grid">
                  <div 
                    className="demo-card admin-demo"
                    onClick={() => handleDemoLogin('admin@hr.com', 'admin123')}
                  >
                    <div className="demo-card-header">
                      <div className="demo-icon-wrapper blue-gradient">
                        <FaCrown />
                      </div>
                      <span className="demo-card-badge">Admin</span>
                    </div>
                    <div className="demo-card-content">
                      <h5>Admin Panel</h5>
                      <p>admin@hr.com</p>
                      <small>Parol: admin123</small>
                    </div>
                    <div className="demo-card-hint">Sinab ko'rish →</div>
                  </div>
                  <div 
                    className="demo-card employee-demo"
                    onClick={() => handleDemoLogin('employee@hr.com', '123456')}
                  >
                    <div className="demo-card-header">
                      <div className="demo-icon-wrapper blue-gradient">
                        <FaBriefcase />
                      </div>
                      <span className="demo-card-badge">Xodim</span>
                    </div>
                    <div className="demo-card-content">
                      <h5>Xodim Panel</h5>
                      <p>employee@hr.com</p>
                      <small>Parol: 123456</small>
                    </div>
                    <div className="demo-card-hint">Sinab ko'rish →</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-header">
                <h2 className="form-title">Yangi hisob ochish</h2>
                <p className="form-subtitle">
                  {usingFirebase 
                    ? 'Firebase bilan ro\'yxatdan o\'ting' 
                    : 'Local Storage bilan ro\'yxatdan o\'ting'}
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="auth-form register-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName" className="form-label">
                      <FaUser className="input-icon" />
                      To'liq ism
                    </label>
                    <div className="input-container">
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={registerData.fullName}
                        onChange={handleRegisterChange}
                        placeholder="Ism va familiyangiz"
                        required
                        disabled={loading}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      <FaEnvelope className="input-icon" />
                      Elektron pochta
                    </label>
                    <div className="input-container">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        placeholder="email@example.com"
                        required
                        disabled={loading}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      <FaPhone className="input-icon" />
                      Telefon raqam
                    </label>
                    <div className="input-container">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={registerData.phone}
                        onChange={handleRegisterChange}
                        placeholder="+998 90 123 45 67"
                        required
                        disabled={loading}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="position" className="form-label">
                      <FaUserTag className="input-icon" />
                      Lavozim
                    </label>
                    <div className="input-container">
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={registerData.position}
                        onChange={handleRegisterChange}
                        placeholder="Dasturchi, Menejer, ..."
                        required
                        disabled={loading}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="department" className="form-label">
                      <FaBuilding className="input-icon" />
                      Bo'lim
                    </label>
                    <div className="input-container">
                      <select
                        id="department"
                        name="department"
                        value={registerData.department}
                        onChange={handleRegisterChange}
                        disabled={loading}
                        className="form-input"
                      >
                        <option value="">Bo'limni tanlang</option>
                        <option value="IT">IT Bo'limi</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sotuv</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Moliya</option>
                        <option value="Operations">Operatsiyalar</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="role" className="form-label">
                      <FaCrown className="input-icon" />
                      Rol
                    </label>
                    <div className="input-container">
                      <select
                        id="role"
                        name="role"
                        value={registerData.role}
                        onChange={handleRegisterChange}
                        disabled={loading}
                        className="form-input"
                      >
                        <option value="employee">Xodim</option>
                        <option value="manager">Menejer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      <FaLock className="input-icon" />
                      Parol
                    </label>
                    <div className="input-container password-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        placeholder="Kamida 6 ta belgi"
                        required
                        disabled={loading}
                        className="form-input"
                      />
                      <button 
                        type="button" 
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      <FaLock className="input-icon" />
                      Parolni tasdiqlash
                    </label>
                    <div className="input-container password-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        placeholder="Parolni qayta kiriting"
                        required
                        disabled={loading}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-container">
                    <input type="checkbox" required />
                    <span className="checkmark"></span>
                    <span>
                      Men <Link to="/terms">foydalanish shartlari</Link> bilan tanishdim
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="submit-button register-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Ro'yxatdan o'tilmoqda...
                    </>
                  ) : (
                    <>
                      <FaUserTag className="button-icon" />
                      Hisob Ochish
                    </>
                  )}
                </button>

                <div className="divider">
                  <span className="divider-text">yoki</span>
                </div>

                <div className="social-login">
                  <button 
                    type="button" 
                    className="social-btn google-btn"
                    onClick={handleGoogleLogin}
                    disabled={loading || !isOnline}
                    title={!isOnline ? "Internet aloqasi yo'q" : ""}
                  >
                    <FaGoogle className="social-icon" />
                    Google bilan ro'yxatdan o'tish
                  </button>
                </div>
              </form>

              <div className="register-benefits">
                <div className="section-header">
                  <FaCheck className="section-icon" />
                  <h4 className="section-title">Afzalliklar</h4>
                </div>
                <ul className="benefits-list">
                  <li>
                    <FaCheck className="benefit-icon" />
                    <span>Offline ishlash imkoniyati</span>
                  </li>
                  <li>
                    <FaCheck className="benefit-icon" />
                    <span>Auto backup tizimi</span>
                  </li>
                  <li>
                    <FaCheck className="benefit-icon" />
                    <span>Mobil optimallashtirilgan</span>
                  </li>
                  <li>
                    <FaCheck className="benefit-icon" />
                    <span>Bepul va ochiq manba</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          <div className="auth-footer">
            <p className="footer-contact">
              Savollaringiz bormi?{' '}
              <Link to="/contact" className="footer-link">
                Yordam markazi
              </Link>
            </p>
            <p className="copyright">
              © 2024 HR Management System. {usingFirebase ? 'Firebase' : 'Local Storage'} asosida.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;