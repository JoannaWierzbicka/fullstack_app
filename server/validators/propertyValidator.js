import { createHttpError } from '../utils/httpError.js';

export const validatePropertyPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw createHttpError(400, 'Invalid property payload.');
  }

  const { name, description } = payload;

  if (!name || !name.trim()) {
    throw createHttpError(400, 'Property name is required.');
  }

  return {
    name: name.trim(),
    description: description ? String(description).trim() : null,
  };
};
