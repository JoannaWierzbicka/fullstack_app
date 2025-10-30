import { supabase } from './supabaseClient.js';
import { createHttpError } from '../utils/httpError.js';

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    next(createHttpError(401, 'Unauthorized'));
    return;
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw createHttpError(401, 'Invalid or expired token.');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err instanceof Error ? err : createHttpError(401, 'Unauthorized'));
  }
}
