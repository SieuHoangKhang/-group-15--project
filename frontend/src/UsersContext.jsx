import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from './api';

const UsersContext = createContext(null);

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/users');
      setUsers(res.data || []);
    } catch (err) {
      setError(err?.message || 'Network Error');
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
