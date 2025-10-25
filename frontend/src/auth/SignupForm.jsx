import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from '@mui/material';
import { useAuth } from './AuthContext';
import { useToast } from '../ui/ToastProvider';

export default function SignupForm({ open, onClose }) {
  const { signup } = useAuth();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      if (!name.trim()) return toast.warning('Vui lòng nhập tên');
      if (!/\S+@\S+\.\S+/.test(email)) return toast.warning('Email không hợp lệ');
      if (password.length < 6) return toast.warning('Mật khẩu tối thiểu 6 ký tự');
      if (password !== confirm) return toast.warning('Mật khẩu xác nhận không khớp');
      await signup({ name, email, password });
      toast.success('Đăng ký thành công. Hãy đăng nhập!');
      onClose?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Đăng ký</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Họ tên" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <TextField label="Xác nhận mật khẩu" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSignup} variant="contained" disabled={loading}>Đăng ký</Button>
      </DialogActions>
    </Dialog>
  );
}
