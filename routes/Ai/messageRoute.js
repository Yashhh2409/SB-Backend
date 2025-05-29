const express = require('express');
const router = express.Router();
const { saveMessage, getAllMessages } = require('../../controllers/Ai/messageController');

router.post('/save-messages', saveMessage); // POST /api/messages
router.get('/get-allmessages', getAllMessages); // POST /api/messages

module.exports = router;
