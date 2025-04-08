require("dotenv").config();
const express = require("express");

const mongoose = require("mongoose");
const { connectDB } = require("./config/db.config.js");

// const authRoutes = require("./routes/auth.routes.js");
// const alertRoutes = require("./routes/alerts.routes.js");
// const streamRoutes = require("./routes/stream.routes.js");


const app = express();



// app.use("/api/auth", authRoutes);
// app.use("/api/alert", alertRoutes);
// app.use("/api/stream", streamRoutes);

connectDB()
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error);
    });

app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(500).json("Something went wrong!");
})

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// app.get("*", (req, res,next) => {
//     next new Error("Page not found");
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server is running on PORT : ", PORT);
});