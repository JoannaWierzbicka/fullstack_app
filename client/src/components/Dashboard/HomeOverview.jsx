import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import ReservationCalendar from '../ReservationCalendar.jsx';
import ReservationList from '../ReservationList.jsx';
import ReservationFormDialog from '../ReservationFormDialog.jsx';
import { fetchProperties } from '../../api/properties.js';
import { fetchRooms } from '../../api/rooms.js';
import {
  loadReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} from '../../api/reservations.js';
import { addDays, startOfToday, isBefore } from 'date-fns';

const formatDateInput = (date) => format(date, 'yyyy-MM-dd');

export default function HomeOverview() {
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);

  const [propertiesError, setPropertiesError] = useState(null);
  const [roomsError, setRoomsError] = useState(null);
  const [reservationsError, setReservationsError] = useState(null);

  const [dialogState, setDialogState] = useState({
    open: false,
    mode: 'create',
    reservation: null,
    initialValues: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setLoadingProperties(true);
    fetchProperties({ signal: controller.signal })
      .then((data) => {
        setProperties(data);
        if (data.length > 0) {
          setSelectedPropertyId((current) => current || data[0].id);
        }
        setPropertiesError(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setPropertiesError(err.message || 'Unable to load properties.');
      })
      .finally(() => setLoadingProperties(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedPropertyId) {
      setRooms([]);
      setRoomsError(null);
      setReservations([]);
      setReservationsError(null);
      return undefined;
    }

    const controller = new AbortController();
    setLoadingRooms(true);
    fetchRooms({ propertyId: selectedPropertyId, signal: controller.signal })
      .then((data) => {
        setRooms(data);
        setRoomsError(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setRoomsError(err.message || 'Unable to load rooms.');
      })
      .finally(() => setLoadingRooms(false));

    return () => controller.abort();
  }, [selectedPropertyId]);

  useEffect(() => {
    if (!selectedPropertyId) {
      setReservations([]);
      setReservationsError(null);
      return undefined;
    }

    const controller = new AbortController();
    setLoadingReservations(true);
    loadReservations({
      signal: controller.signal,
      filters: { property_id: selectedPropertyId },
    })
      .then((data) => {
        setReservations(data);
        setReservationsError(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setReservationsError(err.message || 'Unable to load reservations.');
      })
      .finally(() => setLoadingReservations(false));

    return () => controller.abort();
  }, [selectedPropertyId]);

  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === selectedPropertyId) ?? null,
    [properties, selectedPropertyId],
  );

  const roomsForCalendar = useMemo(() => {
    if (!selectedProperty) {
      return rooms.map((room) => ({ ...room, propertyName: '' }));
    }
    return rooms.map((room) => ({ ...room, propertyName: selectedProperty.name }));
  }, [rooms, selectedProperty]);

  const closeDialog = () => {
    setDialogState({
      open: false,
      mode: 'create',
      reservation: null,
      initialValues: null,
    });
  };

  const openCreateDialog = (initialValues = {}) => {
    const propertyId = initialValues.property_id || selectedPropertyId;
    if (!propertyId) return;
    setSelectedPropertyId(propertyId);

    const today = startOfToday();
    const rawStart = initialValues.start_date ? new Date(initialValues.start_date) : today;
    const startDate = isBefore(rawStart, today) ? today : rawStart;
    const startDateStr = formatDateInput(startDate);
    const endDateStr =
      initialValues.end_date || formatDateInput(addDays(startDate, 1));

    const defaultRoomId =
      initialValues.room_id ||
      rooms.find((room) => room.property_id === propertyId)?.id ||
      rooms[0]?.id ||
      '';

    setDialogState({
      open: true,
      mode: 'create',
      reservation: null,
      initialValues: {
        property_id: propertyId,
        start_date: startDateStr,
        end_date: endDateStr,
        room_id: defaultRoomId,
        ...initialValues,
      },
    });
  };

  const openEditDialog = (reservation) => {
    if (!reservation) return;
    setSelectedPropertyId(reservation.property_id || reservation.property?.id || selectedPropertyId);
    setDialogState({
      open: true,
      mode: 'edit',
      reservation,
      initialValues: {
        ...reservation,
        property_id: reservation.property_id || reservation.property?.id || selectedPropertyId,
        room_id: reservation.room_id || reservation.room?.id || '',
      },
    });
  };

  const handleCreate = async (values) => {
    const payload = {
      ...values,
      property_id: values.property_id || selectedPropertyId,
    };
    const created = await createReservation(payload);
    setReservations((prev) => [...prev, created]);
  };

  const handleUpdate = async (values) => {
    if (!dialogState.reservation) return;
    const updated = await updateReservation(dialogState.reservation.id, values);
    setReservations((prev) =>
      prev.map((reservation) => (reservation.id === updated.id ? updated : reservation)),
    );
  };

  const handleDelete = async (id) => {
    await deleteReservation(id);
    setReservations((prev) => prev.filter((reservation) => reservation.id !== id));
  };

  const handleDayClick = (date, room) => {
    const today = startOfToday();
    if (isBefore(date, today)) return;

    const startDate = date;
    const endDate = addDays(date, 1);
    const propertyIdForRoom = room?.property_id || selectedPropertyId;
    if (propertyIdForRoom) {
      setSelectedPropertyId(propertyIdForRoom);
    }
    openCreateDialog({
      property_id: propertyIdForRoom,
      start_date: formatDateInput(startDate),
      end_date: formatDateInput(endDate),
      room_id: room?.id || rooms.find((r) => r.property_id === propertyIdForRoom)?.id || '',
    });
  };

  const dialogSubmit = async (values) => {
    if (dialogState.mode === 'create') {
      await handleCreate(values);
    } else {
      await handleUpdate(values);
    }
    closeDialog();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track availability and manage bookings across your properties.
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 220 }} disabled={loadingProperties || properties.length === 0}>
          <InputLabel id="dashboard-property-select-label">Property</InputLabel>
          <Select
            labelId="dashboard-property-select-label"
            value={selectedPropertyId}
            label="Property"
            onChange={(event) => setSelectedPropertyId(event.target.value)}
          >
            {properties.map((property) => (
              <MenuItem key={property.id} value={property.id}>
                {property.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="outlined" component={RouterLink} to="/dashboard/settings">
          Manage properties
        </Button>
      </Stack>

      {propertiesError && <Alert severity="error">{propertiesError}</Alert>}

      {!selectedPropertyId && !loadingProperties ? (
        <Alert severity="info">
          Add your first property in settings to start creating reservations.
        </Alert>
      ) : (
        <>
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Availability {selectedProperty ? `— ${selectedProperty.name}` : ''}
              </Typography>
              <Button
                variant="contained"
                disabled={rooms.length === 0}
                onClick={() =>
                  openCreateDialog({
                    property_id: selectedPropertyId,
                    room_id:
                      rooms.find((room) => room.property_id === selectedPropertyId)?.id ||
                      rooms[0]?.id ||
                      '',
                  })
                }
              >
                Add reservation
              </Button>
            </Stack>

            {loadingRooms || loadingReservations ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {(roomsError || reservationsError) && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {roomsError || reservationsError}
                  </Alert>
                )}
                <ReservationCalendar
                  rooms={roomsForCalendar}
                  reservations={reservations}
                  onDayClick={handleDayClick}
                  onReservationSelect={openEditDialog}
                />
              </>
            )}
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Reservations
          </Typography>

          <ReservationList
            reservations={reservations}
            onDeleteReservation={handleDelete}
            onEditReservation={openEditDialog}
            onAddReservation={() =>
              openCreateDialog({
                property_id: selectedPropertyId,
                room_id:
                  rooms.find((room) => room.property_id === selectedPropertyId)?.id ||
                  rooms[0]?.id ||
                  '',
              })
            }
            showHeader={false}
            canAdd={rooms.length > 0}
          />
        </>
      )}

      {dialogState.open && (
        <ReservationFormDialog
          title={dialogState.mode === 'create' ? 'Add Reservation' : 'Edit Reservation'}
          initialValues={dialogState.initialValues}
          submitLabel={dialogState.mode === 'create' ? 'Create' : 'Save changes'}
          submittingLabel={dialogState.mode === 'create' ? 'Creating...' : 'Saving...'}
          onSubmit={dialogSubmit}
          onCancel={closeDialog}
          properties={properties}
          rooms={rooms}
          onPropertyChange={(propertyId) => setSelectedPropertyId(propertyId)}
          loadingProperties={loadingProperties}
          loadingRooms={loadingRooms}
          minDate={dialogState.mode === 'create' ? formatDateInput(startOfToday()) : undefined}
        />
      )}
    </Box>
  );
}
