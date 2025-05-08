const Alert = require("../models/alert.models");
const Camera = require("../models/camera.models");
const User = require("../models/user.models");
const MLClient = require("../services/mlClient.services");
const notificationService = require("../services/notifications.services");

exports.createAlert = async (req, res) => {
    try {
        const { cameraId, location, severity, message } = req.body;
        const camera = await Camera.findOne({ cameraId });
        if (!camera) {
            return res.status(404).json({ error: "Camera not found" });
        }

        const imagePath = `E:/All projects/alert_eye/ml/data/cctv/camera_${cameraId}.jpg`;
        const prediction = await MLClient.predictDisaster(imagePath);
        const { class: disasterType, probability } = prediction;

        const alert = new Alert({
            cameraId,
            location: location || camera.location.coordinates.join(", "), // Convert array to string
            severity,
            message: message || `Disaster detected: ${disasterType}`,
            disasterType,
            probability: probability[disasterType],
            timestamp: new Date(),
        });
        await alert.save();

        const users = await User.find({ phoneNumber: { $exists: true, $ne: null } });
        const phoneNumbers = users.map(u => u.phoneNumber);

        if (phoneNumbers.length > 0 && probability[disasterType] > 0.7) {
            await notificationService.sendSMS({
                message: `Disaster Alert: ${disasterType} detected at ${location || camera.location.coordinates.join(", ")} with ${Math.round(probability[disasterType] * 100)}% confidence on Camera ${cameraId} at ${new Date().toLocaleString()}`,
                recipients: phoneNumbers
            });
        }

        res.status(201).json(alert);
    } catch (error) {
        res.status(500).json({ error: "Failed to create alert" });
    }
};

exports.getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ timestamp: -1 });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch alerts" });
    }
};