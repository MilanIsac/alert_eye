require("dotenv").config();
const express = require("express");
const pathToRegexp = require("path-to-regexp");

const mongoose = require("mongoose");
const { connectDB } = require("./config/db.config.js");

const authRoutes = require("./routes/auth.routes.js");
const alertRoutes = require("./routes/alerts.routes.js");
const streamRoutes = require("./routes/stream.routes.js");

// Debug path-to-regexp
const debugPathToRegexp = (path, ...args) => {
    console.log("path-to-regexp called with path:", path);
    return pathToRegexp(path, ...args);
};

// Override Express route methods to use debugPathToRegexp
const originalRoute = express.Router().route;
express.Router.route = function (path) {
    return originalRoute.call(this, path, debugPathToRegexp);
};

const app = express();

app.use(express.json());

// Debug routes
console.log("Loading routes...");
console.log("Auth routes:", authRoutes.stack.map(r => r.route?.path));
console.log("Alert routes:", alertRoutes.stack.map(r => r.route?.path));
console.log("Stream routes:", streamRoutes.stack.map(r => r.route?.path));

// Debug all environment variables
console.log("Environment variables:", {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    ML_SERVICE_URL: process.env.ML_SERVICE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
});

// Catch invalid route registration
app.use((req, res, next) => {
    console.log("Request path:", req.path);
    next();
});

app.use("/auth", authRoutes);
app.use("/alerts", alertRoutes);
app.use("/streams", streamRoutes);

connectDB()
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error);
    });

app.use((err, req, res, next) => {
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: `Something went wrong: ${err.message}` });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("*", (req, res) => {
    res.status(404).json({ error: "Page not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server is running on PORT : ", PORT);
});