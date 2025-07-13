const express = require("express");
const router = express.Router();
const { login, getCurrentUser } = require("../controller/authController");
const { authenticateUser } = require("../middleware/authMiddleware");

router.post("/login", login);
router.get("/me", authenticateUser, getCurrentUser);

module.exports = router;
