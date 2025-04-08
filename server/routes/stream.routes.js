const express = require("express");
const router = express.Router();
const streamController = require("../controllers/streamController");
const {authenticate} = require("../utils/jwt");

// Get live CCTV url
router.get("/live/:cameraId", authenticate, streamController.getLiveStream);

module.exports = router;