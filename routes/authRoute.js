const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getAuthCustomers,
  addUser,
} = require("../controllers/authController");
const veryfyToken = require('../middlewares/authMiddleware.js')

router.post("/signup", signup)
router.post("/login", login);
router.post("/adduser", veryfyToken, addUser);
router.get("/getCustomers", veryfyToken, getAuthCustomers);

module.exports = router;
