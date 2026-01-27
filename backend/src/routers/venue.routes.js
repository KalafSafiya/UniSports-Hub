const router = require('express').Router();
const venueController = require('../controllers/venue.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Create venue
router.post('/', authMiddleware, venueController.createVenue);

// Get all venues
router.get('/', authMiddleware, venueController.getAllVenues);

module.exports = router;
