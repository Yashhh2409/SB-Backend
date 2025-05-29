const express = require('express');
const router = express.Router();
const { saveUserLog, getUserLogs } = require('../../controllers/Ai/userLogsController.js');

// POST /api/user-logs
router.post('/save-userlogs', saveUserLog);

// GET /api/user-logs/:userId
router.get('/get-userlogs', getUserLogs);

module.exports = router;
