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
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, fontWeight: 700 }}
      >
        {t('home.heroTitle')}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ fontSize: { xs: '1rem', sm: '1.05rem' }, lineHeight: 1.6 }}
      >
        {t('home.heroSubtitle')}
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ width: '100%' }}
        justifyContent={{ xs: 'flex-start', sm: 'center' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        {isAuthenticated ? (
          <Button
            component={RouterLink}
            to="/dashboard"
            variant="contained"
            size="large"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {t('home.goToDashboard')}
          </Button>
        ) : (
          <>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              size="large"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {t('home.login')}
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              size="large"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {t('home.createAccount')}
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
