import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { format } from 'date-fns';

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? format(date, 'd MMM yyyy') : '—';
};

const formatPrice = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  maximumFractionDigits: 2,
});

function ReservationCard({ reservation, onEdit, onDelete, onView, disabled = false }) {
  const formattedStart = formatDate(reservation.start_date);
  const formattedEnd = formatDate(reservation.end_date);
  const propertyName = reservation.property?.name ?? '—';
  const roomName = reservation.room?.name ?? '—';

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
          Property: {propertyName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Room: {roomName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          From: <strong>{formattedStart}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          To: <strong>{formattedEnd}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Guests: {reservation.adults} Adults, {reservation.children} Children
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: {formatPrice.format(Number(reservation.price ?? 0))}
        </Typography>
      </CardContent>

      <CardActions onClick={(e) => e.stopPropagation()} sx={{ px: 2, pb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => onEdit?.()}
          disabled={disabled}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => onDelete?.()}
          disabled={disabled}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default ReservationCard;
