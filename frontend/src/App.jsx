import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import { getStoredAuth, saveAuth, clearAuth } from './services/authStorage.js';

function PrivateRoute({ children, isLoggedIn }) {
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const [auth, setAuth] = useState(() => getStoredAuth());

  useEffect(() => {
    saveAuth(auth);
  }, [auth]);

  const handleLogin = (data) => {
    setAuth({ token: data.token, user: data.user });
  };

  const handleLogout = () => {
    setAuth(null);
    clearAuth();
  };

  const isLoggedIn = Boolean(auth?.token);

  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage onLogin={handleLogin} isLoggedIn={isLoggedIn} />}
      />
      <Route
        path="/register"
        element={<RegisterPage onLogin={handleLogin} isLoggedIn={isLoggedIn} />}
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <DashboardPage auth={auth} onLogout={handleLogout} />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
