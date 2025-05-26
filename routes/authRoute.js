const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getAuthCustomers,
} = require("../controllers/authController");
const veryfyToken = require('../middlewares/authMiddleware.js')

router.post("/signup", signup);
router.post("/login", login);
router.get("/getCustomers", veryfyToken, getAuthCustomers);

module.exports = router;
