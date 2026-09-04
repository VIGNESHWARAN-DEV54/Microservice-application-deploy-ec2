import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Sparkles } from 'lucide-react';

const AuthModal = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (isRegister) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
      onClose();
    } catch (err) {
      // Error handled by AuthContext toast
    } finally {
      setSubmitting(false);
    }
  };

  const autofillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@example.com');
      setPassword('password123');
      if (isRegister) setName('Admin User');
    } else {
      setEmail('john@example.com');
      setPassword('password123');
      if (isRegister) setName('John Doe');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2rem',
          borderRadius: '24px',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: '#94a3b8',
            padding: '4px',
          }}
        >
          <X size={20} />
        </button>

        {/* Tab Header */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            style={{
              paddingBottom: '0.75rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: !isRegister ? '#818cf8' : '#64748b',
              borderBottom: !isRegister ? '2px solid #818cf8' : 'none',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            style={{
              paddingBottom: '0.75rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: isRegister ? '#818cf8' : '#64748b',
              borderBottom: isRegister ? '2px solid #818cf8' : 'none',
            }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '38px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            <span>{submitting ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Helper Buttons */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed rgba(255, 255, 255, 0.08)' }}>
          <p style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginBottom: '8px' }}>
            Quick Demo Autofill:
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => autofillDemo('user')}
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              Customer Demo
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => autofillDemo('admin')}
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
