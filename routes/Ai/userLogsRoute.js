const express = require('express');
const router = express.Router();
const { saveUserLog, getUserLogs } = require('../../controllers/Ai/userLogsController.js');

// POST /api/user-logs
router.post('/api/v1/user-event-logs', saveUserLog);

// GET /api/user-logs/:userId
router.get('/api/v1/user-event-logs', getUserLogs);

module.exports = router;
