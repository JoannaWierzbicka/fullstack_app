import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  IconButton,
  Drawer,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FilterHdrIcon from '@mui/icons-material/FilterHdr';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLocale } from '../context/LocaleContext.jsx';

export default function Navbar() {
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();
  const { t, language, setLanguage } = useLocale();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [menuOpen, setMenuOpen] = useState(false);

  const userLabel = user?.email || user?.phone || null;
  const toggleLanguage = () => setLanguage(language === 'en' ? 'pl' : 'en');
  const languageLabel = language === 'en' ? 'PL' : 'EN';

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const renderLanguageButton = (props = {}) => (
    <Button
      variant="outlined"
      color="inherit"
      onClick={toggleLanguage}
      aria-label={t('navbar.language')}
      size="small"
      {...props}
    >
      {languageLabel}
    </Button>
  );

  const drawerNavItems = isAuthenticated
    ? [
        { key: 'dashboard', label: t('navbar.allReservations'), to: '/dashboard' },
        { key: 'add', label: t('navbar.addReservation'), to: '/dashboard/add' },
        { key: 'settings', label: t('navbar.settings'), to: '/dashboard/settings' },
      ]
    : [
        { key: 'login', label: t('navbar.login'), to: '/login' },
        { key: 'register', label: t('navbar.register'), to: '/register' },
      ];

  return (
    <AppBar
      position="sticky"
      color="primary"
      sx={{
        borderRadius: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
      }}
    >
      <Toolbar sx={{ minHeight: 56, px: { xs: 2, sm: 3, md: 4 } }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            color="inherit"
            sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <FilterHdrIcon fontSize="medium" />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, fontWeight: 600 }}>
              MyResCal
            </Box>
          </Typography>
        </Stack>

        {isDesktop ? (
          isAuthenticated ? (
            <Stack direction="row" spacing={2} alignItems="center">
              {userLabel && (
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {userLabel}
                </Typography>
              )}

              <Button
                component={NavLink}
                to="/dashboard"
                variant="contained"
                color="secondary"
                sx={{ '&.active': { backgroundColor: 'secondary.dark' } }}
              >
                {t('navbar.allReservations')}
              </Button>
              <Button
                component={NavLink}
                to="/dashboard/add"
                variant="outlined"
                color="secondary"
                sx={{
                  '&.active': {
                    backgroundColor: 'secondary.main',
                    color: 'common.white',
                  },
                }}
              >
                {t('navbar.addReservation')}
              </Button>
              <Button
                component={NavLink}
                to="/dashboard/settings"
                variant="outlined"
                color="secondary"
                sx={{
                  '&.active': {
                    backgroundColor: 'secondary.main',
                    color: 'common.white',
                  },
                }}
              >
                {t('navbar.settings')}
              </Button>

              {renderLanguageButton()}

              <Button
                variant="text"
                color="inherit"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? t('navbar.loggingOut') : t('navbar.logout')}
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              <Button component={NavLink} to="/login" color="inherit">
                {t('navbar.login')}
              </Button>
              <Button component={NavLink} to="/register" color="inherit">
                {t('navbar.register')}
              </Button>
              {renderLanguageButton()}
            </Stack>
          )
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            {renderLanguageButton({ sx: { minWidth: 'auto' } })}
            <IconButton color="inherit" onClick={() => setMenuOpen(true)} aria-label="open navigation">
              <MenuIcon />
            </IconButton>
          </Stack>
        )}
      </Toolbar>

      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{ sx: { width: 300 } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 2 }}>
            <Typography variant="h6">MyResCal</Typography>
            <IconButton onClick={() => setMenuOpen(false)} aria-label="close navigation">
              <CloseIcon />
            </IconButton>
          </Box>
          {userLabel && (
            <Typography variant="body2" sx={{ px: 2, pb: 1, color: 'text.secondary' }}>
              {userLabel}
            </Typography>
          )}
          <Divider />

          <List sx={{ flexGrow: 1 }}>
            {drawerNavItems.map((item) => (
              <ListItem disablePadding key={item.key}>
                <ListItemButton
                  component={NavLink}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  sx={{
                    '&.active': {
                      backgroundColor: 'action.selected',
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ px: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {renderLanguageButton({ fullWidth: true })}
            {isAuthenticated ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
                disabled={isLoggingOut}
                fullWidth
              >
                {isLoggingOut ? t('navbar.loggingOut') : t('navbar.logout')}
              </Button>
            ) : (
              <>
                <Button
                  component={NavLink}
                  to="/login"
                  variant="contained"
                  onClick={() => setMenuOpen(false)}
                  fullWidth
                >
                  {t('navbar.login')}
                </Button>
                <Button
                  component={NavLink}
                  to="/register"
                  variant="outlined"
                  onClick={() => setMenuOpen(false)}
                  fullWidth
                >
                  {t('navbar.register')}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
