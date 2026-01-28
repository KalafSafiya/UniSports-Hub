const router = require('express').Router();
const contactRequestController = require('../controllers/contactRequest.controller');
const upload = require('../middlewares/upload');

/** Guests */
router.post('/', upload.single('attachment'), contactRequestController.createContactRequest);

/** Admin routes */
router.get('/', contactRequestController.getAllContactRequests);
router.put('/:id/status', contactRequestController.updateRequestStatus);
router.get('/:id/attachment', contactRequestController.viewAttachment);

module.exports = router;