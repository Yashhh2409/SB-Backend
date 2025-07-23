const express = require('express');
const router = express.Router();
const { saveStoreLog, getStoreLogs } = require('../../controllers/Ai/storeLogsController.js');

// POST /api/user-logs
router.post('/api/v1/store-event-logs', saveStoreLog);

// GET /api/user-logs/:userId
router.get('/api/v1/store-event-logs', getStoreLogs);

module.exports = router;
