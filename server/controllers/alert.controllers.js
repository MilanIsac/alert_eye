const Alert = require("../models/alert.models");
const MLClient = require("../services/mlClient.services");
const notificationService = require("../services/notifications.services");

exports.createAlert = async (req, res) => {
    try {
        const { cameraId, location, severity } = req.body;
        const imagePath = `path/to/image/${cameraId}.jpg`;

        const prediction = await MLClient.predictDisaster(imagePath);
        const { class: disastertype, probabitlity } = prediction;

        const alert = new Alert({
            cameraId,
            location,
            severity,
            disastertype,
            probabitlity: probabitlity[disastertype],
            timestamp: new Date(),
        });
        await alert.save();

        await notificationService.sendNotification({
            message: `Alert: ${disasterType} detected at ${location} with ${probability[disasterType] * 100}% confidence`,
            recipients: ['official1@example.com'],
        });

        res.status(201).json(alert);
    }
    catch(error) {
        res.status(500).json({ error: "Failed to create alert" });
    }
}

exports.getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ timestamp: -1 });
        res.json(alerts);
    }
    catch(error) {
        res.status(500).json({ error: "Failed to fetch alerts" });
    }
};