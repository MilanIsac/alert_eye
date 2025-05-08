const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers.js");

// Signup
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login); // Fixed: /signup → /login

// Logout (no-op for stateless JWT, just for API completeness)
router.post("/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
});

module.exports = router;