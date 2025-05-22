import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import { loadReservations } from '../api/reservations';

const ReservationCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchReservations = async () => {
      const data = await loadReservations();
      setReservations(data);
    };
    fetchReservations();
  }, []);

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const rooms = [
    { id: 1, name: 'Pokój 1' },
    { id: 2, name: 'Pokój 2' }
  ];

  const getReservationsForRoom = (roomId) => {
    return reservations.filter(res => Number(res.room) === roomId);
  };

  const renderReservationBar = (reservation, day) => {
    const start = parseISO(reservation.start_date);
    const end = parseISO(reservation.end_date);
    const dayDate = new Date(day);

    if (!isWithinInterval(dayDate, { start, end })) return null;

    const isStart = isSameDay(dayDate, start);
    const isEnd = isSameDay(dayDate, end);

    return (
      <Box
        key={reservation.id}
        sx={{
          height: '100%',
          width: '100%',
          bgcolor: 'primary.light',
          borderTopLeftRadius: isStart ? 4 : 0,
          borderBottomLeftRadius: isStart ? 4 : 0,
          borderTopRightRadius: isEnd ? 4 : 0,
          borderBottomRightRadius: isEnd ? 4 : 0,
          color: 'white',
          fontSize: '0.75rem',
          textAlign: 'center',
          lineHeight: '24px',
          px: 0.5,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }}
        onClick={() => alert(`Rezerwacja: ${reservation.firstname} ${reservation.lastname}`)}
      >
        {isStart ? `${reservation.firstname} ${reservation.lastname}` : ''}
      </Box>
    );
  };

  return (
    <Box>
      {/* Nagłówek */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}>
          <ArrowBackIos fontSize="small" />
        </IconButton>
        <Typography variant="h6">
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </Box>

      {/* Siatka dni */}
      <Box display="grid" gridTemplateColumns={`120px repeat(${daysInMonth.length}, 1fr)`} sx={{ overflowX: 'auto' }}>
        {/* Nagłówki dni */}
        <Box sx={{ bgcolor: 'grey.200', p: 1, border: '1px solid #ccc' }}>
          <Typography variant="subtitle2">Pokój</Typography>
        </Box>
        {daysInMonth.map(day => (
          <Box key={day.toISOString()} sx={{ bgcolor: 'grey.100', p: 1, border: '1px solid #ccc', textAlign: 'center' }}>
            <Typography variant="caption">{format(day, 'd')}</Typography>
          </Box>
        ))}

        {/* Wiersze pokoi */}
        {rooms.map(room => (
          <React.Fragment key={room.id}>
            {/* Nazwa pokoju */}
            <Box sx={{ bgcolor: 'grey.200', p: 1, border: '1px solid #ccc' }}>
              <Typography variant="subtitle2">{room.name}</Typography>
            </Box>

            {/* Komórki dni */}
            {daysInMonth.map(day => (
              <Box
                key={day.toISOString()}
                sx={{
                  border: '1px solid #ccc',
                  height: 32,
                  p: 0,
                  m: 0,
                  position: 'relative'
                }}
              >
                {getReservationsForRoom(room.id).map(reservation =>
                  renderReservationBar(reservation, day)
                )}
              </Box>
            ))}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default ReservationCalendar;
