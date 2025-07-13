const express = require("express");
const router = express.Router();
const { requestReset, resetPassword } = require("../controller/passwordResetController");

router.post("/request", requestReset);
router.post("/reset", resetPassword);

module.exports = router;