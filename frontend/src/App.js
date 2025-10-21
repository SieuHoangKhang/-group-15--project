import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import UserList from "./UserList";
import AddUser from "./AddUser";
import { ToastProvider } from "./ui/ToastProvider";

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
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
        <Typography variant="h4" align="left" sx={{ fontWeight: 800, mt: 5, mb: 3 }}>
          Quản lý User
        </Typography>
  <Grid container spacing={3} alignItems="flex-start" sx={{ mb: 6, flexWrap: 'nowrap' }}>
          {/* Bên trái: Form thêm User */}
          <Grid item xs={5} sm={5} md={5}>
            <AddUser />
          </Grid>
          {/* Bên phải: Danh sách User */}
          <Grid item xs={7} sm={7} md={7}>
            <UserList />
          </Grid>
        </Grid>
      </Container>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
