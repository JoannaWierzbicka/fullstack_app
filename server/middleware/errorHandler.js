import { HttpError, createHttpError } from '../utils/httpError.js';

export const notFoundHandler = (req, _res, next) => {
  next(createHttpError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: err.message,
      details: err.details ?? null,
    });
    return;
  }

  const status = err.status || 500;

  console.error('Unexpected error:', err);
  res.status(status).json({
    error: err.message || 'Unexpected server error',
  });
};
