const express = require('express');
const router = express.Router();
const streamController = require("../controllers/stream.controllers.js");
const jwt = require("../utils/jwt.utils");

// Middleware to verify JWT token
const authenticate = jwt.verifyToken;

router.post('/start', authenticate, streamController.startStream);
router.post('/stop', authenticate, streamController.stopStream);

module.exports = router;