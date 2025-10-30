import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { deleteReservation } from '../api/reservations.js';
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { FaArrowLeft, FaTrashAlt } from 'react-icons/fa';

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? format(date, 'd MMM yyyy') : '—';
};

const numberFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  maximumFractionDigits: 2,
});

function ReservationDetail() {
  const reservation = useLoaderData() ?? {};
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      setIsDeleting(true);
      try {
        await deleteReservation(reservation.id);
        navigate('/dashboard');
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

        {!reservation?.id && (
          <AlertMessage message="Reservation could not be found." />
        )}

        {error && (
          <AlertMessage message={error} severity="error" />
        )}

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          <DetailItem
            label="Name"
            value={[reservation.name, reservation.lastname].filter(Boolean).join(' ') || '—'}
          />
          <DetailItem label="Phone" value={reservation.phone || '—'} />
          <DetailItem label="Email" value={reservation.mail || '—'} />
          <DetailItem label="Property" value={reservation.property?.name || '—'} />
          <DetailItem label="Room" value={reservation.room?.name || '—'} />
          <DetailItem
            label="Price"
            value={
              reservation.price !== undefined
                ? numberFormatter.format(Number(reservation.price))
                : '—'
            }
          />
          <DetailItem label="From" value={formatDate(reservation.start_date)} />
          <DetailItem label="To" value={formatDate(reservation.end_date)} />
          <DetailItem label="Adults" value={reservation.adults ?? '—'} />
          <DetailItem label="Children" value={reservation.children ?? '—'} />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/dashboard"
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
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}

function AlertMessage({ message, severity = 'error' }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography color={severity === 'error' ? 'error' : 'warning.main'} variant="body2">
        {message}
      </Typography>
    </Box>
  );
}

export default ReservationDetail;
