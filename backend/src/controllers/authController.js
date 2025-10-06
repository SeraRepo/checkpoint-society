const Admin = require('../models/Admin')
const ApiResponse = require('../utils/ApiResponse')
const ApiError = require('../utils/ApiError')
const { asyncHandler } = require('../middleware/errorHandler')

/**
 * @route POST /api/auth/login
 * @desc Authenticate admin user
 * @access Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  // Validation
  if (!username || !password) {
    throw ApiError.badRequest('Username and password are required')
  }

  // Validate credentials
  const isValid = await Admin.validatePassword(username, password)

  if (!isValid) {
    throw ApiError.unauthorized('Invalid credentials')
  }

  const admin = Admin.getByUsername(username)

  // Return user data (in a real app, you'd return a JWT token here)
  return ApiResponse.success(res, {
    username: admin.username
  }, 'Login successful')
})
