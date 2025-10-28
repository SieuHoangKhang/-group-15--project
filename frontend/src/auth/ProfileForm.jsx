import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from '@mui/material';
import { useAuth } from './AuthContext';
import { useToast } from '../ui/ToastProvider';

export default function ProfileForm({ open, onClose }) {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
    }
  }, [user, open]);

  const handleSave = async () => {
    try {
    setLoading(true);
    if (!name.trim()) return toast.warning('Vui lòng nhập tên');
    if (!/\S+@\S+\.\S+/.test(email)) return toast.warning('Email không hợp lệ');
    await updateProfile({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim() || null, address: address.trim() || null });
      toast.success('Cập nhật thành công');
      onClose?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Hồ sơ của bạn</DialogTitle>
      <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Họ tên" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
          <TextField label="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>Lưu</Button>
      </DialogActions>
    </Dialog>
  );
}
