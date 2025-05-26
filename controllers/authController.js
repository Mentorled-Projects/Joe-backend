const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Guardian = require ('../models/Guardian');
const Tutor = require ('../models/Tutor')
const Admin = require ('../models/Admin')
const sendOTP = require ('../src/sendOtp')

//Register guardian with phone number

exports.registerGuardian = async (req,res) => {
    const { phoneNumber, password } = req.body;

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
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins
        //Create new user
        const newGuardian = new Guardian({
            phoneNumber,
            password: hashedPassword,
            otp,
            otpExpiresAt,
            isVerified: false, 

        })

        await newGuardian.save();
        await sendOTP(phoneNumber, otp);

        return res.status(201).json({
            message: 'OTP sent to phone. Please verify to complete registration.',
            guardian: {
                id: newGuardian._id,
                phoneNumber: newGuardian.phoneNumber
            }
        })

    } catch (err) {
    console.error("Regsitration error:", err)
    res.status(500).json ({ message: 'Server error'});
    }
};

//Register Tutor
exports.registerTutor = async (req,res) => {
    const { phoneNumber, password } = req.body;

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
        await sendOTP(phoneNumber, otp);

        return res.status(201).json({
            message: 'OTP sent to phone. Please verify to complete registration.',
            guardian: {
                id: newTutor._id,
                phoneNumber: newTutor.phoneNumber
            }
        })

    } catch (err) {
    console.error("Regsitration error:", err)
    res.status(500).json ({ message: 'Server error'});
    }
};

exports.registerAdmin = async (req, res) => {
  const { fullName, phoneNumber, password, email } = req.body;

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


    // const token = jwt.sign({ id: newAdmin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

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

    res.status(200).json({ message: `${role} phone number verified successfully!` });

  } catch (err) {
    console.error('OTP verify error:', err);
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", role, token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Failed to login", error });
  }
};

// exports.login = async (req, res) => {
//     const { phoneNumber, password }  = req.body;

//     try {

//         const guardian = await Guardian.findOne ({phoneNumber});
//         if (!guardian) {
//             return res.status(400).json ({ message: "Invalid credentials" })
//         }
       

//     const isMatch = await bcrypt.compare(password, guardian.password);
//       if (!isMatch) {
//         return res.status(400).json({ message: "Invalid credentials" });
//       }
//             console.log("Password match:", isMatch);
//       const token = jwt.sign({ id: guardian._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//       res.json({ message: "Login successful", token });
//     } catch (error) {
//                 console.error("Login error:", error);

//       res.status(500).json({ message: "Failed to login", error });
//     }
//   };