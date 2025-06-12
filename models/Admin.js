const mongoose = require ('mongoose');

const adminSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true},
     otp: {type: String, select: false},
    otpExpiresAt: {
  type: Date,
  select: false
},
   lastVerificationOtpSentAt: {
  type: Date,
  default: null,
  select: false
},
   lastResetOtpSentAt: {
  type: Date,
  default: null,
  select: false
},    isVerified: { type: Boolean, default: false },
    password: { type: String, required: false, select: false},
    createdAt: { type: Date, default: Date.now},
    email: { type: String, unique: true, sparse: true },
    fullName: { type: String},
    role: { type: String, default: 'admin'},
    resetOtp:  {
  type: String,
  select: false
},
    resetOtpExpires:  {
  type: Date,
  select: false
}, 
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],

    });
    
    
    module.exports = mongoose.model("Admin", adminSchema);
    