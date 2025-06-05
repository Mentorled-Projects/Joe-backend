const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Guardian = require ('../models/Guardian');
const Tutor = require ('../models/Tutor')
const Admin = require ('../models/Admin')
const Message = require ('../models/message')


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
  const loggedInId = req.user.id;

  try {
    const messages = await Message.find({
      $or: [
        { sender: loggedInId, receiver: userId },
        { sender: userId, receiver: loggedInId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
