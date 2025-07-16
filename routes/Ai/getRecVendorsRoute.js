const express = require('express')

const router = express.Router()

const {getRecVendors} = require('../../controllers/Ai/RecVendorsController.js')



router.get('/recommended-vendors', getRecVendors)

module.exports = router;