const router = require('express').Router();
const sportController = require('../controllers/sport.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, sportController.getAllSports);
router.get('/:id', authMiddleware, sportController.getSportById);
router.post('/', authMiddleware, sportController.createSport);
router.put('/:id', authMiddleware, sportController.updateSport);
router.delete('/:id', authMiddleware, sportController.deleteSport);

module.exports = router;