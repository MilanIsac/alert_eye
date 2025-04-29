const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers.js")
const jwt = require('../utils/jwt.utils.js');

// Signup
router.post("/signup", authController.signup);

// login
router.post("/signup", authController.login);

// logout
// router.post("/signup", authController.logout);

module.exports = router;