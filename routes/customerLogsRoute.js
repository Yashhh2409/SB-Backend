const express = require('express')
const router = express.Router()
const logController = require('../controllers/customerLogsController');
const verifyToken = require('../middlewares/authMiddleware.js')

router.post("/log", verifyToken, logController.SaveCustomerLogs);

module.exports = router;