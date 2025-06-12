const express = require("express");
const router = express.Router();
const { getAllUsers, deleteUser, getPaginatedUsers } = require('../controllers/usersController')
const  authMiddleware  = require('../middleware/authMiddleware');
const onlyAdmin = require ('../middleware/adminMiddleware')


/**
 * @swagger
 * /api/v1/users/get-all-users:
 *   get:
 *     summary: Get all users (guardians, tutors, and admins)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     description: Returns a list of all users. Only accessible by admin users.
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       role:
 *                         type: string
 *                         example: "guardian"
 *                       email:
 *                         type: string
 *                         example: "user@example.com"
 *       401:
 *         description: Unauthorized - admin access required
 *       500:
 *         description: Internal server error
 */

router.get('/get-all-users', authMiddleware, onlyAdmin, getAllUsers);

/**
 * @swagger
 * /api/v1/users/get-paginated-users:
 *   get:
 *     summary: Get paginated users by role
 *     tags: [User Management]
 *     description: Returns paginated list of users (guardian, tutor, or admin) with optional search.
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [guardian, tutor, admin]
 *         description: Role of users to fetch
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional search term (by name or email)
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *       400:
 *         description: Bad request (e.g. missing or invalid role)
 *       500:
 *         description: Internal server error
 */

router.get('/get-paginated-users', getPaginatedUsers);
/**
 * @swagger
 * /api/v1/users/delete:
 *   delete:
 *     summary: Delete a user by phone number
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     description: Delete a user using phone number, role, and reason
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - reasonForDeleting
 *               - role
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the user to delete
 *                 example: "08012345678"
 *               reasonForDeleting:
 *                 type: string
 *                 description: Reason for deleting the user
 *                 example: "Requested account deletion"
 *               role:
 *                 type: string
 *                 description: The role of the user (guardian, tutor, or admin)
 *                 example: "tutor"
 *     responses:
 *       200:
 *         description: User removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User removed successfully"
 *                 role:
 *                   type: string
 *                   example: "tutor"
 *       400:
 *         description: Bad request (missing phone number or role)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.delete ("/delete", deleteUser)


module.exports = router;
