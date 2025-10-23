import React from 'react';
import Paper from '@mui/material/Paper';

export default function GlassCard({ children, sx, ...props }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        border: '1px solid',
        borderColor: 'rgba(255,255,255,0.08)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(8px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%)',
          pointerEvents: 'none',
        },
        // Tránh dịch chuyển phần tử khi hover gây cảm giác "nhảy" layout
        '&:hover': {
          boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
          borderColor: 'rgba(255,255,255,0.14)',
        },
        '&:active': {
          boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}
