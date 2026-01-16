const router = require('express').Router();
const coachController = require('../controllers/coach.controllers');
const authMiddleware = require('../middlewares/auth.middleware');

router.get("/", authMiddleware, coachController.getAllCoaches);
router.get("/:id/details", authMiddleware, coachController.getCoachDetails);

module.exports = router;
