const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); 
const {sendMessage, getConversation} = require ('../controllers/messageController');


router.post("/send-message", authMiddleware, sendMessage)

router.get("/get-messages", authMiddleware, getConversation)

module.exports = router;
