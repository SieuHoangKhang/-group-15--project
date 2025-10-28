import React, { useState } from 'react';
import { Box, Paper, Typography, Stack, TextField, Button } from '@mui/material';
import { useAuth } from './AuthContext';
import { useToast } from '../ui/ToastProvider';

export default function SignupPage({ onSwitchToLogin }) {
  const { signup } = useAuth();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      if (!name.trim()) return toast.warning('Vui lòng nhập tên');
      if (!/\S+@\S+\.\S+/.test(email)) return toast.warning('Email không hợp lệ');
      if (password.length < 6) return toast.warning('Mật khẩu tối thiểu 6 ký tự');
      if (password !== confirm) return toast.warning('Mật khẩu xác nhận không khớp');
      await signup({ name, email, password });
      toast.success('Đăng ký thành công. Vui lòng đăng nhập.');
      onSwitchToLogin?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper elevation={6} sx={{ width: '100%', maxWidth: 520, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }} align="center">Đăng ký tài khoản</Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          Điền thông tin để tạo tài khoản mới.
        </Typography>
        <Box component="form" onSubmit={handleSignup}>
          <Stack spacing={2}>
            <TextField label="Họ tên" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
            <TextField label="Xác nhận mật khẩu" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} fullWidth />
            <Button type="submit" variant="contained" disabled={loading} fullWidth>Đăng ký</Button>
            <Button variant="outlined" onClick={() => onSwitchToLogin?.()} fullWidth>Quay lại đăng nhập</Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
