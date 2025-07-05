const express = require("express");
const router = express.Router();
const { createAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement, sendPhoneAnnouncement } = require("../controller/announcementController");

router.post("/create", createAnnouncement);
router.get("/", getAnnouncements);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);
router.post("/:id/send-phone", sendPhoneAnnouncement);

module.exports = router;