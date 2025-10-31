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
import { useLocale } from '../context/LocaleContext.jsx';

const SORT_OPTIONS = [
  { value: 'date', labelKey: 'reservationList.sortOptions.date' },
  { value: 'lastname', labelKey: 'reservationList.sortOptions.lastname' },
  { value: 'property', labelKey: 'reservationList.sortOptions.property' },
  { value: 'room', labelKey: 'reservationList.sortOptions.room' },
];

const getRoomName = (reservation) => reservation?.room?.name ?? '';
const getPropertyName = (reservation) => reservation?.property?.name ?? '';

function ReservationList({
  reservations = [],
  onDeleteReservation,
  onEditReservation,
  onAddReservation,
  showHeader = true,
  canAdd = true,
  rooms = [],
  roomFilterId = 'all',
  onRoomFilterChange,
}) {
  const navigate = useNavigate();
  const { t, language } = useLocale();
  const [sortBy, setSortBy] = useState('date');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const collator = useMemo(
    () => new Intl.Collator(language === 'pl' ? 'pl-PL' : 'en-US', { sensitivity: 'base' }),
    [language],
  );

  const sorters = useMemo(
    () => ({
      date: (a, b) => new Date(a.start_date) - new Date(b.start_date),
      lastname: (a, b) => collator.compare(a.lastname ?? '', b.lastname ?? ''),
      property: (a, b) => collator.compare(getPropertyName(a), getPropertyName(b)),
      room: (a, b) => collator.compare(getRoomName(a), getRoomName(b)),
    }),
    [collator],
  );

  const hasRoomFilter = typeof onRoomFilterChange === 'function' && Array.isArray(rooms) && rooms.length > 0;

  const reservationsFilteredByRoom = useMemo(() => {
    if (!Array.isArray(reservations)) return [];
    if (!hasRoomFilter || roomFilterId === 'all') return reservations;
    return reservations.filter((reservation) => {
      const reservationRoomId = reservation.room_id || reservation.room?.id;
      return reservationRoomId === roomFilterId;
    });
  }, [reservations, roomFilterId, hasRoomFilter]);

  const sortedReservations = useMemo(() => {
    const items = [...reservationsFilteredByRoom];
    const sorter = sorters[sortBy] ?? sorters.date;
    return items.sort(sorter);
  }, [reservationsFilteredByRoom, sortBy]);

  const handleDelete = async (reservation) => {
    if (!reservation?.id) return;
    const confirmed = window.confirm(t('reservationList.deleteConfirm'));
    if (!confirmed) return;

    setPendingDeleteId(reservation.id);
    try {
      if (!onDeleteReservation) {
        throw new Error(t('reservationList.deleteError'));
      }
      await onDeleteReservation?.(reservation.id);
      setToast({ type: 'success', message: t('reservationList.deleteSuccess') });
    } catch (error) {
      setToast({
        type: 'error',
        message: error.message || t('reservationList.deleteError'),
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
        alignItems="stretch"
        mb={3}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2.5}
      >
        <Box sx={{ flexGrow: 1 }}>
          {showHeader && (
            <Typography variant="h5" component="h2" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
              {t('reservationList.title')}
            </Typography>
          )}
        </Box>

        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ width: { xs: '100%', md: 'auto' } }}
        >
          {hasRoomFilter && (
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <InputLabel id="reservation-room-filter-label">
                {t('reservationList.filterByRoom')}
              </InputLabel>
              <Select
                labelId="reservation-room-filter-label"
                value={roomFilterId}
                label={t('reservationList.filterByRoom')}
                onChange={(event) => onRoomFilterChange?.(event.target.value)}
              >
                <MenuItem value="all">{t('reservationList.allRooms')}</MenuItem>
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
            <InputLabel id="reservation-sort-label">{t('reservationList.sortBy')}</InputLabel>
            <Select
              labelId="reservation-sort-label"
              value={sortBy}
              label={t('reservationList.sortBy')}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => onAddReservation?.()}
            disabled={!canAdd || !onAddReservation}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {t('reservationList.add')}
          </Button>
        </Box>
      </Box>

      {sortedReservations.length === 0 ? (
        <Card>
          <CardContent>
            <Typography>{t('reservationList.empty')}</Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => onAddReservation?.()}
              disabled={!canAdd || !onAddReservation}
            >
              {t('reservationList.addFirst')}
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent={{ xs: 'stretch', sm: 'center' }}
          gap={2}
        >
          {sortedReservations.map((reservation) => (
            <Box
              key={reservation.id}
              sx={{
                flex: {
                  xs: '1 1 100%',
                  sm: '1 1 calc(50% - 16px)',
                  lg: '1 1 calc(33.333% - 20px)',
                  xl: '1 1 calc(25% - 24px)',
                },
                minWidth: { xs: '100%', sm: '260px' },
                maxWidth: { xs: '100%', sm: '320px' },
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
