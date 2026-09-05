import React, { useState } from 'react';
import { registerUser } from '../services/api';

function Register({ onLoginSuccess, onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await registerUser({ name, email, password });
      onLoginSuccess(res.user);
      onNavigate('home');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <h2 className="auth-heading">Create Account</h2>

          {error && <div className="alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First and last name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm">Re-enter password</label>
              <input
                id="reg-confirm"
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create your Amazon account'}
            </button>
          </form>

          <p className="auth-terms">
            By creating an account, you agree to Amazon Clone's Conditions of Use & Sale.
          </p>

          <hr className="divider" />

          <p className="auth-switch">
            Already have an account?{' '}
            <span className="link-action" onClick={() => onNavigate('login')}>
              Sign in →
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
