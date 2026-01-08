const attendanceData = [
  {
    id: 1,
    employeeId: 1,
    date: '2024-01-15',
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'ishlayapti',
    location: { lat: 41.3111, lng: 69.2797 },
    snapshot: null
  }
];

export const employeeApi = {
  getMyAttendance: async (employeeId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const myAttendance = attendanceData.filter(
          a => a.employeeId === employeeId
        );
        resolve(myAttendance);
      }, 800);
    });
  },

  checkIn: async (employeeId, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecord = {
          id: Date.now(),
          employeeId,
          date: new Date().toISOString().split('T')[0],
          checkIn: new Date().toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          }),
          status: 'ishlayapti',
          ...data
        };
        attendanceData.push(newRecord);
        resolve({ success: true, data: newRecord });
      }, 1000);
    });
  },

  checkOut: async (attendanceId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const record = attendanceData.find(a => a.id === attendanceId);
        if (record) {
          record.checkOut = new Date().toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          });
          record.status = 'chiqib ketdi';
          resolve({ success: true, data: record });
        }
        resolve({ success: false });
      }, 800);
    });
  },

  updateStatus: async (attendanceId, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const record = attendanceData.find(a => a.id === attendanceId);
        if (record) {
          record.status = status;
          resolve({ success: true, data: record });
        }
        resolve({ success: false });
      }, 600);
    });
  }
};