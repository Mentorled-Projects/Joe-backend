const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); 
const {sendMessage, getConversation, getNotification, markAsRead} = require ('../controllers/messageController');

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Endpoints for messages and notifications
 */

router.post("/send-message", authMiddleware, sendMessage)

/**
 * @swagger
 * /api/v1/message/get-messages/{userId}:
 *   get:
 *     summary: Get conversation messages between logged-in user and specified user
 *     tags: [Message]
 *     security:
 *       - bearerAuth: []  # Optional: Use if JWT-based auth
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the other user in the conversation
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of messages per page
 *     responses:
 *       200:
 *         description: List of messages between the users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized - Guardian or Tutor not logged in
 *       500:
 *         description: Server error
 */


router.get("/get-messages/:userId", authMiddleware, getConversation)

/**
 * @swagger
 * /api/v1/message/notifications:
 *   get:
 *     summary: Get current user's notifications
 *     tags: [Message]
 *     security:
 *       - bearerAuth: []  # Use this if you're using JWT
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized
 */


router.get("/notifications", authMiddleware, getNotification)

/**
 * @swagger
 * /api/v1/message/notification/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Message]
 *     security:
 *       - bearerAuth: []  # Optional, if you use JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Notification not found
 */


router.patch('/notification/:id/read', authMiddleware, markAsRead)


module.exports = router;
