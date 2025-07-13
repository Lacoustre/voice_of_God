const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const {
  createAdmin,
  getAdmins,
  getAdminById,
  deleteAdmin,
  updateAdmin,
  updateCurrentUserProfile,
} = require("../controller/manageAdminController");

// Apply authentication middleware to all admin routes
router.post("/create", authenticateUser, createAdmin);
router.get("/get", authenticateUser, getAdmins);
router.put("/profile/update", authenticateUser, updateCurrentUserProfile);
router.get("/:id", authenticateUser, getAdminById);
router.delete("/:id", authenticateUser, deleteAdmin);
router.put("/:id", authenticateUser, updateAdmin);

module.exports = router;
