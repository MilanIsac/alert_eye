const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    disasterType: {
        type: String,
        required: true
    },
    probability: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    cameraId: {
        type: String,
        required: true
    },
    location: { // Added location field
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ["pending", "dismissed"],
        default: "pending"
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Alert", alertSchema);