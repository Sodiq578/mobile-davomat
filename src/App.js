import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { RealtimeProvider } from './context/RealtimeContext';
import AppRoutes from './routes/AppRoutes';
import './styles/reset.css';
import './styles/variables.css';
import './styles/main.css';

function App() {
  return (
    <Router>
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

