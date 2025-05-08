const mongoose = require("mongoose");

const cameraSchema = new mongoose.Schema({
    cameraId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            required: true,
            trim: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    rtspURL: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Camera", cameraSchema);