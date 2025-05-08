const express = require("express");
const router = express.Router();
const alertsController = require("../controllers/alert.controllers");
const jwt = require("../utils/jwt.utils");

const authenticate = jwt.verifyToken;

// Fixed route paths to match /alerts
router.post('/', authenticate, alertsController.createAlert);
router.get('/', authenticate, alertsController.getAlerts);

module.exports = router;