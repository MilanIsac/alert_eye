// console.log("alerts.routes.js loaded");
const express = require("express");
const router = express.Router();
const alertsController = require("../controllers/alert.controllers");
const jwt = require("../utils/jwt.utils");

// CCTV analysis for disaster prediction and notify officials

const authenticate = jwt.verifyToken;

router.post('/alerts', authenticate, alertsController.createAlert);
router.get('/alerts', authenticate, alertsController.getAlerts);

module.exports = router;