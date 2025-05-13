const express = require('express');
const router = express.Router();
const {saveRecommendation} = require('../controllers/recommendedVendersController');

router.post("/addRecommendedVenders", saveRecommendation);

module.exports = router;