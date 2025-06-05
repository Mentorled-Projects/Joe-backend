const express = require("express");
const router = express.Router();
const { completeProfile, getAllTutors, getTutorById } = require('../controllers/tutorController')
const authMiddleware = require("../middleware/authMiddleware"); 
const onlyAdmin = require ('../middleware/adminMiddleware')



/**
 * @swagger
 * tags:
 *   name: Tutor Management
 *   description: Endpoints for tutor management
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


/**
 * @swagger
 * /api/v1/tutor/complete-profile:
 *   put:
 *     summary: Complete user profile after initial registration
 *     tags: [Tutor Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: Johndoe@gmail.com
 *               dateOfBirth:
 *                 type: string
 *                 example: "01/02/2022"
 *               city:
 *                 type: string
 *                 example: "Lagos"
 *               gender:
 *                 type: string
 *                 example: Male
 *               language:
 *                 type: string
 *                 example: Spanish
 *               religion:
 *                 type: string
 *                 example: Christianity
 *               availabity:
 *                 type: string
 *               teachingCategory:
 *                 type: string
 *               subject:
 *                 type: string
 *               experience:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile completed successfully
 *       400:
 *         description: Missing or invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.put("/complete-profile", authMiddleware, completeProfile);

/**
 * @swagger
 * /api/v1/tutor/get-all-tutors:
 *   get:
 *     summary: Get all tutors
 *     tags: [Tutor Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All tutors retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tutor'
 *       400:
 *         description: Bad request - Missing or invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access only
 *       500:
 *         description: Internal server error
 */
router.get("/get-all-tutors", authMiddleware, onlyAdmin, getAllTutors)

/**
 * @swagger
 * /api/v1/tutor/get-by-id/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Tutor Management]
 *     security:
 *       - bearerAuth: []
 *     description: Returns a user with a specific ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user
 *         example: "64f7a9d8a123456"
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "Oliver Twist"
 *                 email:
 *                   type: string
 *                   example: "example@gmail.com"
 */

router.get ("/get-by-id/:id", authMiddleware, onlyAdmin, getTutorById)


module.exports = router;
