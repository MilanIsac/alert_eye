const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

class MLClient {
    constructor() {
        this.mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";
        console.log("ML_SERVICE_URL:", this.mlServiceUrl); // Debug log
        if (!this.mlServiceUrl) {
            throw new Error("ML_SERVICE_URL is not defined in environment variables");
        }
        try {
            new URL(this.mlServiceUrl);
        } catch (error) {
            console.error("Invalid ML_SERVICE_URL:", this.mlServiceUrl);
            throw new Error("Invalid ML service URL configuration");
        }
    }

    async predictDisaster(imagePath) {
        try {
            const formData = new FormData();
            formData.append("file", fs.createReadStream(imagePath));

            const response = await axios.post(`${this.mlServiceUrl}/predict`, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error calling ML service: ", error.response ? error.response.data : error.message);
            throw new Error("Failed to predict disaster");
        }
    }

    async startStream(cameraId, streamUrl, authToken) {
        try {
            const response = await axios.post(
                `${this.mlServiceUrl}/stream/${cameraId}`,
                { stream_url: streamUrl, auth_token: authToken },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            return response.data;
        } catch (error) {
            console.error("Error starting stream: ", error.response ? error.response.data : error.message);
            throw new Error("Failed to start stream");
        }
    }

    async stopStream(cameraId) {
        try {
            const response = await axios.post(`${this.mlServiceUrl}/stop_stream/${cameraId}`);
            return response.data;
        } catch (error) {
            console.error("Error stopping stream: ", error.response ? error.response.data : error.message);
            throw new Error("Failed to stop stream");
        }
    }
}

module.exports = new MLClient();