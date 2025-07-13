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
router.put("/profile/update", updateCurrentUserProfile);
router.get("/:id", getAdminById);
router.delete("/:id", deleteAdmin);
router.put("/:id", updateAdmin);

module.exports = router;
