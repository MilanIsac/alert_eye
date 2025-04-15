const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const jwt = require('../utils/jwt');

// Signup
router.post("/signup", authController.signup);

// login
router.post("/signup", authController.login);

// logout
// router.post("/signup", authController.logout);

module.exports = router;