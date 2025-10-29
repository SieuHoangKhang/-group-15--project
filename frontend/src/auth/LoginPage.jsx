import React, { useState } from 'react';
import { Box, Paper, Typography, Stack, TextField, Button, Divider } from '@mui/material';
import { useAuth } from './AuthContext';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import ResetPasswordDialog from './ResetPasswordDialog';
import { useToast } from '../ui/ToastProvider';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  // receive optional onSwitchToSignup via props; default to no-op
  // but to keep backward compat we'll accept prop if provided
  // when used inside App.AuthContent we'll pass a callback
  // (see App.js)
  const onSwitchToSignup = arguments[0]?.onSwitchToSignup;

  const handleLogin = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      if (!email || !password) return toast.warning('Vui lòng nhập email và mật khẩu');
      await login({ email, password });
      toast.success('Đăng nhập thành công');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Đăng nhập thất bại');
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
      <Paper elevation={6} sx={{ width: '100%', maxWidth: 480, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }} align="center">Quản lý User</Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          Vui lòng đăng nhập để tiếp tục. Nếu bạn chưa có tài khoản, hãy đăng ký.
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <Stack spacing={2}>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
            <Button type="submit" variant="contained" disabled={loading} fullWidth>Đăng nhập</Button>
            <Divider />
            <Button variant="outlined" onClick={() => onSwitchToSignup ? onSwitchToSignup() : null} fullWidth>Đăng ký</Button>
            <Button variant="text" onClick={() => setOpenForgot(true)} fullWidth>Quên mật khẩu</Button>
            <Button variant="text" onClick={() => setOpenReset(true)} fullWidth>Đổi mật khẩu bằng token</Button>
          </Stack>
        </Box>
        <ForgotPasswordDialog open={openForgot} onClose={() => setOpenForgot(false)} />
        <ResetPasswordDialog open={openReset} onClose={() => setOpenReset(false)} />
        
      </Paper>
    </Box>
  );
}
