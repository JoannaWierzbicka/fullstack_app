import { Outlet, NavLink, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Stack, Box, Container } from '@mui/material';
import FilterHdrIcon from '@mui/icons-material/FilterHdr';

function App() {
  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: 'primary.main',
          borderRadius: 0,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: 44, px: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
            <FilterHdrIcon fontSize="medium" />
            <Typography variant="h6" component="div" fontWeight={600}>
              Booking App
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="secondary"
            >
              All Reservations
            </Button>

            <Button
              component={NavLink}
              to="/add"
              variant="outlined"
              color="secondary"
              sx={{
                '&.active': {
                  backgroundColor: 'secondary.main',
                  color: 'white',
                },
              }}
            >
              Add New Reservation
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>


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
  )
}

export default App;
