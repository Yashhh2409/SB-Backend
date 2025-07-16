const express = require("express");
const {
  addCategory,
} = require("../../controllers/category/categoryController.js");
const {requiresignin} = require('../../middlewares/requiresignin.js')

const router = express.Router();

router.post("/add-category", requiresignin, addCategory);

module.exports = router;
