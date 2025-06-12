const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');

const guardianSchema = new mongoose.Schema({
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
    firstName: { type: String},
    lastName: { type: String},
    dateOfBirth:{ type: String},
    gender: { type: String},
    relationship: { type: String},
    city: { type: String },
    language: { type: String},
    religion: { type: String},
    role: { type: String, default: 'guardian'},
    child: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
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


module.exports = mongoose.model("Guardian", guardianSchema);

