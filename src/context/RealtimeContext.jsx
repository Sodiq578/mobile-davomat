import React, { createContext, useState, useContext, useEffect } from 'react';

const RealtimeContext = createContext();

// useRealtime hook - named export
export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider');
  }
  return context;
};

// RealtimeProvider component - default export
export const RealtimeProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [locations, setLocations] = useState([]);
  const [onlineEmployees, setOnlineEmployees] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize fake data for demo
    setupFakeData();
    
    // In real app, you would initialize socket.io here
    // initializeSocket();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const setupFakeData = () => {
    // Fake initial data
    const fakeEmployees = [
      { 
        id: 1, 
        name: 'Ali Valiyev', 
        position: 'Ishchi',
        status: 'ishlayapti',
        lastSeen: new Date().toISOString(),
        isOnline: true
      },
      { 
        id: 2, 
        name: 'Hasan Hasanov', 
        position: 'Muhandis',
        status: 'tanaffus',
        lastSeen: new Date().toISOString(),
        isOnline: true
      },
      { 
        id: 3, 
        name: 'Dilshod Rajabov', 
        position: 'Haydovchi',
        status: 'ishlayapti',
        lastSeen: new Date().toISOString(),
        isOnline: true
      }
    ];

    setOnlineEmployees(fakeEmployees);
    
    // Generate initial locations
    const initialLocations = fakeEmployees.map(emp => ({
      employeeId: emp.id,
      name: emp.name,
      location: {
        lat: 41.3111 + (Math.random() - 0.5) * 0.01,
        lng: 69.2797 + (Math.random() - 0.5) * 0.01
      },
      timestamp: new Date().toISOString(),
      status: emp.status
    }));
    
    setLocations(initialLocations);
  };

  const emitLocation = (employeeId, location) => {
    // Fake implementation
    console.log('Emitting location:', { employeeId, location });
    
    // Update local state
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const newLocation = {
        employeeId: user.id,
        name: user.name,
        location,
        timestamp: new Date().toISOString(),
        status: 'ishlayapti'
      };
      
      setLocations(prev => {
        const filtered = prev.filter(loc => loc.employeeId !== user.id);
        return [...filtered, newLocation];
      });
    }
    
    return Promise.resolve({ success: true });
  };

  const emitStatus = (employeeId, status) => {
    // Fake implementation
    console.log('Emitting status:', { employeeId, status });
    
    // Update local state
    setOnlineEmployees(prev => 
      prev.map(emp => 
        emp.id === employeeId 
          ? { ...emp, status, lastSeen: new Date().toISOString() }
          : emp
      )
    );
    
    setLocations(prev => 
      prev.map(loc => 
        loc.employeeId === employeeId
          ? { ...loc, status, timestamp: new Date().toISOString() }
          : loc
      )
    );
    
    return Promise.resolve({ success: true });
  };

  const value = {
    socket,
    locations,
    onlineEmployees,
    isConnected,
    emitLocation,
    emitStatus
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

export default RealtimeContext;