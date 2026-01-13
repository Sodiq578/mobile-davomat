import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  FaMicrosoft,
  FaShieldAlt,
  FaHeadset,
  FaMobileAlt,
  FaInfinity
} from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'employee'
  });
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(username, password);
      if (result.success) {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/employee');
          }
        }
      } else {
        setError(result.message || 'Kirish muvaffaqiyatsiz bo\'ldi');
      }
    } catch (err) {
      setError('Server xatosi. Iltimos, qayta urinib ko\'ring.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      const result = await register(registerData);
      if (result.success) {
        setError('Ro\'yxatdan o\'tish muvaffaqiyatli! Iltimos, tizimga kiring.');
        setActiveTab('login');
        setRegisterData({
          fullName: '',
          email: '',
          phone: '',
          username: '',
          password: '',
          confirmPassword: '',
          role: 'employee'
        });
      } else {
        setError(result.message || 'Ro\'yxatdan o\'tish muvaffaqiyatsiz');
      }
    } catch (err) {
      setError('Server xatosi. Iltimos, qayta urinib ko\'ring.');
      console.error('Register error:', err);
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

  const handleDemoLogin = (demoUsername, demoPassword) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="left-panel">
          <div className="brand-section">
            <div className="brand-logo">
              <FaShieldAlt className="logo-icon" />
              <span className="brand-name">Trackio</span>
              <span className="brand-badge">PRO</span>
            </div>
            <h1 className="brand-tagline">
              Ish samaradorligingizni <span className="highlight">oshiring</span>
            </h1>
            <p className="brand-description">
              Zamonaviy xodimlarni boshqarish tizimi bilan jamoangiz samaradorligini maksimal darajaga olib chiqing
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon blue-gradient">
                <FaInfinity />
              </div>
              <h4>Cheksiz miqyos</h4>
              <p>Har qanday hajmdagi jamoalar uchun mos</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue-gradient">
                <FaHeadset />
              </div>
              <h4>24/7 Yordam</h4>
              <p>Doimiy texnik qo'llab-quvvatlash</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue-gradient">
                <FaMobileAlt />
              </div>
              <h4>Mobil ilova</h4>
              <p>Har qayerdan kirish imkoniyati</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue-gradient">
                <FaCheck />
              </div>
              <h4>ISO sertifikati</h4>
              <p> Xavfsizlik standartlariga muvofiq</p>
            </div>
          </div>

          <div className="testimonial">
            <div className="testimonial-content">
              <p className="quote">
                "Trackio bizning ish samaradorligimizni 40% oshirdi. Juda qulay va samarali tizim!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div>
                  <h5>Aliyev Shahob</h5>
                  <p>TechCorp MChJ Bosh direktori</p>
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

          {activeTab === 'login' ? (
            <>
              <div className="form-header">
                <h2 className="form-title">Xush kelibsiz!</h2>
                <p className="form-subtitle">Hisobingizga kiring va boshqaruvga o'ting</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    <FaUser className="input-icon" />
                    Foydalanuvchi nomi
                  </label>
                  <div className="input-container">
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Foydalanuvchi nomingizni kiriting"
                      required
                      disabled={loading}
                      autoComplete="username"
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
                  <button type="button" className="social-btn google-btn">
                    <FaGoogle className="social-icon" />
                    Google bilan kirish
                  </button>
                  <button type="button" className="social-btn microsoft-btn">
                    <FaMicrosoft className="social-icon" />
                    Microsoft bilan kirish
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
                    onClick={() => handleDemoLogin('admin1', 'admin123')}
                  >
                    <div className="demo-card-header">
                      <div className="demo-icon-wrapper blue-gradient">
                        <FaCrown />
                      </div>
                      <span className="demo-card-badge">Admin</span>
                    </div>
                    <div className="demo-card-content">
                      <h5>Admin Panel</h5>
                      <p>admin1 / admin123</p>
                    </div>
                    <div className="demo-card-hint">Sinab ko'rish →</div>
                  </div>
                  <div 
                    className="demo-card employee-demo"
                    onClick={() => handleDemoLogin('employee1', '123456')}
                  >
                    <div className="demo-card-header">
                      <div className="demo-icon-wrapper blue-gradient">
                        <FaBriefcase />
                      </div>
                      <span className="demo-card-badge">Xodim</span>
                    </div>
                    <div className="demo-card-content">
                      <h5>Xodim Panel</h5>
                      <p>employee1 / 123456</p>
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
                <p className="form-subtitle">Trackio tizimidan foydalanish uchun ro'yxatdan o'ting</p>
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
                    <label htmlFor="username" className="form-label">
                      <FaUserTag className="input-icon" />
                      Foydalanuvchi nomi
                    </label>
                    <div className="input-container">
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={registerData.username}
                        onChange={handleRegisterChange}
                        placeholder="username"
                        required
                        disabled={loading}
                        className="form-input"
                      />
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

                <div className="form-group">
                  <label htmlFor="role" className="form-label">
                    <FaUserTag className="input-icon" />
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

                <div className="form-options">
                  <label className="checkbox-container">
                    <input type="checkbox" required />
                    <span className="checkmark"></span>
                    <span>
                      Men <Link to="/terms">foydalanish shartlari</Link> va{' '}
                      <Link to="/privacy">maxfiylik siyosati</Link> bilan tanishdim va roziman
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
                  <button type="button" className="social-btn google-btn">
                    <FaGoogle className="social-icon" />
                    Google bilan ro'yxatdan o'tish
                  </button>
                </div>
              </form>

              <div className="register-benefits">
                <div className="section-header">
                  <FaCheck className="section-icon" />
                  <h4 className="section-title">Ro'yxatdan o'tish afzalliklari</h4>
                </div>
                <ul className="benefits-list">
                  <li>
                    <FaCheck className="benefit-icon" />
                    <span>14 kun bepul sinov muddati</span>
                  </li>
                  <li>
                    <FaCheck className="benefit-icon" />
                    <span>Cheksiz xodimlar soni</span>
                  </li>
                  <li>
                    <FaCheck className="benefit-icon" />
                    <span>24/7 texnik yordam</span>
                  </li>
                  <li>
                    <FaCheck className="benefit-icon" />
                    <span>Mobil ilovaga bepul kirish</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          <div className="auth-footer">
            <p className="footer-contact">
              Savollaringiz bormi?{' '}
              <Link to="/contact" className="footer-link">
                Biz bilan bog'laning
              </Link>
              <span className="phone-number">
                <FaPhone /> +998 90 123 45 67
              </span>
            </p>
            <p className="copyright">
              © 2024 Trackio Pro. Barcha huquqlar himoyalangan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;