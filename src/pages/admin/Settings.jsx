import React, { useState } from 'react';
import { 
  FaSave,
  FaUndo,
  FaBell,
  FaShieldAlt,
  FaUser,
  FaDatabase,
  FaMapMarkerAlt,
  FaClock,
  FaLanguage,
  FaPalette,
  FaLock,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import './settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    companyName: 'Xodim Monitoring',
    timezone: 'Asia/Tashkent',
    language: 'uz',
    dateFormat: 'DD/MM/YYYY',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    attendanceAlerts: true,
    lateAlerts: true,
    gpsAlerts: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordComplexity: 'medium',
    
    // GPS Settings
    gpsAccuracy: 50,
    locationInterval: 5,
    maxDistance: 100,
    
    // Appearance
    theme: 'light',
    primaryColor: '#3498db',
    sidebarCollapsed: false,
    
    // Attendance Settings
    workStartTime: '09:00',
    workEndTime: '18:00',
    lunchStart: '13:00',
    lunchEnd: '14:00',
    lateThreshold: 15,
    earlyLeaveThreshold: 15
  });

  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    alert('Sozlamalar saqlandi!');
  };

  const handleReset = () => {
    if (window.confirm('Barcha sozlamalar dastlabki holatiga qaytarilsinmi?')) {
      setSettings({
        companyName: 'Xodim Monitoring',
        timezone: 'Asia/Tashkent',
        language: 'uz',
        dateFormat: 'DD/MM/YYYY',
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        attendanceAlerts: true,
        lateAlerts: true,
        gpsAlerts: true,
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordComplexity: 'medium',
        gpsAccuracy: 50,
        locationInterval: 5,
        maxDistance: 100,
        theme: 'light',
        primaryColor: '#3498db',
        sidebarCollapsed: false,
        workStartTime: '09:00',
        workEndTime: '18:00',
        lunchStart: '13:00',
        lunchEnd: '14:00',
        lateThreshold: 15,
        earlyLeaveThreshold: 15
      });
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Yangi parollar bir-biriga mos kelmadi!');
      return;
    }
    if (newPassword.length < 6) {
      alert('Parol kamida 6 ta belgidan iborat bo\'lishi kerak!');
      return;
    }
    alert('Parol muvaffaqiyatli o\'zgartirildi!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const tabs = [
    { id: 'general', label: 'Umumiy', icon: <FaUser /> },
    { id: 'notifications', label: 'Bildirishnomalar', icon: <FaBell /> },
    { id: 'security', label: 'Xavfsizlik', icon: <FaShieldAlt /> },
    { id: 'gps', label: 'GPS Sozlamalari', icon: <FaMapMarkerAlt /> },
    { id: 'attendance', label: 'Davomat', icon: <FaClock /> },
    { id: 'appearance', label: 'Ko\'rinish', icon: <FaPalette /> },
    { id: 'database', label: 'Ma\'lumotlar Bazasi', icon: <FaDatabase /> }
  ];

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Tizim Sozlamalari</h1>
          <p>Tizim parametrlarini sozlang va boshqaring</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleReset}>
            <FaUndo /> Tiklash
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <FaSave /> Saqlash
          </button>
        </div>
      </div>

      <div className="settings-container">
        {/* Tabs */}
        <div className="settings-tabs">
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

        {/* Settings Content */}
        <div className="settings-content">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3><FaUser /> Umumiy Sozlamalar</h3>
              
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Kompaniya Nomi</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
                    placeholder="Kompaniya nomi"
                  />
                </div>

                <div className="setting-item">
                  <label>Vaqt Zonasi</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                  >
                    <option value="Asia/Tashkent">Toshkent (UTC+5)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">New York (UTC-5)</option>
                    <option value="Europe/London">London (UTC+0)</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Til</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                  >
                    <option value="uz">O'zbekcha</option>
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Sana Formati</label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="system-info">
                <h4>Tizim Ma'lumotlari</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Versiya:</span>
                    <span className="info-value">2.1.0</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">O'rnatilgan sana:</span>
                    <span className="info-value">2024-01-15</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Yangilangan sana:</span>
                    <span className="info-value">2024-01-20</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Litsenziya:</span>
                    <span className="info-value">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3><FaBell /> Bildirishnoma Sozlamalari</h3>
              
              <div className="settings-grid">
                <div className="setting-item checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                    />
                    <span>Email bildirishnomalari</span>
                  </label>
                </div>

                <div className="setting-item checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                    />
                    <span>Push bildirishnomalar</span>
                  </label>
                </div>

                <div className="setting-item checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                    />
                    <span>SMS bildirishnomalar</span>
                  </label>
                </div>

                <div className="setting-item checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.attendanceAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'attendanceAlerts', e.target.checked)}
                    />
                    <span>Davomat ogohlantirishlari</span>
                  </label>
                </div>

                <div className="setting-item checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.lateAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'lateAlerts', e.target.checked)}
                    />
                    <span>Kechikish ogohlantirishlari</span>
                  </label>
                </div>

                <div className="setting-item checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.gpsAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'gpsAlerts', e.target.checked)}
                    />
                    <span>GPS ogohlantirishlari</span>
                  </label>
                </div>
              </div>

              <div className="notification-test">
                <h4>Bildirishnoma Sinovi</h4>
                <p>Bildirishnoma tizimini sinab ko'ring</p>
                <button className="btn btn-secondary">
                  Test bildirishnoma yuborish
                </button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h3><FaShieldAlt /> Xavfsizlik Sozlamalari</h3>
              
              <div className="security-grid">
                <div className="security-card">
                  <h4>Parolni O'zgartirish</h4>
                  <form onSubmit={handleChangePassword} className="password-form">
                    <div className="form-group">
                      <label>Joriy Parol</label>
                      <div className="password-input">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Joriy parolingiz"
                          required
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
                      <label>Yangi Parol</label>
                      <div className="password-input">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Yangi parol"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Yangi Parolni Tasdiqlash</label>
                      <div className="password-input">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Yangi parolni takrorlang"
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                      <FaLock /> Parolni O'zgartirish
                    </button>
                  </form>
                </div>

                <div className="security-card">
                  <h4>Xavfsizlik Sozlamalari</h4>
                  
                  <div className="setting-item checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                      />
                      <span>Ikki faktorli autentifikatsiya</span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <label>Sessiya muddati (daqiqa)</label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                    >
                      <option value={15}>15 daqiqa</option>
                      <option value={30}>30 daqiqa</option>
                      <option value={60}>1 soat</option>
                      <option value={120}>2 soat</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <label>Parol murakkabligi</label>
                    <select
                      value={settings.passwordComplexity}
                      onChange={(e) => handleSettingChange('security', 'passwordComplexity', e.target.value)}
                    >
                      <option value="low">Oddiy</option>
                      <option value="medium">O'rtacha</option>
                      <option value="high">Murakkab</option>
                    </select>
                  </div>
                </div>

                <div className="security-card">
                  <h4>Faol Sessiyalar</h4>
                  <div className="sessions-list">
                    <div className="session-item">
                      <div className="session-info">
                        <div className="session-device">
                          <strong>Chrome - Windows</strong>
                          <span>Toshkent, Uzbekistan</span>
                        </div>
                        <div className="session-time">
                          <span>Faol</span>
                          <span>2 soat oldin</span>
                        </div>
                      </div>
                      <button className="btn btn-danger btn-sm">
                        Tugatish
                      </button>
                    </div>
                    <div className="session-item">
                      <div className="session-info">
                        <div className="session-device">
                          <strong>Safari - iPhone</strong>
                          <span>Toshkent, Uzbekistan</span>
                        </div>
                        <div className="session-time">
                          <span>Faol</span>
                          <span>1 kun oldin</span>
                        </div>
                      </div>
                      <button className="btn btn-danger btn-sm">
                        Tugatish
                      </button>
                    </div>
                  </div>
                  <button className="btn btn-secondary">
                    Barcha sessiyalarni tugatish
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GPS Settings */}
          {activeTab === 'gps' && (
            <div className="settings-section">
              <h3><FaMapMarkerAlt /> GPS Sozlamalari</h3>
              
              <div className="settings-grid">
                <div className="setting-item">
                  <label>GPS Aniqlik (metr)</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={settings.gpsAccuracy}
                      onChange={(e) => handleSettingChange('gps', 'gpsAccuracy', e.target.value)}
                      className="range-slider"
                    />
                    <span className="slider-value">{settings.gpsAccuracy} m</span>
                  </div>
                  <p className="hint">Kamroq qiymat - yuqori aniqlik</p>
                </div>

                <div className="setting-item">
                  <label>Joylashuv yangilanish oralig'i (daqiqa)</label>
                  <select
                    value={settings.locationInterval}
                    onChange={(e) => handleSettingChange('gps', 'locationInterval', e.target.value)}
                  >
                    <option value={1}>1 daqiqa</option>
                    <option value={5}>5 daqiqa</option>
                    <option value={10}>10 daqiqa</option>
                    <option value={15}>15 daqiqa</option>
                    <option value={30}>30 daqiqa</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Maksimal masofa (km)</label>
                  <input
                    type="number"
                    value={settings.maxDistance}
                    onChange={(e) => handleSettingChange('gps', 'maxDistance', e.target.value)}
                    min="1"
                    max="1000"
                    step="10"
                  />
                  <p className="hint">Ish joyidan ruxsat etilgan maksimal masofa</p>
                </div>

                <div className="setting-item">
                  <label>GPS Monitoring rejimi</label>
                  <select>
                    <option>Doimiy monitoring</option>
                    <option>Ish vaqtida</option>
                    <option>Faollik davomida</option>
                  </select>
                </div>
              </div>

              <div className="gps-test">
                <h4>GPS Test</h4>
                <p>GPS tizimining ishlashini sinab ko'ring</p>
                <div className="test-buttons">
                  <button className="btn btn-secondary">
                    GPS holatini tekshirish
                  </button>
                  <button className="btn btn-secondary">
                    Manzilni aniqlash
                  </button>
                  <button className="btn btn-primary">
                    GPS kalibratsiya
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Settings */}
          {activeTab === 'attendance' && (
            <div className="settings-section">
              <h3><FaClock /> Davomat Sozlamalari</h3>
              
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Ish boshlanish vaqti</label>
                  <input
                    type="time"
                    value={settings.workStartTime}
                    onChange={(e) => handleSettingChange('attendance', 'workStartTime', e.target.value)}
                  />
                </div>

                <div className="setting-item">
                  <label>Ish tugash vaqti</label>
                  <input
                    type="time"
                    value={settings.workEndTime}
                    onChange={(e) => handleSettingChange('attendance', 'workEndTime', e.target.value)}
                  />
                </div>

                <div className="setting-item">
                  <label>Tushlik boshlanishi</label>
                  <input
                    type="time"
                    value={settings.lunchStart}
                    onChange={(e) => handleSettingChange('attendance', 'lunchStart', e.target.value)}
                  />
                </div>

                <div className="setting-item">
                  <label>Tushlik tugashi</label>
                  <input
                    type="time"
                    value={settings.lunchEnd}
                    onChange={(e) => handleSettingChange('attendance', 'lunchEnd', e.target.value)}
                  />
                </div>

                <div className="setting-item">
                  <label>Kechikish chegarasi (daqiqa)</label>
                  <input
                    type="number"
                    value={settings.lateThreshold}
                    onChange={(e) => handleSettingChange('attendance', 'lateThreshold', e.target.value)}
                    min="1"
                    max="60"
                  />
                </div>

                <div className="setting-item">
                  <label>Erkin ketish chegarasi (daqiqa)</label>
                  <input
                    type="number"
                    value={settings.earlyLeaveThreshold}
                    onChange={(e) => handleSettingChange('attendance', 'earlyLeaveThreshold', e.target.value)}
                    min="1"
                    max="60"
                  />
                </div>
              </div>

              <div className="working-days">
                <h4>Ish Kunlari</h4>
                <div className="days-grid">
                  {['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'].map((day, index) => (
                    <div key={day} className="day-item">
                      <label>
                        <input type="checkbox" defaultChecked={index < 5} />
                        <span>{day}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3><FaPalette /> Ko'rinish Sozlamalari</h3>
              
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Tema</label>
                  <div className="theme-selector">
                    <button
                      className={`theme-option ${settings.theme === 'light' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                    >
                      <div className="theme-preview light"></div>
                      <span>Yorqin</span>
                    </button>
                    <button
                      className={`theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                    >
                      <div className="theme-preview dark"></div>
                      <span>Qorong'i</span>
                    </button>
                    <button
                      className={`theme-option ${settings.theme === 'auto' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('appearance', 'theme', 'auto')}
                    >
                      <div className="theme-preview auto"></div>
                      <span>Avtomatik</span>
                    </button>
                  </div>
                </div>

                <div className="setting-item">
                  <label>Asosiy rang</label>
                  <div className="color-selector">
                    {['#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f39c12', '#1abc9c'].map(color => (
                      <button
                        key={color}
                        className={`color-option ${settings.primaryColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleSettingChange('appearance', 'primaryColor', color)}
                      >
                        {settings.primaryColor === color && '✓'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="setting-item checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.sidebarCollapsed}
                      onChange={(e) => handleSettingChange('appearance', 'sidebarCollapsed', e.target.checked)}
                    />
                    <span>Yon panelni yig'ish</span>
                  </label>
                </div>

                <div className="setting-item">
                  <label>Chartlar dizayni</label>
                  <select>
                    <option>Zamonaviy</option>
                    <option>Minimal</option>
                    <option>Batafsil</option>
                  </select>
                </div>
              </div>

              <div className="preview-section">
                <h4>Ko'rinish oldindan ko'rish</h4>
                <div className="preview-container">
                  <div className="preview-header">
                    <div className="preview-logo"></div>
                    <div className="preview-user"></div>
                  </div>
                  <div className="preview-sidebar">
                    <div className="preview-menu"></div>
                    <div className="preview-menu"></div>
                    <div className="preview-menu"></div>
                  </div>
                  <div className="preview-content">
                    <div className="preview-card"></div>
                    <div className="preview-card"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Database Settings */}
          {activeTab === 'database' && (
            <div className="settings-section">
              <h3><FaDatabase /> Ma'lumotlar Bazasi</h3>
              
              <div className="database-stats">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaDatabase />
                  </div>
                  <div className="stat-content">
                    <h3>2.4 GB</h3>
                    <p>Umumiy hajm</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaClock />
                  </div>
                  <div className="stat-content">
                    <h3>45 kun</h3>
                    <p>Ma'lumotlar saqlanadi</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaUser />
                  </div>
                  <div className="stat-content">
                    <h3>1,234</h3>
                    <p>Yozuvlar soni</p>
                  </div>
                </div>
              </div>

              <div className="database-actions">
                <h4>Ma'lumotlar Boshqaruvi</h4>
                <div className="action-buttons">
                  <button className="btn btn-secondary">
                    Backup yaratish
                  </button>
                  <button className="btn btn-secondary">
                    Backup'ni tiklash
                  </button>
                  <button className="btn btn-secondary">
                    Ma'lumotlarni tozalash
                  </button>
                  <button className="btn btn-danger">
                    Arxivni tozalash
                  </button>
                </div>

                <div className="backup-settings">
                  <h5>Avtomatik Backup</h5>
                  <div className="setting-item checkbox">
                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>Avtomatik backup</span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>Backup chastotasi</label>
                    <select>
                      <option>Har kuni</option>
                      <option>Har hafta</option>
                      <option>Har oy</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Backup'lar soni</label>
                    <input type="number" defaultValue={5} min={1} max={20} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;