import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";
// Dùng Grid v2 (Material UI v7): import từ @mui/material/Grid2
import UserList from "./UserList";
import AddUser from "./AddUser";
import { ToastProvider } from "./ui/ToastProvider";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ProfileForm from "./auth/ProfileForm";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import { UsersProvider } from "./UsersContext";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResetPassword from './auth/ResetPassword';

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#6ea8fe" },
    secondary: { main: "#7f5af0" },
    background: {
      default: "#0b1220",
      paper: "rgba(255,255,255,0.04)",
    },
  },
  typography: {
    fontWeightBold: 800,
  },
  shape: { borderRadius: 16 },
});

function HeaderAuth() {
  const { user, logout } = useAuth();
  const [openProfile, setOpenProfile] = React.useState(false);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
      {user ? (
        <>
          <Typography variant="body1" sx={{ mr: 1 }}>Xin chào, {user.name}</Typography>
          <Button size="small" variant="outlined" onClick={() => setOpenProfile(true)}>Hồ sơ</Button>
          <Button size="small" variant="outlined" onClick={logout}>Đăng xuất</Button>
        </>
      ) : (
        null
      )}
      {/* Profile dialog (only when logged in) */}
      {user && <React.Suspense fallback={null}><ProfileForm open={openProfile} onClose={() => setOpenProfile(false)} /></React.Suspense>}
    </Box>
  );
}

function AdminArea() {
  const { user } = useAuth();
  if (!user) return <Typography variant="body1" color="text.secondary">Vui lòng đăng nhập để xem trang quản trị.</Typography>;
  // Any authenticated user may VIEW the user list (read-only).
  // Write operations (add/edit/delete) are still controlled by UI + server-side RBAC.
  return <UserList />;
}

function AuthContent() {
  const { user } = useAuth();
  const [authMode, setAuthMode] = React.useState('login'); // 'login' | 'signup'

  // If not authenticated, show a full-screen login or signup page
  if (!user) {
    if (authMode === 'login') return <LoginPage onSwitchToSignup={() => setAuthMode('signup')} />;
    return <SignupPage onSwitchToLogin={() => setAuthMode('login')} />;
  }

  // Authenticated: show normal app content
  return (
    <>
      <HeaderAuth />
      <Typography variant="h4" align="left" sx={{ fontWeight: 800, mt: 5, mb: 3 }}>
        Quản lý User
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
          gap: 3,
          alignItems: 'flex-start',
          mb: 6,
        }}
      >
        <Box>
          <AddUser />
        </Box>
        <Box>
          <AdminArea />
        </Box>
      </Box>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
      <AuthProvider>
      <UsersProvider>
      <GlobalStyles
        styles={{
          html: {
            // Luôn chừa không gian cho thanh cuộn để tránh đổi chiều rộng viewport gây "nhảy" layout
            overflowY: 'scroll',
            scrollbarGutter: 'stable',
          },
          '@keyframes fadeInUp': {
            from: { opacity: 0, transform: 'translateY(6px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
          body: {
            background:
              "radial-gradient(1200px circle at 20% 0%, #0f1d3b 0%, #0b1220 40%, #0b1220 100%)",
            minHeight: "100vh",
          },
          '.interactive': {
            transition: 'transform 180ms ease, box-shadow 180ms ease, background 180ms ease, border-color 180ms ease',
          },
          '.interactive:hover': {
            transform: 'translateY(-1px)',
          },
          '.interactive:active': {
            transform: 'translateY(0)',
            filter: 'brightness(0.98)',
          },
          'button.MuiButton-root': {
            transition: 'transform 160ms ease, box-shadow 160ms ease, background 160ms ease',
          },
          'button.MuiButton-root:active': {
            transform: 'translateY(0)',
          },
          '.focus-ring:focus-visible': {
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(127,90,240,0.35), 0 10px 30px rgba(0,0,0,0.35)',
            borderColor: 'rgba(255,255,255,0.22) !important',
          },
          '#root > div': {
            animation: 'fadeInUp 360ms ease both',
          }
        }}
      />
      <Container maxWidth="lg">
        <BrowserRouter>
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/*" element={<AuthContent />} />
          </Routes>
        </BrowserRouter>
      </Container>
      </UsersProvider>
      </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
