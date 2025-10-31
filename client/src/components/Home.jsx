import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLocale } from '../context/LocaleContext.jsx';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();

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
        {t('home.heroTitle')}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {t('home.heroSubtitle')}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {isAuthenticated ? (
          <Button component={RouterLink} to="/dashboard" variant="contained" size="large">
            {t('home.goToDashboard')}
          </Button>
        ) : (
          <>
            <Button component={RouterLink} to="/login" variant="contained" size="large">
              {t('home.login')}
            </Button>
            <Button component={RouterLink} to="/register" variant="outlined" size="large">
              {t('home.createAccount')}
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
