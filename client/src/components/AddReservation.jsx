import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReservationFormDialog from './ReservationFormDialog.jsx';
import { createReservation } from '../api/reservations.js';
import { fetchProperties } from '../api/properties.js';
import { fetchRooms } from '../api/rooms.js';
import { addDays, format, startOfToday } from 'date-fns';

const formatDateInput = (date) => format(date, 'yyyy-MM-dd');

function AddReservation() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [error, setError] = useState(null);

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
        setError(err.message || 'Unable to load properties.');
      })
      .finally(() => setLoadingProperties(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedPropertyId) {
      setRooms([]);
      setError(null);
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
        setError(err.message || 'Unable to load rooms.');
      })
      .finally(() => setLoadingRooms(false));

    return () => controller.abort();
  }, [selectedPropertyId]);

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
      title="Add New Reservation"
      initialValues={initialValues}
      submitLabel="Create"
      submittingLabel="Creating..."
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      properties={properties}
      rooms={rooms}
      onPropertyChange={setSelectedPropertyId}
      loadingProperties={loadingProperties}
      loadingRooms={loadingRooms}
      dataError={error}
      minDate={formatDateInput(startOfToday())}
    />
  );
}

export default AddReservation;
