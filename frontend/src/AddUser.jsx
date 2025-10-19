import React, { useState } from "react";
import axios from "axios";
import GlassCard from "./ui/GlassCard";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useToast } from "./ui/ToastProvider";

function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email) {
      toast.warning("Vui lòng nhập đầy đủ tên và email");
      setLoading(false);
      return;
    }
    try {
  // Bám sát yêu cầu: axios.post("http://localhost:3000/api/users", newUser)
  const newUser = { name, email };
  await axios.post("http://localhost:3000/api/users", newUser);
      toast.success("Thêm user thành công!");
      setName("");
      setEmail("");
  // Phát sự kiện để UserList refetch danh sách
  window.dispatchEvent(new CustomEvent('users:refresh'));
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
