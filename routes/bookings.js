const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/create', ensureAuthenticated, bookingController.getBookingPage);
router.post('/create', ensureAuthenticated, bookingController.createBooking);
router.get('/my-bookings', ensureAuthenticated, bookingController.getMyBookings);

module.exports = router;
