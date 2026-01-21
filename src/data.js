// src/data.js

// Bo'limlar ro'yxati
const departments = [
  'IT Bo\'limi',
  'Marketing',
  'Moliya',
  'HR',
  'Sotuv',
  'Logistika',
  'Ishlab chiqarish',
  'Texnik xizmat'
];

// Xodimlar ma'lumotlari
const employees = [
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
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker'],
    performance: {
      efficiency: 92,
      projects: 8,
      rating: 4.7,
      overtime: 12
    },
    device: 'Kompyuter',
    location: 'Toshkent, Yunusobod',
    joined: '2022-03-15',
    lastLogin: '2024-01-21 09:15'
  },
  // ... (qolgan xodimlar oldingi kodda bor)
  {
    id: 10,
    name: 'Abdullayeva Zilola',
    position: 'Moliya Analitigi',
    department: 'Moliya',
    email: 'zilola@company.com',
    phone: '+998 91 012 34 56',
    hireDate: '2022-11-05',
    status: 'active',
    avatarColor: '#6c5ce7',
    attendance: 97,
    lastActivity: 'Bugun, 08:55',
    salary: '13500000',
    image: null,
    passport: {
      series: 'AJ',
      number: '0123456',
      givenDate: '2020-12-01',
      givenBy: 'Andijon viloyati'
    },
    personal: {
      birthDate: '1994-06-22',
      gender: 'female',
      address: 'Andijon shahri'
    },
    education: 'Toshkent Moliya Instituti',
    skills: ['Financial Analysis', 'Excel', 'Data Analysis', 'Reporting'],
    performance: {
      efficiency: 96,
      projects: 5,
      rating: 4.9,
      overtime: 6
    },
    device: 'Kompyuter',
    location: 'Andijon',
    joined: '2022-11-05',
    lastLogin: '2024-01-21 08:55'
  }
];

// Statistics funksiyalari
const getStatistics = () => {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const inactiveEmployees = totalEmployees - activeEmployees;
  const presentToday = Math.floor(employees.length * 0.93);
  const lateToday = Math.floor(employees.length * 0.07);
  const remoteToday = employees.filter(emp => emp.status === 'remote').length;

  // Bo'limlar bo'yicha statistikalar
  const departmentStats = {};
  employees.forEach(emp => {
    if (!departmentStats[emp.department]) {
      departmentStats[emp.department] = {
        count: 0,
        totalAttendance: 0,
        totalSalary: 0
      };
    }
    departmentStats[emp.department].count++;
    departmentStats[emp.department].totalAttendance += emp.attendance;
    departmentStats[emp.department].totalSalary += parseInt(emp.salary);
  });

  // Jinslar bo'yicha statistikalar
  const genderStats = {
    male: employees.filter(emp => emp.personal?.gender === 'male').length,
    female: employees.filter(emp => emp.personal?.gender === 'female').length
  };

  // O'rtacha maosh
  const totalSalary = employees.reduce((sum, emp) => sum + parseInt(emp.salary), 0);
  const avgSalary = totalSalary / employees.length;

  // O'rtacha davomat
  const totalAttendance = employees.reduce((sum, emp) => sum + emp.attendance, 0);
  const avgAttendance = totalAttendance / employees.length;

  return {
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    presentToday,
    lateToday,
    remoteToday,
    departmentStats,
    genderStats,
    avgSalary,
    avgAttendance,
    totalSalary
  };
};

// Haftalik davomat ma'lumotlari
const getWeeklyAttendance = () => {
  const days = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];
  
  return days.map((day, index) => ({
    name: day,
    attendance: Math.floor(Math.random() * 10) + 85,
    late: Math.floor(Math.random() * 4) + 1,
    absent: Math.floor(Math.random() * 3)
  }));
};

// Bo'limlar taqsimoti
const getDepartmentDistribution = () => {
  const stats = getStatistics().departmentStats;
  const colors = [
    '#1976d2', '#d32f2f', '#388e3c', '#f57c00', 
    '#7b1fa2', '#00796b', '#5d4037', '#455a64'
  ];
  
  return Object.keys(stats).map((dept, index) => ({
    name: dept,
    value: stats[dept].count,
    color: colors[index % colors.length],
    avgAttendance: Math.round(stats[dept].totalAttendance / stats[dept].count),
    avgSalary: Math.round(stats[dept].totalSalary / stats[dept].count)
  }));
};

// So'nggi faoliyatlar
const getRecentActivities = () => {
  const activities = [];
  const actionTypes = [
    'Davomat qayd etdi',
    'GPS joylashuv yangilandi',
    'Kechikdi',
    'Ta\'tilga chiqdi',
    'Uzoq ish rejimi',
    'Ishni boshladi',
    'Ishni tugatdi',
    'Ma\'lumotlarini yangiladi'
  ];

  employees.slice(0, 8).forEach(emp => {
    const randomAction = actionTypes[Math.floor(Math.random() * actionTypes.length)];
    const timeAgo = [
      '5 daqiqa oldin',
      '15 daqiqa oldin',
      '30 daqiqa oldin',
      '1 soat oldin',
      '2 soat oldin',
      '3 soat oldin',
      'Bugun ertalab',
      'Kecha kechqurun'
    ][Math.floor(Math.random() * 8)];

    activities.push({
      id: emp.id,
      employee: emp.name,
      action: randomAction,
      time: timeAgo,
      status: randomAction.includes('Kechikdi') ? 'warning' : 
              randomAction.includes('Ta\'til') ? 'info' : 'success',
      details: emp.position
    });
  });

  return activities;
};

// Hisobotlar
const reports = [
  {
    id: 1,
    name: 'Oylik Davomat Hisobot',
    type: 'attendance',
    date: '2024-01',
    size: '2.4 MB',
    downloads: 45,
    lastDownload: '2024-01-15',
    description: 'Yanvar oyi davomat statistikasi',
    data: getWeeklyAttendance()
  },
  {
    id: 2,
    name: 'Kechikishlar Hisobot',
    type: 'late',
    date: '2024-01',
    size: '1.2 MB',
    downloads: 28,
    lastDownload: '2024-01-14',
    description: 'Kechikishlar va sabablari',
    data: employees.filter(emp => emp.attendance < 90).slice(0, 5)
  },
  {
    id: 3,
    name: 'Bo\'limlar Hisobot',
    type: 'department',
    date: '2023-12',
    size: '2.1 MB',
    downloads: 32,
    lastDownload: '2024-01-10',
    description: 'Bo\'limlar bo\'yicha faoliyat',
    data: getDepartmentDistribution()
  },
  {
    id: 4,
    name: 'Maoshlar Hisobot',
    type: 'salary',
    date: '2023-12',
    size: '1.8 MB',
    downloads: 38,
    lastDownload: '2024-01-05',
    description: 'Xodimlar maoshlari statistikasi',
    data: employees.map(emp => ({ name: emp.name, salary: parseInt(emp.salary) }))
  },
  {
    id: 5,
    name: 'Samaradorlik Hisobot',
    type: 'performance',
    date: '2023-11',
    size: '2.7 MB',
    downloads: 19,
    lastDownload: '2023-12-28',
    description: 'Xodimlar samaradorligi',
    data: employees.map(emp => ({ 
      name: emp.name, 
      efficiency: emp.performance.efficiency,
      projects: emp.performance.projects 
    }))
  }
];

// Helper funksiyalar
const getEmployeeById = (id) => {
  return employees.find(emp => emp.id === id);
};

const getEmployeesByDepartment = (department) => {
  return employees.filter(emp => emp.department === department);
};

const getActiveEmployees = () => {
  return employees.filter(emp => emp.status === 'active');
};

const getRemoteEmployees = () => {
  return employees.filter(emp => emp.status === 'remote');
};

const getOnLeaveEmployees = () => {
  return employees.filter(emp => emp.status === 'on_leave');
};

const getTopPerformers = (limit = 5) => {
  return [...employees]
    .sort((a, b) => b.performance.rating - a.performance.rating)
    .slice(0, limit);
};

const getLateEmployees = () => {
  return employees.filter(emp => emp.attendance < 90);
};

// Eksport qilish
export {
  departments,
  employees,
  reports,
  getStatistics,
  getWeeklyAttendance,
  getDepartmentDistribution,
  getRecentActivities,
  getEmployeeById,
  getEmployeesByDepartment,
  getActiveEmployees,
  getRemoteEmployees,
  getOnLeaveEmployees,
  getTopPerformers,
  getLateEmployees
};

// Default export
const data = {
  departments,
  employees,
  reports,
  getStatistics,
  getWeeklyAttendance,
  getDepartmentDistribution,
  getRecentActivities,
  getEmployeeById,
  getEmployeesByDepartment,
  getActiveEmployees,
  getRemoteEmployees,
  getOnLeaveEmployees,
  getTopPerformers,
  getLateEmployees
};

export default data;







