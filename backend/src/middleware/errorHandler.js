const ApiResponse = require('../utils/ApiResponse')
const ApiError = require('../utils/ApiError')

/**
 * Global error handling middleware
 * Catches all errors and sends standardized error responses
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  })

  // Handle ApiError instances
  if (err instanceof ApiError) {
    return ApiResponse.error(
      res,
      err.message,
      err.statusCode,
      err.code,
      err.details
    )
  }

  // Handle validation errors (if using a validation library)
  if (err.name === 'ValidationError') {
    return ApiResponse.badRequest(res, err.message, err.errors)
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return ApiResponse.badRequest(res, 'Invalid JSON format')
  }

  // Default to 500 server error
  return ApiResponse.serverError(res, 'An unexpected error occurred')
}

/**
 * Middleware to wrap async route handlers
 * Automatically catches errors and passes them to error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = {
  errorHandler,
  asyncHandler
}
