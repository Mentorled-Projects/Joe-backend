const mongoose = require ('mongoose');

const tutorSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true},
    otp: String,
    otpExpiresAt: Date,
    isVerified: { type: Boolean, default: false },
    password: { type: String, required: false},
    createdAt: { type: Date, default: Date.now},
    email: { type: String, unique: true, sparse: true },
    firstName: { type: String},
    lastName: { type: String},
    dateOfBirth:{ type: String},
    gender: { type: String},
    city: { type: String },
    language: { type: String},
    religion: { type: String},
    role: { type: String, default: 'tutor'},

});


module.exports = mongoose.model("Tutor", tutorSchema);

