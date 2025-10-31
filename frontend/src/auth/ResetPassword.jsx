import React, { useState } from "react";
import axios from "../api";
import { Box, Paper, Typography, TextField, Button } from '@mui/material';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [tokenInput, setTokenInput] = useState('');
  const tokenFromQuery = new URLSearchParams(window.location.search).get("token") || '';

  const token = tokenFromQuery || tokenInput;

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/reset-password", {
        token,
        password: newPassword,
      });
      alert(res.data.message);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Lỗi';
      alert(msg);
    }
  };

  return (
    <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300 }}>
      {/* backdrop with blur to emphasize the form */}
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }} />

      <Paper elevation={12} sx={{ position: 'relative', zIndex: 2, width: 480, p: 3, borderRadius: 2, bgcolor: (theme) => theme.palette.background.paper, color: (theme) => theme.palette.text.primary }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>Đổi mật khẩu</Typography>

        <form onSubmit={handleReset}>
          {!tokenFromQuery && (
            <TextField
              label="Token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              fullWidth
              sx={{ mb: 2, bgcolor: (theme) => theme.palette.background.default, borderRadius: 1 }}
            />
          )}

          <TextField
            label="Mật khẩu mới"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2, bgcolor: (theme) => theme.palette.background.default, borderRadius: 1 }}
          />

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="contained" type="submit">Đặt lại mật khẩu</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default ResetPassword;
