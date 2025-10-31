import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, Typography } from '@mui/material';
import api from '../api';
import { useToast } from '../ui/ToastProvider';

export default function ForgotPasswordDialog({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      setToken(res.data.token || '');
      toast.success(res.data.message || 'Yêu cầu đã được xử lý');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Yêu cầu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Quên mật khẩu</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2">Nhập email để nhận token đặt lại (trong demo token sẽ được trả về màn hình).</Typography>
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          {token && (
            <div>
              <Typography variant="subtitle2">Token (dùng để reset trong demo):</Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{token}</Typography>
            </div>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>Gửi</Button>
      </DialogActions>
    </Dialog>
  );
}
