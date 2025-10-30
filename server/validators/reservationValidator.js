import { createHttpError } from '../utils/httpError.js';

const REQUIRED_FIELDS = new Set([
  'name',
  'lastname',
  'phone',
  'mail',
  'start_date',
  'end_date',
  'property_id',
  'room_id',
  'price',
  'adults',
  'children',
]);

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
    if (value === undefined || value === null || value === '') {
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

  return {
    name: String(payload.name).trim(),
    lastname: String(payload.lastname).trim(),
    phone: String(payload.phone).trim(),
    mail: String(payload.mail).trim(),
    start_date: payload.start_date,
    end_date: payload.end_date,
    property_id: String(payload.property_id),
    room_id: String(payload.room_id),
    price: toNumber(payload.price, 'price'),
    adults: toNumber(payload.adults, 'adults'),
    children: toNumber(payload.children, 'children'),
  };
};
