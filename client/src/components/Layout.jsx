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
      <Navbar />
      <Box component="main" sx={{ pt: 4, pb: 4 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
      <Box component="footer" sx={{ mt: 4, py: 2 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </Typography>
        </Container>
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
