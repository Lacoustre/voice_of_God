const express = require("express");
const router = express.Router();
const { requestReset, verifyCode, resetPassword } = require("../controller/passwordResetController");

router.post("/request", requestReset);
router.post("/verify", verifyCode);
router.post("/reset", resetPassword);

module.exports = router;