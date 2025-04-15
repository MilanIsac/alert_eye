// console.log("alerts.routes.js loaded");
const express = require("express");
const router = express.Router();
const alertsController = require("../controllers/alertsController");
const jwt = require('../utils/jwt');

// CCTV analysis for disaster prediction and notify officials

const authenticate = jwt.verifyToken;

router.post('/alerts', authenticate, alertController.createAlert);
router.get('/alerts', authenticate, alertController.getAlerts);

module.exports = router;