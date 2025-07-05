const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controller/statsController");

router.get("/stats", getDashboardStats);

module.exports = router;
