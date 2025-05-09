const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        console.log("MongoDB already connected");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // console.log("MongoDB connected");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        throw error;
    }
};

module.exports = { connectDB };