import React, { useMemo, useState } from 'react';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns';
import { useLocale } from '../context/LocaleContext.jsx';

const safeParseDate = (value) => {
  if (!value) return null;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const ReservationCalendar = ({
  reservations = [],
  rooms: providedRooms,
  onReservationSelect,
  onDayClick,
  onRoomChange,
  selectedRoomId,
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const { t, language, dateLocale } = useLocale();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const weekdayLabels = useMemo(() => {
    const labels = t('calendar.weekdays');
    return Array.isArray(labels) ? labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }, [t, language]);

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const rooms = useMemo(() => {
    if (Array.isArray(providedRooms) && providedRooms.length > 0) {
      return providedRooms;
    }
    const map = new Map();
    reservations.forEach((reservation) => {
      const roomId = reservation.room_id || reservation.room?.id;
      if (!roomId) return;
      if (!map.has(roomId)) {
        map.set(roomId, {
          id: roomId,
          name: reservation.room?.name || t('reservationCard.room'),
          propertyName: reservation.property?.name || t('reservationCard.property'),
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      if (a.propertyName === b.propertyName) {
        return a.name.localeCompare(b.name);
      }
      return a.propertyName.localeCompare(b.propertyName);
    });
  }, [providedRooms, reservations, t]);

  const getReservationsForRoom = (roomId) =>
    reservations.filter((reservation) => (reservation.room_id || reservation.room?.id) === roomId);

  if (rooms.length === 0) {
    return (
      <Box sx={{ p: 2, border: '1px dashed', borderColor: 'grey.300', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t('calendar.noRooms')}
        </Typography>
      </Box>
    );
  }

  if (!isDesktop) {
    return (
      <MonthlyCalendar
        currentMonth={currentMonth}
        onNavigate={(direction) =>
          setCurrentMonth((prev) => addMonths(prev, direction === 'prev' ? -1 : 1))
        }
        rooms={rooms}
        activeRoomId={selectedRoomId || rooms[0]?.id}
        onRoomChange={onRoomChange}
        reservations={reservations}
        onDayClick={onDayClick}
        onReservationSelect={onReservationSelect}
        weekdays={weekdayLabels}
        instructions={t('calendar.mobileHint')}
        roomLabel={t('navbar.roomSelector')}
        dateLocale={dateLocale}
        t={t}
      />
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}>
          <ArrowBackIos fontSize="small" />
        </IconButton>
        <Typography variant="h6">
          {format(currentMonth, 'LLLL yyyy', { locale: dateLocale })}
        </Typography>
        <IconButton onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}>
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={`160px repeat(${daysInMonth.length}, minmax(32px, 1fr))`}
        sx={{
          borderLeft: '1px solid',
          borderTop: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 1,
          overflow: 'hidden',
          minWidth: '100%',
        }}
      >
        <Box
          sx={{
            bgcolor: 'grey.200',
            borderRight: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'grey.300',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 40,
            fontWeight: 600,
          }}
        >
          <Typography variant="subtitle2">{t('calendar.room')}</Typography>
        </Box>
        {daysInMonth.map((day) => (
          <Box
            key={day.toISOString()}
            sx={{
              borderRight: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'grey.300',
              bgcolor: 'grey.100',
              minHeight: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption">
              {format(day, 'd', { locale: dateLocale })}
            </Typography>
          </Box>
        ))}

        {rooms.map((room) => {
          const reservationsForRoom = getReservationsForRoom(room.id);
          return (
            <React.Fragment key={room.id}>
              <Box
                sx={{
                  borderRight: '1px solid',
                  borderBottom: '1px solid',
                  borderColor: 'grey.300',
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  px: 1,
                  minHeight: 40,
                  fontWeight: 500,
                }}
              >
                <Typography variant="subtitle2" noWrap>
                  {room.propertyName ? `${room.propertyName} — ${room.name}` : room.name}
                </Typography>
              </Box>

              {daysInMonth.map((day) => (
                <DayCell
                  key={day.toISOString()}
                  day={day}
                  room={room}
                  reservationsForRoom={reservationsForRoom}
                  onDayClick={onDayClick}
                  onReservationSelect={onReservationSelect}
                />
              ))}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

export default ReservationCalendar;

const DayCell = ({ day, room, reservationsForRoom, onDayClick, onReservationSelect }) => {
  const reservation = reservationsForRoom.find((item) => {
    const start = safeParseDate(item.start_date);
    const end = safeParseDate(item.end_date);
    if (!start || !end) return false;
    return isWithinInterval(day, { start, end });
  });

  const hasReservation = Boolean(reservation);
  const isStart = hasReservation && isSameDay(day, safeParseDate(reservation.start_date));
  const today = startOfToday();
  const isPast = !hasReservation && onDayClick && isBefore(day, today);
  const reservationLength = hasReservation
    ? differenceInCalendarDays(
        safeParseDate(reservation.end_date),
        safeParseDate(reservation.start_date),
      ) + 1
    : 0;

  const handleClick = () => {
    if (hasReservation) {
      onReservationSelect?.(reservation);
    } else if (!isPast) {
      onDayClick?.(day, room);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        borderRight: '1px solid',
        borderBottom: '1px solid',
        borderColor: hasReservation ? 'primary.light' : 'grey.300',
        backgroundColor: hasReservation ? 'primary.light' : 'transparent',
        minHeight: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 0.5,
        cursor: hasReservation ? 'pointer' : isPast ? 'not-allowed' : onDayClick ? 'pointer' : 'default',
        color: hasReservation ? '#fff' : 'inherit',
        borderTopLeftRadius: isStart ? 6 : 0,
        borderBottomLeftRadius: isStart ? 6 : 0,
        borderTopRightRadius: hasReservation && isSameDay(day, safeParseDate(reservation.end_date)) ? 6 : 0,
        borderBottomRightRadius: hasReservation && isSameDay(day, safeParseDate(reservation.end_date)) ? 6 : 0,
        transition: 'background-color 0.2s ease',
        '&:hover':
          !hasReservation && !isPast && onDayClick
            ? {
                backgroundColor: 'grey.100',
              }
            : undefined,
      }}
      onClick={handleClick}
    >
      {hasReservation && isStart && (
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: 'common.white',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            width: '100%',
            textAlign: 'left',
            pl: 0.5,
            pr: 0.5,
            whiteSpace: reservationLength <= 1 ? 'nowrap' : 'normal',
            overflow: reservationLength <= 1 ? 'hidden' : 'visible',
            textOverflow: reservationLength <= 1 ? 'ellipsis' : 'unset',
          }}
        >
          {`${reservation.name ?? ''} ${reservation.lastname ?? ''}`.trim()}
        </Typography>
      )}
    </Box>
  );
};

const MonthlyCalendar = ({
  currentMonth,
  onNavigate,
  rooms,
  activeRoomId,
  onRoomChange,
  reservations,
  onDayClick,
  onReservationSelect,
  weekdays,
  instructions,
  roomLabel,
  dateLocale,
  t,
}) => {
  const today = startOfToday();
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    return Array.from({ length: 42 }, (_, index) => addDays(start, index));
  }, [currentMonth]);

  const room = rooms.find((item) => item.id === activeRoomId) || rooms[0];
  const reservationsForRoom = reservations.filter(
    (reservation) => (reservation.room_id || reservation.room?.id) === room.id,
  );

  const weekChunks = useMemo(() => {
    const chunked = [];
    for (let i = 0; i < days.length; i += 7) {
      chunked.push(days.slice(i, i + 7));
    }
    return chunked;
  }, [days]);

  const handleDayClick = (day) => {
    if (isBefore(day, today)) return;
    onDayClick?.(day, room);
  };

  const resolvedRoomLabel = roomLabel || t('calendar.room');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => onNavigate('prev')} size="small">
            <ArrowBackIos fontSize="inherit" />
          </IconButton>
          <Typography variant="h6">
            {format(currentMonth, 'LLLL yyyy', { locale: dateLocale })}
          </Typography>
          <IconButton onClick={() => onNavigate('next')} size="small">
            <ArrowForwardIos fontSize="inherit" />
          </IconButton>
        </Box>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="calendar-room-select">{resolvedRoomLabel}</InputLabel>
          <Select
            labelId="calendar-room-select"
            value={room.id}
            label={resolvedRoomLabel}
            onChange={(event) => onRoomChange?.(event.target.value)}
          >
            {rooms.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.propertyName ? `${item.propertyName} — ${item.name}` : item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {instructions && (
        <Typography variant="caption" color="text.secondary">
          {instructions}
        </Typography>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 0.5 }}>
        {(weekdays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).map((label) => (
          <Box key={label} sx={{ textAlign: 'center', fontWeight: 600, py: 0.75 }}>
            <Typography variant="caption">{label}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {weekChunks.map((week, index) => (
          <Box
            key={index.toString()}
            sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 0.5 }}
          >
            {week.map((day) => (
              <MobileDayCell
                key={day.toISOString()}
                day={day}
                reservations={reservationsForRoom}
                currentMonth={currentMonth}
                onClick={() => handleDayClick(day)}
                onReservationSelect={onReservationSelect}
                dateLocale={dateLocale}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const MobileDayCell = ({
  day,
  reservations,
  currentMonth,
  onClick,
  onReservationSelect,
  dateLocale,
}) => {
  const today = startOfToday();
  const reservation = reservations.find((item) => {
    const start = safeParseDate(item.start_date);
    const end = safeParseDate(item.end_date);
    if (!start || !end) return false;
    return isWithinInterval(day, { start, end });
  });

  const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
  const isPast = isBefore(day, today);
  const hasReservation = Boolean(reservation);
  const label = format(day, 'd', { locale: dateLocale });
  const isStart = hasReservation && isSameDay(day, safeParseDate(reservation.start_date));

  const handleClick = () => {
    if (hasReservation) {
      onReservationSelect?.(reservation);
    } else if (!isPast) {
      onClick?.();
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        minHeight: 60,
        borderRadius: 1,
        border: '1px solid',
        borderColor: hasReservation ? 'primary.main' : 'grey.300',
        backgroundColor: hasReservation ? 'primary.light' : 'background.paper',
        color: isPast && !hasReservation ? 'text.disabled' : 'inherit',
        opacity: isCurrentMonth ? 1 : 0.4,
        p: 0.75,
        cursor: hasReservation ? 'pointer' : isPast ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      }}
    >
      <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
        {label}
      </Typography>
      {hasReservation && (
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: 'common.white',
            backgroundColor: 'primary.main',
            borderRadius: 0.5,
            px: 0.5,
            py: 0.25,
            alignSelf: 'flex-start',
            display: isStart ? 'inline-flex' : 'none',
          }}
        >
          {`${reservation.name ?? ''} ${reservation.lastname ?? ''}`.trim()}
        </Typography>
      )}
    </Box>
  );
};
