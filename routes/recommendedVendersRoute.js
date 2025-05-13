const express = require('express');
const router = express.Router();
const {saveRecommendation, getRecommendations} = require('../controllers/recommendedVendersController');

router.post("/addRecommendedVenders", saveRecommendation);
router.get("/getRecommendedVendors/:user_id", getRecommendations);

module.exports = router;