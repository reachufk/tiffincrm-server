import twillo from "twilio";
import { config } from "dotenv";
import { exit } from "process";
config();

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const verifySid = process.env.TWILIO_VERIFY_SID as string;

if (!accountSid || !authToken || !verifySid) {
    console.log('Something went wrong with Twilio SMS Service');
    exit()
}

const client = twillo(accountSid, authToken);

export const sendSMS = async (phoneNumber: string) => {
    try {
        const { valid } = await client.verify.v2.services(verifySid).verifications.create({ to: phoneNumber, channel: "sms" });
        return valid;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const verifyOTP = async (phoneNumber: string, otpCode: string) => {
    try {
        const { valid } = await client.verify.v2.services(verifySid).verificationChecks.create({ to: phoneNumber, code: otpCode });
        return valid;
    } catch (error: any) {
        console.error(error);
        if (error?.status === 404) {
            return false;
        }
        throw error;
    }
}


