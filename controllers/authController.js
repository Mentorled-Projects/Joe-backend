const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Guardian = require ('../models/Guardian');
const Tutor = require ('../models/Tutor')
const Admin = require ('../models/Admin')
const sendOTP = require ('../src/sendOtp')
const sendVerificationOtp = require ('../src/sendGrid')
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//Register guardian with phone number

exports.registerGuardian = async (req,res) => {
    const { phoneNumber, password } = req.body;

    // Validate phone number (must be 12 or 13 digits)
  const isValidPhone = /^\+?\d{12,13}$/.test(phoneNumber);
  if (!isValidPhone) {
    return res.status(400).json({ message: 'Phone number must be 12 or 13 digits' });
  }

  //Validate password: min 8 characters, at least 1 letter, 1 number, and 1 special character
  const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
  if (!isValidPassword) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters long and include a letter, number, and special character',
    });
  }

    try {
        //check if phone number already exists
        const existingGuardian = await Guardian.findOne ({ phoneNumber });
        if(existingGuardian) {
                  return res.status(400).json({ message: 'Phone number already in use' });
        }

        //Hash password

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);    
        }

        //Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 
        //Create new user
        const newGuardian = new Guardian({
            phoneNumber,
            password: hashedPassword,
            otp,
            otpExpiresAt,
            isVerified: false, 

        })

        await newGuardian.save();
 try {
         await sendOTP(phoneNumber, otp);

          
        } catch (OtpError) {
          await Guardian.findByIdAndDelete(newGuardian._id);
          return res.status (500).json ({ message: 'Failed to send OTP. Please try again'})
          
        }
        return res.status(201).json({
            message: 'OTP sent to phone. Please verify to complete registration.',
            guardian: {
                id: newGuardian._id,
                phoneNumber: newGuardian.phoneNumber
            }
        })

    } catch (err) {
    console.error("Regsitration error:", err)
    res.status(500).json ({ message: 'Server error:', err});
    }
};

//Register Tutor
exports.registerTutor = async (req,res) => {
    const { phoneNumber, password } = req.body;
     // Validate phone number (must be 12 or 13 digits)
  const isValidPhone = /^\+?\d{12,13}$/.test(phoneNumber);
  if (!isValidPhone) {
    return res.status(400).json({ message: 'Phone number must be 12 or 13 digits' });
  }

  //Validate password: min 8 characters, at least 1 letter, 1 number, and 1 special character
  const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
  if (!isValidPassword) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters long and include a letter, number, and special character',
    });
  }

    try {
        //check if phone number already exists
        const existingTutor = await Tutor.findOne ({ phoneNumber });
        if(existingTutor) {
                  return res.status(400).json({ message: 'Phone number already in use' });
        }

        //Hash password

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);    
        }

        //Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins
        //Create new user
        const newTutor = new Tutor({
            phoneNumber,
            password: hashedPassword,
            otp,
            otpExpiresAt,
            isVerified: false, 

        })

        await newTutor.save();

        try {
         await sendOTP(phoneNumber, otp);

          
        } catch (OtpError) {
          await Tutor.findByIdAndDelete(newTutor._id);
          return res.status (500).json ({ message: 'Failed to send OTP. Please try again'})
          
        }

        return res.status(201).json({
            message: 'OTP sent to phone. Please verify to complete registration.',
            tutor: {
                id: newTutor._id,
                phoneNumber: newTutor.phoneNumber,
                
            }
        })

    } catch (err) {
    console.error("Regsitration error:", err)
    res.status(500).json ({ message: 'Server error'});
    }
};

exports.registerAdmin = async (req, res) => {
  const { fullName, phoneNumber, password, email } = req.body;

   // Validate phone number (must be 12 or 13 digits)
  const isValidPhone = /^\+?\d{12,13}$/.test(phoneNumber);
  if (!isValidPhone) {
    return res.status(400).json({ message: 'Phone number must be 12 or 13 digits' });
  }

  //Validate password: min 8 characters, at least 1 letter, 1 number, and 1 special character
  const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
  if (!isValidPassword) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters long and include a letter, number, and special character',
    });
  }

  try {
    const existing = await Admin.findOne({ phoneNumber });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins


    const newAdmin = new Admin({
      fullName,
      phoneNumber,
      email,
      otp,
      otpExpiresAt,
      password: hashedPassword,
    });

    await newAdmin.save();
    await sendOTP(phoneNumber, otp);

    res.status(201).json({ message: "OTP sent to phone. Please verify to complete registration.",
      admin: {
        id: newAdmin._id,
        phoneNumber: newAdmin.phoneNumber
      }
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ message: "Failed to register admin", error });
  }
};

exports.resendOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    let user = await Guardian.findOne({ phoneNumber });
    let role = "guardian";

    // If not found in Guardian, check Tutor
    if (!user) {
      user = await Tutor.findOne({ phoneNumber });
      role = "tutor";
    }

    // If not Tutor, check Admin
    if (!user) {
      user = await Admin.findOne({ phoneNumber });
      role = "admin";
    }


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Phone number already verified' });
    }

   const now = new Date();
const lastSent = new Date(user.lastVerificationOtpSentAt);

if (user.lastVerificationOtpSentAt && now.getTime() - lastSent.getTime() < 60 * 1000) {
  return res.status(429).json({ message: 'Please wait before requesting another OTP' });
}

    // Generate new OTP and expiration
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    user.lastVerificationOtpSentAt = now; 
    await user.save();

 try {
         await sendOTP(phoneNumber, otp);

          
        } catch (OtpError) {
          await user.findByIdAndDelete(user._id);
          return res.status (500).json ({ message: 'Failed to send OTP. Please try again'})
          
        }
    return res.status(200).json({ message: 'OTP resent successfully' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    let user = await Guardian.findOne({ phoneNumber });
    let role = "guardian";

    // If not found in Guardian, check Tutor
    if (!user) {
      user = await Tutor.findOne({ phoneNumber });
      role = "tutor";
    }

    // If not Tutor, check Admin
    if (!user) {
      user = await Admin.findOne({ phoneNumber });
      role = "admin";
    }

    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    if (user.otpExpiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: "1h" });


 res.status(200).json({
      message: `${role} phone number verified successfully!`,
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        role,
      }
    });

  } catch (err) {
    console.error('OTP verify error:', err);
        console.log('OTP verify error:', err);

    res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    let user = await Guardian.findOne({ phoneNumber });
    let role = "guardian";

    // If not found in Guardian, check Tutor
    if (!user) {
      user = await Tutor.findOne({ phoneNumber });
      role = "tutor";
    }
    if (!user) {
      user = await Admin.findOne({ phoneNumber });
      role = "admin";
    }
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified && !user.emailVerified) {
       return res.status(403).json({ message: "Please verify your phoneNumber or email before logging in" });

    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", role, token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Failed to login", error });
  }
};

exports.forgotPassword = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    let user = await Guardian.findOne({ phoneNumber });
    let role = "guardian";

    // If not found in Guardian, check Tutor
    if (!user) {
      user = await Tutor.findOne({ phoneNumber });
      role = "tutor";
    }
    if (!user) {
      user = await Admin.findOne({ phoneNumber });
      role = "admin";
    }
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    await client.messages.create({
      body: `Your Peenly password reset OTP is: ${otp}`,
      from: 'PEENLY',
      to: phoneNumber,
    });

    res.json({ message: "OTP sent to phone number" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error:", err});
  }
};

exports.resendForgotPasswordOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    let user = await Guardian.findOne({ phoneNumber });
    let role = "guardian";

    // If not found in Guardian, check Tutor
    if (!user) {
      user = await Tutor.findOne({ phoneNumber });
      role = "tutor";
    }

    // If not Tutor, check Admin
    if (!user) {
      user = await Admin.findOne({ phoneNumber });
      role = "admin";
    }


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
const lastSent = new Date(user.lastResetOtpSentAt);

if (user.lastResetOtpSentAt && now.getTime() - lastSent.getTime() < 60 * 1000) {
  return res.status(429).json({ message: 'Please wait before requesting another OTP' });
}
    
    // Generate new OTP and expiration
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOtp = otp;
    user.resetOtpExpires = otpExpiresAt;
    user.lastResetOtpSentAt = now; 
    await user.save();

    await client.messages.create({
      body: `Your Peenly password reset OTP is: ${otp}`,
      from: 'PEENLY',
      to: phoneNumber,
    });


    return res.status(200).json({ message: 'OTP resent successfully' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



exports.resetPassword = async (req, res) => {
  const { phoneNumber, otp, newPassword } = req.body;

  try {
    let user = await Guardian.findOne({ phoneNumber });
    let role = "guardian";

    // If not found in Guardian, check Tutor
    if (!user) {
      user = await Tutor.findOne({ phoneNumber });
      role = "tutor";
    }
    if (!user) {
      user = await Admin.findOne({ phoneNumber });
      role = "admin";
    }

    if (!user || user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error:", err});
  }
};


exports.requestEmailVerification = async (req, res) => {
  const { email } = req. body;
  const Id = req.guardian?.id || req.tutor?.id;
  const isGuardian = !!req.guardian;

  try {
    // 1. Check if email is already in use by another user
    const emailExistsInGuardian = await Guardian.findOne({ email, _id: { $ne: Id } });
    const emailExistsInTutor = await Tutor.findOne({ email, _id: { $ne: Id } });

    if (emailExistsInGuardian || emailExistsInTutor) {
      return res.status(400).json({ message: 'Email is already associated with another account.' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000); // e.g., 6-digit code


    await sendVerificationOtp(email, otp);

        const Model = isGuardian ? Guardian : Tutor;


    await Model.findByIdAndUpdate(Id, {
      email,
      emailVerificationOtp: otp,
      emailVerificationExpires: Date.now() + 10 * 60 * 1000,
    });

    console.log('Sending email to:', email);
console.log('OTP:', otp);

    res.status (200).json({ message: 'Verification otp sent to email.'});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send otp'})
    
  }

};



exports.verifyEmailOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    // Try to find user with matching OTP in both models
    let user = await Guardian.findOne({ emailVerificationOtp: otp });
    let userType = 'guardian';

    if (!user) {
      user = await Tutor.findOne({ emailVerificationOtp: otp });
      userType = 'tutor';
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }


    if (Date.now() > user.emailVerificationExpires) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    user.emailVerified = true;
    user.emailVerificationOtp = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.status(200).json({
      message: `Email verified successfully as ${userType}.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};
