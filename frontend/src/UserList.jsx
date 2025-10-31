import React, { useEffect, useState } from "react";
import { useUsers } from "./UsersContext";
import { useAuth } from "./auth/AuthContext";
import GlassCard from "./ui/GlassCard";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Box from '@mui/material/Box';
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
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";

function UserList() {
  const { users, loading, error, fetchUsers, updateUser, deleteUser } = useUsers();
  const { user: authUser } = useAuth();
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [edit, setEdit] = useState({ open: false, id: null, name: "", email: "" });
  const [showAllOpen, setShowAllOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
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
      await deleteUser(id);
      toast.success('Đã xoá user');
      closeConfirm();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Lỗi xoá user';
      toast.error(msg);
    }
  };

  const openEdit = (user) => {
    setEdit({ open: true, id: user.id, name: user.name, email: user.email });
  };
  const closeEdit = () => setEdit({ open: false, id: null, name: "", email: "" });
  const handleUpdate = async () => {
    if (!edit.id) return;
    if (!edit.name || !edit.email) {
      toast.warning('Vui lòng nhập đầy đủ tên và email');
      return;
    }
    try {
      await updateUser(edit.id, { name: edit.name, email: edit.email });
      toast.success('Cập nhật user thành công');
      closeEdit();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Lỗi cập nhật user';
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
          <>
          {/* Compact scrollable preview */}
          <Box sx={{ maxHeight: 320, overflow: 'auto', mb: 1, borderRadius: 1 }}>
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
                    key={user.id}
                    hover
                    sx={{
                      transition: 'background 160ms ease, transform 160ms ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.03)',
                      },
                    }}
                  >
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="right">
                      {(() => {
                        // Quyền hiển thị nút: admin hiển thị cho tất cả; user chỉ cho phép sửa/xóa chính họ
                        const isAdmin = !!authUser && String(authUser.role || '').toLowerCase() === 'admin';
                        const isSelf = !!authUser && (authUser.id === user.id || authUser.id === user._id || authUser.sub === user.id);
                        const showDelete = isAdmin || isSelf;
                        const showEdit = isAdmin || isSelf;
                        return (
                          <>
                            {showDelete && (
                              <IconButton
                                color="error"
                                onClick={() => confirmDelete(user.id)}
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
                            )}
                            {showEdit && (
                              <IconButton
                                color="primary"
                                onClick={() => openEdit(user)}
                                className="interactive"
                                sx={{ ml: 1,
                                  transition: 'box-shadow 140ms ease, background 140ms ease',
                                  '&:hover': { boxShadow: '0 6px 16px rgba(110,168,254,0.25)' },
                                  '&:active': { boxShadow: '0 4px 12px rgba(110,168,254,0.2)' },
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                          </>
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>
          </Box>

          {/* Actions below preview */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1 }}>
            <Button size="small" variant="outlined" onClick={() => setShowAllOpen(true)}>Xem tất cả</Button>
          </Box>

          {/* Full list dialog */}
          <Dialog
            open={showAllOpen}
            onClose={() => setShowAllOpen(false)}
            fullWidth
            maxWidth="lg"
            BackdropProps={{
              sx: {
                // make background behind the dialog noticeably blurred and dimmed
                backgroundColor: 'rgba(0,0,0,0.64)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                transition: 'background-color 180ms ease, backdrop-filter 180ms ease',
              },
            }}
            PaperProps={{
              sx: {
                // make the dialog paper more solid and higher-contrast than the heavily blurred backdrop
                bgcolor: (theme) => theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: 6,
                backgroundImage: 'none',
                opacity: 0.98,
              },
            }}
          >
            <DialogTitle>Toàn bộ danh sách User</DialogTitle>
            <DialogContent dividers sx={{ p: 1 }}>
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
                      <TableRow key={user.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell align="right">
                          {(() => {
                            const isAdmin = !!authUser && String(authUser.role || '').toLowerCase() === 'admin';
                            const isSelf = !!authUser && (authUser.id === user.id || authUser.id === user._id || authUser.sub === user.id);
                            const showDelete = isAdmin || isSelf;
                            const showEdit = isAdmin || isSelf;
                            return (
                              <>
                                {showDelete && (
                                  <IconButton color="error" onClick={() => confirmDelete(user.id)}>
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                                {showEdit && (
                                  <IconButton color="primary" onClick={() => openEdit(user)} sx={{ ml: 1 }}>
                                    <EditIcon />
                                  </IconButton>
                                )}
                              </>
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowAllOpen(false)}>Đóng</Button>
            </DialogActions>
          </Dialog>
          </>
        ) : null}
      </CardContent>
      <Dialog
        open={confirm.open}
        onClose={closeConfirm}
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
        <DialogTitle sx={{ fontWeight: 700 }}>Xoá user?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.primary">Bạn có chắc chắn muốn xoá user #{confirm.id} không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Huỷ</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Xoá</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={edit.open}
        onClose={closeEdit}
        fullWidth
        maxWidth="sm"
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
        <DialogTitle sx={{ fontWeight: 700 }}>Sửa thông tin user</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.primary">Chỉnh sửa tên và email của user.</Typography>
          <TextField
            margin="dense"
            label="Tên"
            fullWidth
            value={edit.name}
            onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))}
            sx={{ bgcolor: (theme) => theme.palette.background.default, borderRadius: 1, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={edit.email}
            onChange={(e) => setEdit((s) => ({ ...s, email: e.target.value }))}
            sx={{ bgcolor: (theme) => theme.palette.background.default, borderRadius: 1, mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit}>Huỷ</Button>
          <Button onClick={handleUpdate} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </GlassCard>
  );
}

export default UserList;
