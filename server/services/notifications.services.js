const MLClient = require("../services/mlClient.services");
const Camera = require("../models/camera.models");
const twilio = require("twilio");


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

async function processCameraFree(req, res) {
    try {
        const { cameraId } = req.body;
        const camera = await Camera.findById({ cameraId });
        if(!camera){
            return res.status(400).json({ 'Error' : 'Camera not found' });
        }
        const imagePath = "path";
        const prediction = await MLClient.predictDisaster(imagePath);
        res.json(prediction);
    }
    catch(error) {
        res.status(500).json({
            error: "Failed to process camera feed"
        });
    }
}

async function sendSMS({ message, recipients }){
    try{
        for(const phoneNumber of recipients){
            await client.messages.create({
                body : message,
                from : twilioNumber,
                to : phoneNumber
            })
            console.log(`SMS sent to ${phoneNumber}`);
        }
    }
    catch(error){
        console.error("Error sending messages : ", error.message);
        throw error;
    }
}

module.export = { processCameraFree, sendSMS };