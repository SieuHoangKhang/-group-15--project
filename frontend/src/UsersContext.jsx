import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from './api';

const UsersContext = createContext(null);

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      // Only attempt to fetch users if we have a token stored (avoid 401 noise)
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setUsers([]);
        return;
      }
      // Allow any authenticated user to fetch the user list (read-only).
      // Backend will enforce create/update/delete permissions.
      setLoading(true);
      setError('');
      const res = await api.get('/users');
      setUsers(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Network Error');
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(async (payload) => {
    const res = await api.post('/users', payload);
    // Refresh list after add
    await fetchUsers();
    return res.data;
  }, [fetchUsers]);

  const updateUser = useCallback(async (id, payload) => {
    const res = await api.put(`/users/${id}`, payload);
    await fetchUsers();
    return res.data;
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id) => {
    const res = await api.delete(`/users/${id}`);
    await fetchUsers();
    return res.data;
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
    // Listen for auth login events so we refetch when a user logs in (useful for admin)
    const onAuthLogin = () => fetchUsers();
    window.addEventListener('auth:login', onAuthLogin);
    return () => window.removeEventListener('auth:login', onAuthLogin);
  }, [fetchUsers]);

  return (
    <UsersContext.Provider value={{ users, loading, error, fetchUsers, addUser, updateUser, deleteUser }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error('useUsers must be used within UsersProvider');
  return ctx;
}

export default UsersContext;
