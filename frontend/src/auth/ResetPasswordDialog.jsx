import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, Typography } from '@mui/material';
import api from '../api';
import { useToast } from '../ui/ToastProvider';

export default function ResetPasswordDialog({ open, onClose }) {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleReset = async () => {
    try {
      setLoading(true);
      const res = await api.post('/auth/reset-password', { token, password });
      toast.success(res.data.message || 'Đặt lại mật khẩu thành công');
      onClose?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Reset thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          bgcolor: (theme) => theme.palette.background.paper,
          color: (theme) => theme.palette.text.primary,
          boxShadow: 12,
          borderRadius: 2,
          p: 1,
        }
      }}
      BackdropProps={{ sx: { backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Đổi mật khẩu bằng token</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.primary">Nhập token bạn nhận được trong email và mật khẩu mới.</Typography>
          <TextField label="Token" value={token} onChange={(e) => setToken(e.target.value)} fullWidth sx={{ bgcolor: (theme) => theme.palette.background.default, borderRadius: 1 }} />
          <TextField label="Mật khẩu mới" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth sx={{ bgcolor: (theme) => theme.palette.background.default, borderRadius: 1 }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleReset} variant="contained" disabled={loading}>Đổi mật khẩu</Button>
      </DialogActions>
    </Dialog>
  );
}
