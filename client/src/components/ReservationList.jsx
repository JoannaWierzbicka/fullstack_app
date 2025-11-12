import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from '@mui/material';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
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
  const [confirmReservation, setConfirmReservation] = useState(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
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

  const requestDelete = (reservation) => {
    if (!reservation?.id) return;
    setConfirmReservation(reservation);
  };

  const closeDeleteDialog = () => {
    if (isConfirmingDelete) return;
    setConfirmReservation(null);
  };

  const handleConfirmDelete = async () => {
    if (!confirmReservation?.id) return;
    setIsConfirmingDelete(true);
    setPendingDeleteId(confirmReservation.id);
    try {
      if (!onDeleteReservation) {
        throw new Error(t('reservationList.deleteError'));
      }
      await onDeleteReservation(confirmReservation.id);
      setToast({ type: 'success', message: t('reservationList.deleteSuccess') });
      setConfirmReservation(null);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.message || t('reservationList.deleteError'),
      });
    } finally {
      setIsConfirmingDelete(false);
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
        mb={4}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={3}
      >
        <Box sx={{ flexGrow: 1 }}>
          {showHeader && (
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: '1.8rem', sm: '2rem' },
                letterSpacing: '0.12rem',
                textTransform: 'uppercase',
              }}
            >
              {t('reservationList.title')}
            </Typography>
          )}
        </Box>

        <Box
          display="flex"
          flexDirection={{ xs: 'column', lg: 'row' }}
          gap={2}
          alignItems={{ xs: 'stretch', lg: 'center' }}
          sx={{
            width: { xs: '100%', md: 'auto' },
            backgroundColor: 'rgba(251, 247, 240, 0.85)',
            borderRadius: 30,
            border: '1px solid rgba(195, 111, 43, 0.35)',
            boxShadow: '0 18px 40px rgba(25, 41, 49, 0.16)',
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 2.5 },
          }}
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
            color="info"
            startIcon={<LocalPostOfficeIcon />}
            onClick={() => onAddReservation?.()}
            disabled={!canAdd || !onAddReservation}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {t('reservationList.add')}
          </Button>
        </Box>
      </Box>

      {sortedReservations.length === 0 ? (
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(251, 245, 234, 0.94), rgba(233, 220, 198, 0.9))',
            border: '2px dashed rgba(195, 111, 43, 0.35)',
            textAlign: 'center',
          }}
        >
          <CardContent>
            <Typography sx={{ mb: 2 }}>{t('reservationList.empty')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('reservationList.addFirst')}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="info"
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
                onDelete={() => requestDelete(reservation)}
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
      <Dialog open={Boolean(confirmReservation)} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{t('reservationList.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {t('reservationList.deleteConfirmMessage')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDeleteDialog} disabled={isConfirmingDelete}>
            {t('reservationList.cancel')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={isConfirmingDelete}
          >
            {t('reservationList.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ReservationList;
