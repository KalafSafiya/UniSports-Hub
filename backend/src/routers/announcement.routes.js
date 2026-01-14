const router = require("express").Router();
const announcementController = require("../controllers/announcement.controller");

router.post("/", announcementController.createAnnouncement);
router.get("/", announcementController.getAllAnnouncements);
router.get("/:id", announcementController.getAnnouncementById);
router.put("/:id", announcementController.updateAnnouncement);
router.delete("/:id", announcementController.deleteAnnouncement);

module.exports = router;