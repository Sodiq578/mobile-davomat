import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Dastlabki yuklanishda foydalanuvchi ma'lumotlarini tekshirish
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    
    try {
      // Bu yerda haqiqiy backend API ga so'rov yuboriladi
      // Hozircha demo login qilamiz
      
      // Demo userlar
      const demoUsers = {
        admin1: { 
          username: 'admin1', 
          password: 'admin123', 
          user: {
            id: 1,
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            avatar: 'A'
          } 
        },
        employee1: { 
          username: 'employee1', 
          password: '123456', 
          user: {
            id: 2,
            name: 'Employee User',
            email: 'employee@example.com',
            role: 'employee',
            avatar: 'E'
          } 
        }
      };

      // Demo login tekshiruvi
      if (demoUsers[username] && demoUsers[username].password === password) {
        const userData = demoUsers[username].user;
        const token = 'demo-token-' + Date.now();
        
        // LocalStorage ga saqlash
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        
        setUser(userData);
        setLoading(false);
        
        return { 
          success: true, 
          message: 'Kirish muvaffaqiyatli!',
          user: userData,
          token: token
        };
      } else {
        setLoading(false);
        return { 
          success: false, 
          message: 'Noto\'g\'ri foydalanuvchi nomi yoki parol' 
        };
      }
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: 'Server xatosi. Iltimos, keyinroq urinib ko\'ring.' 
      };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    
    try {
      // Bu yerda haqiqiy backend API ga so'rov yuboriladi
      
      // Yangi foydalanuvchi yaratish
      const newUser = {
        id: Date.now(),
        name: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        username: userData.username,
        role: userData.role,
        avatar: userData.fullName.charAt(0).toUpperCase()
      };

      // LocalStorage dan mavjud foydalanuvchilarni olish
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Foydalanuvchi nomi bandligini tekshirish
      const usernameExists = existingUsers.some(u => u.username === userData.username);
      if (usernameExists) {
        setLoading(false);
        return { 
          success: false, 
          message: 'Bu foydalanuvchi nomi band' 
        };
      }
      
      // Email bandligini tekshirish
      const emailExists = existingUsers.some(u => u.email === userData.email);
      if (emailExists) {
        setLoading(false);
        return { 
          success: false, 
          message: 'Bu email band' 
        };
      }

      // Yangi foydalanuvchini qo'shish
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      setLoading(false);
      
      return { 
        success: true, 
        message: 'Ro\'yxatdan o\'tish muvaffaqiyatli!',
        user: newUser
      };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: 'Ro\'yxatdan o\'tishda xato. Iltimos, keyinroq urinib ko\'ring.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const updateUser = (updatedData) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...currentUser, ...updatedData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};