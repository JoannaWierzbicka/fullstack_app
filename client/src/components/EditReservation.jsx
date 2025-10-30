import { useEffect, useMemo, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import ReservationFormDialog from './ReservationFormDialog.jsx';
import { updateReservation } from '../api/reservations.js';
import { fetchProperties } from '../api/properties.js';
import { fetchRooms } from '../api/rooms.js';

function EditReservation() {
  const reservation = useLoaderData();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(reservation?.property_id || '');
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingProperties(true);
    fetchProperties({ signal: controller.signal })
      .then((data) => {
        setProperties(data);
        if (reservation?.property_id) {
          setSelectedPropertyId(reservation.property_id);
        } else if (data.length > 0) {
          setSelectedPropertyId(data[0].id);
        } else {
          setSelectedPropertyId('');
        }
        setError(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Unable to load properties.');
      })
      .finally(() => setLoadingProperties(false));

    return () => controller.abort();
  }, [reservation?.property_id]);

  useEffect(() => {
    const propertyId = selectedPropertyId || reservation?.property_id;
    if (!propertyId) {
      setRooms([]);
      setError(null);
      return undefined;
    }

    const controller = new AbortController();
    setLoadingRooms(true);
    fetchRooms({ propertyId, signal: controller.signal })
      .then((data) => {
        setRooms(data);
        setError(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Unable to load rooms.');
      })
      .finally(() => setLoadingRooms(false));

    return () => controller.abort();
  }, [reservation?.property_id, selectedPropertyId]);

  const initialValues = useMemo(() => ({
    ...reservation,
    property_id: reservation?.property_id || selectedPropertyId,
    room_id: reservation?.room_id || reservation?.room?.id || '',
  }), [reservation, selectedPropertyId]);

  const handleSubmit = async (formValues) => {
    if (!reservation?.id) {
      throw new Error('Reservation not found');
    }
    await updateReservation(reservation.id, formValues);
    navigate('/dashboard');
  };

  const handleCancel = () => navigate('/dashboard');

  return (
    <ReservationFormDialog
      title="Edit Reservation"
      initialValues={initialValues}
      submitLabel="Save Changes"
      submittingLabel="Saving..."
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      properties={properties}
      rooms={rooms}
      onPropertyChange={setSelectedPropertyId}
      loadingProperties={loadingProperties}
      loadingRooms={loadingRooms}
      dataError={error}
    />
  );
}

export default EditReservation;
