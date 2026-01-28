const router = require('express').Router();
const bookingController = require('../controllers/booking.controller');

// Verify every function name matches the 'exports' in the controller exactly
router.post('/', bookingController.createBooking);
router.get('/pending', bookingController.getPendingBookings);
router.put('/:id/status', bookingController.updateBookingStatus);

router.get('/approved', bookingController.getAllApprovedBookings);

module.exports = router;