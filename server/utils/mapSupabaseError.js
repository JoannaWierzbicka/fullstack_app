import { createHttpError } from './httpError.js';

export const mapSupabaseError = (error, fallbackStatus = 500, fallbackMessage = 'Supabase error.') =>
  createHttpError(
    error?.status || fallbackStatus,
    error?.message || fallbackMessage,
    error?.details,
  );
