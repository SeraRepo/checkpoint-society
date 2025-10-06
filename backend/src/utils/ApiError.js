/**
 * Custom API Error class
 * Extends Error to include HTTP status code and error code
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, code = null, details = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code || `ERROR_${statusCode}`
    this.details = details
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(message = 'Bad request', details = null) {
    return new ApiError(message, 400, 'BAD_REQUEST', details)
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(message, 401, 'UNAUTHORIZED')
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(message, 404, 'NOT_FOUND')
  }

  static serverError(message = 'Internal server error') {
    return new ApiError(message, 500, 'INTERNAL_SERVER_ERROR')
  }
}

module.exports = ApiError
