import React, { useState } from "react";
import { useUsers } from "./UsersContext";
import GlassCard from "./ui/GlassCard";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useToast } from "./ui/ToastProvider";
import { useAuth } from "./auth/AuthContext";

function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { token } = useAuth();
  const { addUser } = useUsers();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Yêu cầu đăng nhập trước khi thêm
    if (!token) {
      toast.warning("Vui lòng đăng nhập để thêm người dùng");
      setLoading(false);
      return;
    }
    // Validation
    if (!name || !name.trim()) {
      toast.warning("Tên không được để trống");
      setLoading(false);
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email || !emailRegex.test(email)) {
      toast.warning("Email không hợp lệ");
      setLoading(false);
      return;
    }
    try {
      const newUser = { name: name.trim(), email: email.trim() };
      await addUser(newUser);
      toast.success("Thêm user thành công!");
      setName("");
      setEmail("");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Lỗi không xác định";
      console.error("Lỗi khi thêm user:", err);
      toast.error(`Không thể thêm user: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard>
      <CardHeader title="Thêm người dùng" />
      <CardContent sx={{ pt: 0 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} useFlexGap flexWrap="wrap">
            <TextField
              label="Tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              className="interactive focus-ring"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(4px)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.22)' },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 3px rgba(110,168,254,0.25)',
                  },
                },
              }}
            />
            <TextField
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              className="interactive focus-ring"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(4px)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.22)' },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 3px rgba(110,168,254,0.25)',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className="interactive"
              sx={{
                minWidth: 140,
                background: 'linear-gradient(135deg, #7f5af0 0%, #6ea8fe 100%)',
                boxShadow: '0 10px 24px rgba(127,90,240,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #8a67ff 0%, #7fb4ff 100%)',
                  boxShadow: '0 14px 28px rgba(127,90,240,0.45)',
                },
                '&:active': {
                  boxShadow: '0 8px 18px rgba(127,90,240,0.35)',
                },
              }}
            >
              {loading ? "Đang thêm..." : "Thêm"}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </GlassCard>
  );
}

export default AddUser;
