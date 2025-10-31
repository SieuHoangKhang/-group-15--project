import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, Avatar, Box, Typography } from '@mui/material';
import { useAuth } from './AuthContext';
import { useToast } from '../ui/ToastProvider';

export default function ProfileForm({ open, onClose }) {
  const { user, updateProfile, uploadAvatar } = useAuth();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setAvatarPreview(user.avatarUrl || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setAvatarPreview('');
    }
  }, [user, open]);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAvatar = async () => {
    if (!avatarPreview) return toast.warning('Chọn ảnh trước khi tải lên');
    try {
      setLoading(true);
      await uploadAvatar(avatarPreview);
      toast.success('Ảnh đại diện đã được cập nhật');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload thất bại');
    } finally {
      setLoading(false);
    }
  };

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
      <DialogTitle sx={{ fontWeight: 700 }}>Hồ sơ của bạn</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.primary">Cập nhật thông tin hồ sơ và ảnh đại diện của bạn.</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar src={avatarPreview || ''} sx={{ width: 64, height: 64, border: '2px solid rgba(255,255,255,0.06)', bgcolor: (theme) => theme.palette.background.default }} />
            <div>
              <input
                id="avatar-file"
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files[0])}
                style={{ display: 'block', marginBottom: 8 }}
              />
              <Button size="small" variant="outlined" onClick={handleUploadAvatar} disabled={loading}>Tải lên ảnh</Button>
            </div>
          </Box>
          <TextField label="Họ tên" value={name} onChange={(e) => setName(e.target.value)} fullWidth sx={{ bgcolor: (theme) => theme.palette.background.default, borderRadius: 1 }} />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={{ bgcolor: (theme) => theme.palette.background.default, borderRadius: 1 }} />
          <TextField label="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth sx={{ bgcolor: (theme) => theme.palette.background.default, borderRadius: 1 }} />
          <TextField label="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth sx={{ bgcolor: (theme) => theme.palette.background.default, borderRadius: 1 }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>Lưu</Button>
      </DialogActions>
    </Dialog>
  );
}
