const express = require("express");
const router = express.Router();
const { getContacts, createContact, deleteContact, updateContact, handleContact, sendReply } = require("../controller/contactController");

router.get("/", getContacts);
router.post("/", handleContact);
router.post("/reply", sendReply);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;