import { Outlet, NavLink, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Stack, Box, Container} from '@mui/material';

function App() {
  return (
    <>
      <AppBar position="sticky" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Booking App
        </Typography>
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
