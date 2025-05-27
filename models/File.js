const mongoose = require ('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  url: String,
  resource_type: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
phoneNumber:  String,
guardian: { type: mongoose.Schema.Types.ObjectId, ref: "Guardian", default: null },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", default: null },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },

});

module.exports= mongoose.model('File', fileSchema);
