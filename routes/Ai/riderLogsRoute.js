const express = require('express');
const router = express.Router();
const { saveRiderLog, getRiderLogs } = require('../../controllers/Ai/riderLogsController.js');

// POST /api/user-logs
router.post('/api/v1/rider-event-logs', saveRiderLog);

// GET /api/user-logs/:userId
router.get('/api/v1/rider-event-logs', getRiderLogs);

module.exports = router;
