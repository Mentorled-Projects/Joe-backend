const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userModel",
    required: true
  },
  userModel: {
    type: String,
    enum: ["guardian", "tutor"],
    required: true
  },
  type: {
    type: String, // e.g., 'message', 'invite'
    required: true
  },
  message: String, // e.g., "You have a new message"
  data: Object, // optional extra payload
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
