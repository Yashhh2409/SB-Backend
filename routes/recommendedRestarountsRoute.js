const express = require('express');
const router = express.Router();
const {saveRecommendation} = require("../controllers/recommendedRestarountsController");

router.post("/addRecommendedRestaurants", saveRecommendation);

module.exports = router;