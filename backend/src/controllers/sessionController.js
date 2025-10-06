const Session = require('../models/Session')
const ApiResponse = require('../utils/ApiResponse')
const ApiError = require('../utils/ApiError')
const { asyncHandler } = require('../middleware/errorHandler')

/**
 * @route GET /api/sessions
 * @desc Get all sessions
 * @access Public
 */
exports.getAllSessions = asyncHandler(async (req, res) => {
  const sessions = Session.getAll()

  return ApiResponse.success(res, sessions)
})

/**
 * @route GET /api/sessions/:id
 * @desc Get session by ID
 * @access Public
 */
exports.getSessionById = asyncHandler(async (req, res) => {
  const session = Session.getById(req.params.id)

  if (!session) {
    throw ApiError.notFound('Session not found')
  }

  return ApiResponse.success(res, session)
})

/**
 * @route POST /api/sessions
 * @desc Create new session
 * @access Private (Admin)
 */
exports.createSession = asyncHandler(async (req, res) => {
  const { name, start_time, end_time, total_slots } = req.body

  // Validation
  const missingFields = []
  if (!name) missingFields.push('name')
  if (!start_time) missingFields.push('start_time')
  if (!end_time) missingFields.push('end_time')
  if (!total_slots) missingFields.push('total_slots')

  if (missingFields.length > 0) {
    throw ApiError.badRequest(
      'Missing required fields',
      { fields: missingFields }
    )
  }

  // Validate total_slots is a positive number
  if (typeof total_slots !== 'number' || total_slots <= 0) {
    throw ApiError.badRequest('total_slots must be a positive number')
  }

  // Validate dates
  const startDate = new Date(start_time)
  const endDate = new Date(end_time)

  if (isNaN(startDate.getTime())) {
    throw ApiError.badRequest('Invalid start_time format')
  }

  if (isNaN(endDate.getTime())) {
    throw ApiError.badRequest('Invalid end_time format')
  }

  if (endDate <= startDate) {
    throw ApiError.badRequest('end_time must be after start_time')
  }

  const sessionId = Session.create({ name, start_time, end_time, total_slots })
  const session = Session.getById(sessionId)

  return ApiResponse.created(res, session, 'Session created successfully')
})

/**
 * @route PUT /api/sessions/:id
 * @desc Update session
 * @access Private (Admin)
 */
exports.updateSession = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, start_time, end_time, total_slots } = req.body

  // Validation
  const missingFields = []
  if (!name) missingFields.push('name')
  if (!start_time) missingFields.push('start_time')
  if (!end_time) missingFields.push('end_time')
  if (!total_slots) missingFields.push('total_slots')

  if (missingFields.length > 0) {
    throw ApiError.badRequest(
      'Missing required fields',
      { fields: missingFields }
    )
  }

  // Validate total_slots is a positive number
  if (typeof total_slots !== 'number' || total_slots <= 0) {
    throw ApiError.badRequest('total_slots must be a positive number')
  }

  // Validate dates
  const startDate = new Date(start_time)
  const endDate = new Date(end_time)

  if (isNaN(startDate.getTime())) {
    throw ApiError.badRequest('Invalid start_time format')
  }

  if (isNaN(endDate.getTime())) {
    throw ApiError.badRequest('Invalid end_time format')
  }

  if (endDate <= startDate) {
    throw ApiError.badRequest('end_time must be after start_time')
  }

  const updated = Session.update(id, { name, start_time, end_time, total_slots })

  if (!updated) {
    throw ApiError.notFound('Session not found')
  }

  const session = Session.getById(id)

  return ApiResponse.success(res, session, 'Session updated successfully')
})
