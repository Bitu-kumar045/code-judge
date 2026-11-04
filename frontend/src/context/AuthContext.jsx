import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Broadcast user change across the app so all user-scoped data updates immediately
    window.dispatchEvent(new CustomEvent('codejudge_auth_changed', { detail: { user: userData } }));
    window.dispatchEvent(new CustomEvent('codejudge_solved_updated', { detail: { user: userData } }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Broadcast logout so guest/clean state is loaded
    window.dispatchEvent(new CustomEvent('codejudge_auth_changed', { detail: { user: null } }));
    window.dispatchEvent(new CustomEvent('codejudge_solved_updated', { detail: { user: null } }));
  };

  // Only the specific admin account has admin access
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAdmin, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
