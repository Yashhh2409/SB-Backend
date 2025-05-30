const express = require("express");
const {
  addCategory,
} = require("../../controllers/category/categoryController.js");

const router = express.Router();

router.post("/add-category", addCategory);

module.exports = router;
