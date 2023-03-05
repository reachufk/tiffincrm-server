const twillo = require("twilio");
const { exit } = require("process");

const accountSid = "AC5981a454af7ef92f9724a592d2c433c8";
const authToken = "16b138bfa86dec36ad04316645035fc3"
const verifySid = "VAc4a3ab6c4973fb358c22f6f97ca607ff"

if (!accountSid || !authToken || !verifySid) {
    console.log('Something went wrong with Twilio SMS Service');
    exit()
}

const client = twillo(accountSid, authToken);

const sendSMS = async (phoneNumber) => {
    try {
        const { status } = await client.verify.v2.services(verifySid).verifications.create({ to: '+916005927438', channel: "sms" });
        return status;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const verifyOTP = async (phoneNumber, otpCode) => {
    try {
        const { valid } = await client.verify.v2.services(verifySid).verificationChecks.create({ to: phoneNumber, code: otpCode });
        return;
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