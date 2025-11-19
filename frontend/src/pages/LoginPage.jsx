import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import api from '../services/apiClient.js';

function LoginPage({ onLogin, isLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      onLogin(response.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Sign in</h1>
          <p className="card-subtitle">Dashboard access is restricted to registered users.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="form-row">
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <div className="error-text">{error}</div>}
          <div className="button-row">
            <button className="button button-primary" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="page-switch">
          <span>New here? </span>
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
