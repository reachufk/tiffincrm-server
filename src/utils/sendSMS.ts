import twillo from "twilio";
import { exit } from "process";
import { environment } from "../config/environment.config";

const accountSid = environment.TWILIO_ACCOUNT_SID
const authToken = environment.TWILIO_AUTH_TOKEN
const verifySid = environment.TWILIO_VERIFY_SID

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
        throw error;
    }
}

export const verifyOTP = async (phoneNumber: string, otpCode: string) => {
    try {
        const { valid } = await client.verify.v2.services(verifySid).verificationChecks.create({ to: phoneNumber, code: otpCode });
        return valid;
    } catch (error: any) {
        if (error?.status === 404) {
            return false;
        }
        throw error;
    }
}


