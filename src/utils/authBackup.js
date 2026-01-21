// src/utils/authBackup.js
export const checkLocalUsers = () => {
  const users = JSON.parse(localStorage.getItem('hr_users') || '[]');
  
  if (users.length === 0) {
    // Agar Firebase ishlamasa, demo hisoblarni yaratish
    const demoUsers = [
      {
        id: 1,
        email: 'admin@hr.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        position: 'System Administrator',
        department: 'IT',
        avatarColor: '#3498db',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        email: 'employee@hr.com',
        password: '123456',
        name: 'Demo Employee',
        role: 'employee',
        position: 'Senior Developer',
        department: 'IT',
        avatarColor: '#2ecc71',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        email: 'manager@hr.com',
        password: 'manager123',
        name: 'Manager User',
        role: 'manager',
        position: 'HR Manager',
        department: 'HR',
        avatarColor: '#9b59b6',
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('hr_users', JSON.stringify(demoUsers));
    return demoUsers;
  }
  
  return users;
};

export const localLogin = (email, password) => {
  const users = JSON.parse(localStorage.getItem('hr_users') || '[]');
  const foundUser = users.find(user => user.email === email && user.password === password);
  
  if (foundUser) {
    const userObj = {
      uid: foundUser.id.toString(),
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role,
      avatar: null,
      position: foundUser.position,
      department: foundUser.department,
      avatarColor: foundUser.avatarColor
    };
    
    return {
      success: true,
      user: userObj,
      token: `local-token-${Date.now()}`,
      source: 'local'
    };
  }
  
  return {
    success: false,
    message: 'Email yoki parol noto\'g\'ri'
  };
};

export const localRegister = (userData) => {
  const users = JSON.parse(localStorage.getItem('hr_users') || '[]');
  
  // Email takrorlanishini tekshirish
  if (users.some(user => user.email === userData.email)) {
    return {
      success: false,
      message: 'Bu email allaqachon ro\'yxatdan o\'tilgan'
    };
  }
  
  const newUser = {
    id: Date.now(),
    email: userData.email,
    password: userData.password,
    name: userData.name,
    role: userData.role || 'employee',
    position: userData.position || '',
    department: userData.department || '',
    avatarColor: ['#3498db', '#2ecc71', '#9b59b6', '#f39c12'][Math.floor(Math.random() * 4)],
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('hr_users', JSON.stringify(users));
  
  const userObj = {
    uid: newUser.id.toString(),
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    avatar: null,
    position: newUser.position,
    department: newUser.department,
    avatarColor: newUser.avatarColor
  };
  
  return {
    success: true,
    user: userObj,
    token: `local-token-${Date.now()}`,
    source: 'local'
  };
};

// Local storage dan barcha userlarni olish
export const getAllLocalUsers = () => {
  return JSON.parse(localStorage.getItem('hr_users') || '[]');
};

// User ma'lumotlarini yangilash
export const updateLocalUser = (userId, updates) => {
  const users = JSON.parse(localStorage.getItem('hr_users') || '[]');
  const userIndex = users.findIndex(user => user.id === userId || user.id.toString() === userId);
  
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('hr_users', JSON.stringify(users));
    return { success: true };
  }
  
  return { success: false, message: 'User topilmadi' };
};

// User ni o'chirish
export const deleteLocalUser = (userId) => {
  const users = JSON.parse(localStorage.getItem('hr_users') || '[]');
  const filteredUsers = users.filter(user => user.id !== userId && user.id.toString() !== userId);
  
  localStorage.setItem('hr_users', JSON.stringify(filteredUsers));
  return { success: true };
};