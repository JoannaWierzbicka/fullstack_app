import { useMemo, useState, useCallback } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
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
import { useLocale } from '../context/LocaleContext.jsx';

function ReservationDetail() {
  const reservation = useLoaderData() ?? {};
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const { t, language, dateLocale } = useLocale();

  const formatDate = useCallback(
    (value) => {
      const date = value ? new Date(value) : null;
      return date && !Number.isNaN(date.getTime())
        ? format(date, 'd MMM yyyy', { locale: dateLocale })
        : '—';
    },
    [dateLocale],
  );

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(language === 'pl' ? 'pl-PL' : 'en-US', {
        style: 'currency',
        currency: 'PLN',
        maximumFractionDigits: 2,
      }),
    [language],
  );

  const handleDelete = async () => {
    if (window.confirm(t('reservationDetail.deleteConfirm'))) {
      setIsDeleting(true);
      try {
        await deleteReservation(reservation.id);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message || t('reservationDetail.deleteError'));
        setIsDeleting(false);
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t('reservationDetail.title')}
        </Typography>

        {!reservation?.id && (
          <AlertMessage message={t('reservationDetail.notFound')} />
        )}

        {error && (
          <AlertMessage message={error} severity="error" />
        )}

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          <DetailItem
            label={t('reservationDetail.name')}
            value={[reservation.name, reservation.lastname].filter(Boolean).join(' ') || '—'}
          />
          <DetailItem label={t('reservationDetail.phone')} value={reservation.phone || '—'} />
          <DetailItem label={t('reservationDetail.email')} value={reservation.mail || '—'} />
          <DetailItem label={t('reservationDetail.property')} value={reservation.property?.name || '—'} />
          <DetailItem label={t('reservationDetail.room')} value={reservation.room?.name || '—'} />
          <DetailItem
            label={t('reservationDetail.price')}
            value={
              reservation.price !== undefined
                ? numberFormatter.format(Number(reservation.price))
                : '—'
            }
          />
          <DetailItem label={t('reservationDetail.from')} value={formatDate(reservation.start_date)} />
          <DetailItem label={t('reservationDetail.to')} value={formatDate(reservation.end_date)} />
          <DetailItem label={t('reservationDetail.adults')} value={reservation.adults ?? '—'} />
          <DetailItem label={t('reservationDetail.children')} value={reservation.children ?? '—'} />
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
            {t('reservationDetail.back')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isDeleting}
            startIcon={<FaTrashAlt />}
          >
            {isDeleting ? t('reservationDetail.deleting') : t('reservationDetail.delete')}
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
