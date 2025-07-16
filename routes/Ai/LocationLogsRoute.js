const express = require("express");
const router = express.Router();
const { requiresignin } = require("../../middlewares/requiresignin.js");
const {
  SaveLocationLogs,
  getLocationLogs,
} = require("../../controllers/Ai/LocationLogsController.js");

router.post("/save-locationLogs", requiresignin, SaveLocationLogs); // Save location
router.get("/get-allLocationLogs", getLocationLogs); // Get all locations

module.exports = router;
