import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';

import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import AdminPage from './pages/AdminPage.jsx';
import EmployeePage from './pages/EmployeePage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;