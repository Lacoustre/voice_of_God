const express = require("express");
const router = express.Router();
const {
  deleteEvent,
  updateEvent,
  createEvent,
  getEvents
} = require("../controller/eventController");

router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.get("/events", getEvents);

module.exports = router;
