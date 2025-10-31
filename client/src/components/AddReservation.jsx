import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReservationFormDialog from './ReservationFormDialog.jsx';
import { createReservation, loadReservations } from '../api/reservations.js';
import { fetchProperties } from '../api/properties.js';
import { fetchRooms } from '../api/rooms.js';
import { addDays, format, startOfToday } from 'date-fns';
import { useLocale } from '../context/LocaleContext.jsx';

const formatDateInput = (date) => format(date, 'yyyy-MM-dd');

function AddReservation() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const { t } = useLocale();

  useEffect(() => {
    const controller = new AbortController();
    setLoadingProperties(true);
    fetchProperties({ signal: controller.signal })
      .then((data) => {
        setProperties(data);
        if (data.length > 0) {
          setSelectedPropertyId(data[0].id);
        }
        setError(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message || t('dashboard.errors.properties'));
      })
      .finally(() => setLoadingProperties(false));

    return () => controller.abort();
  }, [t]);

  useEffect(() => {
    if (!selectedPropertyId) {
      setRooms([]);
      setError(null);
      setReservations([]);
      setReservationsError(null);
      return undefined;
    }

    const controller = new AbortController();
    setLoadingRooms(true);
    fetchRooms({ propertyId: selectedPropertyId, signal: controller.signal })
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
  }, [selectedPropertyId, t]);

  useEffect(() => {
    if (!selectedPropertyId) {
      setReservations([]);
      setReservationsError(null);
      return undefined;
    }

    const controller = new AbortController();
    setReservations([]);
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
        setReservationsError(err.message || t('dashboard.errors.reservations'));
      });

    return () => controller.abort();
  }, [selectedPropertyId, t]);

  const initialValues = useMemo(() => {
    const today = startOfToday();
    return {
      property_id: selectedPropertyId,
      start_date: formatDateInput(today),
      end_date: formatDateInput(addDays(today, 1)),
    };
  }, [selectedPropertyId]);

  const handleSubmit = async (formValues) => {
    await createReservation(formValues);
    navigate('/dashboard');
  };

  const handleCancel = () => navigate('/dashboard');

  return (
    <ReservationFormDialog
      title={t('reservationForm.addTitle')}
      initialValues={initialValues}
      submitLabel={t('reservationForm.submitCreate')}
      submittingLabel={t('reservationForm.submitCreating')}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      properties={properties}
      rooms={rooms}
      onPropertyChange={setSelectedPropertyId}
      loadingProperties={loadingProperties}
      loadingRooms={loadingRooms}
      dataError={error || reservationsError}
      minDate={formatDateInput(startOfToday())}
      existingReservations={reservations}
    />
  );
}

export default AddReservation;
