/**
 * Response Utility Functions
 * Provides consistent API response format
 */
export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message = 'Error occurred', statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

export const sendCreated = (res, data, message = 'Created successfully') => {
  sendSuccess(res, data, message, 201);
};

export const sendNotFound = (res, message = 'Resource not found') => {
  sendError(res, message, 404);
};

export const sendUnauthorized = (res, message = 'Unauthorized') => {
  sendError(res, message, 401);
};

export const sendForbidden = (res, message = 'Forbidden') => {
  sendError(res, message, 403);
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors automatically
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

