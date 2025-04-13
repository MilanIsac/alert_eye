const MLClient = require("../services/mlClient");

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