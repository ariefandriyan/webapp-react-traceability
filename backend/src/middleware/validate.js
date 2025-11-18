const { validationResult } = require('express-validator');

/**
 * Middleware to validate request and return errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: formattedErrors
    });
  }
  
  next();
};

module.exports = validate;
