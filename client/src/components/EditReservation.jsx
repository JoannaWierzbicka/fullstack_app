import { useEffect, useMemo, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import ReservationFormDialog from './ReservationFormDialog.jsx';
import { updateReservation, loadReservations } from '../api/reservations.js';
import { fetchProperties } from '../api/properties.js';
import { fetchRooms } from '../api/rooms.js';
import { useLocale } from '../context/LocaleContext.jsx';
import { DEFAULT_RESERVATION_STATUS } from '../utils/reservationStatus.js';

function EditReservation() {
  const reservation = useLoaderData();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(reservation?.property_id || '');
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [error, setError] = useState(null);
  const [reservationsData, setReservationsData] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const { t } = useLocale();

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
        setError(err.message || t('dashboard.errors.properties'));
      })
      .finally(() => setLoadingProperties(false));

    return () => controller.abort();
  }, [reservation?.property_id, t]);

  useEffect(() => {
    const propertyId = selectedPropertyId || reservation?.property_id;
    if (!propertyId) {
      setRooms([]);
      setError(null);
      setReservationsData([]);
      setReservationsError(null);
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
        setError(err.message || t('dashboard.errors.rooms'));
      })
      .finally(() => setLoadingRooms(false));

    return () => controller.abort();
  }, [reservation?.property_id, selectedPropertyId, t]);

  useEffect(() => {
    const propertyId = selectedPropertyId || reservation?.property_id;
    if (!propertyId) {
      setReservationsData([]);
      setReservationsError(null);
      return undefined;
    }

    const controller = new AbortController();
    setReservationsData([]);
    loadReservations({
      signal: controller.signal,
      filters: { property_id: propertyId },
    })
      .then((data) => {
        setReservationsData(data);
        setReservationsError(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setReservationsError(err.message || t('dashboard.errors.reservations'));
      });

    return () => controller.abort();
  }, [reservation?.property_id, selectedPropertyId, t]);

  const initialValues = useMemo(() => ({
    ...reservation,
    property_id: reservation?.property_id || selectedPropertyId,
    room_id: reservation?.room_id || reservation?.room?.id || '',
    status: reservation?.status || DEFAULT_RESERVATION_STATUS,
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
      title={t('reservationForm.editTitle')}
      initialValues={initialValues}
      submitLabel={t('reservationForm.submitSave')}
      submittingLabel={t('reservationForm.submitSaving')}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      properties={properties}
      rooms={rooms}
      onPropertyChange={setSelectedPropertyId}
      loadingProperties={loadingProperties}
      loadingRooms={loadingRooms}
      dataError={error || reservationsError}
      existingReservations={reservationsData}
      reservationId={reservation?.id}
    />
  );
}

export default EditReservation;
