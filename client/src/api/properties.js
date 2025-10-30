import { apiClient } from './client.js';

export const fetchProperties = ({ signal } = {}) =>
  apiClient('/properties', { signal });

export const createProperty = (data, { signal } = {}) =>
  apiClient('/properties', { method: 'POST', data, signal });

export const updateProperty = (id, data, { signal } = {}) =>
  apiClient(`/properties/${id}`, { method: 'PUT', data, signal });

export const deleteProperty = (id, { signal } = {}) =>
  apiClient(`/properties/${id}`, { method: 'DELETE', signal });
