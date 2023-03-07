const twillo = require("twilio");
const { exit } = require("process");

const accountSid = "AC58046bde8ac79ab9d5c94c8f8dac5020";
const authToken = "ffde8c40944bf74d19f3a0286d69bf5f"
const verifySid = "VAc9eb3a798b214550a05a00eb2c684c8e"

if (!accountSid || !authToken || !verifySid) {
    console.log('Something went wrong with Twilio SMS Service');
    exit()
}

const client = twillo(accountSid, authToken);

const sendSMS = async (phoneNumber) => {
    try {
        const { status } = await client.verify.v2.services(verifySid).verifications.create({ to: phoneNumber, channel: "sms" });
        return status;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const verifyOTP = async (phoneNumber, otpCode) => {
    try {
        const { valid } = await client.verify.v2.services(verifySid).verificationChecks.create({ to: phoneNumber, code: otpCode });
        return valid;
    } catch (error) {
        console.error(error);
        if (error?.status === 404) {
            return false;
        }
        throw error;
    }
}


module.exports = {
    sendSMS,
    verifyOTP
}