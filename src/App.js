import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

// ================= CONTEXT =================
import { AuthProvider } from "./context/AuthContext";
import { EmployeeProvider } from "./context/EmployeeContext";
import { RealtimeProvider } from "./context/RealtimeContext";

// ================= ROUTES =================
import AppRoutes from "./routes/AppRoutes";

// ================= STYLES =================
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/main.css";

const App = () => {
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
};

export default App;
