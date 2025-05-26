const express = require('express')
const router = express.Router()
const logController = require('../controllers/customerLogsController');

router.post("/log", logController.SaveCustomerLogs);

module.exports = router;