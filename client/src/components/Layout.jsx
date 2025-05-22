import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Box, Container, Typography } from '@mui/material';

export default function Layout() {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ pt: 4, pb: 4 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
      <Box component="footer" sx={{ mt: 4, py: 2 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            &copy; {new Date().getFullYear()} Booking App
          </Typography>
        </Container>
      </Box>
    </>
  );
}
