const express = require('express')

const router = express.Router();
const {getSatus} = require('../../controllers/Common/statusController.js')

router.get("/get-status", getSatus)

module.exports = router;