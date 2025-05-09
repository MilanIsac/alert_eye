require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db.config.js");

const authRoutes = require("./routes/auth.routes.js");
const alertRoutes = require("./routes/alerts.routes.js");
const streamRoutes = require("./routes/stream.routes.js");

const app = express();
const cors = require("cors");

app.use(express.json());

// Debug routes
// console.log("Loading routes...");
// console.log("Auth routes:", authRoutes.stack.map(r => r.route?.path));
// console.log("Alert routes:", alertRoutes.stack.map(r => r.route?.path));
// console.log("Stream routes:", streamRoutes.stack.map(r => r.route?.path));


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

// Remove app.get("*", ...)
// Add this at the end of server.js, after all routes
app.use((req, res, next) => {
    res.status(404).json({ error: "Page not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server is running on PORT : ", PORT);
});