import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import GlassCard from "./ui/GlassCard";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useToast } from "./ui/ToastProvider";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const toast = useToast();

  const fetchUsers = useCallback(async () => {
      try {
        setLoading(true);
        setError('');
  // Gọi API backend MongoDB Atlas
  const res = await axios.get("http://localhost:3001/users");
        setUsers(res.data);
      } catch (err) {
        const msg = err?.message || 'Network Error';
        setError(msg);
        toast.error(`Không thể tải danh sách: ${msg}`);
      } finally {
        setLoading(false);
      }
    }, [toast]);

  useEffect(() => {
    fetchUsers();
    const handler = () => fetchUsers();
    window.addEventListener('users:refresh', handler);
    return () => window.removeEventListener('users:refresh', handler);
  }, [fetchUsers]);

  const confirmDelete = (id) => setConfirm({ open: true, id });
  const closeConfirm = () => setConfirm({ open: false, id: null });

  const handleDelete = async () => {
    const id = confirm.id;
    if (!id) return;
    try {
  // Gọi API backend MongoDB Atlas để xóa user
  await axios.delete(`http://localhost:3001/users/${id}`);
      toast.success('Đã xoá user');
      closeConfirm();
      fetchUsers();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Lỗi xoá user';
      toast.error(msg);
    }
  };

  return (
    <GlassCard>
      <CardHeader title="Danh sách User" />
      <CardContent sx={{ pt: 0 }}>
        {error && (
          <>
            <Typography variant="body2" color="error" sx={{ mb: 1 }}>
              Lỗi tải dữ liệu: {error}
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={fetchUsers}
              className="interactive"
              sx={{
                background: 'linear-gradient(135deg, #7f5af0 0%, #6ea8fe 100%)',
                boxShadow: '0 8px 18px rgba(127,90,240,0.35)',
              }}
            >
              Thử lại
            </Button>
          </>
        )}
        {users.length === 0 && !loading && !error ? (
          <Typography variant="body2" color="text.secondary">Chưa có user nào.</Typography>
        ) : users.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user._id}
                    hover
                    sx={{
                      transition: 'background 160ms ease, transform 160ms ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.03)',
                      },
                    }}
                  >
                    <TableCell>{user._id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => confirmDelete(user._id)}
                        className="interactive"
                        sx={{
                          transition: 'box-shadow 140ms ease, background 140ms ease',
                          '&:hover': {
                            boxShadow: '0 6px 16px rgba(255,0,0,0.25)',
                          },
                          '&:active': { boxShadow: '0 4px 12px rgba(255,0,0,0.2)' },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </CardContent>
      <Dialog open={confirm.open} onClose={closeConfirm}>
        <DialogTitle>Xoá user?</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xoá user #{confirm.id} không?</DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Huỷ</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Xoá</Button>
        </DialogActions>
      </Dialog>
    </GlassCard>
  );
}

export default UserList;
