import { useEffect, useMemo, useState } from 'react';
import { fetchProperties } from '../api/properties.js';
import { fetchRooms } from '../api/rooms.js';
import { loadReservations } from '../api/reservations.js';

const DEFAULT_MESSAGES = {
  properties: 'Unable to load properties.',
  rooms: 'Unable to load rooms.',
  reservations: 'Unable to load reservations.',
};

const initialResourceState = (overrides = {}) => ({
  data: [],
  loading: false,
  error: null,
  ...overrides,
});

const mergeMessages = (overrides = {}) => ({
  properties: overrides.properties ?? DEFAULT_MESSAGES.properties,
  rooms: overrides.rooms ?? DEFAULT_MESSAGES.rooms,
  reservations: overrides.reservations ?? DEFAULT_MESSAGES.reservations,
});

export function useReservationFormData(initialPropertyId = '', messageOverrides) {
  const messages = useMemo(
    () => mergeMessages(messageOverrides),
    [messageOverrides],
  );

  const [selectedPropertyId, setSelectedPropertyId] = useState(initialPropertyId || '');
  const [propertiesState, setPropertiesState] = useState(() =>
    initialResourceState({ loading: true }),
  );
  const [roomsState, setRoomsState] = useState(() => initialResourceState());
  const [reservationsState, setReservationsState] = useState(() => initialResourceState());

  useEffect(() => {
    if (!initialPropertyId) return;
    setSelectedPropertyId((current) => current || initialPropertyId);
  }, [initialPropertyId]);

  useEffect(() => {
    const controller = new AbortController();
    setPropertiesState((prev) => ({ ...prev, loading: true }));

    fetchProperties({ signal: controller.signal })
      .then((data) => {
        setPropertiesState({ data, loading: false, error: null });
        setSelectedPropertyId((current) => {
          if (current && data.some((property) => property.id === current)) {
            return current;
          }
          if (initialPropertyId && data.some((property) => property.id === initialPropertyId)) {
            return initialPropertyId;
          }
          return data[0]?.id || '';
        });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setPropertiesState({
          data: [],
          loading: false,
          error: error.message || messages.properties,
        });
      });

    return () => controller.abort();
  }, [initialPropertyId, messages.properties]);

  useEffect(() => {
    if (!selectedPropertyId) {
      setRoomsState(initialResourceState());
      return undefined;
    }

    const controller = new AbortController();
    setRoomsState((prev) => ({ ...prev, loading: true, error: null }));

    fetchRooms({ propertyId: selectedPropertyId, signal: controller.signal })
      .then((data) => {
        setRoomsState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setRoomsState({
          data: [],
          loading: false,
          error: error.message || messages.rooms,
        });
      });

    return () => controller.abort();
  }, [selectedPropertyId, messages.rooms]);

  useEffect(() => {
    if (!selectedPropertyId) {
      setReservationsState(initialResourceState());
      return undefined;
    }

    const controller = new AbortController();
    setReservationsState((prev) => ({ ...prev, loading: true, error: null }));

    loadReservations({
      signal: controller.signal,
      filters: { property_id: selectedPropertyId },
    })
      .then((data) => {
        setReservationsState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setReservationsState({
          data: [],
          loading: false,
          error: error.message || messages.reservations,
        });
      });

    return () => controller.abort();
  }, [selectedPropertyId, messages.reservations]);

  const dataError = propertiesState.error || roomsState.error || reservationsState.error;

  return {
    properties: propertiesState.data,
    rooms: roomsState.data,
    reservations: reservationsState.data,
    selectedPropertyId,
    setSelectedPropertyId,
    loading: {
      properties: propertiesState.loading,
      rooms: roomsState.loading,
      reservations: reservationsState.loading,
    },
    errors: {
      properties: propertiesState.error,
      rooms: roomsState.error,
      reservations: reservationsState.error,
      combined: dataError,
    },
  };
}
