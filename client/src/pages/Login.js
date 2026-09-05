import React, { useState } from 'react';
import { loginUser } from '../services/api';

function Login({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await loginUser({ email, password });
      onLoginSuccess(res.user);
      onNavigate('home');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials or register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-brand">
          <span className="brand-title">amazon<span className="brand-dot">.clone</span></span>
        </div>

        <div className="auth-card">
          <h2 className="auth-heading">Sign In</h2>

          {error && <div className="alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email or mobile phone number</label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-terms">
            By continuing, you agree to Amazon Clone's Conditions of Use and Privacy Notice.
          </p>
        </div>

        <div className="auth-divider">
          <span>New to Amazon Clone?</span>
        </div>

        <button
          className="btn btn-secondary btn-block"
          onClick={() => onNavigate('register')}
        >
          Create your Amazon account
        </button>
      </div>
    </div>
  );
}

export default Login;
