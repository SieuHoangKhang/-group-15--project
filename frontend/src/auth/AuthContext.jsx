import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Load token từ localStorage khi mount
  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t) setToken(t);
    if (u) {
      try { setUser(JSON.parse(u)); } catch (_) {}
    }
  }, []);

  const saveAuth = useCallback((t, u) => {
    setToken(t);
    setUser(u);
    if (t) localStorage.setItem('token', t); else localStorage.removeItem('token');
    if (u) localStorage.setItem('user', JSON.stringify(u)); else localStorage.removeItem('user');
    // notify other parts (e.g., UsersContext) that login happened
    try { window.dispatchEvent(new CustomEvent('auth:login')); } catch (_) {}
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    const res = await api.post('/auth/signup', { name, email, password });
    return res.data; // không trả token theo yêu cầu, chỉ trả user info
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: t, user: u } = res.data || {};
    saveAuth(t, u);
    return u;
  }, [saveAuth]);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch (_) { /* stateless */ }
    saveAuth(null, null);
  }, [saveAuth]);

  const updateProfile = useCallback(async ({ name, email, phone, address }) => {
    const res = await api.put('/auth/profile', { name, email, phone, address });
    const updated = res.data;
    // update local user copy
    saveAuth(token, updated);
    return updated;
  }, [saveAuth, token]);

  const value = useMemo(() => ({ token, user, signup, login, logout, updateProfile }), [token, user, signup, login, logout, updateProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
