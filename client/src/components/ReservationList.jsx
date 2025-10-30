import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  Container, Typography, Button, Card,
  CardContent, CardActions, Select, MenuItem,
  FormControl, InputLabel, Box
} from '@mui/material';
import ReservationCard from './ReservationCard';

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
        return sorted.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    }
  }, [reservations, sortBy]);

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
      >
        <Typography variant="h5">Reservations</Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="date">Start Date</MenuItem>
            <MenuItem value="lastname">Last Name</MenuItem>
            <MenuItem value="room">Apartment</MenuItem>
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
            >
              Add First Reservation
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Box 
        display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={2}
       >
        {sortedReservations.map((reservation) => (
          <Box
            key={reservation.id}
            sx={{
              flex: '1 1 calc(25% - 24px)',
              minWidth: '260px',
              maxWidth: '280px',
            }}
          >
            <ReservationCard
              reservation={reservation}
              onView={() => navigate(`/dashboard/detail/${reservation.id}`)}
              onEdit={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/edit/${reservation.id}`);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                handleDelete(e, reservation.id);
              }}
            />
          </Box>
        ))}
      </Box>
      )}
    </Container>
  );
}

export default ReservationList;
