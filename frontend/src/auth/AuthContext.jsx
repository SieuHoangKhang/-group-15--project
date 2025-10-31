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
    // Save basic auth first so api interceptor has token available
    saveAuth(t, u);
    // Immediately fetch /auth/me to get the latest profile fields (avatarUrl, phone, etc.)
    // This ensures that after logout/login the saved user contains avatarUrl persisted on server.
    try {
      const me = await api.get('/auth/me');
      const full = me.data || {};
      const merged = Object.assign({}, u || {}, full);
      saveAuth(t, merged);
      return merged;
    } catch (err) {
      // If /auth/me fails for any reason, return the original user object
      return u;
    }
  }, [saveAuth]);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch (_) { /* stateless */ }
    saveAuth(null, null);
  }, [saveAuth]);

  const updateProfile = useCallback(async ({ name, email, phone, address }) => {
    const res = await api.put('/auth/profile', { name, email, phone, address });
    const updated = res.data;
    // update local user copy
    // merge with existing user to avoid dropping fields like `role` that the profile endpoint may not return
    const merged = Object.assign({}, user || {}, updated);
    saveAuth(token, merged);
    return updated;
  }, [saveAuth, token, user]);

  const uploadAvatar = useCallback(async (imageDataUrl) => {
    const res = await api.post('/auth/upload-avatar', { image: imageDataUrl });
    const { avatarUrl } = res.data || {};
    // fetch updated profile
    const me = await api.get('/auth/me');
    const updated = me.data;
    // merge with existing user to preserve fields like `role` that /auth/me may not include
    const merged = Object.assign({}, user || {}, updated);
    saveAuth(token, merged);
    return { avatarUrl, updated };
  }, [saveAuth, token, user]);

  // Export uploadAvatar so components (ProfileForm) can call it
  const value = useMemo(() => ({ token, user, signup, login, logout, updateProfile, uploadAvatar }), [token, user, signup, login, logout, updateProfile, uploadAvatar]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
