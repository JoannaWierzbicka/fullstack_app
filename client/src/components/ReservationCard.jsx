import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { format } from 'date-fns';

function ReservationCard({ reservation, onEdit, onDelete, onView }) {
  const formattedStart = format(new Date(reservation.start_date), 'd MMM yyyy');
  const formattedEnd = format(new Date(reservation.end_date), 'd MMM yyyy');

  return (
    <Card
      onClick={onView}
      sx={{
        height: '100%',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.25s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 8,
        },
      }}
      elevation={3}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {reservation.name} {reservation.lastname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Apartment: {reservation.room}
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
          Price: {reservation.price} PLN
        </Typography>
      </CardContent>

      <CardActions onClick={(e) => e.stopPropagation()} sx={{ px: 2, pb: 2 }}>
        <Button variant="outlined" color="primary" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="outlined" color="error" onClick={onDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default ReservationCard;
