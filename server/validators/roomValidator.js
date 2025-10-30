import { createHttpError } from '../utils/httpError.js';

export const validateRoomPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw createHttpError(400, 'Invalid room payload.');
  }

  const { name, property_id: propertyId } = payload;

  if (!propertyId) {
    throw createHttpError(400, 'property_id is required.');
  }

  if (!name || !name.trim()) {
    throw createHttpError(400, 'Room name is required.');
  }

  return {
    property_id: propertyId,
    name: name.trim(),
  };
};
