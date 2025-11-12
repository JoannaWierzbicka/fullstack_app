import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import {
  Alert,
  Box,
  Container,
  Snackbar,
  Typography,
} from '@mui/material';
import { useLocale } from '../context/LocaleContext.jsx';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [flash, setFlash] = useState(null);
  const { t } = useLocale();

  useEffect(() => {
    const flashMessage = location.state?.flash;
    if (flashMessage) {
      setFlash(flashMessage);
      navigate(location.pathname + location.search + location.hash, { replace: true });
    }
  }, [location, navigate]);

  const handleFlashClose = (_event, reason) => {
    if (reason === 'clickaway') return;
    setFlash(null);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Navbar />
        <Box
          component="main"
          sx={{
            position: 'relative',
            flexGrow: 1,
            display: 'flex',
            alignItems: 'stretch',
            pt: { xs: 8, sm: 10, md: 12 },
            pb: { xs: 10, md: 12 },
            px: { xs: 1.5, sm: 2, md: 0 },
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(120% 90% at 50% -10%, rgba(36, 78, 96, 0.14) 0%, transparent 70%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              position: 'relative',
              px: { xs: 2.5, sm: 3.5, md: 5 },
              py: { xs: 2, sm: 3 },
              borderRadius: { xs: 5, md: 7 },
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(251, 247, 240, 0.82)',
              boxShadow: '0 32px 80px rgba(21, 40, 50, 0.2)',
              flexGrow: 1,
            }}
          >
            <Outlet />
          </Container>
        </Box>
        <Box
          component="footer"
          sx={{
            mt: { xs: 6, md: 10 },
            py: { xs: 4, md: 5 },
            background: 'linear-gradient(180deg, rgba(31,60,74,0) 0%, rgba(31,60,74,0.18) 100%)',
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3.5, md: 5 } }}>
            <Typography variant="caption" align="center" sx={{ display: 'block', letterSpacing: '0.2rem' }}>
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </Typography>
          </Container>
        </Box>
      </Box>
      <Snackbar
        open={Boolean(flash)}
        autoHideDuration={4000}
        onClose={handleFlashClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {flash ? (
          <Alert onClose={handleFlashClose} severity={flash.severity || 'info'} sx={{ width: '100%' }}>
            {flash.message}
          </Alert>
        ) : null}
      </Snackbar>
    </>
  );
}
