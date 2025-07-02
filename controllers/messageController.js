const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Guardian = require ('../models/Guardian');
const Tutor = require ('../models/Tutor')
const Admin = require ('../models/Admin')
const Message = require ('../models/message')
const Notification = require ('../models/Notifications')
const mongoose = require ('mongoose');



exports.sendMessage = async (req, res) => {
  const { receiverId, receiverModel, content } = req.body;
  const senderId = req.guardian?.id || req.tutor?.id || req.admin?.id;
  const senderModel = req.guardian ? 'guardian' : req.tutor ? 'tutor' : 'admin';

  try {
    const message = await Message.create({
      sender: senderId,
      senderModel: senderModel,
      receiver: receiverId,
      receiverModel: receiverModel,
      content
    });

    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.getConversation = async (req, res) => {
  const { userId } = req.params;
  const loggedInId = req.guardian?.id || req.tutor?.id;


  const page = parseInt(req.query.page) || 1;
  const limit = parseInt (req.query.limit) || 20;
  const skip = (page - 1) * limit;
  console.log("🧪 Logged in ID:", loggedInId);
  console.log("🧪 User ID param:", userId);

  if (!loggedInId || !mongoose.isValidObjectId(loggedInId) || !mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ error: "Invalid or missing IDs" });
  }

  try {
    const senderId = new mongoose.Types.ObjectId(loggedInId);
    const receiverId = new mongoose.Types.ObjectId(userId);

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

      const orderedMessages = messages.reverse();

      res.status(200).json({
        success: true,
        currentPage: page,
        messages: orderedMessages,
             })


      const totalMessages = await Message.countDocuments();

      res.json({
      messages,
      page,
      totalPages: Math.ceil(totalMessages / limit),
      hasMore: page * limit < totalMessages
});



    console.log("✅ Messages found:", messages.length);
    res.status(200).json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getNotification = async (req, res) => {
const userId = req.guardian?.id || req.tutor?.id;
  const userModel = req.guardian ? "guardian" : "tutor";

  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const notifications = await Notification.find({ user: userId, userModel })
    .sort({ createdAt: -1 })
    .limit(20); // Or paginate

  res.json(notifications);
}

  exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
