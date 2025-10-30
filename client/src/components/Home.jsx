import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 3,
        maxWidth: 640,
        mx: 'auto',
        px: 2,
        py: 6,
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Manage your bookings like a pro
      </Typography>
      <Typography variant="body1" color="text.secondary">
        A dedicated workspace for property owners to organise reservations, track availability, and
        keep every guest stay under control.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {isAuthenticated ? (
          <Button component={RouterLink} to="/dashboard" variant="contained" size="large">
            Go to dashboard
          </Button>
        ) : (
          <>
            <Button component={RouterLink} to="/login" variant="contained" size="large">
              Log in
            </Button>
            <Button component={RouterLink} to="/register" variant="outlined" size="large">
              Create account
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
