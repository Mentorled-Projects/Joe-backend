const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');

const guardianSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true},
    otp: String,
    otpExpiresAt: {
  type: Date,
},
   lastVerificationOtpSentAt: {
  type: Date,
  default: null,
},
   lastResetOtpSentAt: {
  type: Date,
  default: null,
},   
 isVerified: { type: Boolean, default: false },
    password: { type: String, required: false},
    createdAt: { type: Date, default: Date.now},
    email: { type: String, unique: true, sparse: true },
    emailVerified: { type: Boolean, default: false },
emailVerificationOtp: { type: String },
emailVerificationExpires: { type: Date },
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
},
    resetOtpExpires:  {
  type: Date,
}, 
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],

});


module.exports = mongoose.model("Guardian", guardianSchema);

