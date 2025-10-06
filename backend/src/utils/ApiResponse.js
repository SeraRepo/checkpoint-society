/**
 * Standard API Response utility class
 * Follows REST/OpenAPI guidelines for consistent response structure
 */
class ApiResponse {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {String} message - Optional success message
   * @param {Number} statusCode - HTTP status code (default: 200)
   */
  static success(res, data = null, message = null, statusCode = 200) {
    const response = {
      success: true
    }

    if (data !== null) {
      response.data = data
    }

    if (message) {
      response.message = message
    }

    return res.status(statusCode).json(response)
  }

  /**
   * Created response (for POST requests)
   * @param {Object} res - Express response object
   * @param {*} data - Created resource data
   * @param {String} message - Optional success message
   */
  static created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201)
  }

  /**
   * No content response (for DELETE requests)
   * @param {Object} res - Express response object
   */
  static noContent(res) {
    return res.status(204).send()
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @param {Number} statusCode - HTTP status code (default: 500)
   * @param {String} code - Error code
   * @param {*} details - Additional error details
   */
  static error(res, message, statusCode = 500, code = null, details = null) {
    const response = {
      success: false,
      error: {
        message,
        code: code || `ERROR_${statusCode}`
      }
    }

    if (details) {
      response.error.details = details
    }

    return res.status(statusCode).json(response)
  }

  /**
   * Bad Request (400)
   */
  static badRequest(res, message = 'Bad request', details = null) {
    return this.error(res, message, 400, 'BAD_REQUEST', details)
  }

  /**
   * Unauthorized (401)
   */
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401, 'UNAUTHORIZED')
  }

  /**
   * Not Found (404)
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404, 'NOT_FOUND')
  }

  /**
   * Internal Server Error (500)
   */
  static serverError(res, message = 'Internal server error') {
    return this.error(res, message, 500, 'INTERNAL_SERVER_ERROR')
  }
}

module.exports = ApiResponse
