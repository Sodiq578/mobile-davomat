const users = [
  {
    id: 1,
    username: 'employee1',
    password: '123456',
    role: 'employee',
    name: 'Ali Valiyev',
    position: 'Ishchi',
    phone: '+998901234567'
  },
  {
    id: 2,
    username: 'admin1',
    password: 'admin123',
    role: 'admin',
    name: 'Admin Adminov',
    position: 'Rahbar'
  }
];

export const authApi = {
  login: async (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => 
          u.username === username && u.password === password
        );
        if (user) {
          resolve({
            success: true,
            token: 'fake-jwt-token-' + user.id,
            user: {
              id: user.id,
              name: user.name,
              role: user.role,
              position: user.position
            }
          });
        } else {
          reject({
            success: false,
            message: 'Foydalanuvchi nomi yoki parol noto‘g‘ri'
          });
        }
      }, 1000);
    });
  },

  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },

  checkAuth: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const token = localStorage.getItem('token');
        if (token) {
          const userId = token.split('-')[3];
          const user = users.find(u => u.id == userId);
          if (user) {
            resolve({
              isAuthenticated: true,
              user: {
                id: user.id,
                name: user.name,
                role: user.role,
                position: user.position
              }
            });
          }
        }
        resolve({ isAuthenticated: false });
      }, 500);
    });
  }
};