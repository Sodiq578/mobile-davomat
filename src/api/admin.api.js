const employees = [
  {
    id: 1,
    name: 'Ali Valiyev',
    position: 'Ishchi',
    phone: '+998901234567',
    isOnline: true,
    lastLocation: { lat: 41.3111, lng: 69.2797 },
    lastSnapshot: null,
    currentStatus: 'ishlayapti'
  },
  {
    id: 3,
    name: 'Hasan Hasanov',
    position: 'Muhandis',
    phone: '+998901234569',
    isOnline: false,
    lastLocation: null,
    lastSnapshot: null,
    currentStatus: 'chiqib ketdi'
  },
  {
    id: 4,
    name: 'Dilshod Rajabov',
    position: 'Haydovchi',
    phone: '+998901234570',
    isOnline: true,
    lastLocation: { lat: 41.3151, lng: 69.2847 },
    lastSnapshot: null,
    currentStatus: 'ishlayapti'
  }
];

export const adminApi = {
  getAllEmployees: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(employees);
      }, 800);
    });
  },

  getEmployeeDetails: async (employeeId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employee = employees.find(e => e.id === employeeId);
        const attendance = [
          {
            date: '2024-01-15',
            checkIn: '09:00',
            checkOut: '18:00',
            status: 'ishlayapti'
          },
          {
            date: '2024-01-14',
            checkIn: '08:55',
            checkOut: '17:30',
            status: 'chiqib ketdi'
          }
        ];
        resolve({ employee, attendance });
      }, 600);
    });
  },

  getLiveLocations: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const liveEmployees = employees.filter(e => e.isOnline);
        resolve(liveEmployees.map(e => ({
          id: e.id,
          name: e.name,
          position: e.position,
          location: e.lastLocation,
          status: e.currentStatus
        })));
      }, 500);
    });
  }
};