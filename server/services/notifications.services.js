const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);

async function sendSMS({ message, recipients }) {
    try {
        for (const phoneNumber of recipients) {
            await client.messages.create({
                body: message,
                from: twilioNumber,
                to: phoneNumber
            });
            console.log(`SMS sent to ${phoneNumber}`);
        }
    } catch (error) {
        console.error("Error sending messages: ", error.message);
        throw error;
    }
}

module.exports = { sendSMS }; // Fixed: module.export → module.exports, removed unused processCameraFree