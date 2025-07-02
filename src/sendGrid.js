const sgMail = require ('@sendgrid/mail');
const dotenv = require ("dotenv");
dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationOtp = async (email, otp) => {
  const msg = {
    to: email,
    from: 'peenlyapp@gmail.com', 
    subject: 'Your Peenly Verification Code',
    text: `Hi there!

Welcome to Peenly — we’re glad to have you.

Your email verification code is: ${otp}

This code will expire in 10 minutes. If you didn’t request this, you can safely ignore this email.

Thanks,  
The Peenly Team`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Welcome to Peenly</h2>
        <p>We're glad to have you!</p>
        <p>Your email verification code is:</p>
        <h1 style="background: #f2f2f2; padding: 10px 20px; border-radius: 6px; display: inline-block; color: #111;">${otp}</h1>
        <p>This code will expire in <strong>10 minutes</strong>.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <br/>
        <p style="font-size: 14px;">— The Peenly Team</p>
      </div>
    `,
  };

try {
  await sgMail.send(msg);
  console.log('Email sent!');
} catch (error) {
  console.error('SendGrid error:', error.response?.body || error.message);
}
};

module.exports = sendVerificationOtp;