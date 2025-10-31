import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../../api/properties.js';
import {
  fetchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../../api/rooms.js';
import PropertyFormDialog from './PropertyFormDialog.jsx';
import RoomFormDialog from './RoomFormDialog.jsx';
import { useLocale } from '../../context/LocaleContext.jsx';

export default function Settings() {
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState(null);
  const [roomsError, setRoomsError] = useState(null);

  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const { t } = useLocale();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchProperties({ signal: controller.signal })
      .then((data) => {
        setProperties(data);
        if (data.length > 0) {
          setSelectedPropertyId((current) => current ?? data[0].id);
        }
        setPropertiesError(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setPropertiesError(err.message || t('dashboard.errors.properties'));
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [t]);

  useEffect(() => {
    if (!selectedPropertyId) {
      setRooms([]);
      return undefined;
    }

    const controller = new AbortController();
    fetchRooms({ propertyId: selectedPropertyId, signal: controller.signal })
      .then((data) => {
        setRooms(data);
        setRoomsError(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setRoomsError(err.message || t('dashboard.errors.rooms'));
      });

    return () => controller.abort();
  }, [selectedPropertyId, t]);

  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === selectedPropertyId) ?? null,
    [properties, selectedPropertyId],
  );

  const handleCreateProperty = async (payload) => {
    const result = await createProperty(payload);
    setProperties((prev) => [...prev, result]);
    setSelectedPropertyId(result.id);
    setPropertiesError(null);
  };

  const handleUpdateProperty = async (id, payload) => {
    const updated = await updateProperty(id, payload);
    setProperties((prev) => prev.map((item) => (item.id === id ? updated : item)));
    setSelectedPropertyId(updated.id);
    setPropertiesError(null);
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm(t('settings.deletePropertyConfirm'))) return;
    await deleteProperty(id);
    setProperties((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (selectedPropertyId === id) {
        setSelectedPropertyId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
    if (selectedPropertyId === id) {
      setRooms([]);
    }
    setPropertiesError(null);
  };

  const handleCreateRoom = async (payload) => {
    const result = await createRoom(payload);
    if (result.property_id === selectedPropertyId) {
      setRooms((prev) => [...prev, result]);
    }
    setRoomsError(null);
  };

  const handleUpdateRoom = async (id, payload) => {
    const updated = await updateRoom(id, payload);
    if (updated.property_id === selectedPropertyId) {
      setRooms((prev) => prev.map((room) => (room.id === id ? updated : room)));
    } else {
      setRooms((prev) => prev.filter((room) => room.id !== id));
    }
    setRoomsError(null);
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm(t('settings.deleteRoomConfirm'))) return;
    await deleteRoom(id);
    setRooms((prev) => prev.filter((room) => room.id !== id));
    setRoomsError(null);
  };

  const roomsHeading = useMemo(
    () =>
      selectedProperty
        ? t('settings.roomsTitle', { name: selectedProperty.name })
        : t('settings.roomsTitle', { name: t('settings.selectPropertyFallback') }),
    [selectedProperty, t],
  );

  return (
    <Box>
      {(propertiesError || roomsError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {propertiesError || roomsError}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Card sx={{ flex: '1 1 320px' }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">{t('settings.propertiesTitle')}</Typography>
              <Button
                startIcon={<Add />}
                variant="contained"
                onClick={() => {
                  setEditingProperty(null);
                  setPropertyDialogOpen(true);
                }}
              >
                {t('settings.addProperty')}
              </Button>
            </Stack>

            {loading ? (
              <Typography variant="body2">{t('settings.loading')}</Typography>
            ) : propertiesError ? (
              <Alert severity="error">{propertiesError}</Alert>
            ) : (
              <List disablePadding>
                {properties.map((property) => (
                  <ListItem
                    key={property.id}
                    disablePadding
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          edge="end"
                          aria-label={t('reservationCard.actions.edit')}
                          onClick={() => {
                            setEditingProperty(property);
                            setPropertyDialogOpen(true);
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label={t('reservationCard.actions.delete')}
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    }
                  >
                    <ListItemButton
                      selected={property.id === selectedPropertyId}
                      onClick={() => setSelectedPropertyId(property.id)}
                    >
                      <ListItemText
                        primary={property.name}
                        secondary={property.description}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}

                {properties.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {t('settings.emptyProperties')}
                  </Typography>
                )}
              </List>
            )}
          </CardContent>
        </Card>

        <Card sx={{ flex: '2 1 480px' }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">{roomsHeading}</Typography>
              <Button
                startIcon={<Add />}
                variant="contained"
                onClick={() => {
                  setEditingRoom(null);
                  setRoomDialogOpen(true);
                }}
                disabled={!selectedProperty || properties.length === 0}
              >
                {t('roomForm.addTitle')}
              </Button>
            </Stack>

            {!selectedProperty ? (
              <Typography variant="body2" color="text.secondary">
                {t('settings.selectPropertyHint')}
              </Typography>
            ) : roomsError ? (
              <Alert severity="error">{roomsError}</Alert>
            ) : rooms.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {t('settings.emptyRooms')}
              </Typography>
            ) : (
              <List disablePadding>
                {rooms.map((room, index) => (
                  <Box key={room.id}>
                    <ListItem
                      disablePadding
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                        <IconButton
                          edge="end"
                          aria-label={t('reservationCard.actions.edit')}
                          onClick={() => {
                            setEditingRoom(room);
                            setRoomDialogOpen(true);
                          }}
                        >
                            <Edit fontSize="small" />
                          </IconButton>
                        <IconButton
                          edge="end"
                          aria-label={t('reservationCard.actions.delete')}
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                      }
                    >
                      <ListItemText
                        primary={room.name}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                    {index < rooms.length - 1 && <Divider component="li" />}
                  </Box>
                ))}
              </List>
            )}
          </CardContent>
          <CardActions>
            <Typography variant="caption" color="text.secondary">
              {t('settings.roomsInfo')}
            </Typography>
          </CardActions>
        </Card>
      </Stack>

      <PropertyFormDialog
        open={propertyDialogOpen}
        onClose={() => setPropertyDialogOpen(false)}
        onSubmit={(payload) =>
          editingProperty
            ? handleUpdateProperty(editingProperty.id, payload)
            : handleCreateProperty(payload)
        }
        initialValues={editingProperty}
      />

      <RoomFormDialog
        open={roomDialogOpen}
        onClose={() => setRoomDialogOpen(false)}
        onSubmit={(payload) =>
          editingRoom ? handleUpdateRoom(editingRoom.id, payload) : handleCreateRoom(payload)
        }
        initialValues={editingRoom}
        properties={properties}
      />
    </Box>
  );
}
