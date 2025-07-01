const express = require("express");
const router = express.Router();
const { createAnnouncement, getAnnouncements, deleteAnnouncement } = require("../controller/announcementController");

router.post("/create", createAnnouncement);
router.get("/", getAnnouncements);
router.delete("/:id", deleteAnnouncement);

module.exports = router;