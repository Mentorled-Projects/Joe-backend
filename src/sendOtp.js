const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOTP = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your peenly verification code to continue your registration is: ${otp}`,
      to: phoneNumber,
      from: 'PEENLY'
    });
    // console.log('Message SID:', message.sid);
    // console.log('Message status:', message.status);
    return message;
  } catch (error) {
    console.error('Twilio error:', error);
    throw error;
  }
};
module.exports = sendOTP;
