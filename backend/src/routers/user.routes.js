const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.put("/:id", userController.updateUser);
router.put("/:id/status", userController.updateUserStatus);
router.delete("/:id", userController.deleteUser);

module.exports = router;
