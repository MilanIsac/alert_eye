// console.log("alerts.routes.js loaded");


const express = require("express");
const router = express.Router();
const alertsController = require("../controllers/alertsController");
const { authenticate } = require("../utils/jwt");

// CCTV analysis for disaster prediction and notify officials
router.post("/analyze", authenticate, alertsController.analyzeFrame);

// get all alerts
router.post("/all", authenticate, alertsController.approveAlert);

module.exports = router;q