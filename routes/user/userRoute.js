// const express = require("express");
// const router = express.Router();

// const { addUser, signup, login, getAuthCustomers } = require('../../controllers/user/userController.js')

// const veryfyToken = require('../../middlewares/authMiddleware.js')

// router.post("/signup", signup)
// router.post("/login", login);
// router.post("/adduser", veryfyToken, addUser);
// router.get("/getCustomers", veryfyToken, getAuthCustomers);

// module.exports = router;

// routes/authRoutes.js
// const express = require('express');
// const router = express.Router();
// const { loginWithEmail } = require('../../controllers/user/userController.js')

// router.post('/login', loginWithEmail);

// module.exports = router;

const express = require("express");
const { loginWithEmail, addUser, getAllUsers} = require("../../controllers/user/userController.js");
const { requiresignin } = require("../../middlewares/requiresignin.js"); // your auth middleware

const router = express.Router();

// Login route (no auth needed)
router.post("/login", loginWithEmail);

// Add user route - protected by requiresignin middleware
router.post("/add-user", requiresignin, addUser);

router.get('/get-allUsers', getAllUsers);

module.exports = router;
