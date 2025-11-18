/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error status and message
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = 'Validation error';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'Data already exists';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Handle Sequelize database errors
  if (err.name === 'SequelizeDatabaseError') {
    status = 400;
    message = 'Database error: ' + err.message;
  }

  // Handle Sequelize connection errors
  if (err.name === 'SequelizeConnectionError') {
    status = 503;
    message = 'Database connection error';
  }

  // Send error response
  res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};
