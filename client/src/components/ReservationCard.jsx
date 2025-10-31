import { useCallback, useMemo } from 'react';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useLocale } from '../context/LocaleContext.jsx';

function ReservationCard({ reservation, onEdit, onDelete, onView, disabled = false }) {
  const { t, dateLocale, language } = useLocale();
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(language === 'pl' ? 'pl-PL' : 'en-US', {
        style: 'currency',
        currency: 'PLN',
        maximumFractionDigits: 2,
      }),
    [language],
  );

  const formatDate = useCallback(
    (value) => {
      const date = value ? new Date(value) : null;
      return date && !Number.isNaN(date.getTime())
        ? format(date, 'd MMM yyyy', { locale: dateLocale })
        : '—';
    },
    [dateLocale],
  );

  const formattedStart = formatDate(reservation.start_date);
  const formattedEnd = formatDate(reservation.end_date);
  const propertyName = reservation.property?.name ?? '—';
  const roomName = reservation.room?.name ?? '—';
  const adultsProvided = reservation.adults !== undefined && reservation.adults !== null;
  const childrenProvided = reservation.children !== undefined && reservation.children !== null;
  const guestSummary = (() => {
    if (adultsProvided && childrenProvided) {
      return t('reservationCard.guestsSummary', {
        adults: reservation.adults,
        children: reservation.children,
      });
    }
    if (adultsProvided) {
      return `${t('common.adults')}: ${reservation.adults}`;
    }
    if (childrenProvided) {
      return `${t('common.children')}: ${reservation.children}`;
    }
    return '—';
  })();

  return (
    <Card
      onClick={() => {
        if (disabled) return;
        onView?.();
      }}
      sx={{
        height: '100%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.25s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: disabled ? 'none' : 'translateY(-6px)',
          boxShadow: disabled ? 1 : 8,
        },
      }}
      elevation={3}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {reservation.name} {reservation.lastname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('reservationCard.property')}: {propertyName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('reservationCard.room')}: {roomName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('reservationCard.from')}: <strong>{formattedStart}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('reservationCard.to')}: <strong>{formattedEnd}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('reservationCard.guests')}: {guestSummary}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('reservationCard.price')}:{' '}
          {reservation.price !== undefined && reservation.price !== null
            ? numberFormatter.format(Number(reservation.price))
            : '—'}
        </Typography>
      </CardContent>

      <CardActions onClick={(e) => e.stopPropagation()} sx={{ px: 2, pb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => onEdit?.()}
          disabled={disabled}
        >
          {t('reservationCard.actions.edit')}
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => onDelete?.()}
          disabled={disabled}
        >
          {t('reservationCard.actions.delete')}
        </Button>
      </CardActions>
    </Card>
  );
}

export default ReservationCard;
