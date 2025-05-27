const mongoose = require ('mongoose');

const adminSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true},
    otp: String,
    otpExpiresAt: Date,
    isVerified: { type: Boolean, default: false },
    password: { type: String, required: false},
    createdAt: { type: Date, default: Date.now},
    email: { type: String, unique: true, sparse: true },
    fullName: { type: String},
    role: { type: String, default: 'admin'},
    resetOtp: String,
    resetOtpExpires: Date,
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],

    });
    
    
    module.exports = mongoose.model("Admin", adminSchema);
    