import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { deleteReservation } from '../api/reservations';
import {
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  Divider,
  Container
} from '@mui/material';
import { FaTrashAlt, FaArrowLeft } from 'react-icons/fa';

function ReservationDetail() {
  const reservation = useLoaderData();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      setIsDeleting(true);
      try {
        await deleteReservation(reservation.id);
        navigate('/');
      } catch (err) {
        setError(err.message || 'Failed to delete.');
        setIsDeleting(false);
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Reservation Details
        </Typography>

        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          <DetailItem label="Name" value={`${reservation.name} ${reservation.lastname}`} />
          <DetailItem label="Phone" value={reservation.phone} />
          <DetailItem label="Email" value={reservation.mail} />
          <DetailItem label="Room" value={reservation.room} />
          <DetailItem label="Price" value={`$${reservation.price}`} />
          <DetailItem label="From" value={reservation.start_date} />
          <DetailItem label="To" value={reservation.end_date} />
          <DetailItem label="Adults" value={reservation.adults} />
          <DetailItem label="Children" value={reservation.children} />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/"
            startIcon={<FaArrowLeft />}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isDeleting}
            startIcon={<FaTrashAlt />}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

function DetailItem({ label, value }) {
  return (
    <Box>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}

export default ReservationDetail;
