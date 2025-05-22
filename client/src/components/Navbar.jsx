
import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import FilterHdrIcon from '@mui/icons-material/FilterHdr';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
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

                    <Typography variant="h6" component={Link} to="/" color="inherit" sx={{ textDecoration: 'none' }}>

                        <FilterHdrIcon fontSize="large" />
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                    {user ? (
                        <>
                            <Button
                                component={NavLink}
                                to="/dashboard"
                                variant="contained"
                                color="secondary"
                            >
                                All Reservations
                            </Button>

                            <Button
                                component={NavLink}
                                to="/dashboard/add"
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

                            <Button
                                variant="text"
                                color="inherit"
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">Log In</Button>
                            <Button color="inherit" component={Link} to="/register">Register</Button>
                        </>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
