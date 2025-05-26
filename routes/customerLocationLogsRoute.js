const express = require("express")
const router = express.Router();

const { SaveLocationLogs } = require('../controllers/customerLocationLogsController.js')
const verifyToken = require('../middlewares/authMiddleware.js')

router.post("/location-log", verifyToken, SaveLocationLogs);

module.exports = router;