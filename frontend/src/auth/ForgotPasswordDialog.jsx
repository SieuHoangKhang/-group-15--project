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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      // Make the dialog paper more opaque and with stronger contrast so text is readable
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
      <DialogTitle sx={{ fontWeight: 700 }}>Quên mật khẩu</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.primary">
            Nhập email để nhận token đặt lại. Token sẽ có hiệu lực trong 15 phút.
          </Typography>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ bgcolor: (theme) => theme.palette.background.default, borderRadius: 1 }}
          />
          {token && (
            <div>
              <Typography variant="subtitle2">Token (dùng để reset trong demo):</Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all', background: 'rgba(0,0,0,0.04)', p: 1, borderRadius: 1 }}>{token}</Typography>
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
