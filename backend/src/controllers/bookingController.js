const Booking = require('../models/Booking')
const Session = require('../models/Session')
const ApiResponse = require('../utils/ApiResponse')
const ApiError = require('../utils/ApiError')
const { asyncHandler } = require('../middleware/errorHandler')
const { isValidEmail } = require('../utils/validation')

/**
 * @route GET /api/bookings
 * @desc Get all bookings
 * @access Private (Admin)
 */
exports.getAllBookings = asyncHandler(async (req, res) => {
  const bookings = Booking.getAll()

  return ApiResponse.success(res, bookings)
})

/**
 * @route POST /api/bookings
 * @desc Create new booking
 * @access Public
 */
exports.createBooking = asyncHandler(async (req, res) => {
  const { session_id, name, email, phone, party_size = 1 } = req.body

  // Validation
  const missingFields = []
  if (!session_id) missingFields.push('session_id')
  if (!name) missingFields.push('name')
  if (!email) missingFields.push('email')

  if (missingFields.length > 0) {
    throw ApiError.badRequest(
      'Missing required fields',
      { fields: missingFields }
    )
  }

  // Email validation
  if (!isValidEmail(email)) {
    throw ApiError.badRequest('Invalid email format')
  }

  // Name validation (minimum 2 characters)
  if (name.trim().length < 2) {
    throw ApiError.badRequest('Name must be at least 2 characters long')
  }

  // Phone validation (if provided)
  if (phone && phone.trim().length < 8) {
    throw ApiError.badRequest('Phone number must be at least 8 characters long')
  }

  // Party size validation
  const partySizeNum = parseInt(party_size)
  if (isNaN(partySizeNum) || partySizeNum < 1) {
    throw ApiError.badRequest('Party size must be at least 1')
  }

  if (partySizeNum > 10) {
    throw ApiError.badRequest('Party size cannot exceed 10 people')
  }

  // Check if session exists
  const session = Session.getById(session_id)
  if (!session) {
    throw ApiError.notFound('Session not found')
  }

  // Determine if this is a waitlist booking
  const isWaitlist = session.available_slots < partySizeNum

  // Create booking
  const bookingId = Booking.create({
    session_id,
    name,
    email,
    phone,
    party_size: partySizeNum,
    is_waitlist: isWaitlist
  })

  // Only decrement slots if not waitlist
  if (!isWaitlist) {
    const success = Session.decrementSlot(session_id, partySizeNum)
    if (!success) {
      throw ApiError.badRequest('Failed to book - not enough slots available')
    }
  }

  const booking = Booking.getById(bookingId)

  const message = isWaitlist
    ? 'Booking created successfully - added to waitlist'
    : 'Booking created successfully'

  return ApiResponse.created(res, booking, message)
})

/**
 * @route PUT /api/bookings/:id
 * @desc Update booking party size
 * @access Private (Admin)
 */
exports.updateBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id
  const { party_size } = req.body

  // Get current booking
  const booking = Booking.getById(bookingId)
  if (!booking) {
    throw ApiError.notFound('Booking not found')
  }

  // Validate party size
  const newPartySize = parseInt(party_size)
  if (isNaN(newPartySize) || newPartySize < 1) {
    throw ApiError.badRequest('Party size must be at least 1')
  }

  if (newPartySize > 10) {
    throw ApiError.badRequest('Party size cannot exceed 10 people')
  }

  const currentPartySize = booking.party_size || 1
  const difference = newPartySize - currentPartySize

  // Get session to check availability
  const session = Session.getById(booking.session_id)
  if (!session) {
    throw ApiError.notFound('Session not found')
  }

  // If increasing party size, check if enough slots available
  if (difference > 0 && session.available_slots < difference) {
    throw ApiError.badRequest(
      `Not enough available slots. Only ${session.available_slots} slot(s) remaining.`
    )
  }

  // Update booking
  const updated = Booking.update(bookingId, { party_size: newPartySize })
  if (!updated) {
    throw ApiError.serverError('Failed to update booking')
  }

  // Adjust available slots
  if (difference > 0) {
    // Increasing party size - decrement slots
    Session.decrementSlot(booking.session_id, difference)
  } else if (difference < 0) {
    // Decreasing party size - increment slots
    Session.incrementSlot(booking.session_id, Math.abs(difference))
  }

  const updatedBooking = Booking.getById(bookingId)
  return ApiResponse.success(res, updatedBooking, 'Booking updated successfully')
})

/**
 * @route DELETE /api/bookings/:id
 * @desc Delete booking
 * @access Private (Admin)
 */
exports.deleteBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id

  // Get booking to know which session to update
  const booking = Booking.getById(bookingId)
  if (!booking) {
    throw ApiError.notFound('Booking not found')
  }

  // Delete the booking
  const deleted = Booking.delete(bookingId)
  if (!deleted) {
    throw ApiError.notFound('Booking not found')
  }

  // Increment available slots for the session by party_size
  const partySize = booking.party_size || 1
  Session.incrementSlot(booking.session_id, partySize)

  return ApiResponse.noContent(res)
})

/**
 * @route GET /api/bookings/token/:token
 * @desc Get booking by token
 * @access Public
 */
exports.getBookingByToken = asyncHandler(async (req, res) => {
  const { token } = req.params

  const booking = Booking.getByToken(token)
  if (!booking) {
    throw ApiError.notFound('Booking not found')
  }

  return ApiResponse.success(res, booking)
})

/**
 * @route PUT /api/bookings/token/:token
 * @desc Update booking by token
 * @access Public
 */
exports.updateBookingByToken = asyncHandler(async (req, res) => {
  const { token } = req.params
  const { name, email, phone, party_size } = req.body

  // Get current booking
  const booking = Booking.getByToken(token)
  if (!booking) {
    throw ApiError.notFound('Booking not found')
  }

  // Validate email if provided
  if (email && !isValidEmail(email)) {
    throw ApiError.badRequest('Invalid email format')
  }

  // Validate name if provided
  if (name && name.trim().length < 2) {
    throw ApiError.badRequest('Name must be at least 2 characters long')
  }

  // Validate party size if provided
  if (party_size !== undefined) {
    const newPartySize = parseInt(party_size)
    if (isNaN(newPartySize) || newPartySize < 1) {
      throw ApiError.badRequest('Party size must be at least 1')
    }
    if (newPartySize > 10) {
      throw ApiError.badRequest('Party size cannot exceed 10 people')
    }

    const currentPartySize = booking.party_size || 1
    const difference = newPartySize - currentPartySize

    // If increasing party size, check if enough slots available
    if (difference > 0 && booking.available_slots < difference) {
      throw ApiError.badRequest(
        `Not enough available slots. Only ${booking.available_slots} slot(s) remaining.`
      )
    }

    // Adjust available slots
    if (difference > 0) {
      Session.decrementSlot(booking.session_id, difference)
    } else if (difference < 0) {
      Session.incrementSlot(booking.session_id, Math.abs(difference))
    }
  }

  // Update booking
  const updated = Booking.updateByToken(token, { name, email, phone, party_size })
  if (!updated) {
    throw ApiError.serverError('Failed to update booking')
  }

  const updatedBooking = Booking.getByToken(token)
  return ApiResponse.success(res, updatedBooking, 'Booking updated successfully')
})
