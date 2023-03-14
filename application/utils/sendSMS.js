const twillo = require("twilio");
const { exit } = require("process");

const accountSid = "AC58046bde8ac79ab9d5c94c8f8dac5020";
const authToken = "25039fb3b2727b26776614d7eba73c70"
const verifySid = "VA46e19e059308c9c2a7837638e6828d5d"

if (!accountSid || !authToken || !verifySid) {
    console.log('Something went wrong with Twilio SMS Service');
    exit()
}

const client = twillo(accountSid, authToken);

const sendSMS = async (phoneNumber) => {
    if(!phoneNumber?.includes('+91')){
        phoneNumber = `+91${phoneNumber}`
    }
    try {
        const { status } = await client.verify.v2.services(verifySid).verifications.create({ to: phoneNumber, channel: "sms" });
        return status;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const verifyOTP = async (phoneNumber, otpCode) => {
    if(!phoneNumber?.includes('+91')){
        phoneNumber = `+91${phoneNumber}`
    }
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