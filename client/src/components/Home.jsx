import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ReservationCalendar from "./ReservationCalendar";
import { loadReservations } from '../api/reservations';

export default function Home() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (user) {
      loadReservations().then(setReservations).catch(console.error);
    }
  }, [user]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Reservations
      </Typography>
      {user ? (
        <ReservationCalendar reservations={reservations} />
      ) : (
        "Please log in or register to access your dashboard."
      )}
    </Box>
  );
}
