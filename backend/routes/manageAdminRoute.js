const express = require("express");
const router = express.Router();
const {
  createAdmin,
  getAdmins,
  getAdminById,
  deleteAdmin,
  updateAdmin,
  updateCurrentUserProfile,
} = require("../controller/manageAdminController");

router.post("/create", createAdmin);
router.get("/get", getAdmins);
router.get("/:id", getAdminById);
router.delete("/:id", deleteAdmin);
router.put("/:id", updateAdmin);
router.put("/profile/update", updateCurrentUserProfile);

module.exports = router;
