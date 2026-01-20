const router = require('express').Router();
const sportController = require('../controllers/sport.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public: View approved sports on GuestSports page
router.get('/approved', sportController.getApprovedSports);

// Admin: Get all sports
router.get('/', authMiddleware, sportController.getAllSports);

// Coach: Request new sport (Protected)
router.post('/', authMiddleware, sportController.createSport);
router.get('/my-approved', authMiddleware, sportController.getMyApprovedSports);

// Admin: Review pending requests (Protected)
router.get('/pending', authMiddleware, sportController.getPendingRequests);

// Admin: Approve or Reject (Protected)
router.patch('/:id/status', authMiddleware, sportController.updateSportStatus);

module.exports = router;
