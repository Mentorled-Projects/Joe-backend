const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOTP = async (phoneNumber, otp) => {
  return await client.messages.create({
    body: `Your verification code to continue your registration is: ${otp}`,
    to: phoneNumber,
    from: 'PEENLY'
  });
};

module.exports = sendOTP;
