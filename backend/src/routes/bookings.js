const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/bookingController')

router.get('/', bookingController.getAllBookings)
router.post('/', bookingController.createBooking)
router.put('/:id', bookingController.updateBooking)
router.delete('/:id', bookingController.deleteBooking)

// Public routes with token
router.get('/token/:token', bookingController.getBookingByToken)
router.put('/token/:token', bookingController.updateBookingByToken)

module.exports = router
