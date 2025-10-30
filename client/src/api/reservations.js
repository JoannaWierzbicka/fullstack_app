import { apiClient, withQueryParams } from './client.js';

export async function loadReservations({ signal, filters } = {}) {
  const path = withQueryParams('/reservations', filters);
  return apiClient(path, { signal });
}

export async function loadReservation({ id, signal }) {
  if (!id) {
    throw new Error('Reservation id is required');
  }

  return apiClient(`/reservations/${id}`, { signal });
}

export async function createReservation(reservationData, { signal } = {}) {
  return apiClient('/reservations', {
    method: 'POST',
    data: reservationData,
    signal,
  });
}

export async function updateReservation(id, reservationData, { signal } = {}) {
  if (!id) {
    throw new Error('Reservation id is required');
  }

  return apiClient(`/reservations/${id}`, {
    method: 'PUT',
    data: reservationData,
    signal,
  });
}

export async function deleteReservation(id, { signal } = {}) {
  if (!id) {
    throw new Error('Reservation id is required');
  }

  return apiClient(`/reservations/${id}`, {
    method: 'DELETE',
    signal,
  });
}
