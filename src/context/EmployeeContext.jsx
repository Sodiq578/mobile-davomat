import React, { createContext, useState, useContext } from 'react';
import { api } from '../api';

const EmployeeContext = createContext();

// useEmployee hook - named export
export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within EmployeeProvider');
  }
  return context;
};

// EmployeeProvider component - default export
export const EmployeeProvider = ({ children }) => {
  const [attendance, setAttendance] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const getMyAttendance = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) return;
      
      const user = JSON.parse(userData);
      const data = await api.getMyAttendance(user.id);
      setAttendance(data);
      
      const today = data.find(a => {
        const today = new Date().toISOString().split('T')[0];
        return a.date === today;
      });
      setCurrentSession(today || null);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIn = async (data) => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      const result = await api.checkIn(user.id, data);
      if (result.success) {
        setCurrentSession(result.data);
        await getMyAttendance();
      }
      return result;
    } catch (error) {
      console.error('Error checking in:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    try {
      if (!currentSession) return null;
      setLoading(true);
      const result = await api.checkOut(currentSession.id);
      if (result.success) {
        setCurrentSession(null);
        await getMyAttendance();
      }
      return result;
    } catch (error) {
      console.error('Error checking out:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      if (!currentSession) return null;
      setLoading(true);
      const result = await api.updateStatus(currentSession.id, status);
      if (result.success) {
        setCurrentSession(result.data);
      }
      return result;
    } catch (error) {
      console.error('Error updating status:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    attendance,
    currentSession,
    loading,
    getMyAttendance,
    checkIn,
    checkOut,
    updateStatus
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeContext;