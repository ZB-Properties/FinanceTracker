import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './Routes/ProtectedRoutes';
import Dashboard from './pages/Dashboard';
import Transaction from './pages/Transaction';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';


const App = () => {
  
   

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute>
              <Dashboard /></ProtectedRoute>} />
        <Route path="/transaction" element={ <ProtectedRoute><Transaction /></ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};


export default App;