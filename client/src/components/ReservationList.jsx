import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  Paper, Grid, Typography, Button, Card,
  CardContent, CardActions, Container,
  Select, MenuItem, FormControl, InputLabel, Box
} from '@mui/material';

function ReservationList() {
  const initialReservations = useLoaderData();
  const [reservations, setReservations] = useState(initialReservations);
  const [sortBy, setSortBy] = useState('date');
  const navigate = useNavigate();

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this reservation?')) {
      await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
      setReservations(prev => prev.filter(r => r.id !== id));
    }
  };

  const sortedReservations = useMemo(() => {
    const sorted = [...reservations];
    switch (sortBy) {
      case 'lastname':
        return sorted.sort((a, b) => a.lastname.localeCompare(b.lastname));
      case 'room':
        return sorted.sort((a, b) => Number(a.room) - Number(b.room));
      case 'date':
      default:
        return sorted.sort(
          (a, b) => new Date(a.start_date) - new Date(b.start_date)
        );
    }
  }, [reservations, sortBy]);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant='h5'>Reservations</Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="date">Start Date (Nearest)</MenuItem>
            <MenuItem value="lastname">Last Name (A–Z)</MenuItem>
            <MenuItem value="room">Room Number</MenuItem>
          </Select>
        </FormControl>
      </Box>
        {sortedReservations.length === 0 ? (
          <Card>
            <CardContent>
              <Typography>No reservations found.</Typography>
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to="/add"
                variant="contained"
                color="secondary"
                sx={{
                  '&.active': {
                    backgroundColor: 'secondary.main',
                    color: 'white',
                  },
                }}
              >
                Add First Reservation
              </Button>
            </CardActions>
          </Card>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {sortedReservations.map(reservation => (
              <Grid item xs={12} sm={6} md={3} key={reservation.id}>
                <Card
                  className="reservation-item"
                  onClick={() => navigate(`/detail/${reservation.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <CardContent className="reservation-details">
                    <Typography variant="h6">
                      {reservation.name} {reservation.lastname}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Room: {reservation.room}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      From: {reservation.start_date} To: {reservation.end_date}
                    </Typography>
                  </CardContent>
                  <CardActions onClick={(e) => e.stopPropagation()}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit/${reservation.id}`);
                      }}
                      variant="contained"
                      color="secondary"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={(e) => handleDelete(e, reservation.id)}
                      variant="contained"
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
   
    </Container>
  );
}

export default ReservationList;
