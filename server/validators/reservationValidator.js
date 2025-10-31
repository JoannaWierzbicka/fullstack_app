import { createHttpError } from '../utils/httpError.js';

const REQUIRED_FIELDS = new Set(['name', 'lastname', 'start_date', 'end_date', 'property_id', 'room_id']);

const toNumber = (value, field) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw createHttpError(400, `Field "${field}" must be a valid number.`);
  }
  return parsed;
};

export const validateReservationPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw createHttpError(400, 'Invalid reservation payload.');
  }

  const missing = [];
  REQUIRED_FIELDS.forEach((field) => {
    const value = payload[field];
    if (value === undefined || value === null) {
      missing.push(field);
      return;
    }
    if (typeof value === 'string' && value.trim() === '') {
      missing.push(field);
    }
  });

  if (missing.length > 0) {
    throw createHttpError(400, `Missing required fields: ${missing.join(', ')}.`);
  }

  const startDate = new Date(payload.start_date);
  const endDate = new Date(payload.end_date);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw createHttpError(400, 'Invalid reservation dates.');
  }

  if (endDate < startDate) {
    throw createHttpError(400, 'End date cannot be earlier than the start date.');
  }

  const normalizeString = (value) => {
    if (value === undefined || value === null) return null;
    const trimmed = String(value).trim();
    return trimmed.length === 0 ? null : trimmed;
  };

  const normalizeNumber = (value, field) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    return toNumber(value, field);
  };

  return {
    name: String(payload.name).trim(),
    lastname: String(payload.lastname).trim(),
    phone: normalizeString(payload.phone),
    mail: normalizeString(payload.mail),
    start_date: payload.start_date,
    end_date: payload.end_date,
    property_id: String(payload.property_id),
    room_id: String(payload.room_id),
    price: normalizeNumber(payload.price, 'price'),
    adults: normalizeNumber(payload.adults, 'adults'),
    children: normalizeNumber(payload.children, 'children'),
  };
};
