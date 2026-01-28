const router = require('express').Router();
const statsController = require('../controllers/stats.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/admin-dashboard-stats', auth, statsController.getAdminDashboardStats);

module.exports = router;