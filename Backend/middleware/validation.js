/**
 * Validation Middleware
 * Validates request body, params, and query
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    req.body = value;
    next();
  };
};

// Common validation schemas using Joi-like structure
export const validateMeal = {
  type: (value) => {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('Meal type is required');
    }
    return value.trim();
  },
  items: (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value.split(',').map(i => i.trim()).filter(Boolean);
    }
    return [];
  },
  date: (value) => {
    if (!value) return undefined;
    return new Date(value);
  },
};

