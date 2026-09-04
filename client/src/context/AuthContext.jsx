import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('shophub_token') || '');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await authService.getMe();
        setUser(response.data.user || response.data);
      } catch (err) {
        console.warn('Failed to verify token:', err.message);
        localStorage.removeItem('shophub_token');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('shophub_token', newToken);
      setToken(newToken);
      setUser(userData);
      addToast(`Welcome back, ${userData.name || 'User'}!`, 'success');
      return true;
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token: newToken, user: newUserData } = response.data;
      localStorage.setItem('shophub_token', newToken);
      setToken(newToken);
      setUser(newUserData);
      addToast('Account created successfully!', 'success');
      return true;
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('shophub_token');
    setToken('');
    setUser(null);
    addToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin' || user?.isAdmin === true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
