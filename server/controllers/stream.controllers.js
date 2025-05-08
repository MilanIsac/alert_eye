const Camera = require("../models/camera.models");
const MLClient = require('../services/mlClient.services');

const activeStreams = new Map();

exports.startStream = async (req, res) => {
    try {
        const { cameraId } = req.body;
        const camera = await Camera.findOne({ cameraId });
        if (!camera) {
            return res.status(404).json({ error: 'Camera not found' });
        }

        const streamUrl = camera.rtspURL;
        const authToken = req.headers['authorization']?.split(' ')[1]; // Extract token

        if (!authToken) {
            return res.status(401).json({ error: 'No token provided' });
        }

        await MLClient.startStream(cameraId, streamUrl, authToken);

        activeStreams.set(cameraId, true);

        res.json({ message: 'Stream started', cameraId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to start stream' });
    }
};

exports.stopStream = async (req, res) => {
    try {
        const { cameraId } = req.body;
        if (!activeStreams.has(cameraId)) {
            return res.status(404).json({ error: 'Stream not found' });
        }

        await MLClient.stopStream(cameraId);
        activeStreams.delete(cameraId);

        res.json({ message: 'Stream stopped', cameraId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to stop stream' });
    }
};