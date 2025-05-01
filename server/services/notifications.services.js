const MLClient = require("../services/mlClient.services");
const Camera = require("../models/camera.models");
const twilio = require("twilio");

async function processCameraFree(req, res) {
    try {
        const { cameraId } = req.body;
        const imagePath = "path";
        const prediction = await MLClient.predictDisaster(imagePath);
        res.json(prediction);
    }
    catch(error) {
        res.status(500).json({
            error: "Failed to process camera feed"})
    }
}

module.export = { processCameraFree };