const Alert = require("../models/alert.models");
const MLClient = require("../services/mlClient.services");
const notificationService = require("../services/notifications.services");
const User = require("../models/user.models");
const Camera = require("../models/camera.models");

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

        const users = await User.find({ phoneNumber : { $exists : true, $ne : null }});
        const phoneNumbers = users.map(u => u.phoneNumber);

        if(phoneNumbers.length > 0 && probabitlity[disastertype] > 0.7){
            await notificationService.sendSMS({
                message: `Disaster Alert : ${disastertype} detected at ${location || camera.location.coordinates}`,
                recipients : phoneNumbers
            })
        }
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