import { useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext.jsx';
import ReservationFormDialog from './ReservationFormDialog.jsx';
import { updateReservation } from '../api/reservations.js';
import { DEFAULT_RESERVATION_STATUS } from '../utils/reservationStatus.js';
import { useReservationFormData } from '../hooks/useReservationFormData.js';

function EditReservation() {
  const reservation = useLoaderData();
  const navigate = useNavigate();
  const { t } = useLocale();
  const errorMessages = useMemo(
    () => ({
      properties: t('dashboard.errors.properties'),
      rooms: t('dashboard.errors.rooms'),
      reservations: t('dashboard.errors.reservations'),
    }),
    [t],
  );

  const {
    properties,
    rooms,
    reservations,
    selectedPropertyId,
    setSelectedPropertyId,
    loading,
    errors,
  } = useReservationFormData(reservation?.property_id || '', errorMessages);

  const initialValues = useMemo(
    () => ({
      ...reservation,
      property_id: reservation?.property_id || selectedPropertyId || '',
      room_id: reservation?.room_id || reservation?.room?.id || '',
      status: reservation?.status || DEFAULT_RESERVATION_STATUS,
    }),
    [reservation, selectedPropertyId],
  );

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
      loadingProperties={loading.properties}
      loadingRooms={loading.rooms}
      dataError={errors.combined}
      existingReservations={reservations}
      reservationId={reservation?.id}
    />
  );
}

export default EditReservation;
