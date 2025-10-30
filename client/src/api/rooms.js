import { apiClient, withQueryParams } from './client.js';

export const fetchRooms = ({ propertyId, signal } = {}) => {
  const path = withQueryParams('/rooms', { property_id: propertyId });
  return apiClient(path, { signal });
};

export const createRoom = (data, { signal } = {}) =>
  apiClient('/rooms', { method: 'POST', data, signal });

export const updateRoom = (id, data, { signal } = {}) =>
  apiClient(`/rooms/${id}`, { method: 'PUT', data, signal });

export const deleteRoom = (id, { signal } = {}) =>
  apiClient(`/rooms/${id}`, { method: 'DELETE', signal });
