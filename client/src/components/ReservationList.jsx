import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from '@mui/material';
import ReservationCard from './ReservationCard.jsx';

const collator = new Intl.Collator(undefined, { sensitivity: 'base' });

const SORT_OPTIONS = [
  { value: 'date', label: 'Start Date' },
  { value: 'lastname', label: 'Last Name' },
  { value: 'property', label: 'Property' },
  { value: 'room', label: 'Room' },
];

const getRoomName = (reservation) => reservation?.room?.name ?? '';
const getPropertyName = (reservation) => reservation?.property?.name ?? '';

const sorters = {
  date: (a, b) => new Date(a.start_date) - new Date(b.start_date),
  lastname: (a, b) => collator.compare(a.lastname ?? '', b.lastname ?? ''),
  property: (a, b) => collator.compare(getPropertyName(a), getPropertyName(b)),
  room: (a, b) => collator.compare(getRoomName(a), getRoomName(b)),
};

function ReservationList({
  reservations = [],
  onDeleteReservation,
  onEditReservation,
  onAddReservation,
  showHeader = true,
  canAdd = true,
}) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('date');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const sortedReservations = useMemo(() => {
    const items = Array.isArray(reservations) ? [...reservations] : [];
    const sorter = sorters[sortBy] ?? sorters.date;
    return items.sort(sorter);
  }, [reservations, sortBy]);

  const handleDelete = async (reservation) => {
    if (!reservation?.id) return;
    const confirmed = window.confirm('Delete this reservation?');
    if (!confirmed) return;

    setPendingDeleteId(reservation.id);
    try {
      if (!onDeleteReservation) {
        throw new Error('Delete handler not configured.');
      }
      await onDeleteReservation?.(reservation.id);
      setToast({ type: 'success', message: 'Reservation deleted successfully.' });
    } catch (error) {
      setToast({
        type: 'error',
        message: error.message || 'Failed to delete reservation.',
      });
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleToastClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setToast(null);
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
      >
        <Box sx={{ flexGrow: 1 }}>
          {showHeader && (
            <Typography variant="h5" component="h2">
              Reservations
            </Typography>
          )}
        </Box>

        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="reservation-sort-label">Sort By</InputLabel>
            <Select
              labelId="reservation-sort-label"
              value={sortBy}
              label="Sort By"
              onChange={(event) => setSortBy(event.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => onAddReservation?.()}
            disabled={!canAdd || !onAddReservation}
          >
            Add Reservation
          </Button>
        </Box>
      </Box>

      {sortedReservations.length === 0 ? (
        <Card>
          <CardContent>
            <Typography>No reservations found.</Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => onAddReservation?.()}
              disabled={!canAdd || !onAddReservation}
            >
              Add First Reservation
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
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
                onEdit={() => onEditReservation?.(reservation)}
                onDelete={() => handleDelete(reservation)}
                disabled={pendingDeleteId === reservation.id}
              />
            </Box>
          ))}
        </Box>
      )}

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert onClose={handleToastClose} severity={toast.type} sx={{ width: '100%' }}>
            {toast.message}
          </Alert>
        ) : null}
      </Snackbar>
    </Box>
  );
}

export default ReservationList;
