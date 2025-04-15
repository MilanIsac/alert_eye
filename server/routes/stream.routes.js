const express = require('express');
const router = express.Router();
const streamController = require('../controllers/streamController');
const jwt = require('../utils/jwt');

// Middleware to verify JWT token
const authenticate = jwt.verifyToken;

router.post('/streams/start', authenticate, streamController.startStream);
router.post('/streams/stop', authenticate, streamController.stopStream);

module.exports = router;