import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


const sendOTP = async (mobile, otp) => {
  try {
    console.log(process.env.TWILIO_PHONE_NUMBER);
    const message = await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: mobile,
    });
    console.log("OTP sent successfully:", message.sid);
    return message.sid;
  } catch (error) {
    console.error("Failed to send OTP:", error.message);
    throw new Error("Failed to send OTP");
  }
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default { generateOtp, sendOTP };
