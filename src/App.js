import React from 'react';
import { HashRouter as Router } from 'react-router-dom'; // O'zgardi
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { RealtimeProvider } from './context/RealtimeContext';
import AppRoutes from './routes/AppRoutes';
import './styles/reset.css';
import './styles/variables.css';
import './styles/main.css';

function App() {
  return (
    <Router> {/* Endi HashRouter ishlaydi */}
      <AuthProvider>
        <EmployeeProvider>
          <RealtimeProvider>
            <AppRoutes />
          </RealtimeProvider>
        </EmployeeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;